# 🔄 Migration Guide: Facebook SDK → Firebase Facebook Auth

## 📊 Tóm tắt thay đổi

| Aspect | Old (Facebook SDK) | New (Firebase) |
|--------|-------------------|----------------|
| **Setup** | Load SDK in HTML | npm install firebase |
| **Init** | FB SDK in window | Firebase config file |
| **Login** | FB.login() | signInWithPopup() |
| **User Data** | FB.api('/me') | Firebase Auth user object |
| **State** | Manual localStorage | Firebase Auth state |
| **Logout** | FB.logout() | signOut() |

## 🚀 Quick Start

### Bước 1: Cài đặt Firebase

```bash
npm install firebase
```

### Bước 2: Cấu hình Firebase

Tạo file `.env` (copy từ `.env.example`):

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Bước 3: Update imports

#### ❌ Cũ (Facebook SDK)
```javascript
import { 
  handleFacebookLoginSuccess,
  handleFacebookLoginError 
} from './utils/facebookAuth';
```

#### ✅ Mới (Firebase)
```javascript
import { 
  signInWithFacebook,
  signOutFromFacebook,
  handleFacebookLoginError 
} from './utils/firebaseFacebookAuth';

// Hoặc sử dụng alias từ utils/index.js
import { 
  handleFirebaseFacebookLogin,
  handleFirebaseFacebookError 
} from '@utils';
```

## 📝 Code Migration Examples

### Example 1: Basic Login

#### ❌ Cũ
```javascript
import { handleFacebookLoginSuccess } from './utils/facebookAuth';

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      await handleFacebookLoginSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleLogin}>Login with Facebook</button>;
};
```

#### ✅ Mới
```javascript
import { signInWithFacebook } from './utils/firebaseFacebookAuth';

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      const userData = await signInWithFacebook();
      console.log('User:', userData);
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleLogin}>Login with Facebook</button>;
};
```

### Example 2: With Error Handling

#### ❌ Cũ
```javascript
import { 
  handleFacebookLoginSuccess,
  handleFacebookLoginError 
} from './utils/facebookAuth';

const handleLogin = async () => {
  try {
    const userData = await handleFacebookLoginSuccess();
    redirectUserBasedOnRole(userData.role);
  } catch (error) {
    handleFacebookLoginError(error);
  }
};
```

#### ✅ Mới (Giống hệt!)
```javascript
import { 
  handleFirebaseFacebookLogin,
  handleFirebaseFacebookError,
  redirectUserBasedOnRole 
} from '@utils';

const handleLogin = async () => {
  try {
    const userData = await handleFirebaseFacebookLogin();
    redirectUserBasedOnRole(userData.role);
  } catch (error) {
    handleFirebaseFacebookError(error);
  }
};
```

### Example 3: Auth State Listener

#### ❌ Cũ (Manual check)
```javascript
import { isLoggedInWithFacebook } from './utils/facebookAuth';

useEffect(() => {
  const checkAuth = async () => {
    const isLoggedIn = await isLoggedInWithFacebook();
    setUser(isLoggedIn ? JSON.parse(localStorage.getItem('userData')) : null);
  };
  
  checkAuth();
}, []);
```

#### ✅ Mới (Real-time listener)
```javascript
import { onAuthStateChange } from './utils/firebaseFacebookAuth';

useEffect(() => {
  const unsubscribe = onAuthStateChange((user) => {
    setUser(user);
  });

  return () => unsubscribe();
}, []);
```

### Example 4: Logout

#### ❌ Cũ
```javascript
import { logoutFromFacebook } from './utils/facebookAuth';

const handleLogout = async () => {
  try {
    await logoutFromFacebook();
    localStorage.removeItem('userData');
    window.location.href = '/';
  } catch (error) {
    console.error(error);
  }
};
```

#### ✅ Mới
```javascript
import { signOutFromFacebook } from './utils/firebaseFacebookAuth';

const handleLogout = async () => {
  try {
    await signOutFromFacebook(); // Auto clears localStorage
    window.location.href = '/';
  } catch (error) {
    console.error(error);
  }
};
```

## 🔍 API Comparison

### Login Methods

| Old Method | New Method | Notes |
|------------|-----------|-------|
| `handleFacebookLoginSuccess()` | `signInWithFacebook()` | Direct replacement |
| `loginWithFacebook()` | `signInWithPopup(auth, provider)` | Lower level |
| `initializeFacebook()` | Not needed | Auto-initialized |

