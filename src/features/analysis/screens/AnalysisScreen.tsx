import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from '../../../components/BackButton';
import ImageUploadArea from '../../../components/ImageUploadArea';
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react';
import { runInference } from 'api/image';

export default function AnalysisScreen() {
  const { image } = useLocalSearchParams() as { image?: string }
  const router = useRouter()

  const [imageUri, setImageUri] = useState<string | null>(typeof image === 'string' ? image : null)

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);


  const getImageMetaFromUri = (uri: string) => {
    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);

    const ext = match ? match[1].toLowerCase() : 'jpg';

    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      heic: 'image/heic',
    };

    return {
      uri,
      fileName: filename,
      type: mimeTypes[ext] || 'image/jpeg',
    };
  };


  const handleAnalyze = async () => {
    if (!imageUri) {
      Alert.alert("No image", "Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      // Build image object expected by runInference
      const imagePayload = getImageMetaFromUri(imageUri);

      const response = await runInference(imagePayload);
      setResult(response);
    } catch (error: any) {
      Alert.alert("Inference failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
          externalImageUri={imageUri}
          onPick={(uri) => setImageUri(uri)}
          onRemove={() => setImageUri(null)}
        />
      </View>

      {/* ANALYZE BUTTON */}
      <Pressable
        className="w-full mb-6 mt-2"
        onPress={handleAnalyze}
        disabled={loading}
      >
        <View
          style={{ elevation: 3 }}
          className={`py-4 rounded-lg items-center justify-center ${loading ? "bg-gray-400" : "bg-red-500"
            }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-xl">
              Analyze
            </Text>
          )}
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
