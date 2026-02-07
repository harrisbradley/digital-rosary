const { onDocumentCreated, onDocumentDeleted } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const STATS_VERSION = 2;
const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function dateToUtcMs(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function addDays(dateStr, delta) {
  const utcMs = dateToUtcMs(dateStr);
  const next = new Date(utcMs + delta * DAY_MS);
  return next.toISOString().slice(0, 10);
}

function isNextDay(prevDateStr, nextDateStr) {
  return dateToUtcMs(nextDateStr) - dateToUtcMs(prevDateStr) === DAY_MS;
}

async function computeStatsFromLogs(userId) {
  const logsSnap = await db
    .collection("users")
    .doc(userId)
    .collection("prayerLog")
    .select("date")
    .get();

  if (logsSnap.empty) {
    return { total: 0, streak: 0, longestStreak: 0, lastDate: null };
  }

  const dates = new Set();
  logsSnap.forEach((doc) => {
    const data = doc.data() || {};
    const dateStr = data.date || doc.id;
    if (dateStr && DATE_REGEX.test(dateStr)) {
      dates.add(dateStr);
    }
  });

  const sorted = Array.from(dates).sort();
  if (sorted.length === 0) {
    return { total: 0, streak: 0, longestStreak: 0, lastDate: null };
  }

  let longestRun = 1;
  let currentRun = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    if (isNextDay(sorted[i - 1], sorted[i])) {
      currentRun += 1;
    } else {
      longestRun = Math.max(longestRun, currentRun);
      currentRun = 1;
    }
  }
  longestRun = Math.max(longestRun, currentRun);

  const lastDate = sorted[sorted.length - 1];
  const streak = currentRun;
  const longestStreak = longestRun;

  return {
    total: sorted.length,
    streak,
    longestStreak,
    lastDate,
    version: STATS_VERSION
  };
}

async function writeStats(userId, stats) {
  const statsRef = db.collection("users").doc(userId).collection("stats").doc("current");
  await statsRef.set(
    {
      ...stats,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}

exports.onPrayerLogCreated = onDocumentCreated(
  "users/{userId}/prayerLog/{dateId}",
  async (event) => {
    const { userId, dateId } = event.params;
    const data = event.data ? event.data.data() : {};
    const dateStr = data.date || dateId;

    if (!dateStr || !DATE_REGEX.test(dateStr)) {
      logger.warn("Invalid prayer log date", { userId, dateId, dateStr });
      return;
    }

    const statsRef = db.collection("users").doc(userId).collection("stats").doc("current");
    const statsSnap = await statsRef.get();
    const stats = statsSnap.exists ? statsSnap.data() : null;

    if (!stats || !stats.lastDate || stats.version !== STATS_VERSION) {
      const recomputed = await computeStatsFromLogs(userId);
      await writeStats(userId, recomputed);
      return;
    }

    if (dateStr <= stats.lastDate) {
      const recomputed = await computeStatsFromLogs(userId);
      await writeStats(userId, recomputed);
      return;
    }

    const yesterday = addDays(dateStr, -1);
    const yesterdaySnap = await db
      .collection("users")
      .doc(userId)
      .collection("prayerLog")
      .doc(yesterday)
      .get();

    let newStreak = 1;
    if (yesterdaySnap.exists) {
      const prevStreak = stats.streak || 0;
      newStreak = Math.max(prevStreak + 1, 2);
    }

    const prevLongest = stats.longestStreak || 0;
    const newLongest = Math.max(prevLongest, newStreak);
    const newTotal = (stats.total || 0) + 1;

    await writeStats(userId, {
      total: newTotal,
      streak: newStreak,
      longestStreak: newLongest,
      lastDate: dateStr,
      version: STATS_VERSION
    });
  }
);

exports.onPrayerLogDeleted = onDocumentDeleted(
  "users/{userId}/prayerLog/{dateId}",
  async (event) => {
    const { userId } = event.params;
    const recomputed = await computeStatsFromLogs(userId);
    await writeStats(userId, recomputed);
  }
);
