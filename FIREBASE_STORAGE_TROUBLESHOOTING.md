# Firebase Storage Troubleshooting Guide

This guide addresses common issues with Firebase Storage in the FloodGuard+ app, particularly for image uploads in flood reports.

## Common Issues and Solutions

### 1. "Firebase Storage: An unknown error occurred" Error

This generic error can have several causes:

#### Check Firebase Storage Rules

Make sure your Firebase Storage rules allow authenticated users to upload files:

```
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read and write to flood report images
    match /flood_reports/{filename} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

To update your rules:
1. Go to Firebase Console > Storage > Rules
2. Paste the rules above
3. Click "Publish"

#### Check Network Connection

- Ensure you have a stable internet connection
- Try uploading smaller images (under 5MB)
- Check if you're behind a firewall or VPN that might block Firebase Storage

#### Check Firebase Storage Quota

- Verify you haven't exceeded your Firebase Storage quota in the Firebase Console

### 2. ImagePicker MediaType Issues

If you see this warning:
```
WARN [expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated. Use `ImagePicker.MediaType` or an array of `ImagePicker.MediaType` instead.
```

This is just a deprecation warning and shouldn't affect functionality. However, if you're getting errors like:

```
ERROR Error picking image: [TypeError: Cannot read property 'IMAGE' of undefined]
```

Try these solutions:

1. Make sure you're using the correct import:
   ```javascript
   import * as ImagePicker from 'expo-image-picker';
   ```

2. Use the correct MediaTypeOptions:
   ```javascript
   const result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.Images,
     allowsEditing: true,
     aspect: [4, 3],
     quality: 0.7,
   });
   ```

3. Check your expo-image-picker version:
   ```bash
   npm list expo-image-picker
   ```
   
   If it's outdated, update it:
   ```bash
   npm install expo-image-picker@latest
   ```

### 3. Firebase Auth Initialization Issues

If you see this error:
```
FirebaseError: Firebase: Error (auth/already-initialized)
```

This means Firebase Auth is being initialized multiple times. To fix:

1. Make sure you're only initializing Firebase Auth once in your app
2. Use `getAuth()` instead of `initializeAuth()` after the first initialization

### 4. Debugging Firebase Storage Uploads

To debug Firebase Storage uploads, add detailed logging:

```javascript
try {
  console.log('Starting upload...');
  const storageRef = ref(storage, `flood_reports/${filename}`);
  console.log('Storage reference created');
  
  const metadata = { contentType: 'image/jpeg' };
  console.log('Uploading with metadata:', metadata);
  
  const uploadResult = await uploadBytes(storageRef, blob, metadata);
  console.log('Upload successful:', uploadResult);
  
  const downloadURL = await getDownloadURL(storageRef);
  console.log('Download URL:', downloadURL);
  
  return downloadURL;
} catch (error) {
  console.error('Upload error:', error);
  console.error('Error details:', JSON.stringify(error));
  throw error;
}
```

### 5. Firebase Storage Permissions

Make sure your app has the necessary permissions:

1. In `app.json`, add:
   ```json
   "android": {
     "permissions": [
       "CAMERA",
       "READ_EXTERNAL_STORAGE",
       "WRITE_EXTERNAL_STORAGE"
     ]
   },
   "ios": {
     "infoPlist": {
       "NSPhotoLibraryUsageDescription": "This app needs access to your photos to upload flood report images."
     }
   }
   ```

2. Request permissions in your code:
   ```javascript
   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
   if (status !== 'granted') {
     Alert.alert('Permission needed', 'Please grant permission to access your photos');
     return;
   }
   ```

## Advanced Troubleshooting

If you're still experiencing issues:

1. **Check Firebase Storage Logs**
   - Go to Firebase Console > Storage > Logs
   - Look for errors related to your uploads

2. **Test with a Simple Upload**
   - Create a minimal test app that only uploads a small image
   - If this works, the issue might be in your main app's code

3. **Check Firebase SDK Versions**
   - Make sure all Firebase packages are compatible versions
   - Update to the latest versions if possible

4. **Try Alternative Upload Method**
   - If `uploadBytes` is failing, try `uploadString` with base64 data

5. **Contact Firebase Support**
   - If all else fails, contact Firebase support with detailed logs
