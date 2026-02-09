import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from '../../../components/BackButton';
import ImageUploadArea from '../../../components/ImageUploadArea';
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState, useEffect, useRef } from 'react';
import { runInference } from 'api/image';
import DetectionOverlay from '@/components/DetectionOverlay';
import { ScanSearch } from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Button } from 'react-native';
import { Dimensions } from 'react-native';



export default function AnalysisScreen() {
  const { image } = useLocalSearchParams() as { image?: string }
  const router = useRouter()

  // decode route-encoded URIs (file:// and other special chars can break route params)
  const initialImageUri = typeof image === 'string' ? decodeURIComponent(image) : null;
  const [imageUri, setImageUri] = useState<string | null>(initialImageUri)

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [analyzedImageUri, setAnalyzedImageUri] = useState<string | null>(null);

  const detectionRef = useRef<View>(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (!imageUri) return;

    Image.getSize(
      imageUri,
      (width, height) => {
        setImageSize({ width, height });
      },
      (error) => {
        console.error('Failed to get image size:', error);
      }
    );
  }, [imageUri]);

  // update when route param changes
  useEffect(() => {
    if (typeof image === 'string') {
      //setImageUri(decodeURIComponent(image));
      const decoded = decodeURIComponent(image)

      setImageUri(decoded)
      setAnalyzedImageUri(null)
      setResult(null)
      setImageSize(null)

      
    }
  }, [image]);


  const handleDownload = async () => {
    if (!detectionRef.current || !isLayoutReady) return
    try {
      //Ask for permission
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== 'granted') {
        Alert.alert("Permission denied", "Cannot save image without permission.");
        return;
      }

      //Capture the DetectionOverlay as an image
      const uri = await captureRef(detectionRef, {
        format: 'png',
        quality: 1,
      });

      //Save to media library
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('DetectionResults', asset, false);

      Alert.alert("Success", "Image saved to your gallery!");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to save image.");
    }
  };



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

      setAnalyzedImageUri(imageUri);
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
          onPick={(uri) => {
            setImageUri(uri)
            setAnalyzedImageUri(null);
            setResult(null);
            setImageSize(null);
          }}
          onRemove={() => {
            setImageUri(null)
          }}
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

      <View className="w-full mt-6 gap-4">
        <Text className="font-semibold text-xl text-gray-800">
          Detection Result
        </Text>   

        {result && result.detections?.thyrocytes && imageSize && analyzedImageUri ? (
          <>
            <View
              ref={detectionRef}
              collapsable={false}
              style={{
                width: screenWidth - 40, // account for ScrollView padding
                aspectRatio: imageSize.width / imageSize.height,
                marginVertical: 10,
              }}
              onLayout={() => setIsLayoutReady(true)}
            >
              <DetectionOverlay
                imageUri={analyzedImageUri}
                thyrocytes={result.detections?.thyrocytes}
                clusters={result.detections?.clusters}
                originalWidth={imageSize.width}
                originalHeight={imageSize.height}
              />
            </View>

            {/* LEGEND */}
            <View className="flex-row justify-start items-center gap-4">
              <View className="flex-row items-center gap-2">
                <View className="w-4 h-4 bg-green-500 rounded-sm" />
                <Text className="text-gray-800 text-sm">Adequate</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <View className="w-4 h-4 bg-blue-500 rounded-sm" />
                <Text className="text-gray-800 text-sm">Inadequate</Text>
              </View>

              <Button title="Download Result" onPress={handleDownload} />
            </View>
          </>
        ) : (
           <View className="bg-white rounded-xl p-4 items-center justify-center border-2 border-dashed border-gray-300">
              <ScanSearch size={48} color="#9CA3AF" />
              <Text className="text-gray-400 mt-2 text-center">
                No results are shown. Upload a valid image for analysis to see them here!
              </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}