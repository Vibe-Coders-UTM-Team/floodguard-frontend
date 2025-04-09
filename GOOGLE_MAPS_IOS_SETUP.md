# Setting Up Google Maps for iOS in React Native

This guide provides step-by-step instructions for setting up Google Maps in your iOS app using react-native-maps.

## Prerequisites

- Xcode installed
- CocoaPods installed
- A Google Cloud Platform account
- Your React Native project with react-native-maps installed

## Step 1: Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google Maps SDK for iOS" API
4. Create an API key with restrictions for iOS applications
   - Go to Credentials > Create Credentials > API Key
   - Restrict the API key to iOS applications
   - Add your app's bundle identifier
5. Note down your API key

## Step 2: Install Dependencies

```bash
# Install react-native-maps if you haven't already
npm install react-native-maps

# Install pod dependencies
cd ios && pod install && cd ..
```

## Step 3: Configure Your iOS Project

### Update AppDelegate.mm

1. Open `ios/YourAppName/AppDelegate.mm` in Xcode or your code editor
2. Add the Google Maps import at the top:

```objective-c
#import <GoogleMaps/GoogleMaps.h>
```

3. Initialize Google Maps in the `didFinishLaunchingWithOptions` method:

```objective-c
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"YOUR_API_KEY"]; // Add this line before the RCTBridge initialization
  
  // Rest of your existing code...
}
```

### Update Info.plist

Open `ios/YourAppName/Info.plist` and add:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs access to your location to show it on the map.</string>
```

## Step 4: Configure Podfile

1. Open `ios/Podfile` in your code editor
2. Add the following at the top of your Podfile:

```ruby
source 'https://github.com/CocoaPods/Specs.git'
```

3. Inside your target block, add:

```ruby
target 'YourAppName' do
  # ...existing config...
  
  # Add these lines
  rn_maps_path = '../node_modules/react-native-maps'
  pod 'react-native-google-maps', :path => rn_maps_path
  pod 'GoogleMaps'
  pod 'Google-Maps-iOS-Utils'
end
```

## Step 5: Install Pods

```bash
cd ios
pod install
cd ..
```

## Step 6: Clean and Rebuild

```bash
# Clean the build
cd ios
xcodebuild clean -workspace YourAppName.xcworkspace -scheme YourAppName
cd ..

# Rebuild
npx react-native run-ios
```

## Troubleshooting

### Common Issues

1. **"AirGoogleMaps dir must be added to your xCode project"**:
   - This means the Google Maps SDK wasn't properly linked
   - Make sure you've added the correct pods in your Podfile
   - Run `pod install` again

2. **API Key Issues**:
   - Ensure your API key is correctly set up in the Google Cloud Console
   - Make sure you've enabled the Google Maps SDK for iOS
   - Check that you've added the API key to your AppDelegate.mm file

3. **Pod Installation Issues**:
   - Try cleaning your project: `cd ios && pod deintegrate && pod install && cd ..`
   - Make sure you're using the latest version of CocoaPods

4. **Xcode Build Errors**:
   - Clean your build folder in Xcode: Product > Clean Build Folder
   - Make sure your Deployment Target is set to iOS 12.0 or higher

## Alternative: Using Apple Maps

If you're having trouble setting up Google Maps, you can use Apple Maps instead by setting the provider to `null`:

```jsx
<MapView
  provider={null} // Use Apple Maps
  style={{ flex: 1 }}
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
/>
```

## Additional Resources

- [react-native-maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Google Maps SDK for iOS Documentation](https://developers.google.com/maps/documentation/ios-sdk/overview)
- [Google Cloud Console](https://console.cloud.google.com/)
