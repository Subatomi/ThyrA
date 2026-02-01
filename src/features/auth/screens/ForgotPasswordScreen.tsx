import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, ScrollView, ImageBackground } from 'react-native'
import { useRouter } from 'expo-router'
import LogoTitleVertical from 'assets/icons/LogoTitleVertical'

type Props = {}

const ForgotPasswordScreen: React.FC<Props> = () => {
  const [email, setEmail] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  function handleSubmit() {
    // UI-only for now: simulate submit
    setSubmitted(true)
  }

  return (
    <View style={{ flex: 1, position: 'relative' }}> 
      <ImageBackground source={require('assets/img/topographic_background.jpg')} resizeMode="cover" blurRadius={8} className="flex-1 ">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-center py-16 px-8">
          <LogoTitleVertical width={180} height={180} className="mb-6" />

          <Text className="text-2xl font-bold text-black mb-2">Forgot Password</Text>
          <Text className="text-sm text-gray-600 mb-6 text-center">Enter the email address associated with your account and we will send password reset instructions.</Text>

          <View className="w-full max-w-md bg-white p-5 rounded-md shadow-md">
            <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded px-3 py-2 mb-3"
            />

            <Pressable onPress={handleSubmit} className={`rounded py-3 items-center ${submitted ? 'bg-gray-300' : 'bg-red-600'}`}>
              <Text className="text-white font-bold">{submitted ? 'Link Sent' : 'Send reset link'}</Text>
            </Pressable>

            {submitted && (
              <Text className="text-sm text-gray-600 mt-4">If that email exists, we will send password reset instructions shortly.</Text>
            )}

            <View className="mt-4 items-center">
              <Text className="text-sm text-gray-600 text-center">
                Remembered your password or don't have an account?{' '}
                <Text
                  className="text-red-600 font-bold"
                  onPress={() => router.push('/sign-in')}
                  accessibilityRole="link"
                >
                  Sign in
                </Text>
                {' '}or{' '}
                <Text
                  className="text-red-600 font-bold"
                  onPress={() => router.push('/sign-up')}
                  accessibilityRole="link"
                >
                  sign up
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

export default ForgotPasswordScreen
