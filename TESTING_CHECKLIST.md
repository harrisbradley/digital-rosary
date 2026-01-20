# Comprehensive Testing Checklist

This checklist will help you thoroughly test the Firebase authentication and profile features.

## 🔐 Authentication Testing

### Sign Up Flow
- [ ] **Email/Password Sign Up**
  - [ ] Create new account with valid email and password (min 6 chars)
  - [ ] Verify account appears in Firebase Console → Authentication → Users
  - [ ] Verify user is redirected to profile page after sign up
  - [ ] Try signing up with existing email (should show error)
  - [ ] Try signing up with password < 6 characters (should show error)
  - [ ] Try signing up with invalid email format (should show error)

- [ ] **Google Sign-In**
  - [ ] Click "Sign up with Google" button
  - [ ] Complete Google OAuth flow
  - [ ] Verify account created in Firebase Console
  - [ ] Verify redirected to profile page
  - [ ] Verify profile shows Google account name and email

### Sign In Flow
- [ ] **Email/Password Sign In**
  - [ ] Sign in with correct credentials (should succeed)
  - [ ] Sign in with wrong password (should show error)
  - [ ] Sign in with non-existent email (should show error)
  - [ ] Verify navigation shows "Profile" instead of "Log In" after sign in

- [ ] **Google Sign-In**
  - [ ] Sign in with Google account
  - [ ] Verify successful sign in
  - [ ] Verify navigation updates correctly

### Password Reset
- [ ] **Password Reset Flow**
  - [ ] Go to reset-password.html
  - [ ] Enter valid email address
  - [ ] Check email inbox for reset link
  - [ ] Click reset link in email
  - [ ] Set new password
  - [ ] Sign in with new password (should work)
  - [ ] Try reset with non-existent email (should still show success message for security)

### Password Change
- [ ] **Change Password (Authenticated)**
  - [ ] Sign in to account
  - [ ] Go to profile page
  - [ ] Enter current password and new password
  - [ ] Verify password changes successfully
  - [ ] Sign out and sign in with new password (should work)
  - [ ] Try changing password with wrong current password (should show error)
  - [ ] Try changing password with new password < 6 chars (should show error)
  - [ ] Try changing password with mismatched confirm password (should show error)

### Sign Out
- [ ] **Sign Out Flow**
  - [ ] Sign in to account
  - [ ] Click "Sign Out" on profile page
  - [ ] Verify redirected to index.html
  - [ ] Verify navigation shows "Log In" instead of "Profile"
  - [ ] Verify user data is no longer accessible (check console)

## 📊 Data Migration Testing

### First-Time Sign Up Migration
- [ ] **LocalStorage to Firestore Migration**
  - [ ] Clear browser data (or use incognito)
  - [ ] Add some test data to localStorage:
    - Log a few rosaries (use "Log Today's Rosary" button)
    - Toggle dark mode on/off
    - Toggle 1-click Hail Marys
    - Add entries to prayer log
  - [ ] Sign up for new account
  - [ ] Verify data appears in Firestore:
    - Check `users/{userId}/stats/current` for total, streak, lastDate
    - Check `users/{userId}/settings/preferences` for darkMode, oneClickHailMarys
    - Check `users/{userId}/prayerLog` for entries
  - [ ] Verify data appears correctly on profile page
  - [ ] Verify stats show correctly on main page

### Existing Account Sign In
- [ ] **No Migration on Existing Account**
  - [ ] Sign in to existing account (that already has Firestore data)
  - [ ] Verify no duplicate data is created
  - [ ] Verify existing Firestore data is loaded correctly

## 🔄 Data Sync Testing

### Real-Time Sync
- [ ] **Cross-Tab Sync**
  - [ ] Open app in two browser tabs
  - [ ] Sign in to same account in both tabs
  - [ ] In Tab 1: Log a rosary
  - [ ] In Tab 2: Verify stats update automatically (without refresh)
  - [ ] In Tab 1: Toggle dark mode
  - [ ] In Tab 2: Verify dark mode updates automatically
  - [ ] In Tab 1: Change timezone setting
  - [ ] In Tab 2: Verify timezone updates automatically

### Cross-Device Sync
- [ ] **Multi-Device Testing**
  - [ ] Sign in on Device 1 (e.g., desktop)
  - [ ] Log a rosary on Device 1
  - [ ] Sign in on Device 2 (e.g., phone or different browser)
  - [ ] Verify stats from Device 1 appear on Device 2
  - [ ] Change settings on Device 2
  - [ ] Verify settings sync to Device 1

## 👤 Profile Page Testing

