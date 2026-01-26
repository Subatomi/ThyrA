import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from '../../../components/BackButton';
import ImageUploadArea from '../../../components/ImageUploadArea';
import { useLocalSearchParams, useRouter } from 'expo-router'

export default function AnalysisScreen() {
  const { image } = useLocalSearchParams() as { image?: string }
  const router = useRouter()
  return (
    <ScrollView className="flex-1 bg-gray-100"
    contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      <View className='w-full flex-row items-center mb-4 gap-4'>
        <View>
          <BackButton />
        </View>

        <View className='items-center'>
          <Text className="font-bold text-4xl text-center text-gray-900">Analysis</Text>
        </View>

      </View>

      <View className="w-full my-4">
        <ImageUploadArea
          externalImageUri={typeof image === 'string' ? image : null}
          onRemove={() => {
            // clear image param by replacing route without params
            router.replace('/analysis')
          }}
        />
      </View>

      <Pressable className="w-full mb-6 mt-2" >
        <View style={{ elevation:3}} className="bg-red-500 py-4 rounded-lg items-center justify-center">
          <Text className="text-white font-bold text-xl">
            Analyze
          </Text> 
        </View>
      </Pressable>

      <View className="w-full mt-6">
        <Text className="font-semibold text-xl text-gray-800 mb-4">
          Result:
        </Text>
      </View>

    </ScrollView>
  );
}
