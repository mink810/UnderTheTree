import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import NotificationCategoryFilterBar from '@/features/notifications/components/NotificationCategoryFilter';
import NotificationListItem from '@/features/notifications/components/NotificationListItem';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { NotificationCategoryFilter } from '@/features/notifications/types/notification.types';
import {
  filterNotificationsByCategory,
  groupNotificationsByDate,
} from '@/features/notifications/utils/notificationUtils';
import { COLORS } from '@/constants/colors';

export default function NotificationsScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<NotificationCategoryFilter>('ALL');
  const { notifications, unreadCount, loading, refresh, markAllRead } =
    useNotifications();

  const filtered = useMemo(
    () => filterNotificationsByCategory(notifications, category),
    [notifications, category]
  );

  const sections = useMemo(
    () =>
      groupNotificationsByDate(filtered).map((group) => ({
        title: group.label,
        data: group.data,
      })),
    [filtered]
  );

  const isEmpty = !loading && filtered.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.side}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={styles.headerTitle}>알림</Text>
          {unreadCount > 0 ? (
            <Text style={styles.unreadBadge}>읽지 않음 {unreadCount}</Text>
          ) : null}
        </View>
        <Pressable
          style={styles.side}
          onPress={markAllRead}
          disabled={unreadCount === 0}
        >
          <Text
            style={[
              styles.readAll,
              unreadCount === 0 && styles.readAllDisabled,
            ]}
          >
            모두 읽음
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : isEmpty ? (
        <View style={styles.empty}>
          <View style={styles.bellWrap}>
            <Text style={styles.bell}>🔔</Text>
          </View>
          <Text style={styles.emptyTitle}>새로운 알림이 없어요.</Text>
          <Text style={styles.emptyText}>
            중요한 소식이 있으면 여기에서 알려드릴게요.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.list}
          onRefresh={refresh}
          refreshing={loading}
          ListHeaderComponent={
            <NotificationCategoryFilterBar
              selected={category}
              onChange={setCategory}
            />
          }
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <NotificationListItem
              item={item}
              onPress={() =>
                router.push({
                  pathname: '/notifications/[notificationId]',
                  params: { notificationId: item.id },
                })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  side: {
    width: 72,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.text,
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  unreadBadge: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  readAll: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  readAllDisabled: {
    color: COLORS.textPlaceholder,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  bellWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bell: {
    fontSize: 44,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
