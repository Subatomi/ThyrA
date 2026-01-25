import React from 'react';
import { Pressable, View, Platform } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import useBackNavigation from '@/hooks/useBackNavigation';

export default function BackButton() {
  const { back } = useBackNavigation({
    enableHardwareBack: true,
    exitOnRoot: true,
  });

  const elevated = Platform.select({
    android: { elevation: 3 },
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 2,
    },
    default: { elevation: 3 },
  });

  return (
    <View
      className="w-11 h-11 rounded-full overflow-hidden"
      style={elevated}
    >
      <Pressable
        onPress={back}
        hitSlop={8}
        accessibilityLabel="Back"
        className="flex-1 items-center justify-center bg-white pressed:bg-slate-100"
      >
        <ArrowLeft size={28} color="#111827" />
      </Pressable>
    </View>
  );
}
