import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { DeviceEventEmitter } from 'react-native';
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
  folder_id?: string;
  original_width?: number;
  original_height?: number;
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
    if (initialItems) return;

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
            folder_id: String(it.folder_id),
            original_width: it.original_width,
            original_height: it.original_height,
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

  useEffect(() => {
    const addSub = DeviceEventEmitter.addListener('recentAnalyses', (payload: any) => {
      if (!payload || payload.action === 'refresh') {
        (async () => {
          setLoading(true);
          try {
            const data = await getRecentAnalyses(limit);
            setItems(
              (data || []).map((it: any) => ({
                id: String(it.id),
                image_name: it.image_name,
                image_url: it.image_url,
                date: it.date ?? '',
                detection_result: it.detection_result ?? null,
                folder_id: String(it.folder_id),
                original_width: it.original_width,
                original_height: it.original_height,
              }))
            );
          } catch (e) {
            console.error('Failed to refetch recent analyses', e);
          } finally {
            setLoading(false);
          }
        })();
        return;
      }
      if (payload.action === 'add' && payload.item) {
        setItems((prev) => (prev ? [payload.item, ...prev] : [payload.item]));
      }
    });

    const removeSub = DeviceEventEmitter.addListener('recentAnalyses:remove', (payload: any) => {
      if (!payload?.id) return;
      setItems((prev) => (prev ? prev.filter((r) => r.id !== payload.id) : prev));
      (async () => {
        try {
          const data = await getRecentAnalyses(limit);
          setItems(
            (data || []).map((it: any) => ({
              id: String(it.id),
              image_name: it.image_name,
              image_url: it.image_url,
              date: it.date ?? '',
              detection_result: it.detection_result ?? null,
              folder_id: String(it.folder_id),
              original_width: it.original_width,
              original_height: it.original_height,
            }))
          );
        } catch (e) {
          console.error('Failed to refetch after delete', e);
        }
      })();
    });

    const renameSub = DeviceEventEmitter.addListener('report:rename', (payload: any) => {
      if (!payload?.id) return;
      setItems((prev) =>
        prev
          ? prev.map((r) => (r.id === payload.id ? { ...r, image_name: payload.name } : r))
          : prev
      );
    });

    return () => {
      addSub.remove();
      removeSub.remove();
      renameSub.remove();
    };
  }, [limit]);

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
              router.push({
                pathname: '/report-analysis',
                params: {
                  image: encodeURIComponent(item.image_url),
                  reportId: item.id,
                  reportName: item.image_name,
                  folderId: item.folder_id,
                  reportDecode: item.detection_result ? JSON.stringify(item.detection_result) : '',
                  originalWidth: item.original_width?.toString() || '',
                  originalHeight: item.original_height?.toString() || '',
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