### Profile Picture
- [ ] **Upload Profile Picture**
  - [ ] Go to profile page
  - [ ] Click camera icon to upload picture
  - [ ] Select image file (JPEG, PNG, or WebP)
  - [ ] Verify image uploads successfully
  - [ ] Verify image displays correctly
  - [ ] Try uploading image > 2MB (should show error)
  - [ ] Try uploading non-image file (should show error)
  - [ ] Upload new picture (should replace old one)

### Profile Information
- [ ] **Display User Info**
  - [ ] Verify name displays correctly
  - [ ] Verify email displays correctly
  - [ ] Sign in with Google account, verify Google name/email shows

### Prayer Stats Display
- [ ] **Stats on Profile**
  - [ ] Verify current streak displays correctly
  - [ ] Verify total rosaries displays correctly
  - [ ] Log a rosary, verify stats update on profile page
  - [ ] Verify stats match main page stats

### Recent Prayers
- [ ] **Last 5 Prayers Preview**
  - [ ] Add more than 5 prayer log entries
  - [ ] Verify only last 5 show on profile
  - [ ] Verify entries are sorted newest first
  - [ ] Click "View All →" link, verify goes to prayer-log.html
  - [ ] Verify entries show date and notes correctly

### Settings Management
- [ ] **Dark Mode Setting**
  - [ ] Toggle dark mode on/off
  - [ ] Refresh page, verify setting persists
  - [ ] Sign out and sign back in, verify setting persists
  - [ ] Verify setting syncs across devices

- [ ] **1-Click Hail Marys Setting**
  - [ ] Toggle 1-click Hail Marys on/off
  - [ ] Go to main page, verify toggle state matches
  - [ ] Refresh page, verify setting persists
  - [ ] Verify setting syncs across devices

- [ ] **Timezone Setting**
  - [ ] Change timezone dropdown
  - [ ] Refresh page, verify timezone persists
  - [ ] Verify timezone saves to Firestore
  - [ ] Try different timezones, verify all work

## 📝 Prayer Log Integration

### Prayer Log with Authentication
- [ ] **Authenticated Prayer Log**
  - [ ] Sign in to account
  - [ ] Go to prayer-log.html
  - [ ] Add new entry
  - [ ] Verify entry appears in list
  - [ ] Verify entry appears in Firestore
  - [ ] Add entry with notes
  - [ ] Verify notes save correctly
  - [ ] Try adding duplicate entry for same date (should show error)
  - [ ] Clear prayer log
  - [ ] Verify all entries deleted from Firestore

### Prayer Log without Authentication
- [ ] **LocalStorage Fallback**
  - [ ] Sign out
  - [ ] Go to prayer-log.html
  - [ ] Add entry
  - [ ] Verify entry saves to localStorage only
  - [ ] Sign in
  - [ ] Verify localStorage entry doesn't automatically migrate (migration only happens on first sign up)

## 🎨 Settings Persistence

### Dark Mode
- [ ] **Dark Mode Sync**
  - [ ] Sign in
  - [ ] Toggle dark mode on main page
  - [ ] Go to profile, verify dark mode setting matches
  - [ ] Change dark mode on profile
  - [ ] Go to main page, verify dark mode updates
  - [ ] Sign out, verify dark mode persists (localStorage)
  - [ ] Sign in, verify dark mode loads from Firestore

### 1-Click Hail Marys
- [ ] **1-Click Setting Sync**
  - [ ] Sign in
  - [ ] Toggle 1-click on main page
  - [ ] Go to profile, verify setting matches
  - [ ] Change setting on profile
  - [ ] Go to main page, verify toggle state matches
  - [ ] Verify setting persists across sessions

## 🔌 Offline Functionality

### Offline Mode
- [ ] **Offline Data Access**
  - [ ] Sign in to account
  - [ ] Load some data (stats, settings)
  - [ ] Disconnect internet (or use browser DevTools → Network → Offline)
  - [ ] Verify app still works (uses localStorage cache)
  - [ ] Try to log a rosary while offline
  - [ ] Reconnect internet
  - [ ] Verify offline changes sync to Firestore

### Network Error Handling
- [ ] **Error Recovery**
  - [ ] Sign in
  - [ ] Disconnect internet
  - [ ] Try to change settings
  - [ ] Verify error is handled gracefully (no crashes)
  - [ ] Reconnect internet
  - [ ] Verify changes sync when connection restored

## 🐛 Edge Cases & Error Handling

### Edge Cases
- [ ] **Empty States**
  - [ ] Create new account with no localStorage data
  - [ ] Verify profile shows 0 stats (not errors)
  - [ ] Verify "No prayers logged yet" shows correctly
  - [ ] Verify default settings apply correctly

- [ ] **Data Conflicts**
  - [ ] Sign in on two devices
  - [ ] Make changes on both simultaneously
  - [ ] Verify last write wins (or verify conflict resolution)

