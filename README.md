# FloodGuard+ App

A comprehensive flood monitoring and alert system, designed to keep you and your community safe.

## Firebase Setup

This app uses Firebase for authentication and storage. Follow these steps to set up Firebase for your project:

1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup steps
   - Enable Google Analytics if desired

2. **Register your app with Firebase**:
   - In the Firebase console, click on the project you just created
   - Click "Add app" and select the web platform (</>)
   - Register the app with a nickname (e.g., "FloodGuard+ Web")
   - Copy the Firebase configuration object

3. **Update Firebase Configuration**:
   - Open `config/firebase.js` in the project
   - Replace the placeholder values in the `firebaseConfig` object with your actual Firebase configuration:

   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```

4. **Enable Email/Password Authentication**:
   - In the Firebase console, go to "Authentication" > "Sign-in method"
   - Enable "Email/Password" provider
   - Save the changes

5. **Set up Firebase Storage**:
   - In the Firebase console, go to "Storage"
   - Click "Get Started" and follow the setup steps
   - Set up security rules to allow authenticated users to upload files
   - Copy and paste the rules from `firebase-storage-rules.txt` into the Firebase Storage Rules section

6. **Test the Features**:
   - Run the app and test the registration, login, and password reset functionality
   - Test uploading a profile picture in the profile screen

## Running the App

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Features

- User authentication (login, registration, password reset)
- Personalized greeting in the dashboard
- Profile picture upload with Firebase Storage
- Error and success messages for authentication actions
- Dark/light mode toggle
- Multiple language support
- Notification preferences
- Flood monitoring and alerts
- Evacuation guidance
- AI-powered flood reports
- User profile management

## Technologies Used

- React Native / Expo
- Firebase Authentication
- Firebase Storage for profile pictures
- Expo Router for navigation
- Expo Image Picker for selecting images
- React Context API for state management
- Linear Gradient for UI effects
- Lucide React Native for icons
# floodguard-frontend
