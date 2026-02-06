import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TextInput, Pressable, ScrollView, ImageBackground, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import LogoTitleVertical from 'assets/icons/LogoTitleVertical'
import { resetLink } from 'api/auth'
import OtpInput from '@/components/OtpInput'

type Props = {}

const ForgotPasswordScreen: React.FC<Props> = () => {
  const [email, setEmail] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [cooldownSeconds, setCooldownSeconds] = useState<number | null>(null)
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null)
  const countdownRef = useRef<number | null>(null)
  const router = useRouter()

  async function handleSubmit() {
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const res = await resetLink({ email })

      const msg = typeof res?.message === 'string' ? res.message : ''
      const lowerMsg = msg.toLowerCase()

      // Detect cooldown in seconds: "Please try again in N second(s)."
      const secondsMatch = msg.match(/please\s+try\s+again\s+in\s+(\d+)\s+second/i)
      // Detect lockout in minutes: "Too many attempts. Please try again in M minute(s)."
      const minutesMatch = msg.match(/please\s+try\s+again\s+in\s+(\d+)\s+minute/i)

      if (secondsMatch) {
        const secs = parseInt(secondsMatch[1], 10)
        if (!Number.isNaN(secs) && secs > 0) {
          setCooldownSeconds(secs)
          setError(`Please try again in ${secs} second(s).`)
          // Start countdown
          if (countdownRef.current) clearInterval(countdownRef.current)
          countdownRef.current = setInterval(() => {
            setCooldownSeconds(prev => {
              if (prev === null) return null
              const next = prev - 1
              if (next <= 0) {
                if (countdownRef.current !== null) {
                  clearInterval(countdownRef.current)
                }
                countdownRef.current = null
                // Set to 0 so the effect clears the error message
                return 0
              }
              return next
            })
          }, 1000)
          return
        }
      }

      if (minutesMatch) {
        const mins = parseInt(minutesMatch[1], 10)
        if (!Number.isNaN(mins) && mins > 0) {
          const until = new Date(Date.now() + mins * 60_000)
          setLockoutUntil(until)
          const timeStr = until.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          setError(`Too many attempts. Try again at ${timeStr}.`)
          return
        }
      }

      // Generic rate-limit phrasing fallback
      const isRateLimited =
        lowerMsg.startsWith('too many attempts') ||
        lowerMsg.includes('please try again in') ||
        lowerMsg.includes('cooldown')
      if (isRateLimited) {
        setError(msg || 'Please try again later.')
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (cooldownSeconds && cooldownSeconds > 0) {
      setError(`Please try again in ${cooldownSeconds} second(s).`)
    } else if (cooldownSeconds === 0) {
      setError('')
    }
  }, [cooldownSeconds])

  useEffect(() => {
    return () => {
      if (countdownRef.current !== null) clearInterval(countdownRef.current)
    }
  }, [])

  return (
    <View style={{ flex: 1, position: 'relative' }}> 
      <ImageBackground source={require('assets/img/topographic_background.jpg')} resizeMode="cover" blurRadius={8} className="flex-1 ">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-center py-16 px-8">
          <LogoTitleVertical width={180} height={180} className="mb-6" />

          {submitted ? (
            <OtpInput email={email} onComplete={() => router.push({ pathname: '/change-password', params: { email } })} onGoBack={() => setSubmitted(false)} />
          ) : (
            <View className='items-center justify-center'>
              <Text className="text-2xl font-bold text-black mb-2">Forgot Password</Text>
              <Text className="text-sm text-gray-600 mb-6 text-center">Enter the email address associated with your account and we will send password reset instructions.</Text>

              <View className="w-full  bg-white p-5 rounded-md shadow-md">
                <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="border border-gray-300 rounded px-3 py-2 mb-3"
                />
            
                {!!error && (
                  <Text className="text-red-600 mb-2 text-center">{error}</Text>
                )}

                <Pressable
                  onPress={handleSubmit}
                  disabled={loading || !email || (cooldownSeconds !== null && cooldownSeconds > 0)}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: loading || !email || (cooldownSeconds !== null && cooldownSeconds > 0) }}
                >
                  {({ pressed }) => (
                    <View
                      className="rounded py-3 items-center"
                      style={{
                        backgroundColor: pressed
                          ? '#991b1b'
                          : (loading || !email || (cooldownSeconds !== null && cooldownSeconds > 0) ? '#d1d5db' : '#dc2626'),
                        opacity: (loading || !email || (cooldownSeconds !== null && cooldownSeconds > 0)) ? 0.6 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      }}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text className="text-white font-bold">{(cooldownSeconds !== null && cooldownSeconds > 0) ? `Wait ${cooldownSeconds}s` : 'Send reset link'}</Text>
                      )}
                    </View>
                  )}
                </Pressable>

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
          )}
          
        </View>
      </ScrollView>
      </ImageBackground>
    </View>
  )
}

export default ForgotPasswordScreen
