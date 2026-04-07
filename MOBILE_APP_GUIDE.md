# Talkit Mobile App - React Native Implementation Guide

## Overview
This guide outlines the structure for building the Talkit mobile application using React Native with TypeScript.

## Tech Stack
- **React Native** (with TypeScript)
- **React Navigation** - Navigation
- **Axios** - API calls
- **AsyncStorage** - Local storage
- **React Native Maps** - Location & mapping
- **React Native Image Picker** - Photo upload
- **React Native Geolocation** - GPS tracking
- **React Native Push Notifications** - Real-time alerts
- **Context API** - State management

## Project Structure

```
mobile/
├── src/
│   ├── components/
│   │   ├── PostCard.tsx
│   │   ├── ReportCard.tsx
│   │   ├── CommentItem.tsx
│   │   ├── NotificationItem.tsx
│   │   └── MapPicker.tsx
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   ├── feed/
│   │   │   ├── FeedScreen.tsx
│   │   │   ├── TrendingScreen.tsx
│   │   │   └── PostDetailScreen.tsx
│   │   ├── reports/
│   │   │   ├── CreateReportScreen.tsx
│   │   │   ├── ReportsListScreen.tsx
│   │   │   └── ReportDetailScreen.tsx
│   │   ├── authority/
│   │   │   ├── DashboardScreen.tsx
│   │   │   └── AnalyticsScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── notifications/
│   │       └── NotificationsScreen.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── location.ts
│   │   ├── notifications.ts
│   │   └── storage.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── constants.ts
│       └── helpers.ts
├── android/
├── ios/
├── App.tsx
├── package.json
└── tsconfig.json
```

## Key Features Implementation

### 1. Authentication Flow

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    await AsyncStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Location & Map Integration

```typescript
// src/services/location.ts
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  });
};
```

### 3. Create Report Screen

```typescript
// src/screens/reports/CreateReportScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { getCurrentLocation } from '../../services/location';
import api from '../../services/api';

export default function CreateReportScreen({ navigation }) {
  const [formData, setFormData] = useState({
    category: 'infrastructure',
    title: '',
    description: '',
    media: [],
    location: { address: '', coordinates: { lat: 0, lng: 0 } },
    privacy: 'public'
  });

  const handleGetLocation = async () => {
    try {
      const coords = await getCurrentLocation();
      setFormData({ ...formData, location: { ...formData.location, coordinates: coords } });
    } catch (error) {
      alert('Failed to get location');
    }
  };

  const handleImagePicker = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets) {
      const images = result.assets.map(asset => asset.uri);
      setFormData({ ...formData, media: [...formData.media, ...images] });
    }
  };

  const handleSubmit = async () => {
    try {
      const { data } = await api.post('/reports', formData);
      alert(`Report created! ID: ${data.reportId}`);
      navigation.goBack();
    } catch (error) {
      alert('Failed to create report');
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Create Civic Report
      </Text>

      {/* Category Picker */}
      {/* Title Input */}
      {/* Description Input */}
      
      <Button title="Pick Photos" onPress={handleImagePicker} />
      
      <Button title="Get Current Location" onPress={handleGetLocation} />
      
      {formData.location.coordinates.lat !== 0 && (
        <MapView
          style={{ height: 200, marginVertical: 16 }}
          initialRegion={{
            latitude: formData.location.coordinates.lat,
            longitude: formData.location.coordinates.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
        >
          <Marker coordinate={formData.location.coordinates} />
        </MapView>
      )}

      <Button title="Submit Report" onPress={handleSubmit} />
    </ScrollView>
  );
}
```

### 4. Push Notifications

```typescript
// src/services/notifications.ts
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
};

export const getFCMToken = async () => {
  const token = await messaging().getToken();
  await AsyncStorage.setItem('fcm_token', token);
  return token;
};

export const setupNotificationListeners = () => {
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground notification:', remoteMessage);
    // Show in-app notification
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background notification:', remoteMessage);
  });
};
```

### 5. Navigation Structure

```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Trending" component={TrendingScreen} />
      <Tab.Screen name="Reports" component={ReportsListScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="CreateReport" component={CreateReportScreen} />
            <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
            <Stack.Screen name="AuthorityDashboard" component={DashboardScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Installation Commands

```bash
# Initialize React Native project
npx react-native init TalkitMobile --template react-native-template-typescript

# Install dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install axios @react-native-async-storage/async-storage
npm install react-native-maps
npm install react-native-image-picker
npm install @react-native-community/geolocation
npm install @react-native-firebase/app @react-native-firebase/messaging

# iOS specific
cd ios && pod install && cd ..

# Run
npm run android
npm run ios
```

## Key Differences from Web

1. **Navigation**: Use React Navigation instead of React Router
2. **Storage**: AsyncStorage instead of localStorage
3. **Styling**: StyleSheet API instead of CSS
4. **Images**: Image component with local/remote sources
5. **Maps**: React Native Maps for location features
6. **Permissions**: Request runtime permissions for camera, location
7. **Push Notifications**: Firebase Cloud Messaging
8. **Gestures**: TouchableOpacity, Pressable for interactions

## Platform-Specific Features

### Android
- Material Design components
- Hardware back button handling
- Android permissions system

### iOS
- iOS design guidelines
- Safe area handling
- iOS permissions system

## Performance Optimization

1. Use FlatList for long lists
2. Implement image caching
3. Lazy load screens
4. Optimize re-renders with React.memo
5. Use native driver for animations

## Testing

```bash
# Unit tests
npm test

# E2E tests with Detox
npm run e2e:ios
npm run e2e:android
```

## Deployment

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
```bash
cd ios
xcodebuild -workspace TalkitMobile.xcworkspace -scheme TalkitMobile -configuration Release
```

## Next Steps

1. Set up Firebase project for push notifications
2. Configure Google Maps API keys
3. Set up app signing for production
4. Submit to App Store and Google Play
5. Implement analytics (Firebase Analytics)
6. Add crash reporting (Crashlytics)
