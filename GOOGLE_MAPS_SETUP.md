# Setting Up Google Maps for iOS in React Native

This guide provides instructions for setting up Google Maps in your iOS app using react-native-maps.

## Error Message

If you're seeing this error:
```
ERROR react-native-maps: AirGoogleMaps dir must be added to your xCode project to support GoogleMaps on iOS.
```

It means that the native Google Maps SDK for iOS has not been properly set up in your Xcode project.

## Setup Instructions

### 1. Install Dependencies

First, make sure you have the required dependencies:

```bash
# Install react-native-maps
npm install react-native-maps

# Install pod dependencies
cd ios && pod install && cd ..
```

### 2. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Maps SDK for iOS
4. Create an API key with restrictions for iOS applications
5. Note down your API key

### 3. Configure Your iOS Project

#### Update AppDelegate.m

Open `ios/YourAppName/AppDelegate.m` and add the following:

```objective-c
#import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"YOUR_API_KEY"]; // Add this line before the RCTBridge initialization
  
  // Rest of your existing code...
}
@end
```

#### Update Info.plist

Open `ios/YourAppName/Info.plist` and add:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs access to your location to show it on the map.</string>
```

### 4. Configure Podfile

Open `ios/Podfile` and add:

```ruby
# At the top of your Podfile
source 'https://github.com/CocoaPods/Specs.git'

# Inside your target block
target 'YourAppName' do
  # ...existing config...
  
  # Add these lines
  rn_maps_path = '../node_modules/react-native-maps'
  pod 'react-native-google-maps', :path => rn_maps_path
  pod 'GoogleMaps'
  pod 'Google-Maps-iOS-Utils'
end
```

### 5. Install Pods

```bash
cd ios
pod install
cd ..
```

### 6. Update Your Map Component

In your React Native code, make sure to specify the Google Maps provider:

```jsx
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// In your component
<MapView
  provider={PROVIDER_GOOGLE}
  style={{ flex: 1 }}
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
/>
```

## Troubleshooting

### Common Issues

1. **Missing AirGoogleMaps directory**:
   - This is the most common issue and is caused by not properly setting up the Google Maps SDK in your Xcode project.
   - Make sure you've followed all the steps above, especially the Podfile configuration.

2. **API Key Issues**:
   - Ensure your API key is correctly set up in the Google Cloud Console.
   - Make sure you've enabled the Google Maps SDK for iOS.
   - Check that you've added the API key to your AppDelegate.m file.

3. **Pod Installation Issues**:
   - Try cleaning your project: `cd ios && pod deintegrate && pod install && cd ..`
   - Make sure you're using the latest version of CocoaPods.

4. **Xcode Build Errors**:
   - Clean your build folder in Xcode: Product > Clean Build Folder
   - Make sure your Deployment Target is set to iOS 12.0 or higher.

### For Development Testing

If you're just testing your app during development and don't want to set up Google Maps yet, you can use the default Apple Maps provider:

```jsx
<MapView
  // Remove the provider prop or set it to null
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
