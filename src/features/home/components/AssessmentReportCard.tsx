import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import CustomLoader from '@/components/CustomLoader';
import usePressableAnimation from '../../../hooks/usePressableAnimation';

interface ReportCardProps {
  title: string;
  date: string;
  imageSource?: any;
  onPress?: () => void;
}

const AssessmentReportCard = ({ title, date, imageSource, onPress }: ReportCardProps) => {
  const { animatedStyle, onPressIn, onPressOut } = usePressableAnimation();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const imageKey = imageSource?.uri ? `${imageSource.uri}-${Date.now()}` : 'default';

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[{ elevation: 1 }, animatedStyle]} className="bg-white rounded-md p-4 w-40 mb-4">
        <View className="aspect-square w-full overflow-hidden mb-3 relative items-center justify-center">
          {imageLoading && !imageError && (
            <View className="absolute inset-0 items-center justify-center bg-white/70">
              <CustomLoader size="small" />
            </View>
          )}
          <Image
            key={imageKey}
            source={imageError || !imageSource ? require('assets/img/topographic_background.jpg') : imageSource}
            className="w-full h-full absolute inset-0"
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            style={{ opacity: imageLoading ? 0 : 1 }}
          />
        </View>

        <View className="items-center">
          <Text numberOfLines={1} className="text-xl font-bold text-gray-900 text-center">
            {title}
          </Text>
          <Text className="text-base text-gray-400 font-bold uppercase tracking-widest">
            {date.split('T')[0]}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default AssessmentReportCard;
