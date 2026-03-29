import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '../global.css'
import { MenuProvider } from '../src/features/tabs/MenuContext'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MenuProvider>
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
        </MenuProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}