import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, ScrollView, ImageBackground } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { resetPassword } from 'api/auth'
import LogoTitleVertical from 'assets/icons/LogoTitleVertical'
import { useToast } from '../../../contexts/ToastContext'

export default function ChangePasswordScreen() {
  const { show } = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { email } = useLocalSearchParams<{ email?: string }>()

  function validate() {
    if (!email) {
      show('danger', 'Missing email', 'Email not found. Please restart the reset flow.')
      return false
    }
    if (!newPassword || !confirmPassword) {
      show('warning', 'Missing fields', 'Please fill in all fields.')
      return false
    }
    if (newPassword.length < 8) {
      show('warning', 'Weak password', 'New password must be at least 8 characters.')
      return false
    }
    if (newPassword !== confirmPassword) {
      show('warning', 'Mismatch', 'New password and confirmation do not match.')
      return false
    }
    return true
  }

  async function handleChange() {
    if (!validate()) return
    setLoading(true)
    try {
      await resetPassword({ email: String(email), new_password: newPassword })
      show('success', 'Success', 'Your password has been changed. Please sign in.')
      router.replace('/sign-in')
    } catch (err: any) {
      console.error(err)
      show('danger', 'Error', err?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, position: 'relative' }}> 
      <ImageBackground source={require('assets/img/topographic_background.jpg')} resizeMode="cover" blurRadius={8} className="flex-1 ">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-center py-16 px-8">
          <LogoTitleVertical width={180} height={180} className="mb-6" />

          <Text className="text-2xl font-bold text-black mb-2">Change Password</Text>
          <Text className="text-sm text-gray-600 mb-6 text-center">Enter your new password and create a secure password.</Text>

          <View className="w-full max-w-md bg-white p-5 rounded-md shadow-md">
            <Text className="text-sm font-medium text-gray-700 mb-1">New password</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New password"
              secureTextEntry
              className="border border-gray-300 rounded px-3 py-2 mb-3"
            />

            <Text className="text-sm font-medium text-gray-700 mb-1">Confirm new password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
              className="border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <Pressable onPress={handleChange} disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || !email}
            >
                  {({ pressed }) => (
                    <View
                      className="py-2 rounded-md items-center justify-center"
                      style={{
                        backgroundColor: pressed ? '#991b1b' : (loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || !email ? '#d1d5db' : '#dc2626'),
                        opacity: loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || !email ? 0.6 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      }}
                    >
                      <Text className="text-white font-semibold">{loading ? 'Updating...' : 'Change password'}</Text>
                    </View>
                  )}
            </Pressable>

            <View className="mt-4 items-center">
              <Text className="text-sm text-gray-600 text-center">
                Remembered your password?{' '}
                <Text
                  className="text-red-600 font-bold"
                  onPress={() => router.push('/sign-in')}
                  accessibilityRole="link"
                >
                  Sign in
                </Text>
                .
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      </ImageBackground>
    </View>
  )
}
