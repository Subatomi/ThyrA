import React, { useEffect, useRef } from 'react';
import { View, Animated, Text } from 'react-native';

interface CustomLoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeConfig = {
  small: { width: 32, height: 32, borderWidth: 3 },
  medium: { width: 48, height: 48, borderWidth: 4 },
  large: { width: 54, height: 54, borderWidth: 6 },
};

export default function CustomLoader({
  message = 'Loading...',
  size = 'medium',
}: CustomLoaderProps) {
  const config = sizeConfig[size];
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();

    return () => spinValue.setValue(0);
  }, [spinValue]);

  const spinDegree = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="items-center justify-center gap-4">
      <Animated.View
        style={{
          transform: [{ rotate: spinDegree }],
        }}
      >
        <View
          style={{
            width: config.width,
            height: config.height,
            borderWidth: config.borderWidth,
            borderColor: '#E5E7EB',
            borderTopColor: '#DC2626',
            borderRadius: config.width / 2,
          }}
        />
      </Animated.View>

      <Text className="text-gray-600 text-sm">{message}</Text>
    </View>
  );
}
