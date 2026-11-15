import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';

import { sellerEditableProfileService } from '../services/sellerEditableProfileService';
import { SellerEditableProfile } from '../types/sellerEditableProfile.types';

/** SELL-009 내 프로필 조회 */
export default function SELL009Screen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<SellerEditableProfile | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await sellerEditableProfileService.getProfile();
      if (mounted) {
        setProfile(data);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>내 프로필</Text>
        <Pressable
          onPress={() => router.push('/seller/profile-edit')}
          style={styles.editBtn}
        >
          <Text style={styles.editText}>수정</Text>
        </Pressable>
      </View>

      {loading || !profile ? (
        <ActivityIndicator style={styles.loader} color={COLORS.primary} />
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          {profile.mainPhotoUri ? (
            <Image source={{ uri: profile.mainPhotoUri }} style={styles.hero} />
          ) : null}
          <Text style={styles.name}>
            {profile.name}, {profile.age}세
          </Text>
          <Text style={styles.meta}>{profile.region}</Text>
          {profile.mbti ? (
            <Text style={styles.meta}>MBTI {profile.mbti}</Text>
          ) : null}
          <Text style={styles.intro}>{profile.introduction}</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  back: { width: 44, padding: 8 },
  backText: { fontSize: 22, color: COLORS.text },
  title: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  editBtn: { padding: 8, paddingRight: 12 },
  editText: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  loader: { marginTop: 40 },
  body: { padding: 20, gap: 8 },
  hero: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: COLORS.surfaceMuted,
  },
  name: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  meta: { fontSize: 14, color: COLORS.textMuted },
  intro: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
  },
});
