import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/colors';

type Props = {
  visible: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

export default function ReviewImageViewer({
  visible,
  images,
  initialIndex,
  onClose,
}: Props) {
  const [index, setIndex] = useState(initialIndex);

  React.useEffect(() => {
    if (visible) {
      setIndex(initialIndex);
    }
  }, [visible, initialIndex]);

  if (images.length === 0) {
    return null;
  }

  const goPrev = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goNext = () => {
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
          <Text style={styles.counter}>
            {index + 1} / {images.length}
          </Text>
          <View style={styles.close} />
        </View>

        <View style={styles.main}>
          {images.length > 1 ? (
            <Pressable style={styles.nav} onPress={goPrev}>
              <Text style={styles.navText}>‹</Text>
            </Pressable>
          ) : (
            <View style={styles.navPlaceholder} />
          )}

          <Image source={{ uri: images[index] }} style={styles.image} />

          {images.length > 1 ? (
            <Pressable style={styles.nav} onPress={goNext}>
              <Text style={styles.navText}>›</Text>
            </Pressable>
          ) : (
            <View style={styles.navPlaceholder} />
          )}
        </View>

        {images.length > 1 ? (
          <View style={styles.thumbs}>
            {images.map((uri, thumbIndex) => (
              <Pressable key={uri} onPress={() => setIndex(thumbIndex)}>
                <Image
                  source={{ uri }}
                  style={[
                    styles.thumb,
                    thumbIndex === index && styles.thumbActive,
                  ]}
                />
              </Pressable>
            ))}
          </View>
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 52,
  },
  close: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: COLORS.white,
    fontSize: 28,
    lineHeight: 30,
  },
  counter: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  nav: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navPlaceholder: {
    width: 40,
  },
  navText: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '300',
  },
  image: {
    flex: 1,
    height: '80%',
    resizeMode: 'contain',
  },
  thumbs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 16,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    opacity: 0.6,
  },
  thumbActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});
