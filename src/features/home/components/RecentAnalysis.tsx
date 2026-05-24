import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { DeviceEventEmitter } from 'react-native';
import AssessmentReportCard from './AssessmentReportCard';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable } from 'react-native';

const SAVED_RESULTS_KEY = 'savedResults'

type SavedResult = {
  filename: string;
  savedAt: string;
  uri: string;
}

type Props = {
  limit?: number;
};

const RecentAnalysis: React.FC<Props> = ({ limit = 3 }) => {
  const [items, setItems] = useState<SavedResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadFromStorage = async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem(SAVED_RESULTS_KEY)
      const parsed: SavedResult[] = data ? JSON.parse(data) : []
      const sliced = parsed.slice(0, limit)
      setItems(sliced)
    } catch (err) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFromStorage()
  }, [limit])

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('savedResults:refresh', () => {
      loadFromStorage()
    })
    return () => {
      sub.remove()
    }
  }, [limit])

  if (loading) return <ActivityIndicator />;
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row flex-wrap justify-between gap-5">
        {items.map((item, index) => {
          return (
            <AssessmentReportCard
              key={index}
              title={item.filename.replace(/\.[^/.]+$/, '')}
              date={item.savedAt}
              imageSource={item.uri ? { uri: item.uri } : undefined}
              onPress={() => {
                router.push({
                  pathname: '/report-analysis',
                  params: {
                    image: encodeURIComponent(item.uri),
                    reportName: item.filename.replace(/\.[^/.]+$/, ''),
                  },
                })
              }}
            />
          )
        })}
      </View>
    </ScrollView>
    
  );
};

export default RecentAnalysis;