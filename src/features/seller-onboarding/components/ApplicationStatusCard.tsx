import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

export type ApplicationInfoItem = {
  id: string;
  icon: 'search' | 'bell' | 'clock';
  title: string;
  description: string;
};

function RowIcon({ icon }: { icon: ApplicationInfoItem['icon'] }) {
  const glyph =
    icon === 'search' ? '🔍' : icon === 'bell' ? '🔔' : '🕐';

  return (
    <View style={styles.iconWrap}>
      <Text style={styles.icon}>{glyph}</Text>
    </View>
  );
}

type Props = {
  items: ApplicationInfoItem[];
};

export default function ApplicationStatusCard({ items }: Props) {
  return (
    <View style={styles.card}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 ? <View style={styles.divider} /> : null}
          <View style={styles.row}>
            <RowIcon icon={item.icon} />
            <View style={styles.textBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    opacity: 0.6,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
  },
});
