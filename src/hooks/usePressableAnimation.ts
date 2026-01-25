import { useCallback } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type Options = {
  pressedScale?: number;
  pressedOpacity?: number;
  duration?: number;
};

export function usePressableAnimation({ pressedScale = 0.95, pressedOpacity = 0.9, duration = 100 }: Options = {}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withTiming(pressedScale, { duration });
    opacity.value = withTiming(pressedOpacity, { duration });
  }, [pressedScale, pressedOpacity, duration]);

  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, { duration });
    opacity.value = withTiming(1, { duration });
  }, [duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle, onPressIn, onPressOut } as const;
}

export default usePressableAnimation;
