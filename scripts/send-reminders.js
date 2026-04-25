#!/usr/bin/env node

const admin = require('firebase-admin');

const APP_BASE_URL = process.env.APP_BASE_URL || 'https://digitalrosary.app';
const REMINDER_WINDOW_MINUTES = Number(process.env.REMINDER_WINDOW_MINUTES || 20);
const DEFAULT_DAILY_TIME = '19:30';
const DEFAULT_STREAK_TIME = '21:00';

function normalizeTimeZone(timeZone) {
  if (!timeZone) return 'UTC';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
    return timeZone;
  } catch {
    return 'UTC';
  }
}

function parseTimeToMinutes(timeString, fallbackMinutes) {
  if (typeof timeString !== 'string') return fallbackMinutes;
  const match = timeString.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return fallbackMinutes;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return fallbackMinutes;
  return hour * 60 + minute;
}

function getLocalDateTimeParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: normalizeTimeZone(timeZone),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date);

  const values = {};
  parts.forEach((part) => {
    if (part.type !== 'literal') values[part.type] = part.value;
  });

  const dateStr = `${values.year}-${values.month}-${values.day}`;
  const hour = Number(values.hour);
  const minute = Number(values.minute);

  return {
    dateStr,
    minutes: (hour * 60) + minute
  };
}

function isDueNow(currentMinutes, targetMinutes) {
  return currentMinutes >= targetMinutes && currentMinutes < targetMinutes + REMINDER_WINDOW_MINUTES;
}

function getNormalizedNotificationSettings(rawSettings) {
  const notifications = rawSettings || {};
  return {
    enabled: !!notifications.enabled,
    dailyPrayerEnabled: notifications.dailyPrayerEnabled !== false,
    dailyPrayerTime: notifications.dailyPrayerTime || DEFAULT_DAILY_TIME,
    streakProtectionEnabled: notifications.streakProtectionEnabled !== false,
    streakProtectionTime: notifications.streakProtectionTime || DEFAULT_STREAK_TIME,
    lastDailyPrayerSentDate: notifications.lastDailyPrayerSentDate || null,
    lastStreakProtectionSentDate: notifications.lastStreakProtectionSentDate || null
  };
}

function buildPayload(type, dateStr, ordinal) {
  let title, body;
  if (type === 'daily_prayer') {
    title = 'Time to pray the Rosary';
    body = 'Take a few peaceful minutes to pray today.';
  } else if (type === 'decade_break') {
    title = 'Continue your Rosary';
    body = `You left off after the ${ordinal} decade. Ready to continue?`;
  } else {
    title = 'Protect your prayer streak';
    body = 'You have not logged a rosary yet today. Keep your streak alive.';
  }

  return {
    notification: { title, body },
    data: {
      type,
      date: dateStr,
      link: `${APP_BASE_URL}/index.html`,
      tag: `digital-rosary-${type}-${dateStr}`
    },
    webpush: {
      notification: {
        title,
        body,
        icon: `${APP_BASE_URL}/images/logo/plain_logo_v0.1.png`,
        badge: `${APP_BASE_URL}/images/logo/plain_logo_v0.1.png`,
        tag: `digital-rosary-${type}-${dateStr}`
      },
      fcmOptions: {
        link: `${APP_BASE_URL}/index.html`
      }
    }
  };
}

async function sendReminder(db, userRef, tokenDocs, type, dateStr, ordinal) {
  const tokens = tokenDocs.map((doc) => doc.token).filter(Boolean);
  if (!tokens.length) return { sentCount: 0, invalidCount: 0 };

  const payload = buildPayload(type, dateStr, ordinal);
  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: payload.notification,
    data: payload.data,
    webpush: payload.webpush
  });

  let sentCount = 0;
  const invalidDocIds = [];
  response.responses.forEach((result, index) => {
    if (result.success) {
      sentCount += 1;
      return;
    }

    const code = result.error && result.error.code;
    if (code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token') {
      const doc = tokenDocs[index];
      if (doc && doc.id) invalidDocIds.push(doc.id);
    }
  });

  if (invalidDocIds.length > 0) {
    const batch = db.batch();
    invalidDocIds.forEach((docId) => {
      batch.delete(userRef.collection('notificationTokens').doc(docId));
    });
    await batch.commit();
  }

  return { sentCount, invalidCount: invalidDocIds.length };
}

