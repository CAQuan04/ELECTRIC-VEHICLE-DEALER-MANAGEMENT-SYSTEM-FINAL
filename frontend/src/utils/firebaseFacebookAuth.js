/**
 * Firebase Facebook Authentication
 * Replaces Facebook SDK with Firebase Authentication
 */

import { 
  getAuth, 
  signInWithPopup, 
  signOut,
  FacebookAuthProvider,
  onAuthStateChanged 
} from 'firebase/auth';
import { app } from '../firebase/config'; // You need to create this

const auth = getAuth(app);
const facebookProvider = new FacebookAuthProvider();

// Configure Facebook provider with additional scopes
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

// Optional: Set custom parameters
facebookProvider.setCustomParameters({
  'display': 'popup'
});

/**
 * Helper function to determine user role based on email
 */
const getUserRole = (email) => {
  if (!email) return 'customer';
  
  if (email.includes('@dealer.') || email.includes('dealer@')) {
    return 'dealer';
  } else if (email.includes('@evm.') || email.includes('admin@') || email.includes('evm@')) {
    return 'evm_admin';
  } else {
    return 'customer';
  }
};

/**
 * Redirect user based on their role
 */
export const redirectUserBasedOnRole = (userRole) => {
  switch (userRole) {
    case 'dealer':
      window.location.href = '/dealer-dashboard';
      break;
    case 'evm_admin':
      window.location.href = '/evm-dashboard';
      break;
    case 'customer':
    default:
      window.location.href = '/customer-dashboard';
      break;
  }
};

/**
 * Sign in with Facebook using Firebase
 * @returns {Promise<Object>} User data object
 */
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    
    // Get the Facebook access token
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
    
    // Get user information
    const user = result.user;
    
    const userData = {
      uid: user.uid,
      id: user.uid,
      name: user.displayName,
      email: user.email,
      picture: user.photoURL,
      provider: 'facebook',
      accessToken: accessToken,
      role: getUserRole(user.email),
      emailVerified: user.emailVerified,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      }
    };
    
    // Store user data in localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('isAuthenticated', 'true');
    
    console.log('✅ Firebase Facebook login successful:', userData);
    return userData;
    
  } catch (error) {
    console.error('❌ Firebase Facebook login error:', error);
    
    // Handle specific error codes
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = FacebookAuthProvider.credentialFromError(error);
    
    throw {
      code: errorCode,
      message: errorMessage,
      email: email,
      credential: credential,
      originalError: error
    };
  }
};

/**
 * Sign out from Firebase
 * @returns {Promise<void>}
 */
export const signOutFromFacebook = async () => {
  try {
    await signOut(auth);
    
    // Clear localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    
    console.log('✅ User signed out successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Sign out error:', error);
    throw error;
  }
};

/**
 * Get current authenticated user
 * @returns {Object|null} Current user or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Check if user is currently authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const userData = {
        uid: user.uid,
        id: user.uid,
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
        provider: user.providerData[0]?.providerId,
        role: getUserRole(user.email),
        emailVerified: user.emailVerified
      };
      callback(userData);
    } else {
      callback(null);
    }
  });
};

/**
 * Complete Facebook login flow with success handling
 * Compatible with existing codebase
 */
export const handleFacebookLoginSuccess = async () => {
  try {
    const userData = await signInWithFacebook();
    
    console.log('Facebook login successful:', userData);
    return userData;
    
  } catch (error) {
    console.error('Facebook login error:', error);
    throw error;
  }
};

/**
 * Handle Facebook login error
 * Compatible with existing codebase
 */
export const handleFacebookLoginError = (error) => {
  console.error('Facebook login failed:', error);
  
  let errorMessage = 'Đăng nhập Facebook thất bại';
  
  // Firebase error codes
  switch (error.code) {
    case 'auth/account-exists-with-different-credential':
      errorMessage = 'Email này đã được sử dụng với phương thức đăng nhập khác';
      break;
    case 'auth/cancelled-popup-request':
    case 'auth/popup-closed-by-user':
      errorMessage = 'Đăng nhập bị hủy';
      break;
    case 'auth/popup-blocked':
      errorMessage = 'Popup bị chặn. Vui lòng cho phép popup';
      break;
    case 'auth/network-request-failed':
      errorMessage = 'Lỗi kết nối mạng';
      break;
    case 'auth/unauthorized-domain':
      errorMessage = 'Domain chưa được cấu hình trong Firebase';
      break;
    default:
      if (error.message) {
        errorMessage = error.message;
      }
  }
  
  alert(errorMessage);
  return errorMessage;
};

/**
 * Check if user is logged in with Facebook
 * Compatible with existing codebase
 */
export const isLoggedInWithFacebook = () => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Check if provider is Facebook
  const providerData = user.providerData || [];
  return providerData.some(provider => provider.providerId === 'facebook.com');
};

/**
 * Re-authenticate user (useful for sensitive operations)
 */
export const reauthenticateWithFacebook = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    const credential = FacebookAuthProvider.credential(
      user.accessToken
    );
    
    await user.reauthenticateWithCredential(credential);
    console.log('✅ Re-authentication successful');
    return true;
    
  } catch (error) {
    console.error('❌ Re-authentication error:', error);
    throw error;
  }
};

/**
 * Link Facebook account to existing account
 */
export const linkFacebookAccount = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    const result = await linkWithPopup(user, facebookProvider);
    console.log('✅ Facebook account linked successfully');
    return result;
    
  } catch (error) {
    console.error('❌ Account linking error:', error);
    throw error;
  }
};

/**
 * Unlink Facebook account
 */
export const unlinkFacebookAccount = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    await unlink(user, 'facebook.com');
    console.log('✅ Facebook account unlinked successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Account unlinking error:', error);
    throw error;
  }
};

// Export auth instance for advanced usage
export { auth, facebookProvider };
