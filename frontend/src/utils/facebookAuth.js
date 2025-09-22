// Facebook Authentication utilities
// Requires Facebook SDK to be loaded in index.html

// Initialize Facebook SDK
export const initializeFacebook = () => {
  return new Promise((resolve, reject) => {
    // Check if FB SDK is available
    if (typeof FB === 'undefined') {
      // Wait for FB SDK to load
      window.fbAsyncInit = function() {
        FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID || 'your-facebook-app-id-here',
          cookie: true,
          xfbml: true,
          version: 'v20.0'
        });
        
        FB.AppEvents.logPageView();
        resolve();
      };
    } else {
      // FB is already loaded
      resolve();
    }
  });
};

// Check if user is logged in to Facebook
export const checkFacebookLoginStatus = () => {
  return new Promise((resolve, reject) => {
    if (typeof FB === 'undefined') {
      reject(new Error('Facebook SDK not loaded'));
      return;
    }
    
    FB.getLoginStatus((response) => {
      resolve(response);
    });
  });
};

// Handle Facebook login
export const loginWithFacebook = (permissions = 'public_profile,email') => {
  return new Promise((resolve, reject) => {
    if (typeof FB === 'undefined') {
      reject(new Error('Facebook SDK not loaded'));
      return;
    }
    
    FB.login((response) => {
      if (response.authResponse) {
        // User logged in successfully
        resolve(response);
      } else {
        // User cancelled login or did not fully authorize
        reject(new Error('User cancelled login or did not fully authorize'));
      }
    }, { scope: permissions });
  });
};

// Get user info from Facebook
export const getFacebookUserInfo = (fields = 'name,email,picture') => {
  return new Promise((resolve, reject) => {
    if (typeof FB === 'undefined') {
      reject(new Error('Facebook SDK not loaded'));
      return;
    }
    
    FB.api('/me', { fields }, (response) => {
      if (response && !response.error) {
        resolve(response);
      } else {
        reject(new Error(response.error?.message || 'Failed to get user info'));
      }
    });
  });
};

// Handle Facebook logout
export const logoutFromFacebook = () => {
  return new Promise((resolve, reject) => {
    if (typeof FB === 'undefined') {
      reject(new Error('Facebook SDK not loaded'));
      return;
    }
    
    FB.logout((response) => {
      resolve(response);
    });
  });
};

// Complete Facebook login flow (login + get user info)
export const handleFacebookLoginSuccess = async () => {
  try {
    // Initialize Facebook SDK first
    await initializeFacebook();
    
    const loginResponse = await loginWithFacebook();
    
    if (loginResponse.authResponse) {
      const userInfo = await getFacebookUserInfo();
      
      // Store user info in localStorage (similar to Google Auth pattern)
      const userData = {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture?.data?.url,
        provider: 'facebook',
        accessToken: loginResponse.authResponse.accessToken
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      
      console.log('Facebook login successful:', userData);
      return userData;
    }
  } catch (error) {
    console.error('Facebook login error:', error);
    throw error;
  }
};

// Handle Facebook login error
export const handleFacebookLoginError = (error) => {
  console.error('Facebook login failed:', error);
  
  // You can customize error handling here
  let errorMessage = 'Đăng nhập Facebook thất bại';
  
  if (error.message.includes('cancelled')) {
    errorMessage = 'Đăng nhập bị hủy';
  } else if (error.message.includes('SDK not loaded')) {
    errorMessage = 'Không thể kết nối với Facebook';
  }
  
  alert(errorMessage);
};

// Check if user is currently logged in
export const isLoggedInWithFacebook = async () => {
  try {
    const status = await checkFacebookLoginStatus();
    return status.status === 'connected';
  } catch (error) {
    console.error('Error checking Facebook login status:', error);
    return false;
  }
};

// Initialize Facebook login button (if using Facebook's button component)
export const initFacebookLoginButton = () => {
  if (typeof FB !== 'undefined') {
    FB.XFBML.parse();
  }
};