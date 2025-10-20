# 🔥 Firebase Facebook Authentication - Quick Reference

## 📦 Files Created

### Core Files
1. ✅ **`src/firebase/config.js`** - Firebase initialization
2. ✅ **`src/utils/firebaseFacebookAuth.js`** - Firebase Facebook auth utilities
3. ✅ **`.env.example`** - Environment variables template

### Documentation
4. ✅ **`FIREBASE_FACEBOOK_SETUP.md`** - Complete setup guide
5. ✅ **`FIREBASE_MIGRATION_GUIDE.md`** - Migration instructions
6. ✅ **`FACEBOOK_VS_FIREBASE_COMPARISON.md`** - Feature comparison

### Examples & Scripts
7. ✅ **`src/examples/FirebaseFacebookLoginExample.jsx`** - Demo component
8. ✅ **`install-firebase.bat`** - Installation script

### Updated Files
9. ✅ **`src/utils/index.js`** - Added Firebase exports

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Firebase
```bash
npm install firebase
```
Or run: `install-firebase.bat`

### Step 2: Configure Environment
Copy `.env.example` to `.env` and fill in your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
# ... etc
```

### Step 3: Use in Your Code
```javascript
import { signInWithFacebook, signOutFromFacebook } from '@utils';

// Login
const userData = await signInWithFacebook();

// Logout
await signOutFromFacebook();
```

---

## 📝 API Reference

### Login Methods
```javascript
import { 
  signInWithFacebook,           // Main login function
  handleFirebaseFacebookLogin,  // Alias (compatible with old code)
  redirectUserBasedOnRole       // Auto redirect by role
} from '@utils';

// Simple login
const user = await signInWithFacebook();

// Login with redirect
const user = await handleFirebaseFacebookLogin();
redirectUserBasedOnRole(user.role);
```

### Logout Methods
```javascript
import { signOutFromFacebook } from '@utils';

// Logout (auto clears localStorage)
await signOutFromFacebook();
```

### Auth State
```javascript
import { 
  onAuthStateChange,
  getCurrentUser,
  isLoggedInWithFacebook 
} from '@utils';

// Real-time listener
const unsubscribe = onAuthStateChange((user) => {
  console.log('Auth changed:', user);
});

// Get current user (sync)
const user = getCurrentUser();

// Check if logged in
const isLoggedIn = isLoggedInWithFacebook();
```

### Error Handling
```javascript
import { handleFirebaseFacebookError } from '@utils';

try {
  await signInWithFacebook();
} catch (error) {
  handleFirebaseFacebookError(error); // Shows Vietnamese error message
}
```

### Advanced Features
```javascript
import { 
  reauthenticateWithFacebook,
  linkFacebookAccount,
  unlinkFacebookAccount 
} from '@utils';

// Re-authenticate (for sensitive operations)
await reauthenticateWithFacebook();

// Link Facebook to existing account
await linkFacebookAccount();

// Unlink Facebook account
await unlinkFacebookAccount();
```

---

## 🎯 User Data Structure

```javascript
{
  uid: "firebase-uid-123",
  id: "firebase-uid-123",
  name: "John Doe",
  email: "john@example.com",
  picture: "https://graph.facebook.com/picture",
  provider: "facebook",
  accessToken: "fb-access-token",
  role: "customer", // or "dealer" or "evm_admin"
  emailVerified: true,
  metadata: {
    creationTime: "2024-01-01T00:00:00Z",
    lastSignInTime: "2024-01-15T12:00:00Z"
  }
}
```

---

## 🔄 Migration Path

### Old Code (Facebook SDK)
```javascript
import { handleFacebookLoginSuccess } from './utils/facebookAuth';

await handleFacebookLoginSuccess();
```

### New Code (Firebase) - Option 1: Direct
```javascript
import { signInWithFacebook } from './utils/firebaseFacebookAuth';

await signInWithFacebook();
```

### New Code (Firebase) - Option 2: Alias (Zero changes!)
```javascript
import { handleFirebaseFacebookLogin } from '@utils';

await handleFirebaseFacebookLogin();
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **FIREBASE_FACEBOOK_SETUP.md** | Step-by-step Firebase setup |
| **FIREBASE_MIGRATION_GUIDE.md** | Code migration examples |
| **FACEBOOK_VS_FIREBASE_COMPARISON.md** | Feature comparison |
| **This file** | Quick reference |

---

## ✅ Checklist

### Setup Phase
- [ ] Run `npm install firebase`
- [ ] Create Firebase project
- [ ] Enable Facebook authentication in Firebase
- [ ] Configure Facebook App OAuth
- [ ] Create `.env` file with credentials
- [ ] Test Firebase connection

### Migration Phase
- [ ] Update imports in components
- [ ] Replace login function calls
- [ ] Replace logout function calls
- [ ] Update auth state listeners
- [ ] Test login flow
- [ ] Test logout flow
- [ ] Test role detection

### Cleanup Phase
- [ ] Remove Facebook SDK script from `index.html`
- [ ] Remove old Facebook SDK imports
- [ ] Update documentation
- [ ] Deploy and test in production

---

## 🎨 Component Example

```jsx
import React, { useState, useEffect } from 'react';
import { 
  signInWithFacebook, 
  signOutFromFacebook,
  onAuthStateChange 
} from '@utils';

function LoginComponent() {
  const [user, setUser] = useState(null);

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithFacebook();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutFromFacebook();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login with Facebook</button>
      )}
    </div>
  );
}
```

---

## 🐛 Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `Module not found: firebase` | Run `npm install firebase` |
| `Firebase not initialized` | Check `.env` file |
| `Popup blocked` | Allow popups in browser |
| `Unauthorized domain` | Add domain to Firebase Console |
| `Account exists with different credential` | User signed up with different provider |

---

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Facebook Developers](https://developers.facebook.com/)
- [Firebase Docs](https://firebase.google.com/docs/auth/web/facebook-login)
- [Example Component](./src/examples/FirebaseFacebookLoginExample.jsx)

---

## 💡 Pro Tips

1. **Use auth state listener** instead of manual checks
2. **Let Firebase handle token refresh** automatically
3. **Use error codes** for better error handling
4. **Enable email enumeration protection** in Firebase
5. **Add authorized domains** before deploying
6. **Use re-authentication** for sensitive operations
7. **Consider account linking** for better UX

---

## 📞 Need Help?

1. Check **FIREBASE_FACEBOOK_SETUP.md** for setup
2. Check **FIREBASE_MIGRATION_GUIDE.md** for code examples
3. Check **FACEBOOK_VS_FIREBASE_COMPARISON.md** for features
4. Run demo: Import `FirebaseFacebookLoginExample.jsx`

---

**✨ Happy coding with Firebase! 🔥**
