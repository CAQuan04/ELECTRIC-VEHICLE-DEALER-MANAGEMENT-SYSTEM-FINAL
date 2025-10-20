# Firebase Facebook Authentication Setup Guide

## 📋 Prerequisites

1. **Firebase Project**: Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. **Facebook App**: Create a Facebook App at [Facebook Developers](https://developers.facebook.com/)

## 🔧 Setup Steps

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable **Authentication** in Firebase Console
4. Go to **Authentication > Sign-in method**
5. Enable **Facebook** provider
6. You'll need to provide:
   - Facebook App ID
   - Facebook App Secret

### 2. Facebook App Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app (Consumer type)
3. Add **Facebook Login** product
4. Configure OAuth settings:
   - **Valid OAuth Redirect URIs**: Add your Firebase Auth domain
     ```
     https://your-project-id.firebaseapp.com/__/auth/handler
     ```
5. Copy **App ID** and **App Secret**
6. In Facebook App Settings > Basic:
   - Add your app domain
   - Set Privacy Policy URL
   - Set Terms of Service URL

### 3. Firebase Console Configuration

1. In Firebase Console > Authentication > Sign-in method
2. Click on Facebook provider
3. Enter your Facebook **App ID** and **App Secret**
4. Copy the OAuth redirect URI from Firebase
5. Paste it in Facebook App OAuth settings

### 4. Environment Variables

Create/Update `.env` file in your frontend directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 5. Install Firebase SDK

```bash
npm install firebase
```

## 📝 Usage

### Basic Login

```javascript
import { signInWithFacebook } from './utils/firebaseFacebookAuth';

const handleLogin = async () => {
  try {
    const userData = await signInWithFacebook();
    console.log('Logged in:', userData);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### With Error Handling

```javascript
import { 
  handleFacebookLoginSuccess, 
  handleFacebookLoginError 
} from './utils/firebaseFacebookAuth';

const handleLogin = async () => {
  try {
    const userData = await handleFacebookLoginSuccess();
    // Redirect based on role
    redirectUserBasedOnRole(userData.role);
  } catch (error) {
    handleFacebookLoginError(error);
  }
};
```

### Sign Out

```javascript
import { signOutFromFacebook } from './utils/firebaseFacebookAuth';

const handleLogout = async () => {
  try {
    await signOutFromFacebook();
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

### Auth State Listener

```javascript
import { onAuthStateChange } from './utils/firebaseFacebookAuth';

useEffect(() => {
  const unsubscribe = onAuthStateChange((user) => {
    if (user) {
      console.log('User logged in:', user);
    } else {
      console.log('User logged out');
    }
  });

  return () => unsubscribe();
}, []);
```

## 🔄 Migration from Facebook SDK

### Old Code (Facebook SDK)
```javascript
import { handleFacebookLoginSuccess } from './utils/facebookAuth';

const handleLogin = async () => {
  try {
    await handleFacebookLoginSuccess();
  } catch (error) {
    console.error(error);
  }
};
```

### New Code (Firebase)
```javascript
import { handleFacebookLoginSuccess } from './utils/firebaseFacebookAuth';

const handleLogin = async () => {
  try {
    await handleFacebookLoginSuccess();
  } catch (error) {
    console.error(error);
  }
};
```

✅ **Same API interface** - Just change the import path!

## 🚀 Features

- ✅ Facebook Login with Popup
- ✅ Auto role detection based on email
- ✅ LocalStorage persistence
- ✅ Auth state listener
- ✅ Error handling with Vietnamese messages
- ✅ Re-authentication support
- ✅ Account linking/unlinking
- ✅ Compatible with existing codebase

## 🔒 Security Notes

1. **Never commit** `.env` file to git
2. Add `.env` to `.gitignore`
3. Use environment variables for all sensitive data
4. Enable **Email enumeration protection** in Firebase Console
5. Set up **Authorized domains** in Firebase Console

## 🐛 Troubleshooting

### Error: "Popup blocked"
- User's browser is blocking popups
- Ask user to allow popups for your domain

### Error: "Unauthorized domain"
- Add your domain to Firebase Console > Authentication > Settings > Authorized domains

### Error: "Account exists with different credential"
- User has already signed up with this email using different provider (Google, Email, etc.)
- Consider implementing account linking

### Error: "Network request failed"
- Check internet connection
- Check if Firebase services are down
- Verify Firebase configuration

## 📚 Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Facebook Login Docs](https://developers.facebook.com/docs/facebook-login)
- [Firebase Facebook Auth Guide](https://firebase.google.com/docs/auth/web/facebook-login)

## 🔗 File Structure

```
src/
├── firebase/
│   └── config.js              # Firebase initialization
├── utils/
│   ├── firebaseFacebookAuth.js # New Firebase Facebook auth
│   └── facebookAuth.js         # Old Facebook SDK (deprecated)
```

## ⚡ Next Steps

1. ✅ Install Firebase: `npm install firebase`
2. ✅ Configure `.env` with Firebase credentials
3. ✅ Update imports from `facebookAuth.js` to `firebaseFacebookAuth.js`
4. ✅ Test login flow
5. ✅ Remove old Facebook SDK from `index.html`
