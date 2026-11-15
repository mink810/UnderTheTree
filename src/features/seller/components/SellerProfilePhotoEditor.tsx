import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { COLORS } from '@/constants/colors';

import {
  PROFILE_MAX_IMAGE_BYTES,
  PROFILE_MAX_PHOTOS,
} from '../constants/profileEdit';

type Props = {
  photos: string[];
  mainPhotoUri: string | null;
  onChange: (photos: string[], mainPhotoUri: string | null) => void;
  error?: string;
};

export default function SellerProfilePhotoEditor({
  photos,
  mainPhotoUri,
  onChange,
  error,
}: Props) {
  const addPhotos = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '사진을 추가하려면 갤러리 접근 권한이 필요해요.');
      return;
    }

    const remaining = PROFILE_MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      Alert.alert('안내', `사진은 최대 ${PROFILE_MAX_PHOTOS}장까지 등록할 수 있어요.`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: remaining > 1,
      selectionLimit: remaining,
      quality: 0.85,
    });

    if (result.canceled) {
      return;
    }

    const oversized = result.assets.filter(
      (a) => a.fileSize != null && a.fileSize > PROFILE_MAX_IMAGE_BYTES
    );
    if (oversized.length > 0) {
      Alert.alert('용량 초과', '5MB 이하의 사진만 등록할 수 있어요.');
      return;
    }

    const picked = result.assets.map((a) => a.uri);
    const nextPhotos = [...photos, ...picked].slice(0, PROFILE_MAX_PHOTOS);
  let nextMain = mainPhotoUri;
    if (!nextMain && nextPhotos.length > 0) {
      nextMain = nextPhotos[0];
    }
    onChange(nextPhotos, nextMain);
  };

  const setMain = (uri: string) => {
    onChange(photos, uri);
  };

  const removePhoto = (uri: string) => {
    Alert.alert('사진 삭제', '이 사진을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          const nextPhotos = photos.filter((p) => p !== uri);
          let nextMain = mainPhotoUri;
          if (mainPhotoUri === uri) {
            nextMain = nextPhotos[0] ?? null;
          }
          onChange(nextPhotos, nextMain);
        },
      },
    ]);
  };

  const reorderPhoto = (uri: string, direction: 'left' | 'right') => {
    const index = photos.indexOf(uri);
    if (index < 0) {
      return;
    }
    const target = direction === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= photos.length) {
      return;
    }
    const next = [...photos];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next, mainPhotoUri);
  };

  const openPhotoActions = (uri: string) => {
    const index = photos.indexOf(uri);
    const actions: {
      text: string;
      onPress?: () => void;
      style?: 'cancel' | 'destructive';
    }[] = [
      { text: '메인 사진으로 지정', onPress: () => setMain(uri) },
    ];
    if (index > 0) {
      actions.push({ text: '앞으로 이동', onPress: () => reorderPhoto(uri, 'left') });
    }
    if (index < photos.length - 1) {
      actions.push({ text: '뒤로 이동', onPress: () => reorderPhoto(uri, 'right') });
    }
    actions.push({
      text: '삭제',
      style: 'destructive',
      onPress: () => removePhoto(uri),
    });
    actions.push({ text: '닫기', style: 'cancel' });
    Alert.alert('프로필 사진', undefined, actions);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>프로필 사진</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {photos.map((uri) => {
          const isMain = mainPhotoUri === uri;
          return (
            <Pressable
              key={uri}
              style={styles.photoCard}
              onPress={() => openPhotoActions(uri)}
              onLongPress={() => setMain(uri)}
            >
              <Image source={{ uri }} style={styles.photo} />
              {isMain ? (
                <View style={styles.mainBadge}>
                  <Text style={styles.mainBadgeText}>메인 사진</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}

        {photos.length < PROFILE_MAX_PHOTOS ? (
          <Pressable style={styles.addCard} onPress={addPhotos}>
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addLabel}>사진 추가</Text>
          </Pressable>
        ) : null}
      </ScrollView>
      <Text style={styles.hint}>
        사진을 여러 장 등록할 수 있으며, 메인 사진을 선택할 수 있습니다.
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const PHOTO_W = 112;
const PHOTO_H = 140;

const styles = StyleSheet.create({
  wrap: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 14,
  },
  row: { gap: 12, paddingRight: 20 },
  photoCard: {
    width: PHOTO_W,
    height: PHOTO_H,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceMuted,
  },
  photo: { width: '100%', height: '100%' },
  mainBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: 'rgba(70, 149, 107, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mainBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  addCard: {
    width: PHOTO_W,
    height: PHOTO_H,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  addIcon: { fontSize: 26, color: COLORS.textMuted, marginBottom: 6 },
  addLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  hint: {
    marginTop: 12,
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  error: { marginTop: 8, fontSize: 12, color: COLORS.primary, fontWeight: '600' },
});
