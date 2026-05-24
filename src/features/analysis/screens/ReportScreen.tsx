import { View, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from '../../../components/BackButton';
import CustomLoader from '@/components/CustomLoader';
import { useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react';
import { ScanSearch } from 'lucide-react-native';
import { Dimensions } from 'react-native';
import { ResumableZoom } from 'react-native-zoom-toolkit'

const screenWidth = Dimensions.get('window').width;
const detectionWidth = screenWidth - 72;

export default function ReportScreen() {
  const { image, reportName } = useLocalSearchParams<{
    image?: string
    reportName?: string
  }>()

  const imageUri = typeof image === 'string' ? decodeURIComponent(image) : null

  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)
  const [displayName, setDisplayName] = useState(reportName ?? '')
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    setDisplayName(reportName ?? '')
  }, [reportName])

  useEffect(() => {
    if (!imageUri) return
    Image.getSize(imageUri, (width, height) => {
      setImageSize({ width, height })
      setImageLoading(false)
    }, () => setImageLoading(false))
  }, [imageUri])

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      <View className='w-full flex-row items-center mb-4 gap-4'>
        <BackButton />
        <View className='items-center'>
          <Text className="font-bold text-4xl text-center text-gray-900">{displayName}</Text>
        </View>
      </View>

      <View className="w-full mt-6 gap-4">
        <Text className="font-semibold text-xl text-gray-800">Detection Result</Text>

        {imageLoading ? (
          <View className="bg-white rounded-md p-4 items-center justify-center min-h-64">
            <CustomLoader size="large" message="Loading report..." />
          </View>
        ) : imageSize && imageUri ? (
          <>
            <View className='bg-white rounded-md overflow-hidden' style={{ elevation: 1 }}>
              <ResumableZoom maxScale={8} minScale={1}>
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: detectionWidth,
                    aspectRatio: imageSize.width / imageSize.height,
                  }}
                  resizeMode="contain"
                />
              </ResumableZoom>
            </View>

            <View className='bg-white rounded-md p-4 gap-4 items-center' style={{ elevation: 1 }}>
              <View className="flex-row justify-start items-center gap-4 flex-wrap">
                <View className="flex-row items-center gap-2">
                  <View className="w-4 h-4 bg-green-500 rounded-sm" />
                  <Text className="text-gray-800 text-sm">Adequate</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="w-4 h-4 bg-blue-500 rounded-sm" />
                  <Text className="text-gray-800 text-sm">Inadequate</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="w-4 h-4 bg-red-500 rounded-sm" />
                  <Text className="text-gray-800 text-sm">Isolated</Text>
                </View>
              </View>
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
  )
}