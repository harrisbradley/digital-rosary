// ========== AUTHENTICATION SERVICE ==========
// 🔐 Handles all authentication operations with Firebase Auth

// Auth state listener - tracks when user signs in/out
let authStateListeners = [];
let currentUser = null;

// Listen for auth state changes
firebaseAuth.onAuthStateChanged((user) => {
  currentUser = user;
  authStateListeners.forEach(listener => listener(user));
});

// Subscribe to auth state changes
function onAuthStateChanged(callback) {
  authStateListeners.push(callback);
  // Immediately call with current state
  if (currentUser !== null) {
    callback(currentUser);
  }
}

// Get current user
function getCurrentUser() {
  return firebaseAuth.currentUser;
}

// Sign up with email and password
async function signUpWithEmail(email, password, displayName) {
  try {
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Update display name
    if (displayName) {
      await user.updateProfile({ displayName });
    }
    
    // Create user profile in Firestore first
    if (window.firestoreService) {
      await firestoreService.updateUserProfile(user.uid, {
        name: displayName || 'User',
        email: email
      });
    }
    
    // Migrate localStorage data to Firestore (this will merge with existing profile)
    await migrateLocalStorageData(user.uid);
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign in with email and password
async function signInWithEmail(email, password) {
  try {
    const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Check if this is first sign-in (no Firestore data exists) and migrate
    const userDoc = await firebaseDb.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
      await migrateLocalStorageData(user.uid);
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign in with Google
async function signInWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const userCredential = await firebaseAuth.signInWithPopup(provider);
    const user = userCredential.user;
    
    // Check if this is first sign-in and migrate
    const userDoc = await firebaseDb.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
      await migrateLocalStorageData(user.uid);
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Send password reset email
async function sendPasswordResetEmail(email) {
  try {
    await firebaseAuth.sendPasswordResetEmail(email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Change password (requires re-authentication for security)
async function changePassword(currentPassword, newPassword) {
  try {
    const user = firebaseAuth.currentUser;
    if (!user || !user.email) {
      return { success: false, error: 'No user signed in' };
    }
    
    // Re-authenticate user
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    await user.reauthenticateWithCredential(credential);
    
    // Update password
    await user.updatePassword(newPassword);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign out
async function signOut() {
  try {
    await firebaseAuth.signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Migrate localStorage data to Firestore
async function migrateLocalStorageData(userId) {
  try {
    // Helper to get localStorage value
    const getLS = (key, defaultValue) => {
      try {
        const v = localStorage.getItem(key);
        return v === null ? defaultValue : JSON.parse(v);
      } catch {
        return defaultValue;
      }
    };
    
    // Collect all localStorage data
    const migrationData = {
      stats: {
        total: getLS('rosary_total_v1', 0),
        streak: getLS('rosary_streak_v1', 0),
        lastDate: getLS('rosary_last_date_v1', null)
      },
      settings: {
        darkMode: getLS('dark_mode_v1', false),
        oneClickHailMarys: getLS('one_click_hail_marys_v1', false),
        timezone: getLS('user_timezone_v1', Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'),
        notifications: {
          enabled: false,
          dailyPrayerEnabled: true,
          dailyPrayerTime: '19:30',
          streakProtectionEnabled: true,
          streakProtectionTime: '21:00',
          lastDailyPrayerSentDate: null,
          lastStreakProtectionSentDate: null
        }
      },
      irgProgress: {
        irgStep: getLS('irg_step_v1', 0),
        irgStepDate: getLS('irg_step_date_v1', null),
        irgStepSavedAt: getLS('irg_step_saved_at_v1', null)
      },
      prayerLog: getLS('rosary_log_v1', [])
    };
    
    // Create user document
    const userRef = firebaseDb.collection('users').doc(userId);
    await userRef.set({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    // Save stats - only if we have data to migrate, otherwise don't overwrite
    if (migrationData.stats.total > 0 || migrationData.stats.streak > 0 || migrationData.stats.lastDate) {
      await userRef.collection('stats').doc('current').set({
        total: migrationData.stats.total,
        streak: migrationData.stats.streak,
        lastDate: migrationData.stats.lastDate,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      // Also update localStorage cache to match Firestore
      if (window.setLS) {
        window.setLS('rosary_total_v1', migrationData.stats.total);
        window.setLS('rosary_streak_v1', migrationData.stats.streak);
        if (migrationData.stats.lastDate) {
          window.setLS('rosary_last_date_v1', migrationData.stats.lastDate);
        }
      }
    }
    
    // Save settings
    await userRef.collection('settings').doc('preferences').set({
      ...migrationData.settings,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    // Save IRG progress if available
    if (migrationData.irgProgress.irgStepDate) {
      await userRef.set({
        irgProgress: {
          irgStep: migrationData.irgProgress.irgStep,
          irgStepDate: migrationData.irgProgress.irgStepDate,
          irgStepSavedAt: migrationData.irgProgress.irgStepSavedAt || null,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        },
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }
    
    // Save prayer log entries
    if (migrationData.prayerLog && migrationData.prayerLog.length > 0) {
      const batch = firebaseDb.batch();
      migrationData.prayerLog.forEach(entry => {
        const logRef = userRef.collection('prayerLog').doc();
        batch.set(logRef, {
          date: entry.date,
          notes: entry.notes || '',
          createdAt: firebase.firestore.Timestamp.fromDate(new Date(entry.date)),
          migrated: true
        });
      });
      await batch.commit();
    }
    
    console.log('Data migration completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Error migrating data:', error);
    return { success: false, error: error.message };
  }
}

// Export functions
window.authService = {
  onAuthStateChanged,
  getCurrentUser,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  sendPasswordResetEmail,
  changePassword,
  signOut
};
