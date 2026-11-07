import React, { useState } from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { COLORS } from '../../../constants/colors';

type Props = {
  photos: string[];
};

export default function ProfilePhotoGallery({ photos }: Props) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => String(index)}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height: width * 1.12 }}
            resizeMode="cover"
          />
        )}
      />

      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {activeIndex + 1} / {photos.length}
        </Text>
      </View>

      <View style={styles.dots}>
        {photos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: COLORS.surfaceGray,
  },
  counter: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  counterText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  dots: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  activeDot: {
    width: 18,
    backgroundColor: COLORS.white,
  },
});
