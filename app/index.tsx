import { Text, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoTitleVertical from 'assets/icons/LogoTitleVertical';
import CustomLoader from '../src/components/CustomLoader';
import { refreshProfileFromServer } from '@/features/profile/services/refreshProfile';

export default function Index() {
  const mounted = useRef(true);

  useEffect(() => {
    (async () => {
      try {
        const [shown, token] = await Promise.all([
          AsyncStorage.getItem('onboarding_shown'),
          AsyncStorage.getItem('access_token'),
        ]);

        if (!mounted.current) return;

        if (!shown) {
          router.replace('/onboarding');
        } else if (token) {
          const refreshed = await refreshProfileFromServer();
          if (!mounted.current) return;
          if (!refreshed) {
            await AsyncStorage.removeItem('access_token');
            router.replace('/sign-in');
          } else {
            router.replace('/home');
          }
        } else {
          router.replace('/sign-in');
        }
      } catch {
        router.replace('/sign-in');
      }
    })();

    return () => { mounted.current = false; };
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <LogoTitleVertical />
      <Text className="mt-2 mb-8 text-gray-600">Thyroid Adequacy testing app</Text>
      <CustomLoader size="large" message="Initializing..." />
    </View>
  );
}