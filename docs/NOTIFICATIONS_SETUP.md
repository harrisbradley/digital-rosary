# Notifications Setup (Android + iPhone/iPad Web Push)

This guide enables cross-platform prayer reminders using:

- Firebase Cloud Messaging (FCM) for web push delivery
- Browser service worker (`firebase-messaging-sw.js`)
- Scheduled GitHub Action (`send-prayer-reminders.yml`) to send reminders from Firestore settings

## 1) Configure Web Push in Firebase

1. Open Firebase Console → **Project Settings** → **Cloud Messaging**
2. In **Web configuration**, generate a **Web Push certificate key pair**
3. Copy the **public VAPID key**
4. Set `window.firebaseWebPushConfig.vapidKey` in `js/firebase-config.js`

```js
window.firebaseWebPushConfig = {
  vapidKey: "YOUR_PUBLIC_VAPID_KEY"
};
```

Without this key, browser subscription will fail.

## 2) iPhone/iPad Support (Required)

iOS web push requires additional setup:

1. In Firebase Console → **Cloud Messaging**, configure your Apple Web Push credentials
2. Add APNs key/certificate for your app/site domain
3. Ensure your production site is served over **HTTPS**
4. On iPhone/iPad, users should add the site to Home Screen for best push reliability

## 3) Firestore Rules Update

Allow each authenticated user to manage their own notification tokens:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /settings/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /stats/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /prayerLog/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /notificationTokens/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## 4) GitHub Secrets for Scheduled Reminder Sender

The workflow `.github/workflows/send-prayer-reminders.yml` runs every 15 minutes.

Add these repository secrets:

- `FIREBASE_SERVICE_ACCOUNT_JSON`  
  Full JSON from a Firebase service account with Firestore + FCM access.
- `APP_BASE_URL`  
  Example: `https://digitalrosary.app`

## 5) Reminder Behavior

Per-user reminder settings are saved in `users/{uid}/settings/preferences.notifications`:

- `enabled`
- `dailyPrayerEnabled` + `dailyPrayerTime`
- `streakProtectionEnabled` + `streakProtectionTime`

The scheduled sender:

- Sends a **daily prayer reminder** at user-local daily time
- Sends a **streak protection reminder** at user-local streak time only if no prayer was logged today
- Removes invalid/unregistered device tokens automatically

## 6) User Flow

1. User goes to **Profile → Prayer Reminders**
2. Taps **Enable on This Device**
3. Grants notification permission
4. Chooses reminder toggles/times
5. Uses **Send Test Notification** to verify device setup

## Troubleshooting

- **Permission denied**: user must re-enable notifications in browser/site settings.
- **No token generated**: VAPID key is missing/invalid.
- **iPhone not receiving push**: verify APNs setup + Home Screen install + HTTPS.
- **Workflow runs but no notifications**: check `APP_BASE_URL`, service account permissions, and workflow logs.
