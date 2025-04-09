import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgAKOQRMO4xuDyD7vYn92OdRS25WbuMyE",
  authDomain: "floodguard-plus.firebaseapp.com",
  databaseURL: "https://floodguard-plus-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "floodguard-plus",
  storageBucket: "floodguard-plus.firebasestorage.app",
  messagingSenderId: "15594891846",
  appId: "1:15594891846:android:16d60bf57c85a428207847"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Storage
const storage = getStorage(app);

export { auth, storage };
