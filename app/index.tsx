import { Text, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoTitleVertical from 'assets/icons/LogoTitleVertical';
import CustomLoader from '../src/components/CustomLoader';
import { login } from '../api/auth';

export default function Index() {
  const mounted = useRef(true);

  useEffect(() => {
    (async () => {
      try {
        const shown = await AsyncStorage.getItem('onboarding_shown');

        if (!mounted.current) return;

        if (!shown) {
          router.replace('/onboarding');
          return;
        }

        const existingToken = await AsyncStorage.getItem('access_token');
        if (!existingToken) {
          try {
            const response = await login({
              email: 'laderatheo@gmail.com',
              password: 'test1234',
            });

            if (response?.access_token) {
              await AsyncStorage.setItem('access_token', response.access_token);
            }
          } catch (err) {
            console.warn('Auto-login failed:', err);
          }
        }

        router.replace('/home');
      } catch {
        router.replace('/home');
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