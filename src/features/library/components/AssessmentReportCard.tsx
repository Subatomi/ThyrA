import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import usePressableAnimation from '../../../hooks/usePressableAnimation';

interface ReportCardProps {
  title: string;
  date: string;
  imageSource?: any;
  onPress?: () => void;
}

const AssessmentReportCard = ({ title, date, imageSource, onPress}: ReportCardProps) => {
  const { animatedStyle, onPressIn, onPressOut } = usePressableAnimation();

  return (
    <Pressable 
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[{ elevation: 1 }, animatedStyle]} className="bg-white rounded-md p-4 w-40 mb-4">
          {/* Slide Preview Image */}
          <View className="aspect-square w-full overflow-hidden mb-3 ">
            <Image 
              source={imageSource ? imageSource : require('assets/img/topographic_background.jpg')} 
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Report Info */}
          <View className="items-center">
            <Text 
              numberOfLines={1} 
              className="text-xl font-bold text-gray-900 text-center"
            >
              {title}
            </Text>
            <Text className="text-base text-gray-500 font-light uppercase tracking-widest">
              {date}
            </Text>
          </View>
      </Animated.View>
    </Pressable>
  );
};
export default AssessmentReportCard;