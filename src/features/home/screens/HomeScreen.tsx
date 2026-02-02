import { ScrollView, Text, View } from 'react-native';
import ImageUploadArea from '../../../components/ImageUploadArea';
import { useRouter } from 'expo-router';
import { FileQuestionMark } from 'lucide-react-native';
import RecentAnalysis from '@/features/library/components/RecentAnalysis';
import useGreeting from '../hooks/useGreeting';

export default function HomeScreen() {
  const router = useRouter()
  const greeting = useGreeting()
  return (
    <ScrollView 
      className="flex-1 bg-gray-100" 
      contentContainerStyle={{ alignItems: 'center', padding: 20 }}>

      <Text className="font-medium text-lg text-gray-700 mb-2">{greeting}</Text>
      <Text className="font-bold text-4xl text-center text-gray-900">
        {"How can we help\nyou today?"}
      </Text>

      <View className="w-full mt-4">
        <ImageUploadArea
          preventLocalPreview
          onPick={(uri) => {
            router.push({ pathname: '/analysis', params: { image: encodeURIComponent(uri) } })
          }}
        />
      </View>

      <View className="w-full mt-6">
        <Text className="font-semibold text-xl text-gray-800 mb-4">
          Recent Analysis 
        </Text>
        <RecentAnalysis></RecentAnalysis>
        {/* <View className="bg-white rounded-xl p-4 items-center justify-center border-2 border-dashed border-gray-300">
          <FileQuestionMark size={48} color="#9CA3AF" />
          <Text className="text-gray-400 mt-2 text-center">
            No recent analysis are available. Create some analysis to see them here!
          </Text>
        </View> */}
      </View>


    </ScrollView>
  );
}
