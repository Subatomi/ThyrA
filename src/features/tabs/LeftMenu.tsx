import React, { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Pressable, Text, View, TouchableOpacity, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, Home,  SearchCheck, Folders, Files, Settings, Info, CircleUser } from 'lucide-react-native'
import LogoTitle from 'assets/icons/LogoTitle'
import { useRouter } from 'expo-router'
import useAuth from '@/features/tabs/hooks/useAuth'
import { getProfileDisplayName } from '@/features/profile/services/profileCache'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const MENU_WIDTH = Math.min(320, SCREEN_WIDTH * 0.8)

export default function LeftMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const { logout } = useAuth()
  const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current
  const overlayOpacity = useRef(new Animated.Value(0)).current
  const insets = useSafeAreaInsets()
  const [displayName, setDisplayName] = useState<string>('')

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: isOpen ? 0 : -MENU_WIDTH, duration: 300, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: isOpen ? 0.45 : 0, duration: 300, useNativeDriver: true }),
    ]).start()
  }, [isOpen, overlayOpacity, translateX])

  // Load display name when the menu opens or on mount
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const name = await getProfileDisplayName()
      if (mounted) setDisplayName(name || 'User')
    })()
    return () => { mounted = false }
  }, [isOpen])

  return (
    <>
      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'}
        className="absolute inset-0 bg-black z-50"
        style={{ opacity: overlayOpacity }}
      >
        <Pressable className="flex-1" onPress={onClose} />
      </Animated.View>

      <Animated.View
        className="absolute left-0 top-0 bottom-0 bg-white z-50 shadow-lg"
        style={{ transform: [{ translateX }], width: MENU_WIDTH, paddingTop: insets.top - 5, paddingBottom: insets.bottom  }}
      >
        <View className="flex-1 justify-between">
          <View>
            {/* Header with logo and close */}
            <View className="flex-row items-center justify-between mb-6 px-4 pt-5">
              <LogoTitle />
              <TouchableOpacity onPress={onClose} className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center">
                <ChevronLeft size={20} />
              </TouchableOpacity>
            </View>

            <View className='px-6'>
              {/* Menu items (static) */}
              <TouchableOpacity
                className="flex-row items-center py-3 gap-4"
                onPress={() => {
                  onClose()
                  setTimeout(() => router.push('/home'), 200)
                }}
              >
                <Home size={20} color="#333" className="mr-3" />
                <Text className="text-base">Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center py-3 gap-4"
                onPress={() => {
                  onClose()
                  setTimeout(() => router.push('/analysis'), 200)
                }}
              >
                <SearchCheck size={20} color="#333" className="mr-3" />
                <Text className="text-base">Assess</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center py-3 gap-4"
                onPress={() => {
                  onClose()
                  setTimeout(() => router.push('/folder'), 200)
                }}
              >
                <Folders size={20} color="#333" className="mr-3" />
                <Text className="text-base">File Management</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center py-3 gap-4"
                onPress={() => {
                  onClose()
                  setTimeout(() => router.push('/report-folder'), 200)
                }}
              >
                <Files size={20} color="#333" className="mr-3" />
                <Text className="text-base">Case Management (Temporary)</Text>

              </TouchableOpacity>

                            <TouchableOpacity
                className="flex-row items-center py-3 gap-4"
                onPress={() => {
                  onClose()
                  setTimeout(() => router.push('/result'), 200)
                }}
              >
                <Files size={20} color="#333" className="mr-3" />
                <Text className="text-base">Result (Temporary)</Text>
              </TouchableOpacity>


              <View className="h-3" />
              <View className="h-px bg-gray-200 my-3" />
                
              <TouchableOpacity className="flex-row items-center py-3 gap-4" onPress={() => {
                  onClose()
                  setTimeout(() => router.push('/profile'), 200)
                }}
              >
                <CircleUser size={20} color="#333" className="mr-3" />
                <Text className="text-base">Profile</Text>
              </TouchableOpacity>    
              <TouchableOpacity className="flex-row items-center py-3 gap-4" onPress={() => {
                  onClose()
                  setTimeout(() => router.push('/setting'), 200)
              }}>
                <Settings size={20} color="#333" className="mr-3" />
                <Text className="text-base">Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center py-3 gap-4" onPress={() => {
                  onClose()
                  setTimeout(() => router.push('/support'), 200)
              }}>
                <Info size={20} color="#333" className="mr-3" />
                <Text className="text-base">Support</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom profile card */}
          <View className='px-4 pb-3'>
            <View className="h-px bg-gray-200 my-3" />
            <TouchableOpacity className="flex-row items-center justify-between px-1 mb-3">
              <View className="flex-row items-center">
                <Image source={require('assets/icons/sample_profile_1.png')} className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
                <View>
                  <Text className="text-xs text-gray-500">Welcome back 👋</Text>
                  <Text className="text-xl font-bold">{displayName}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View className="mt-3 px-1">
              <Pressable
                  onPress={async () => {
                    onClose()
                    // clear auth and redirect
                    await logout()
                  }}
              >
                {({ pressed }) => (
                  <View className="py-2 rounded-md items-center justify-center" style={{ backgroundColor: pressed ? '#991b1b' : '#dc2626' }}>
                    <Text className="text-white font-semibold">Log out</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Animated.View>
    </>
  )
}
