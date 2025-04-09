# Setting Up Google Maps in Expo with Development Build

This guide explains how to set up Google Maps in your Expo project using a development build.

## Prerequisites

- Expo project
- Google Maps API key
- Expo CLI installed

## Step 1: Update Your Configuration

We've already updated your app.json file with the necessary configuration. Make sure to replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual Google Maps API key in both the iOS and Android sections.

## Step 2: Create a Development Build

Since you're using Expo, you need to create a development build to use native modules like Google Maps:

```bash
# Install EAS CLI if you haven't already
npm install -g eas-cli

# Log in to your Expo account
eas login

# Configure EAS Build
eas build:configure

# Create a development build for iOS
eas build --profile development --platform ios

# Create a development build for Android
eas build --profile development --platform android
```

## Step 3: Install the Development Build

Once the build is complete, you'll receive a link to download the app:

- For iOS: Download and install using QR code or link
- For Android: Download the APK and install it on your device

## Step 4: Update Your Map Component

We've already updated your map component to work with both Apple Maps and Google Maps. The code will automatically use Google Maps when available.

## Step 5: Run Your Development Build

Instead of using `expo start`, you'll need to use:

```bash
npx expo start --dev-client
```

This will start the development server and allow you to connect your development build.

## Troubleshooting

### Common Issues

1. **"AirGoogleMaps dir must be added to your xCode project"**:
   - This error appears when using the Expo Go app, which doesn't support Google Maps
   - You need to use a development build as described above

2. **API Key Issues**:
   - Make sure your API key is correctly set up in the Google Cloud Console
   - Enable the necessary APIs: Google Maps SDK for iOS, Google Maps SDK for Android
   - Check that you've added the API key to your app.json file

3. **Build Errors**:
   - Make sure you have the latest version of Expo CLI and EAS CLI
   - Check the build logs for specific errors

## Alternative: Using Apple Maps

If you're having trouble setting up Google Maps, you can continue using Apple Maps as we've configured in your app. This works without any additional setup in the Expo Go app.

## Additional Resources

- [Expo Development Builds Documentation](https://docs.expo.dev/development/create-development-builds/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Google Maps in Expo](https://docs.expo.dev/versions/latest/sdk/map-view/)
- [Google Cloud Console](https://console.cloud.google.com/)
