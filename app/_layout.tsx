import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import '../global.css'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Top-level routes in logical order */}
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="about" />
        {/* Auth flows as a grouped stack */}
        <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
        {/* Main tabs */}
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack>
    </GestureHandlerRootView>
  )
}