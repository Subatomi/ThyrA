import { ScrollView, Text, View } from 'react-native';
import ImageUploadArea from '../../../components/ImageUploadArea';
import RecentAnalysis from '@/features/library/components/RecentAnalysis';

export default function HomeScreen() {
  return (
    <ScrollView 
      className="flex-1 bg-gray-100" 
      contentContainerStyle={{ alignItems: 'center', padding: 20 }}>

      <Text className="font-medium text-lg text-gray-700 mb-2">
        Good Morning!
      </Text>
      <Text className="font-bold text-4xl text-center text-gray-900">
        {"How can we help\nyou today?"}
      </Text>

      <View className="w-full mt-4">
        <ImageUploadArea />
      </View>

      <View className="w-full mt-6">
        <Text className="font-semibold text-xl text-gray-800 mb-4">
          Recent Analysis 
        </Text>
        <RecentAnalysis></RecentAnalysis>
        {/* <View className="bg-white rounded-xl p-4 items-center justify-center border-2 border-dashed border-gray-300">
          <Text className="text-gray-400">
            No recent tests available.
          </Text>
        </View> */}
      </View>


    </ScrollView>
  );
}
