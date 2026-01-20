// ========== STORAGE SERVICE ==========
// 📸 Handles profile picture uploads to Firebase Storage

// Maximum file size (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Compress and resize image
function compressImage(file, maxWidth = 200, maxHeight = 200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        }, file.type, quality);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Upload profile picture
async function uploadProfilePicture(userId, file) {
  try {
    // Validate file
    if (!file) {
      return { success: false, error: 'No file provided' };
    }
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Please use JPEG, PNG, or WebP' };
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'File too large. Maximum size is 2MB' };
    }
    
    // Compress image
    const compressedBlob = await compressImage(file);
    
    // Delete old profile picture if exists
    const oldUrl = await getProfilePictureUrl(userId);
    if (oldUrl.success && oldUrl.url) {
      try {
        const oldPath = oldUrl.url.split('/o/')[1]?.split('?')[0];
        if (oldPath) {
          const decodedPath = decodeURIComponent(oldPath);
          await firebaseStorage.ref(decodedPath).delete();
        }
      } catch (error) {
        console.warn('Failed to delete old profile picture:', error);
      }
    }
    
    // Upload new picture
    const storageRef = firebaseStorage.ref(`profile-pictures/${userId}/${Date.now()}.jpg`);
    const snapshot = await storageRef.put(compressedBlob);
    const downloadURL = await snapshot.ref.getDownloadURL();
    
    // Update user profile with new URL
    await firestoreService.updateUserProfile(userId, {
      profilePictureUrl: downloadURL
    });
    
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get profile picture URL
async function getProfilePictureUrl(userId) {
  try {
    const profile = await firestoreService.getUserProfile(userId);
    if (profile.success && profile.data && profile.data.profilePictureUrl) {
      return { success: true, url: profile.data.profilePictureUrl };
    }
    return { success: true, url: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Delete profile picture
async function deleteProfilePicture(userId) {
  try {
    const url = await getProfilePictureUrl(userId);
    if (url.success && url.url) {
      // Delete from Storage
      const path = url.url.split('/o/')[1]?.split('?')[0];
      if (path) {
        const decodedPath = decodeURIComponent(path);
        await firebaseStorage.ref(decodedPath).delete();
      }
      
      // Remove URL from profile
      await firestoreService.updateUserProfile(userId, {
        profilePictureUrl: null
      });
      
      return { success: true };
    }
    return { success: true }; // Already deleted or doesn't exist
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Export functions
window.storageService = {
  uploadProfilePicture,
  getProfilePictureUrl,
  deleteProfilePicture
};
