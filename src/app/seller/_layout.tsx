import { Stack } from 'expo-router';

export default function SellerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="my" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="profile-edit" />
      <Stack.Screen name="reservation-history" />
      <Stack.Screen name="products" />
      <Stack.Screen name="product-register" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="reservations" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
