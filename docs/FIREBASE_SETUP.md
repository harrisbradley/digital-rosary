# Firebase Setup Instructions

This guide will help you set up Firebase for the Digital Rosary application.

## Prerequisites

- A Google account
- Access to Firebase Console (https://console.firebase.google.com)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "digital-rosary")
4. Follow the setup wizard:
   - Disable Google Analytics (optional, or enable if you want it)
   - Click "Create project"
5. Wait for project creation to complete

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable the following providers:
   - **Email/Password**: Click, enable it, and save
   - **Google**: Click, enable it, enter your project support email, and save

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (we'll add security rules later)
4. Select a location for your database (choose closest to your users)
5. Click **Enable**

## Step 4: Set Up Storage

1. In Firebase Console, go to **Storage** in the left sidebar
2. Click **Get started**
3. Start in test mode (we'll add security rules later)
4. Select a location (should match Firestore location)
5. Click **Done**

## Step 5: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. Click the **Web** icon (`</>`)
5. Register app:
   - Enter app nickname (e.g., "Digital Rosary Web")
   - Check "Also set up Firebase Hosting" if you want (optional)
   - Click **Register app**
6. Copy the `firebaseConfig` object

## Step 6: Update firebase-config.js

1. Open `firebase-config.js` in your project
2. **Keep the existing code structure** - do NOT delete everything
3. **Only replace the placeholder values** in the `firebaseConfig` object with your actual Firebase config values
4. The file should look like this (with YOUR values):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"  // Optional, only if you enabled Analytics
};
```

**Important:** 
- Do NOT use the ES6 `import` statements that Firebase Console shows
- Keep the existing `firebase.initializeApp()` and service initialization code
- Only replace the values inside the `firebaseConfig` object

## Step 7: Set Up Security Rules

### Firestore Rules

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Settings subcollection
      match /settings/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Stats subcollection
      match /stats/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Prayer log subcollection
      match /prayerLog/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      // Notification tokens subcollection
      match /notificationTokens/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Click **Publish**

### Storage Rules

1. In Firebase Console, go to **Storage** → **Rules**
2. Replace the rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile pictures - users can only access their own
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

## Step 8: Configure OAuth Consent Screen (for Google Sign-In)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project
3. Go to **APIs & Services** → **OAuth consent screen**
4. Fill in the required information:
   - User type: External (or Internal if using Google Workspace)
   - App name: Digital Rosary
   - User support email: Your email
   - Developer contact: Your email
5. Add scopes (if needed):
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
6. Add test users (if in testing mode)
7. Save and continue

## Step 9: Test the Setup

1. Open your application in a browser
2. Try creating an account
3. Try signing in with email/password
4. Try signing in with Google
5. Check Firebase Console to verify:
   - User appears in Authentication → Users
   - Data appears in Firestore Database
   - Profile picture uploads appear in Storage

## Troubleshooting

### "Firebase SDK not loaded" error
- Make sure Firebase SDK scripts are loaded before `firebase-config.js`
- Check browser console for script loading errors

### Authentication not working
- Verify Email/Password and Google are enabled in Authentication → Sign-in method
- Check browser console for error messages
- Verify your Firebase config values are correct

### Firestore permission denied
- Check that security rules are published
- Verify user is authenticated (`request.auth != null`)
- Check that user ID matches document path

### Storage upload fails
- Check Storage rules are published
- Verify file size is under 2MB
- Check browser console for specific error messages

## Data Migration

When users sign up or sign in for the first time, their existing localStorage data will be automatically migrated to Firestore. This includes:
- Prayer stats (total, streak, last date)
- Prayer log entries
- Settings (dark mode, 1-click Hail Marys)

The migration happens automatically and users don't need to do anything.

## Next Steps

- Consider enabling email verification
- Set up Firebase Hosting for production deployment
- Configure custom domain (if using Firebase Hosting)
- Set up monitoring and analytics (optional)
- Configure push reminders via `docs/NOTIFICATIONS_SETUP.md`
