import { Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoTitleVertical from 'assets/icons/LogoTitleVertical';

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    ;(async () => {
      try {
        const shown = await AsyncStorage.getItem('onboarding_shown');
        const token = await AsyncStorage.getItem('access_token');
        if (!mounted) return;
        if (!shown) {
          router.replace('/onboarding');
        // Do not know if this is correct?????
        // } else if (token) {
        //   router.replace('/home');
        } else {
          router.replace('/sign-in');
        }
      } catch (e) {
        router.replace('/sign-in');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false };
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <LogoTitleVertical />
        <Text className="mt-2 mb-8 text-gray-600">Thyroid Adequacy testing app</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}