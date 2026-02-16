// ========== FIREBASE CONFIGURATION ==========
// 🔥 Firebase initialization and service setup

// TODO: Replace these values with your Firebase project configuration
// Get these from: Firebase Console → Project Settings → General → Your apps
const firebaseConfig = {
    apiKey: "AIzaSyAEjbmQpJTkw2hAfh-1pRtkbDHQLx23BPQ",
    authDomain: "digital-rosary-db.firebaseapp.com",
    projectId: "digital-rosary-db",
    storageBucket: "digital-rosary-db.firebasestorage.app",
    messagingSenderId: "471155166682",
    appId: "1:471155166682:web:9165b939facaf931bfc4e3",
    measurementId: "G-YRYFS073NT"
  };

// Web Push configuration
// Set this to your Firebase Cloud Messaging Web Push certificate key pair (public key)
// Firebase Console → Project Settings → Cloud Messaging → Web configuration
window.firebaseWebPushConfig = {
  vapidKey: "BA5EiAa-RTuDIiR4pyZSB2G1ib8of9rCq6iOAx4en4XhG6aw_VSl6F5CtLPJgj9APxCtqDHTUqhwv8p9c-ugtHU"
};

// Initialize Firebase (only if not already initialized)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable Firestore offline persistence
db.enablePersistence().catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.warn('Firestore persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support persistence
    console.warn('Firestore persistence not supported in this browser');
  }
});

// Export services for use in other modules
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;