### User Info

| Old | New | Notes |
|-----|-----|-------|
| `getFacebookUserInfo()` | `getCurrentUser()` | Sync, no API call |
| `FB.api('/me')` | `auth.currentUser` | Built into Firebase |

### Auth State

| Old | New | Notes |
|-----|-----|-------|
| `checkFacebookLoginStatus()` | `onAuthStateChanged()` | Real-time |
| `isLoggedInWithFacebook()` | `isAuthenticated()` | Instant |

### Logout

| Old | New | Notes |
|-----|-----|-------|
| `logoutFromFacebook()` | `signOutFromFacebook()` | Auto cleanup |

## ✨ New Features (Firebase only)

```javascript
import { 
  reauthenticateWithFacebook,
  linkFacebookAccount,
  unlinkFacebookAccount 
} from './utils/firebaseFacebookAuth';

// Re-authenticate for sensitive operations
await reauthenticateWithFacebook();

// Link Facebook to existing account
await linkFacebookAccount();

// Unlink Facebook account
await unlinkFacebookAccount();
```

## 🗑️ Cleanup Steps

### 1. Remove Facebook SDK from HTML

Xóa script tag trong `index.html`:
```html
<!-- REMOVE THIS -->
<script async defer crossorigin="anonymous" 
  src="https://connect.facebook.net/en_US/sdk.js"></script>
```

### 2. Update AuthComponent

File: `src/modules/auth/AuthComponent.jsx`

```javascript
// Thay đổi import
- import { handleFacebookLoginSuccess } from '@utils';
+ import { signInWithFacebook } from '@utils';

// Thay đổi function call
- await handleFacebookLoginSuccess();
+ await signInWithFacebook();
```

### 3. Remove old .env variables

```env
# DELETE THIS
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

## 🧪 Testing Checklist

- [ ] Install Firebase: `npm install firebase`
- [ ] Configure `.env` with Firebase credentials
- [ ] Test login flow
- [ ] Test logout flow
- [ ] Test role detection (admin/dealer/customer emails)
- [ ] Test auth state persistence (refresh page)
- [ ] Test error handling (cancel popup, network error)
- [ ] Verify localStorage is updated correctly
- [ ] Test redirect based on user role
- [ ] Remove Facebook SDK script from index.html

## 📚 Files Changed

### New Files
- ✅ `src/firebase/config.js` - Firebase configuration
- ✅ `src/utils/firebaseFacebookAuth.js` - Firebase Facebook auth
- ✅ `FIREBASE_FACEBOOK_SETUP.md` - Setup guide
- ✅ `.env.example` - Environment template
- ✅ `src/examples/FirebaseFacebookLoginExample.jsx` - Demo component

### Modified Files
- ✅ `src/utils/index.js` - Added Firebase exports
- 🔄 `src/modules/auth/AuthComponent.jsx` - Update imports (TODO)
- 🔄 `index.html` - Remove Facebook SDK (TODO)

### Deprecated Files (Keep for reference)
- ⚠️ `src/utils/facebookAuth.js` - Old Facebook SDK (will be removed later)

## 🆘 Troubleshooting

### "Module not found: firebase"
```bash
npm install firebase
```

### "Firebase not initialized"
Check `.env` file has correct Firebase config

### "Popup blocked"
Allow popups for your domain in browser settings

### Login works but role is wrong
Check email-to-role logic in `getUserRole()` function

### User data not persisting
Firebase automatically handles persistence, check `onAuthStateChange` listener

## 🎯 Benefits of Firebase

1. ✅ **No SDK loading** - Faster page load
2. ✅ **Better security** - OAuth handled by Firebase
3. ✅ **Real-time auth state** - No manual checks needed
4. ✅ **Built-in persistence** - Auto save/restore auth
5. ✅ **Better error handling** - Standardized error codes
6. ✅ **Cross-platform** - Same code for web/mobile
7. ✅ **Additional features** - Re-auth, account linking, etc.

## 📞 Support

- [Firebase Docs](https://firebase.google.com/docs/auth/web/facebook-login)
- [Migration Guide](./FIREBASE_FACEBOOK_SETUP.md)
- [Example Component](./src/examples/FirebaseFacebookLoginExample.jsx)