async function hasPrayerLoggedForDate(userRef, dateStr) {
  const snapshot = await userRef.collection('prayerLog').where('date', '==', dateStr).limit(1).get();
  return !snapshot.empty;
}

async function processUsers() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }

  const db = admin.firestore();
  const now = new Date();
  const usersSnapshot = await db.collection('users').get();

  let remindersSent = 0;
  let usersEvaluated = 0;
  let tokensRemoved = 0;

  for (const userDoc of usersSnapshot.docs) {
    usersEvaluated += 1;
    const userRef = userDoc.ref;
    const settingsRef = userRef.collection('settings').doc('preferences');
    const settingsDoc = await settingsRef.get();

    if (!settingsDoc.exists) continue;
    const settingsData = settingsDoc.data() || {};
    const notifications = getNormalizedNotificationSettings(settingsData.notifications);
    if (!notifications.enabled) continue;

    const tokensSnapshot = await userRef.collection('notificationTokens').where('enabled', '==', true).get();
    const tokenDocs = tokensSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((doc) => !!doc.token);
    if (!tokenDocs.length) continue;

    const localNow = getLocalDateTimeParts(now, settingsData.timezone || 'UTC');
    const dailyMinutes = parseTimeToMinutes(notifications.dailyPrayerTime, parseTimeToMinutes(DEFAULT_DAILY_TIME, 1170));
    const streakMinutes = parseTimeToMinutes(notifications.streakProtectionTime, parseTimeToMinutes(DEFAULT_STREAK_TIME, 1260));
    let settingsChanged = false;

    if (
      notifications.dailyPrayerEnabled &&
      isDueNow(localNow.minutes, dailyMinutes) &&
      notifications.lastDailyPrayerSentDate !== localNow.dateStr
    ) {
      const dailyResult = await sendReminder(db, userRef, tokenDocs, 'daily_prayer', localNow.dateStr);
      remindersSent += dailyResult.sentCount;
      tokensRemoved += dailyResult.invalidCount;
      if (dailyResult.sentCount > 0) {
        notifications.lastDailyPrayerSentDate = localNow.dateStr;
        settingsChanged = true;
      }
    }

    if (
      notifications.streakProtectionEnabled &&
      isDueNow(localNow.minutes, streakMinutes) &&
      notifications.lastStreakProtectionSentDate !== localNow.dateStr
    ) {
      const alreadyPrayedToday = await hasPrayerLoggedForDate(userRef, localNow.dateStr);
      if (!alreadyPrayedToday) {
        const streakResult = await sendReminder(db, userRef, tokenDocs, 'streak_protection', localNow.dateStr);
        remindersSent += streakResult.sentCount;
        tokensRemoved += streakResult.invalidCount;
        if (streakResult.sentCount > 0) {
          notifications.lastStreakProtectionSentDate = localNow.dateStr;
          settingsChanged = true;
        }
      }
    }

    if (settingsChanged) {
      await settingsRef.set({
        notifications,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }

    // Decade break reminders: fire when scheduledFor <= now, then clear
    const breakReminder = settingsData.decadeBreakReminder;
    if (breakReminder && breakReminder.scheduledFor && new Date(breakReminder.scheduledFor) <= now) {
      const ORDINAL_WORDS = ['first', 'second', 'third', 'fourth'];
      const ordinal = ORDINAL_WORDS[breakReminder.decadeIndex] ?? 'next';
      const breakResult = await sendReminder(db, userRef, tokenDocs, 'decade_break', localNow.dateStr, ordinal);
      remindersSent += breakResult.sentCount;
      tokensRemoved += breakResult.invalidCount;
      await settingsRef.set(
        { decadeBreakReminder: admin.firestore.FieldValue.delete() },
        { merge: true }
      );
    }
  }

  console.log(`Users evaluated: ${usersEvaluated}`);
  console.log(`Reminders sent: ${remindersSent}`);
  console.log(`Invalid tokens removed: ${tokensRemoved}`);
}

processUsers().catch((error) => {
  console.error('Reminder job failed:', error);
  process.exit(1);
});
