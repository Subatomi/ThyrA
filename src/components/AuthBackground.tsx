import React from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Circle, Rect } from 'react-native-svg'

type Props = {
  children: React.ReactNode
}

export default function AuthBackground({ children }: Props) {
  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 375 812" preserveAspectRatio="xMidYMid slice">
          <Defs>
            <LinearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FFF1F0" />
              <Stop offset="1" stopColor="#FFECEB" />
            </LinearGradient>
            <LinearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FF8A80" />
              <Stop offset="1" stopColor="#FF3B30" />
            </LinearGradient>
            <LinearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#8AD1FF" />
              <Stop offset="1" stopColor="#4A90E2" />
            </LinearGradient>
          </Defs>

          <Rect x="0" y="0" width="375" height="300" fill="url(#g1)" />

          <Circle cx="60" cy="100" r="60" fill="url(#g2)" opacity={0.16} />
          <Circle cx="320" cy="80" r="80" fill="url(#g3)" opacity={0.12} />
          <Circle cx="40" cy="720" r="120" fill="url(#g2)" opacity={0.06} />
        </Svg>
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { flex: 1 },
})
