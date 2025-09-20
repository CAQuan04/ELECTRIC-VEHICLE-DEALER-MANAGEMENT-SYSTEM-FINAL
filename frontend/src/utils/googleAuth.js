// Helper function to decode JWT token from Google
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Helper function to handle Google login success
export const handleGoogleLoginSuccess = (credentialResponse) => {
  console.log('Google Login Success:', credentialResponse);
  
  // Decode the JWT token to get user information
  const decodedToken = decodeJWT(credentialResponse.credential);
  
  if (decodedToken) {
    console.log('Decoded user info:', {
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      email_verified: decodedToken.email_verified
    });
    
    // Here you would typically:
    // 1. Send the JWT token to your backend for verification
    // 2. Create a user session
    // 3. Redirect to dashboard or update UI state
    
    return {
      success: true,
      user: {
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
        emailVerified: decodedToken.email_verified
      },
      token: credentialResponse.credential
    };
  }
  
  return { success: false, error: 'Failed to decode token' };
};

// Helper function to handle Google login error
export const handleGoogleLoginError = () => {
  console.log('Google Login Failed');
  return { success: false, error: 'Google authentication failed' };
};