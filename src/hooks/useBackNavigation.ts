import { useCallback, useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useRouter } from 'expo-router';

type Options = {
  enableHardwareBack?: boolean; // Android hardware back
  exitOnRoot?: boolean; // if true and there's no history, allow default (exit)
};

export default function useBackNavigation(options: Options = {}) {
  const { enableHardwareBack = true, exitOnRoot = true } = options;
  const router = useRouter();

  const back = useCallback(() => {
    try {
      // Try to navigate back via router
      router.back();
      return true;
    } catch (err) {
      // If router.back() throws or does nothing, decide whether to allow default
      return exitOnRoot ? false : true;
    }
  }, [router, exitOnRoot]);

  useEffect(() => {
    if (!enableHardwareBack || Platform.OS !== 'android') return;

    const onBackPress = () => {
      // If we handled the back action, return true to prevent default
      return back();
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [back, enableHardwareBack]);

  return { back };
}
