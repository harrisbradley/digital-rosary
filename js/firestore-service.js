// ========== FIRESTORE SERVICE ==========
// 📊 Handles all Firestore database operations

// Get user document reference
function getUserRef(userId) {
  return firebaseDb.collection('users').doc(userId);
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

// Get user settings
async function getUserSettings(userId) {
  try {
    const settingsDoc = await getUserRef(userId).collection('settings').doc('preferences').get();
    if (settingsDoc.exists) {
      const data = settingsDoc.data();
      // Cache in localStorage
      const cacheKey = `user_settings_${userId}`;
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return { success: true, data };
    }
    // Return defaults if no settings exist
    const defaults = {
      darkMode: false,
      oneClickHailMarys: false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    };
    return { success: true, data: defaults };
  } catch (error) {
    // Try to get from cache
    const cacheKey = `user_settings_${userId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return { success: true, data: JSON.parse(cached) };
    }
    return { success: false, error: error.message };
  }
}

// Update user settings
async function updateUserSettings(userId, settings) {
  try {
    await getUserRef(userId).collection('settings').doc('preferences').set({
      ...settings,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    // Update localStorage cache
    const cacheKey = `user_settings_${userId}`;
    localStorage.setItem(cacheKey, JSON.stringify(settings));
    
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
    const defaults = { total: 0, streak: 0, longestStreak: 0, lastDate: null };
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
    let query = getUserRef(userId).collection('prayerLog').orderBy('date', 'desc');
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
  const dateStr = entry.date;
  if (!dateStr) {
    return { success: false, error: 'Entry date is required' };
  }
  
  try {
    const logRef = getUserRef(userId).collection('prayerLog').doc(dateStr);
    // Use server timestamp for createdAt, but store the date string separately
    await logRef.set({
      date: dateStr,
      notes: entry.notes || '',
      timezone: entry.timezone || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Invalidate cache
    const cacheKey = `user_prayer_log_${userId}`;
    localStorage.removeItem(cacheKey);
    
    return { success: true, id: logRef.id };
  } catch (error) {
    if (error.code === 'permission-denied') {
      try {
        const existing = await getUserRef(userId).collection('prayerLog').doc(dateStr).get();
        if (existing.exists) {
          return { success: false, error: 'Entry already exists for this date' };
        }
      } catch {
        // Ignore and fall through to generic error
      }
    }
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

// ========== REAL-TIME LISTENERS ==========

// Listen to settings changes
function listenToSettings(userId, callback) {
  return getUserRef(userId).collection('settings').doc('preferences')
    .onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
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
  listenToSettings,
  listenToStats
};
