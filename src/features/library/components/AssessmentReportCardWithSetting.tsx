import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import CustomLoader from '@/components/CustomLoader';

interface ReportCardProps {
  title: string;
  date: string;
  imageSource?: any;
  onPress?: () => void;
  onMenuPress?: () => void;
  onLongPress?: () => void;
  className?: string;
}

const AssessmentReportCardWithSetting = ({ title, date, imageSource, onPress, onMenuPress, onLongPress, className }: ReportCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Create a unique cache-busting key for newly added images
  const imageKey = imageSource?.uri ? `${imageSource.uri}-${Date.now()}` : 'default';
  
  return (
    <Pressable 
      onPress={onPress}
      onLongPress={onLongPress}
      className={`bg-white w-full max-w-48 h-56 mb-4 rounded-lg shadow-md ${className ?? ''}`}
    >
      {/* Menu Button */}
      <View className="items-end my-2">
        <Pressable onPress={onMenuPress} className="p-1 active:opacity-50">
          <MoreVertical size={20} color="#000" />
        </Pressable>
      </View>

      {/* Slide Preview Image */}
      <View className="mb-2 items-center justify-center ">
        {imageLoading && !imageError && (
          <CustomLoader size="small" />
        )}
        <Image 
          key={imageKey}
          source={imageError || !imageSource ? require('../../../../assets/img/sampleImages/sample1.jpg') : imageSource}
          className="w-28 h-28"
          resizeMode="cover"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          cache="reload"
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
        <Text className="text-base text-gray-400 font-bold uppercase tracking-widest">
          {date ? date.split('T')[0] : ''}
        </Text>
      </View>
    </Pressable>
  );
};

export default AssessmentReportCardWithSetting;