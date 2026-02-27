import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { verifyOtp } from 'api/auth'
import OtpBoxes from './OtpBoxes'

type Props = {
  email?: string
  length?: number
  onComplete?: (code: string) => void
  onGoBack?: () => void
}

export default function OtpInput({ email = '', length = 6, onComplete, onGoBack }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const handleComplete = async (code: string) => {
    setLoading(true)
    setError('')
    try {
      await verifyOtp({ email, code })
      onComplete?.(code)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='items-center justify-center'>
      <Text className="text-2xl font-bold text-black mb-2">Enter the 6-digit code</Text>
      <Text className="text-sm text-gray-600 mb-6 text-center">
        We sent a code to the email address associated with your account. Please enter it below to reset your password.
      </Text>

      <View className="w-full bg-white p-5 rounded-md shadow-md">
        <View className='flex-row items-center justify-start gap-2 mt-2 mb-2'>
          <Pressable onPress={onGoBack}>
            <ArrowLeft color="red" size={24} />
          </Pressable>
          <Text className="text-sm text-gray-600">
            We sent a code to <Text className="font-bold">{email}</Text>
          </Text>
        </View>

        <OtpBoxes length={length} onComplete={handleComplete} />

        {loading && (
          <Text className="text-gray-500 text-sm text-center mt-2">Verifying...</Text>
        )}
        {error && (
          <Text className="text-red-600 text-sm mt-3 text-center">{error}</Text>
        )}

        <Text className="text-sm text-justify text-gray-600 mt-4">
          If you don't see the email in your inbox, check your spam folder and make sure you have an existing Thyra account.
        </Text>

        <View className="mt-6 items-center">
          <Text className="text-sm text-gray-600 text-center">
            If you remembered your password or don't have an account?{' '}
            <Text className="text-red-600 font-bold" onPress={() => router.push('/sign-in')} accessibilityRole="link">
              Sign in
            </Text>
            {' '}or{' '}
            <Text className="text-red-600 font-bold" onPress={() => router.push('/sign-up')} accessibilityRole="link">
              sign up
            </Text>
            .
          </Text>
        </View>
      </View>
    </View>
  )
}