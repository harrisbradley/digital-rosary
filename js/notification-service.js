// ========== NOTIFICATION SERVICE ==========
// Handles Web Push setup, token registration, and local test notifications

const NOTIFICATION_SW_PATH = '/firebase-messaging-sw.js';
const NOTIFICATION_ICON_PATH = '/images/logo/plain_logo_v0.1.png';
const TOKEN_CACHE_KEY = 'fcm_token_v1';

let messagingInstance = null;
let swRegistration = null;
let foregroundHandlerInitialized = false;

function getCachedToken() {
  try {
    return localStorage.getItem(TOKEN_CACHE_KEY);
  } catch {
    return null;
  }
}

function setCachedToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_CACHE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_CACHE_KEY);
    }
  } catch {
    // Ignore localStorage errors
  }
}

function getPlatformLabel() {
  const ua = navigator.userAgent || '';
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Macintosh|Mac OS/i.test(ua)) return 'macos';
  if (/Windows/i.test(ua)) return 'windows';
  return 'web';
}

function normalizeSupportError(error) {
  if (!error) return 'Notifications are not supported on this browser/device.';
  return typeof error === 'string' ? error : error.message || 'Notifications are not supported on this browser/device.';
}

async function isMessagingSupported() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    return { supported: false, reason: 'This browser does not support notifications or service workers.' };
  }
  if (!window.firebase || typeof firebase.messaging !== 'function') {
    return { supported: false, reason: 'Firebase Messaging SDK is not loaded.' };
  }

  if (typeof firebase.messaging.isSupported === 'function') {
    try {
      const result = firebase.messaging.isSupported();
      const supported = (result && typeof result.then === 'function') ? await result : result;
      if (!supported) {
        return { supported: false, reason: 'Push messaging is not available on this browser.' };
      }
    } catch (error) {
      return { supported: false, reason: normalizeSupportError(error) };
    }
  }

  return { supported: true, reason: null };
}

function getVapidKey() {
  return (window.firebaseWebPushConfig && window.firebaseWebPushConfig.vapidKey) || '';
}

async function getMessaging() {
  if (messagingInstance) return messagingInstance;

  const support = await isMessagingSupported();
  if (!support.supported) {
    throw new Error(support.reason);
  }

  messagingInstance = firebase.messaging();
  return messagingInstance;
}

async function registerMessagingServiceWorker() {
  if (swRegistration) return swRegistration;
  swRegistration = await navigator.serviceWorker.register(NOTIFICATION_SW_PATH);
  return swRegistration;
}

async function requestPermission() {
  if (!('Notification' in window)) {
    return { success: false, permission: 'denied', error: 'Notifications are not supported on this browser.' };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return {
      success: false,
      permission,
      error: permission === 'denied'
        ? 'Notifications are blocked for this site. Please enable them in browser settings.'
        : 'Notification permission was not granted.'
    };
  }

  return { success: true, permission };
}

async function ensureForegroundMessageHandler() {
  if (foregroundHandlerInitialized) return;

  try {
    const messaging = await getMessaging();
    messaging.onMessage((payload) => {
      const title = payload?.notification?.title || 'Digital Rosary';
      const body = payload?.notification?.body || 'You have a new reminder.';
      const icon = payload?.notification?.icon || NOTIFICATION_ICON_PATH;
      const clickLink = payload?.data?.link || '/index.html';

      if (Notification.permission === 'granted') {
        const notification = new Notification(title, { body, icon, data: { link: clickLink } });
        notification.onclick = () => {
          window.focus();
          window.location.href = clickLink;
          notification.close();
        };
      }
    });

    foregroundHandlerInitialized = true;
  } catch (error) {
    console.warn('Unable to initialize foreground notification handler:', error);
  }
}

async function getTokenFromMessaging() {
  const vapidKey = getVapidKey();
  if (!vapidKey) {
    throw new Error('Web Push VAPID key is missing. Add firebaseWebPushConfig.vapidKey in js/firebase-config.js.');
  }

  const messaging = await getMessaging();
  const registration = await registerMessagingServiceWorker();
  const token = await messaging.getToken({
    vapidKey,
    serviceWorkerRegistration: registration
  });

  if (!token) {
    throw new Error('Unable to obtain a push token for this device.');
  }

  return token;
}

async function getCurrentToken() {
  if (Notification.permission !== 'granted') {
    return { success: false, token: null, error: 'Notification permission is not granted.' };
  }

  try {
    const token = await getTokenFromMessaging();
    setCachedToken(token);
    return { success: true, token };
  } catch (error) {
    return { success: false, token: getCachedToken(), error: error.message || 'Failed to get push token.' };
  }
}

async function subscribeCurrentDevice(userId) {
  try {
    const support = await isMessagingSupported();
    if (!support.supported) {
      return { success: false, error: support.reason };
    }

    const permissionResult = Notification.permission === 'granted'
      ? { success: true, permission: 'granted' }
      : await requestPermission();

    if (!permissionResult.success) {
      return { success: false, error: permissionResult.error, permission: permissionResult.permission };
    }

    const token = await getTokenFromMessaging();
    setCachedToken(token);

    if (userId && window.firestoreService && typeof window.firestoreService.saveNotificationToken === 'function') {
      const saveResult = await window.firestoreService.saveNotificationToken(userId, {
        token,
        platform: getPlatformLabel(),
        userAgent: navigator.userAgent || '',
        language: navigator.language || 'en'
      });
      if (!saveResult.success) {
        return { success: false, error: saveResult.error || 'Failed to save device notification token.' };
      }
    }

    await ensureForegroundMessageHandler();
    return { success: true, token, permission: 'granted' };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to enable notifications.' };
  }
}

async function unsubscribeCurrentDevice(userId) {
  try {
    const support = await isMessagingSupported();
    if (!support.supported) {
      return { success: false, error: support.reason };
    }

    const messaging = await getMessaging();
    const tokenResult = await getCurrentToken();
    const token = tokenResult.success ? tokenResult.token : getCachedToken();

    if (token && userId && window.firestoreService && typeof window.firestoreService.deleteNotificationToken === 'function') {
      await window.firestoreService.deleteNotificationToken(userId, token);
    }

    if (token) {
      await messaging.deleteToken(token);
    }

    setCachedToken(null);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to disable notifications on this device.' };
  }
}

async function sendTestNotification() {
  try {
    if (Notification.permission !== 'granted') {
      return { success: false, error: 'Enable notifications first to send a test notification.' };
    }

    const registration = await registerMessagingServiceWorker();
    await registration.showNotification('Digital Rosary Reminder', {
      body: 'This is a test reminder. You can now receive prayer notifications.',
      icon: NOTIFICATION_ICON_PATH,
      badge: NOTIFICATION_ICON_PATH,
      tag: 'digital-rosary-test'
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to show test notification.' };
  }
}

function getPermissionState() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

window.notificationService = {
  isMessagingSupported,
  getPermissionState,
  requestPermission,
  getCurrentToken,
  subscribeCurrentDevice,
  unsubscribeCurrentDevice,
  sendTestNotification,
  ensureForegroundMessageHandler
};
