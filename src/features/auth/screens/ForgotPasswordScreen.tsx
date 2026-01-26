import React, { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'

type Props = {}

const ForgotPasswordScreen: React.FC<Props> = () => {
  const [email, setEmail] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    // UI-only for now: simulate submit
    setSubmitted(true)
  }

  return (
    <View className="flex-1 bg-white px-6 pt-20">
      <Text className="text-2xl font-bold text-gray-800 mb-4">Forgot Password</Text>

      <Text className="text-gray-600 mb-6">Enter the email address associated with your account and we&apos;ll send password reset instructions.</Text>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-300 rounded-md px-3 py-2"
        />
      </View>

      <Pressable onPress={handleSubmit} className="bg-emerald-600 rounded-md py-3 items-center">
        <Text className="text-white font-semibold">Send reset link</Text>
      </Pressable>

      {submitted && (
        <Text className="text-sm text-gray-600 mt-4">If that email exists, we will send password reset instructions shortly.</Text>
      )}
    </View>
  )
}

export default ForgotPasswordScreen
