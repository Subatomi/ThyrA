import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';

type Props = {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
};

export default function FAQItem({ question, answer, open, onToggle }: Props) {
  const anim = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: 360,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [open, anim]);

  const rotation = anim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] });
  const horizOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <View>
      <Pressable onPress={onToggle} className="bg-white rounded-md p-3 mb-2">
        <View className="flex-row items-center justify-between">
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text className="font-semibold">{question}</Text>
          </View>

          <View style={{ width: 36, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View style={{ position: 'absolute', width: 16, height: 2, backgroundColor: '#6B7280', borderRadius: 2, opacity: horizOpacity }} />
              <Animated.View style={{ position: 'absolute', width: 16, height: 2, backgroundColor: '#6B7280', borderRadius: 2, transform: [{ rotate: rotation }] }} />
            </View>
          </View>
        </View>

        {open ? <Text className="text-sm text-gray-600 mt-3">{answer}</Text> : null}
      </Pressable>
    </View>
  );
}
