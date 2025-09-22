# Google Sign-In Setup Guide

This project implements Google Sign-In using the `@react-oauth/google` package following best practices.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install @react-oauth/google@latest
```

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client IDs**
5. Configure OAuth consent screen if prompted
6. Set Application type to **Web application**
7. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:5173` (for Vite default)
   - `http://localhost:5174` (for Vite when 5173 is busy)
   - Your production domain

**IMPORTANT:** Make sure to add the exact port your app is running on!

### 3. Configure Environment Variables

Create `.env` file in your frontend directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_BASE_URL=https://your-api.example.com
```

### 4. Implementation Features

✅ **Real Google Authentication** - Uses official Google OAuth library  
✅ **JWT Token Handling** - Decodes and extracts user information  
✅ **One-Tap Sign-In** - Faster authentication experience  
✅ **Error Handling** - Comprehensive error management  
✅ **Responsive Design** - Works on all device sizes  
✅ **Security Best Practices** - JWT verification ready for backend  

## 🔧 Usage

The Google Sign-In popup is triggered by clicking the "Login" button in the top-right corner.

### Authentication Flow

1. User clicks "Login" button
2. Google Sign-In popup opens
3. User selects Google account
4. JWT token is received and decoded
5. User information is extracted and displayed
6. Token should be sent to backend for verification

### User Information Available

- Email address
- Full name
- Profile picture
- Email verification status
- Google User ID

## 🛡️ Security Notes

### Frontend (Current Implementation)
- JWT token is decoded for display purposes only
- User info is logged to console for development
- No sensitive operations performed on frontend

### Backend Integration (Recommended Next Steps)
```javascript
// Send JWT to your backend
const response = await fetch('/api/auth/google', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: credentialResponse.credential })
});
```

### Backend Verification (Node.js Example)
```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload; // Contains verified user info
}
```

## 📱 Responsive Design

The popup is fully responsive and adapts to:
- Desktop screens (400px+ width)
- Tablet screens (768px and below)
- Mobile screens (480px and below)

## 🎨 Customization

### Button Styles Available
- **Theme**: `outline`, `filled_blue`, `filled_black`
- **Size**: `large`, `medium`, `small`
- **Shape**: `rectangular`, `pill`, `circle`, `square`
- **Text**: `signin_with`, `signup_with`, `continue_with`, `signin`

### Custom Implementation
The popup also includes a custom Google button for advanced use cases where you need more control over the authentication flow.

## 🚨 Common Issues

### "no registered origin" Error (Error 401: invalid_client)
**Problem:** Your current localhost port is not in authorized origins
**Solution:** 
1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. Add your current localhost URL to "Authorized JavaScript origins":
   - `http://localhost:5174` (or whatever port your app is running on)
4. Click "Save"
5. Wait a few minutes for changes to take effect
6. Refresh your application

### "popup_closed_by_user" Error
- Usually means incorrect Client ID
- Check that your domain is in authorized origins
- Ensure .env file is properly configured

### Button Not Appearing
- Verify internet connection (Google's CDN required)
- Check browser console for network errors
- Confirm GoogleOAuthProvider is wrapping your app

### Token Verification Issues
- Always verify tokens on your backend
- Never trust frontend-decoded tokens for authentication
- Use Google's official verification libraries

## 📝 Development vs Production

### Development
- Use `http://localhost:3000` and `http://localhost:5173` in authorized origins
- Console logging enabled for debugging
- Demo alerts show user information

### Production
- Add your production domain to authorized origins
- Remove console.log statements
- Implement proper error handling UI
- Set up backend token verification
- Configure user session management
- Set `VITE_API_BASE_URL` to your backend base URL (e.g., https://api.yourdomain.com)

## 🔗 Useful Links

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Package](https://www.npmjs.com/package/@react-oauth/google)
- [Google Cloud Console](https://console.cloud.google.com/)
- [JWT.io Token Debugger](https://jwt.io/)

---

For support, check the browser console for detailed error messages and refer to Google's official documentation.