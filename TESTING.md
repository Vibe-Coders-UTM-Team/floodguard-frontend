# Testing Firebase Authentication

This document outlines the steps to test the Firebase authentication implementation in the FloodGuard+ app.

## Prerequisites

1. Make sure you have set up Firebase correctly as described in the README.md file
2. Ensure you have installed all dependencies with `npm install`
3. Start the development server with `npm run dev`

## Test Cases

### 1. User Registration

**Steps:**
1. Open the app and navigate to the registration screen
2. Fill in the required fields:
   - Full Name
   - Email (use a valid email format)
   - Password (at least 6 characters)
3. Tap "Create Account"

**Expected Results:**
- The app should create a new user account in Firebase
- You should be redirected to the main tabs screen
- Check Firebase console to verify the new user was created

**Error Cases to Test:**
- Empty fields (should show validation error)
- Invalid email format (should show validation error)
- Password too short (should show validation error)
- Email already in use (should show Firebase error)

### 2. User Login

**Steps:**
1. Open the app and navigate to the login screen
2. Enter the email and password of a registered user
3. Tap "Sign In"

**Expected Results:**
- The app should authenticate the user
- You should be redirected to the main tabs screen

**Error Cases to Test:**
- Empty fields (should show validation error)
- Invalid credentials (should show Firebase error)
- User not found (should show Firebase error)

### 3. Password Reset

**Steps:**
1. Open the app and navigate to the login screen
2. Tap "Forgot Password?"
3. Enter the email of a registered user
4. Tap "Reset Password"

**Expected Results:**
- The app should send a password reset email
- A success message should be displayed

**Error Cases to Test:**
- Empty email field (should show validation error)
- Invalid email format (should show validation error)
- User not found (should show Firebase error)

### 4. Logout

**Steps:**
1. Login to the app
2. Navigate to the Profile tab
3. Scroll down and tap "Log Out"

**Expected Results:**
- The user should be logged out
- You should be redirected to the login screen

### 5. Authentication Persistence

**Steps:**
1. Login to the app
2. Close the app completely
3. Reopen the app

**Expected Results:**
- The user should still be logged in
- You should be taken directly to the main tabs screen

### 6. Protected Routes

**Steps:**
1. Logout of the app
2. Try to access a protected route directly (e.g., by manipulating the URL)

**Expected Results:**
- You should be redirected to the login screen

## Troubleshooting

If you encounter issues during testing:

1. Check the console logs for error messages
2. Verify your Firebase configuration in `config/firebase.js`
3. Ensure Firebase Authentication is properly enabled in the Firebase Console
4. Check that the email/password authentication provider is enabled in Firebase

## Next Steps

After confirming that basic authentication works, consider implementing:

1. Social authentication (Google, Apple, etc.)
2. Email verification
3. User profile management (update profile, change password)
4. More robust error handling
