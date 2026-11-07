import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/colors';

const TAB_BAR_CONTENT_HEIGHT = 48;

export default function BuyerTabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSubtle,
        tabBarIconStyle: {
          height: 0,
          width: 0,
          margin: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          lineHeight: 16,
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarStyle: {
          height: TAB_BAR_CONTENT_HEIGHT + bottomInset,
          paddingTop: 4,
          paddingBottom: bottomInset,
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarIcon: () => <View />,
        }}
      />

      <Tabs.Screen
        name="likes"
        options={{
          title: '좋아요',
          tabBarIcon: () => <View />,
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title: '대화',
          tabBarIcon: () => <View />,
        }}
      />

      <Tabs.Screen
        name="my"
        options={{
          title: '마이',
          tabBarIcon: () => <View />,
        }}
      />
    </Tabs>
  );
}
