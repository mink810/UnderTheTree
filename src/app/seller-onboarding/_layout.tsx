import { Stack } from 'expo-router';

export default function SellerOnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="application" />
      <Stack.Screen name="additional-verification" />
      <Stack.Screen name="status" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
