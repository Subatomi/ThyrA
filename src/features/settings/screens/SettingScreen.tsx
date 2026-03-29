import React, { useState } from 'react'
import { View, Text, Pressable, Switch, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackButton from '@/components/BackButton'
import { ChevronRight, Moon, Info } from 'lucide-react-native'
import DeleteAccountModal from '@/features/settings/components/DeleteAccountModal'
import { useRouter } from 'expo-router'
import { getProfileCache, formatFullName } from '@/features/profile/services/profileCache'

export default function SettingScreen() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const fullName = formatFullName(firstName, lastName, email) || 'User'

    // Hydrate profile details from cache on mount
    React.useEffect(() => {
        let mounted = true
        ;(async () => {
            const cached = await getProfileCache()
            if (!mounted || !cached) return
            setFirstName(cached.firstName)
            setLastName(cached.lastName)
            setEmail(cached.email)
        })()
        return () => { mounted = false }
    }, [])

  const Row = ({ children, onPress, right }: { children: React.ReactNode; onPress?: () => void; right?: React.ReactNode }) => (
    <Pressable onPress={onPress} className="px-4 py-3 bg-white rounded-lg mb-3" android_ripple={{ color: 'rgba(0,0,0,0.04)' }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">{children}</View>
        {right}
      </View>
    </Pressable>
  )

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100 pt-6 pb-4 px-4 border-b border-transparent">
        <View className="relative flex-row items-center mb-6">
            <BackButton />
            <View pointerEvents="none" className="absolute left-0 right-0 items-center">
            <Text className="font-bold text-3xl text-black">Settings</Text>
            </View>
            <View className="w-10" />
            </View>
        <View className="flex-1 p-4">
        {/* Profile card (no subscription text) */}
        <View className="bg-white rounded-xl p-4 mb-4">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Image source={require('assets/icons/sample_profile_1.png')} style={{width: 40, height: 40}} className="rounded-full bg-gray-300 mr-3" />
                    <View>
                        <Text className="font-medium">{fullName}</Text>
                        <Text className="text-xs text-gray-500">{email}</Text>
                    </View>
                </View>
                <Pressable onPress={() => router.push('/profile')} className="px-3 py-1 rounded-md bg-gray-100">
                    <Text className="text-sm">Edit</Text>
                </Pressable>
            </View>
        </View>

        {/* Preferences - keep Language and Theme only */}
        {/*         <Text className="text-xs text-gray-500 mb-3">PREFERENCES</Text>
        <Row onPress={() => }}>
            <View className='flex-row items-center justify-between w-full'>
                <View>
                    <Text className="font-medium">Language</Text>
                    <Text className="text-xs text-gray-500">English (USA)</Text>
                </View>
                <ChevronRight size={18} color="#999" />
            </View>

        </Row>*/}


        {/* <Row>
            <View className='flex-row items-center justify-between w-full'>
                <Text className="font-medium">Theme</Text>
                <View>
                    <View className='flex-row gap-2'
                    >
                        <Pressable
                            onPress={() => setDarkMode(true)}
                            className='px-5 py-1 rounded-md border border-gray-200 bg-gray-100'
                        >
                            <Text >Dark</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setDarkMode(false)}
                            className='px-5 py-1 rounded-md border border-gray-200 bg-gray-100'
                        >
                            <Text >Light</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Row> */}

        {/* Support / About */}
        <Text className="text-xs text-gray-500 mb-3 mt-4">SUPPORT</Text>
        <Row onPress={() => router.push('/support')}>
            <View className='flex-row items-center justify-between w-full'>
                <View>
                    <Text className="font-medium">Help Center</Text>
                </View>
                <ChevronRight size={18} color="#999" />
            </View>
        </Row>

        <Row onPress={() => router.push('/privacy-policy')}>
            <View className='flex-row items-center justify-between w-full'>
                <View>
                    <Text className="font-medium">Privacy Policy</Text>
                </View>
                <ChevronRight size={18} color="#999" />
            </View>
        </Row>

        {/* Danger zone */}
                <View className="mt-6">
                    <Pressable onPress={() => setShowDeleteModal(true)} android_ripple={{ color: 'rgba(0,0,0,0.04)' }}>
                        <View className="bg-white rounded-xl p-4">
                            <Text className="text-red-600 text-lg font-semibold">Delete account and data</Text>
                            <Text className="text-xs text-gray-500 mt-1">Deletes all the data permanently.</Text>
                        </View>
                    </Pressable>
                </View>

                <DeleteAccountModal
                    visible={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                />
      </View>
    </SafeAreaView>
  )
}
