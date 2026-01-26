import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { MoreVertical } from 'lucide-react-native';

interface ReportCardProps {
  title: string;
  date: string;
  imageSource?: any;
  onPress?: () => void;
  onMenuPress?: () => void;
  onLongPress?: () => void;
}

const AssessmentReportCardWithSetting = ({ title, date, imageSource, onPress, onMenuPress, onLongPress }: ReportCardProps) => {
  return (
    <Pressable 
      onPress={onPress}
      onLongPress={onLongPress}
      className="bg-white w-40 h-56 mb-4 rounded-lg shadow-md"
    >
      {/* Menu Button */}
      <View className="items-end my-2">
        <Pressable onPress={onMenuPress} className="p-1 active:opacity-50">
          <MoreVertical size={20} color="#000" />
        </Pressable>
      </View>

      {/* Slide Preview Image */}
      <View className="mb-2 items-center justify-center ">
        <Image 
          source={imageSource ? imageSource : require('../../../../assets/img/sampleImages/sample1.jpg')} 
          className="w-28 h-28"
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