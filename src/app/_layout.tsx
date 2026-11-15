import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync().catch(() => {});

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(() => {});
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="find-id" />
        <Stack.Screen name="find-password" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="force-update" />
        <Stack.Screen name="(buyer)" />
        <Stack.Screen name="seller" />
        <Stack.Screen name="seller-onboarding" />
      </Stack>
    </>
  );
}
