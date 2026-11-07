import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppNotification } from '../types/notification.types';
import {
  formatNotificationListTime,
  getNotificationIcon,
} from '../utils/notificationUtils';
import { COLORS } from '../../../constants/colors';

type Props = {
  item: AppNotification;
  onPress: () => void;
};

export default function NotificationListItem({ item, onPress }: Props) {
  const showAvatar =
    item.type === 'MESSAGE' && item.metadata?.sellerImageUrl;

  return (
    <Pressable
      style={[styles.row, !item.isRead && styles.rowUnread]}
      onPress={onPress}
    >
      {showAvatar ? (
        <Image
          source={{ uri: item.metadata!.sellerImageUrl! }}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{getNotificationIcon(item.type)}</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={[styles.title, !item.isRead && styles.titleUnread]}>
          {item.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
      </View>

      <View style={styles.trailing}>
        <Text style={styles.time}>
          {formatNotificationListTime(item.createdAt)}
        </Text>
        {!item.isRead ? <View style={styles.dot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  rowUnread: {
    backgroundColor: COLORS.primaryLighter,
    marginHorizontal: -4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceGray,
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  titleUnread: {
    fontWeight: '800',
  },
  message: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textMuted,
  },
  trailing: {
    alignItems: 'flex-end',
    minWidth: 52,
  },
  time: {
    fontSize: 11,
    color: COLORS.textPlaceholder,
    fontWeight: '600',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 8,
  },
});
