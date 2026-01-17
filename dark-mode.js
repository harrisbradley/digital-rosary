// ========== DARK MODE FUNCTIONALITY ==========
// 🌙 Dark mode toggle functionality - shared across all pages

// Helper functions for localStorage (define if not already available)
// Define on window object to ensure availability
if (typeof window.getLS === 'undefined') {
  window.getLS = function(k, f) {
    try {
      const v = localStorage.getItem(k);
      return v === null ? f : JSON.parse(v);
    } catch {
      return f;
    }
  };
}

if (typeof window.setLS === 'undefined') {
  window.setLS = function(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      // Silently fail if localStorage is disabled
    }
  };
}

// LocalStorage key for dark mode preference
const DARK_MODE_KEY = 'dark_mode_v1';

// Initialize dark mode based on saved preference
async function initDarkMode() {
  const darkModeToggleEl = document.getElementById('darkModeToggle');
  const htmlRootEl = document.documentElement;
  
  if (!darkModeToggleEl) return; // Toggle doesn't exist on this page
  
  let savedDarkMode = window.getLS(DARK_MODE_KEY, false);
  
  // If authenticated, try to get from Firestore
  if (window.authService && window.firestoreService) {
    const user = window.authService.getCurrentUser();
    if (user) {
      try {
        const settings = await window.firestoreService.getUserSettings(user.uid);
        if (settings.success && settings.data.darkMode !== undefined) {
          savedDarkMode = settings.data.darkMode;
          // Update localStorage cache
          window.setLS(DARK_MODE_KEY, savedDarkMode);
        }
      } catch (error) {
        console.warn('Failed to load dark mode from Firestore:', error);
      }
    }
  }
  
  if (savedDarkMode) {
    htmlRootEl.classList.add('dark-mode');
    darkModeToggleEl.checked = true;
  } else {
    htmlRootEl.classList.remove('dark-mode');
    darkModeToggleEl.checked = false;
  }
}

// Toggle dark mode on/off
async function toggleDarkMode() {
  const darkModeToggleEl = document.getElementById('darkModeToggle');
  const htmlRootEl = document.documentElement;
  
  if (!darkModeToggleEl) return; // Toggle doesn't exist on this page
  
  const isDarkMode = darkModeToggleEl.checked;
  
  // Update dark mode class based on checkbox state
  if (isDarkMode) {
    htmlRootEl.classList.add('dark-mode');
  } else {
    htmlRootEl.classList.remove('dark-mode');
  }
  
  // Save preference to localStorage
  window.setLS(DARK_MODE_KEY, isDarkMode);
  
  // Also sync to Firestore if authenticated
  if (window.authService && window.firestoreService) {
    const user = window.authService.getCurrentUser();
    if (user) {
      try {
        const settings = await window.firestoreService.getUserSettings(user.uid);
        const currentSettings = settings.success ? settings.data : {};
        await window.firestoreService.updateUserSettings(user.uid, {
          ...currentSettings,
          darkMode: isDarkMode
        });
      } catch (error) {
        console.warn('Failed to sync dark mode to Firestore:', error);
      }
    }
  }
}

// Set up event listener when DOM is ready
function setupDarkMode() {
  const darkModeToggleEl = document.getElementById('darkModeToggle');
  if (darkModeToggleEl) {
    darkModeToggleEl.addEventListener('change', toggleDarkMode);
  }
  initDarkMode();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupDarkMode);
} else {
  // DOM is already loaded
  setupDarkMode();
}
