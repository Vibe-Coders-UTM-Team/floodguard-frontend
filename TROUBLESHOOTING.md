# Troubleshooting Guide

This document provides solutions for common issues you might encounter when running the FloodGuard+ app.

## Firebase Authentication Issues

### Auth Persistence Warning

If you see this warning:
```
WARN @firebase/auth: Auth (11.6.0): You are initializing Firebase Auth for React Native without providing AsyncStorage.
```

**Solution:**
1. Make sure you have installed AsyncStorage:
   ```bash
   npm install @react-native-async-storage/async-storage
   ```

2. Verify that Firebase Auth is initialized with AsyncStorage persistence in `config/firebase.js`:
   ```javascript
   import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   const auth = initializeAuth(app, {
     persistence: getReactNativePersistence(AsyncStorage)
   });
   ```

### Authentication Failed

If login or registration fails:

1. Check that your Firebase project has Email/Password authentication enabled
2. Verify your Firebase configuration in `config/firebase.js`
3. Check the console for specific error messages

## Firebase Storage Issues

### Storage Upload Error

If you see this error:
```
ERROR Error uploading image: [FirebaseError: Firebase Storage: An unknown error occurred, please check the error payload for server response. (storage/unknown)]
```

**Solutions:**

1. **Check Firebase Storage Rules**
   - Go to Firebase Console > Storage > Rules
   - Make sure your rules allow authenticated users to upload files
   - Use the rules provided in `firebase-storage-rules.txt`

2. **Check File Format and Size**
   - Make sure the image is in a supported format (JPEG, PNG)
   - Reduce the image size if it's too large

3. **Check Firebase Storage Quota**
   - Verify you haven't exceeded your Firebase Storage quota

4. **Check Network Connection**
   - Ensure you have a stable internet connection

5. **Check Firebase Storage Initialization**
   - Verify that Firebase Storage is properly initialized in `config/firebase.js`

## Expo Image Picker Issues

### Deprecated MediaTypeOptions Warning

If you see this warning:
```
WARN [expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated. Use `ImagePicker.MediaType` or an array of `ImagePicker.MediaType` instead.
```

**Solution:**
Update your ImagePicker implementation to use the new API:

```javascript
// Old (deprecated)
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  // other options...
});

// New (recommended)
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: [ImagePicker.MediaType.IMAGE],
  // other options...
});
```

### Permission Issues

If the image picker fails to open:

1. Make sure you're requesting permissions correctly:
   ```javascript
   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
   if (status !== 'granted') {
     Alert.alert('Permission needed', 'Please grant permission to access your photos');
     return;
   }
   ```

2. On iOS, verify that you have the proper entries in your `app.json`:
   ```json
   "ios": {
     "infoPlist": {
       "NSPhotoLibraryUsageDescription": "This app needs access to your photos to allow you to select a profile picture."
     }
   }
   ```

## General Troubleshooting Steps

1. **Clear Cache and Restart**
   ```bash
   expo start --clear
   ```

2. **Update Dependencies**
   ```bash
   npm update
   ```

3. **Check Logs**
   - Look for specific error messages in the console
   - Use `console.log()` to debug specific functions

4. **Verify Firebase Configuration**
   - Double-check your Firebase configuration in `config/firebase.js`
   - Make sure your Firebase project is properly set up

5. **Check Network Connection**
   - Ensure you have a stable internet connection
   - Firebase services require internet access
