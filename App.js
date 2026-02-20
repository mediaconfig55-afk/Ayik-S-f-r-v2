import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import * as ExpoSplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import PermissionScreen from './src/screens/PermissionScreen';
import HomeScreen from './src/screens/HomeScreen';
import { COLORS } from './src/constants/theme';

// Native splash'ı uygulama hazır olana kadar tut
ExpoSplashScreen.preventAutoHideAsync();

const SCREENS = {
  LOADING: 'loading',
  SPLASH: 'splash',
  ONBOARDING: 'onboarding',
  PERMISSIONS: 'permissions',
  HOME: 'home',
};

const STORAGE_KEY = '@ayik_sofor_onboarded';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.LOADING);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      setCurrentScreen(SCREENS.SPLASH);
    } catch (e) {
      setCurrentScreen(SCREENS.SPLASH);
    } finally {
      // Native splash'ı gizle, custom splash gösterilmeye başlasın
      await ExpoSplashScreen.hideAsync();
    }
  };

  const handleSplashFinish = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value === 'true') {
        setCurrentScreen(SCREENS.HOME);
      } else {
        setCurrentScreen(SCREENS.ONBOARDING);
      }
    } catch (e) {
      setCurrentScreen(SCREENS.ONBOARDING);
    }
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    // Smooth transition
    setCurrentScreen(SCREENS.PERMISSIONS);
  }, []);

  const handlePermissionsComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      console.log('AsyncStorage error:', e);
    }
    setCurrentScreen(SCREENS.HOME);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.LOADING:
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.yellow} />
          </View>
        );
      case SCREENS.SPLASH:
        return <SplashScreen onFinish={handleSplashFinish} />;
      case SCREENS.ONBOARDING:
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case SCREENS.PERMISSIONS:
        return <PermissionScreen onComplete={handlePermissionsComplete} />;
      case SCREENS.HOME:
        return <HomeScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" translucent={false} />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
