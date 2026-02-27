import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import ImageUploadArea from '../../../components/ImageUploadArea';
import { useRouter } from 'expo-router';
import { FileQuestionMark } from 'lucide-react-native';
import RecentAnalysis from '@/features/library/components/RecentAnalysis';
import useGreeting from '../hooks/useGreeting';
import { useEffect, useState } from 'react';
import { getRecentAnalyses } from '../../../../api/image';

type RecentItem = {
  id: string
  image_name: string
  image_url: string
  date: string
  detection_result: any | null
}

function mapToRecentItem(raw: any): RecentItem {
  return {
    id: String(raw.id),
    image_name: raw.image_name,
    image_url: raw.image_url,
    date: raw.date ?? '',
    detection_result: raw.detection_result ?? null,
  }
}

export default function HomeScreen() {
  const router = useRouter()
  const greeting = useGreeting()
  const [recent, setRecent] = useState<RecentItem[] | null>(null)
  const [loadingRecent, setLoadingRecent] = useState(false)

  useEffect(() => {
      let mounted = true

      async function fetchRecentAnalyses() { 
        setLoadingRecent(true)
        try {
          const data = await getRecentAnalyses(3)
          if (!mounted) return
          setRecent((data ?? []).map(mapToRecentItem))
        } catch (err) {
          console.error('Failed to fetch recent analyses', err)
          if (mounted) setRecent([])
        } finally {
          if (mounted) setLoadingRecent(false)
        }
      }                                 

      fetchRecentAnalyses()
      return () => { mounted = false }
    }, [])

  function handleImagePick(uri: string) {
    router.push({ pathname: '/analysis', params: { image: encodeURIComponent(uri) } })
  }

  const hasRecent = recent && recent.length > 0

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{ alignItems: 'center', padding: 20 }}
    >
      <Text className="font-medium text-lg text-gray-700 mb-2">{greeting}</Text>
      <Text className="font-bold text-4xl text-center text-gray-900">
        {"How can we help\nyou today?"}
      </Text>

      <View className="w-full mt-4">
        <ImageUploadArea
          preventLocalPreview
          disabled={false}
          onPick={handleImagePick}
        />
      </View>

      <View className="w-full mt-6">
        <Text className="font-semibold text-xl text-gray-800 mb-4">
          Recent Analysis
        </Text>

        {loadingRecent ? (
          <ActivityIndicator />
        ) : hasRecent ? (
          <RecentAnalysis items={recent} />
        ) : (
          <View className="bg-white rounded-xl p-4 items-center justify-center border-2 border-dashed border-gray-300">
            <FileQuestionMark size={48} color="#9CA3AF" />
            <Text className="text-gray-400 mt-2 text-center">
              No recent analysis are available. Create some analysis to see them here!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}