- [ ] **Large Data Sets**
  - [ ] Add 50+ prayer log entries
  - [ ] Verify profile page "Last 5" still works
  - [ ] Verify prayer log page loads all entries
  - [ ] Verify performance is acceptable

### Error Scenarios
- [ ] **Invalid Inputs**
  - [ ] Try to sign up with email that's already taken
  - [ ] Try to sign in with wrong password multiple times
  - [ ] Try to upload corrupted image file
  - [ ] Try to change password while not authenticated

- [ ] **Firebase Errors**
  - [ ] Temporarily break Firebase config (wrong API key)
  - [ ] Verify app handles error gracefully
  - [ ] Verify user sees helpful error message
  - [ ] Restore config, verify app recovers

## 🔒 Security Testing

### Access Control
- [ ] **Data Isolation**
  - [ ] Sign in as User A
  - [ ] Note User A's user ID from Firestore
  - [ ] Sign out
  - [ ] Sign in as User B
  - [ ] Try to manually access User A's data (should fail)
  - [ ] Verify User B only sees their own data

- [ ] **Unauthorized Access**
  - [ ] Sign out
  - [ ] Try to access profile.html directly (should redirect to login)
  - [ ] Try to access Firestore data without auth (should fail per security rules)

## 🎯 Integration Testing

### Main App Integration
- [ ] **Rosary Logging**
  - [ ] Sign in
  - [ ] Complete a rosary on main page
  - [ ] Click "Log Today's Rosary"
  - [ ] Verify stats update on main page
  - [ ] Go to profile, verify stats match
  - [ ] Go to prayer log, verify entry appears

- [ ] **Settings Integration**
  - [ ] Change dark mode on profile
  - [ ] Go to main page, verify dark mode applied
  - [ ] Change 1-click setting on profile
  - [ ] Go to main page, verify setting applied
  - [ ] Use rosary guide, verify 1-click works if enabled

### Navigation Updates
- [ ] **Auth State Navigation**
  - [ ] Sign out, verify all pages show "Log In" button
  - [ ] Sign in, verify all pages show "Profile" link
  - [ ] Click "Profile" from any page, verify goes to profile.html
  - [ ] Click "Log In" from any page, verify goes to login.html

## 📱 Browser Compatibility

### Cross-Browser Testing
- [ ] **Chrome/Edge** (Chromium)
  - [ ] Test all major features
  - [ ] Verify Firebase works correctly

- [ ] **Firefox**
  - [ ] Test authentication flows
  - [ ] Verify Firestore sync works

- [ ] **Safari** (if available)
  - [ ] Test authentication flows
  - [ ] Verify localStorage works correctly

### Mobile Testing
- [ ] **Mobile Browser**
  - [ ] Test on phone/tablet browser
  - [ ] Verify profile picture upload works
  - [ ] Verify forms are usable on mobile
  - [ ] Verify navigation works on small screens

## 🚀 Performance Testing

### Load Times
- [ ] **Initial Load**
  - [ ] Sign in, verify profile loads quickly
  - [ ] Verify stats load from cache first, then sync
  - [ ] Check browser console for errors

- [ ] **Data Sync**
  - [ ] Verify settings changes save quickly (< 1 second)
  - [ ] Verify stats update quickly after logging rosary

## ✅ Final Verification

### Complete User Journey
- [ ] **New User Flow**
  - [ ] New user visits site
  - [ ] Creates account
  - [ ] Data migrates from localStorage (if any)
  - [ ] Completes rosary
  - [ ] Logs rosary
  - [ ] Views profile
  - [ ] Uploads profile picture
  - [ ] Changes settings
  - [ ] Signs out
  - [ ] Signs back in
  - [ ] Verifies all data persisted

- [ ] **Returning User Flow**
  - [ ] Returning user signs in
  - [ ] All data loads correctly
  - [ ] Settings are applied
  - [ ] Can continue using app seamlessly

## 🐞 Known Issues to Watch For

- [ ] Check browser console for any errors
- [ ] Check Firebase Console for any unusual activity
- [ ] Verify no duplicate data in Firestore
- [ ] Verify no memory leaks (check browser DevTools)
- [ ] Verify no console warnings about deprecated APIs

## 📋 Quick Smoke Test (5 minutes)

If you're short on time, at minimum test:
1. ✅ Sign up with email/password
2. ✅ Sign in with Google
3. ✅ Log a rosary and verify it appears in profile
4. ✅ Upload profile picture
5. ✅ Change settings and verify they persist
6. ✅ Sign out and sign back in
7. ✅ Verify all data is still there

---

**After completing this checklist, your Firebase integration should be thoroughly tested and ready for production!**
