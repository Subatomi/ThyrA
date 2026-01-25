import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { MoreVertical } from 'lucide-react-native';

interface ReportCardProps {
  title: string;
  date: string;
  imageSource?: any;
  onPress?: () => void;
  onMenuPress?: () => void;
}

const AssessmentReportCardWithSetting = ({ title, date, imageSource, onPress, onMenuPress }: ReportCardProps) => {
  return (
    <Pressable 
      onPress={onPress}
      // Standard card styling with NativeWind
      className="bg-white rounded-3xl p-4 w-[48%] mb-4 shadow-sm"
      style={{ elevation: 3 }}
    >
      {/* Menu Button */}
      <View className="items-end mb-2">
        <Pressable onPress={onMenuPress} className="p-1 active:opacity-50">
          <MoreVertical size={20} color="#000" />
        </Pressable>
      </View>

      {/* Slide Preview Image */}
      <View className="aspect-square w-full rounded-xl overflow-hidden mb-3 bg-gray-100">
        <Image 
          source={imageSource ? imageSource : require('@assets/img/placeholder-slide.png')} 
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Report Info */}
      <View className="items-center">
        <Text 
          numberOfLines={1} 
          className="text-lg font-bold text-gray-900 text-center"
        >
          {title}
        </Text>
        <Text className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
          {date}
        </Text>
      </View>
    </Pressable>
  );
};

export default AssessmentReportCardWithSetting;