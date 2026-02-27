import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AssessmentReportCard from './AssessmentReportCard';
import { getRecentAnalyses } from '../../../../api/image';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

type RecentItem = {
  id: string;
  image_name: string;
  image_url: string;
  date?: string;
  detection_result?: any;
};

type Props = {
  items?: RecentItem[];
  limit?: number;
};

const RecentAnalysis: React.FC<Props> = ({ items: initialItems, limit = 3 }) => {
  const [items, setItems] = useState<RecentItem[] | null>(initialItems ?? null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (initialItems) return; // items provided by parent — don't fetch

    let mounted = true;
    async function fetchRecent() {
      setLoading(true);
      try {
        const data = await getRecentAnalyses(limit);
        if (!mounted) return;
        setItems(
          (data || []).map((it: any) => ({
            id: String(it.id),
            image_name: it.image_name,
            image_url: it.image_url,
            date: it.date ?? '',
            detection_result: it.detection_result ?? null,
          }))
        );
      } catch (err) {
        console.error('Failed to load recent analyses', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecent();
    return () => {
      mounted = false;
    };
  }, [initialItems, limit]);

  if (loading) return <ActivityIndicator />;
  if (!items || items.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row flex-wrap justify-between gap-5">
        {items.map((item) => (
          <AssessmentReportCard
            key={item.id}
            title={item.image_name}
            date={item.date ?? ''}
            imageSource={{ uri: item.image_url }}
            onPress={() => {
              console.log('pressed', item.id);
              router.push({
                pathname: '/report-analysis',
                params: {
                  image: encodeURIComponent(item.image_url),
                  reportId: item.id,
                  reportName: item.image_name,
                  reportDecode: item.detection_result
                    ? JSON.stringify({ detection_result: item.detection_result })
                    : '',
                },
              });
            }}
          />
        ))}
      </View>
    </ScrollView>

  );
};

export default RecentAnalysis;
