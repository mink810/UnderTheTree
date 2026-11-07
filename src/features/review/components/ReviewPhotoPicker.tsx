import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { REVIEW_MAX_IMAGES } from '../constants/reviewTags';
import { COLORS } from '../../../constants/colors';

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
};

export default function ReviewPhotoPicker({
  images,
  onChange,
  disabled = false,
}: Props) {
  const pickImages = async () => {
    if (disabled) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('권한 필요', '사진을 첨부하려면 갤러리 접근 권한이 필요해요.');
      return;
    }

    const remaining = REVIEW_MAX_IMAGES - images.length;

    if (remaining <= 0) {
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

    const picked = result.assets.map((asset) => asset.uri);
    onChange([...images, ...picked].slice(0, REVIEW_MAX_IMAGES));
  };

  const removeImage = (uri: string) => {
    onChange(images.filter((item) => item !== uri));
  };

  return (
    <View>
      <Text style={styles.label}>사진 첨부 (선택)</Text>
      <View style={styles.row}>
        {images.map((uri) => (
          <View key={uri} style={styles.previewWrap}>
            <Image source={{ uri }} style={styles.preview} />
            {!disabled ? (
              <Pressable
                style={styles.remove}
                onPress={() => removeImage(uri)}
              >
                <Text style={styles.removeText}>×</Text>
              </Pressable>
            ) : null}
          </View>
        ))}

        {!disabled && images.length < REVIEW_MAX_IMAGES ? (
          <Pressable style={styles.addButton} onPress={pickImages}>
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addText}>사진 추가</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  previewWrap: {
    position: 'relative',
  },
  preview: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceGray,
  },
  remove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 16,
  },
  addButton: {
    width: 88,
    height: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 22,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  addText: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
