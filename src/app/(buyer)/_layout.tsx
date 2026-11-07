import { Stack } from 'expo-router';
import { FavoritesProvider } from '../../features/favorites/FavoritesContext';

export default function BuyerLayout() {
  return (
    <FavoritesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="seller/[sellerId]" />
        <Stack.Screen name="booking/[sellerId]/product-select" />
        <Stack.Screen name="booking/[sellerId]/calendar" />
        <Stack.Screen name="booking/[sellerId]/confirm" />
        <Stack.Screen name="booking/[sellerId]/payment" />
        <Stack.Screen name="booking/[sellerId]/complete" />
        <Stack.Screen name="reservations/index" />
        <Stack.Screen name="reservation/[bookingId]" />
        <Stack.Screen name="chat/[bookingId]" />
        <Stack.Screen name="review/[bookingId]" />
        <Stack.Screen name="reviews/index" />
        <Stack.Screen name="notifications/index" />
        <Stack.Screen name="notifications/[notificationId]" />
      </Stack>
    </FavoritesProvider>
  );
}
