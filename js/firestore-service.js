// ========== FIRESTORE SERVICE ==========
// 📊 Handles all Firestore database operations

// Get user document reference
function getUserRef(userId) {
  return firebaseDb.collection('users').doc(userId);
}

// Format a Date as local YYYY-MM-DD (not UTC)
function firestoreLocalDateStr(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toFirestoreLocalDateStr(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return firestoreLocalDateStr(date);
}

function getFirestoreEntryDate(entry) {
  if (!entry) return null;
  if (typeof entry.date === 'string' && entry.date) return entry.date;
  if (entry.createdAt?.toDate) return toFirestoreLocalDateStr(entry.createdAt.toDate());
  return toFirestoreLocalDateStr(entry.createdAt);
}

// ========== USER DATA ==========
// Get full user document data
async function getUserData(userId) {
  try {
    const userDoc = await getUserRef(userId).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      const cacheKey = `user_data_${userId}`;
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return { success: true, data };
    }
    return { success: true, data: null };
  } catch (error) {
    // Try to get from cache
    const cacheKey = `user_data_${userId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return { success: true, data: JSON.parse(cached) };
    }
    return { success: false, error: error.message };
  }
}

// Update user document data (merge)
async function updateUserData(userId, data) {
  try {
    await getUserRef(userId).set({
      ...data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    // Update localStorage cache
    const cacheKey = `user_data_${userId}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const merged = { ...JSON.parse(cached), ...data };
        localStorage.setItem(cacheKey, JSON.stringify(merged));
      } else {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
    } catch {
      // Ignore cache errors
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ========== USER PROFILE ==========

// Get user profile
async function getUserProfile(userId) {
  try {
    const userDoc = await getUserRef(userId).get();
    if (!userDoc.exists) {
      return { success: false, error: 'User profile not found' };
    }
    return { success: true, data: userDoc.data() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Update user profile
async function updateUserProfile(userId, profileData) {
  try {
    await getUserRef(userId).set({
      ...profileData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    // Update localStorage cache
    const cacheKey = `user_profile_${userId}`;
    localStorage.setItem(cacheKey, JSON.stringify(profileData));
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ========== SETTINGS ==========

const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: false,
  dailyPrayerEnabled: true,
  dailyPrayerTime: '19:30',
  streakProtectionEnabled: true,
  streakProtectionTime: '21:00',
  lastDailyPrayerSentDate: null,
  lastStreakProtectionSentDate: null
};

function defaultUserSettings() {
  return {
    darkMode: false,
    oneClickHailMarys: false,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    notifications: { ...DEFAULT_NOTIFICATION_SETTINGS }
  };
}

function normalizeUserSettings(settings = {}) {
  const defaults = defaultUserSettings();
  return {
    ...defaults,
    ...settings,
    notifications: {
      ...defaults.notifications,
      ...(settings.notifications || {})
    }
  };
}

// Get user settings
async function getUserSettings(userId) {
  try {
    const settingsDoc = await getUserRef(userId).collection('settings').doc('preferences').get();
    if (settingsDoc.exists) {
      const data = normalizeUserSettings(settingsDoc.data() || {});
      // Cache in localStorage
      const cacheKey = `user_settings_${userId}`;
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return { success: true, data };
    }
    // Return defaults if no settings exist
    const defaults = defaultUserSettings();
    return { success: true, data: defaults };
  } catch (error) {
    // Try to get from cache
    const cacheKey = `user_settings_${userId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return { success: true, data: normalizeUserSettings(JSON.parse(cached)) };
    }
    return { success: false, error: error.message };
  }
}

// Update user settings
async function updateUserSettings(userId, settings) {
  try {
    const normalized = normalizeUserSettings(settings);
    await getUserRef(userId).collection('settings').doc('preferences').set({
      ...normalized,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    // Update localStorage cache
    const cacheKey = `user_settings_${userId}`;
    localStorage.setItem(cacheKey, JSON.stringify(normalized));
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ========== STATS ==========

// Get user stats
async function getUserStats(userId) {
  try {
    const statsDoc = await getUserRef(userId).collection('stats').doc('current').get();
    if (statsDoc.exists) {
      const data = statsDoc.data();
      // Cache in localStorage
      const cacheKey = `user_stats_${userId}`;
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return { success: true, data };
    }
    // Return defaults
    const defaults = { total: 0, streak: 0, lastDate: null };
    return { success: true, data: defaults };
  } catch (error) {
    // Try to get from cache
    const cacheKey = `user_stats_${userId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return { success: true, data: JSON.parse(cached) };
    }
    return { success: false, error: error.message };
  }
}

// Update user stats
async function updateUserStats(userId, stats) {
  try {
    await getUserRef(userId).collection('stats').doc('current').set({
      ...stats,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    // Update localStorage cache
    const cacheKey = `user_stats_${userId}`;
    localStorage.setItem(cacheKey, JSON.stringify(stats));
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ========== PRAYER LOG ==========

// Get prayer log entries
async function getPrayerLog(userId, limit = null) {
  try {
    let query = getUserRef(userId).collection('prayerLog').orderBy('createdAt', 'desc');
    if (limit) {
      query = query.limit(limit);
    }
    const snapshot = await query.get();
    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Cache in localStorage
    const cacheKey = `user_prayer_log_${userId}`;
    localStorage.setItem(cacheKey, JSON.stringify(entries));
    
    return { success: true, data: entries };
  } catch (error) {
    // Try to get from cache
    const cacheKey = `user_prayer_log_${userId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return { success: true, data: JSON.parse(cached) };
    }
    return { success: false, error: error.message };
  }
}

// Add prayer log entry
async function addPrayerLogEntry(userId, entry) {
  try {
    // Check if entry already exists for this date
    const existingLog = await getPrayerLog(userId);
    if (existingLog.success) {
      const dateStr = entry.date;
      const exists = existingLog.data.some(e => {
        const eDate = getFirestoreEntryDate(e);
        return eDate === dateStr;
      });
      if (exists) {
        return { success: false, error: 'Entry already exists for this date' };
      }
    }
    
    const logRef = getUserRef(userId).collection('prayerLog').doc();
    // Use server timestamp for createdAt, but store the date string separately
    await logRef.set({
      date: entry.date,
      notes: entry.notes || '',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Invalidate cache
    const cacheKey = `user_prayer_log_${userId}`;
    localStorage.removeItem(cacheKey);
    
    return { success: true, id: logRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Delete prayer log entry
async function deletePrayerLogEntry(userId, entryId) {
  try {
    await getUserRef(userId).collection('prayerLog').doc(entryId).delete();
    
    // Invalidate cache
    const cacheKey = `user_prayer_log_${userId}`;
    localStorage.removeItem(cacheKey);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Clear all prayer log entries
async function clearPrayerLog(userId) {
  try {
    const snapshot = await getUserRef(userId).collection('prayerLog').get();
    const batch = firebaseDb.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    // Invalidate cache
    const cacheKey = `user_prayer_log_${userId}`;
    localStorage.removeItem(cacheKey);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ========== NOTIFICATION TOKENS ==========

// Save or update a notification token for this user/device
async function saveNotificationToken(userId, tokenData) {
  try {
    if (!tokenData || !tokenData.token) {
      return { success: false, error: 'Token is required' };
    }

    const tokensRef = getUserRef(userId).collection('notificationTokens');
    const existing = await tokensRef.where('token', '==', tokenData.token).limit(1).get();
    const payload = {
      token: tokenData.token,
      platform: tokenData.platform || 'web',
      userAgent: tokenData.userAgent || '',
      language: tokenData.language || 'en',
      enabled: tokenData.enabled !== false,
      lastSeenAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (existing.empty) {
      const docRef = await tokensRef.add({
        ...payload,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { success: true, id: docRef.id };
    }

    await existing.docs[0].ref.set(payload, { merge: true });
    return { success: true, id: existing.docs[0].id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Remove token from this user (called when disabling notifications on a device)
async function deleteNotificationToken(userId, token) {
  try {
    if (!token) {
      return { success: false, error: 'Token is required' };
    }

    const tokensRef = getUserRef(userId).collection('notificationTokens');
    const snapshot = await tokensRef.where('token', '==', token).get();
    if (!snapshot.empty) {
      const batch = firebaseDb.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// List all notification tokens for a user
async function getNotificationTokens(userId) {
  try {
    const snapshot = await getUserRef(userId).collection('notificationTokens').get();
    const tokens = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: tokens };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ========== REAL-TIME LISTENERS ==========

// Listen to settings changes
function listenToSettings(userId, callback) {
  return getUserRef(userId).collection('settings').doc('preferences')
    .onSnapshot((doc) => {
      if (doc.exists) {
        const data = normalizeUserSettings(doc.data() || {});
        const cacheKey = `user_settings_${userId}`;
        localStorage.setItem(cacheKey, JSON.stringify(data));
        callback({ success: true, data });
      }
    }, (error) => {
      callback({ success: false, error: error.message });
    });
}

// Listen to stats changes
function listenToStats(userId, callback) {
  return getUserRef(userId).collection('stats').doc('current')
    .onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const cacheKey = `user_stats_${userId}`;
        localStorage.setItem(cacheKey, JSON.stringify(data));
        callback({ success: true, data });
      }
    }, (error) => {
      callback({ success: false, error: error.message });
    });
}

// Export functions
window.firestoreService = {
  getUserData,
  updateUserData,
  getUserProfile,
  updateUserProfile,
  getUserSettings,
  updateUserSettings,
  getUserStats,
  updateUserStats,
  getPrayerLog,
  addPrayerLogEntry,
  deletePrayerLogEntry,
  clearPrayerLog,
  saveNotificationToken,
  deleteNotificationToken,
  getNotificationTokens,
  listenToSettings,
  listenToStats
};
