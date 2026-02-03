import React, { useRef, useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { verifyOtp } from 'api/auth'

type Props = {
  email?: string
  length?: number
  onComplete?: (code: string) => void
  onGoBack?: () => void
}

const screenWidth = Dimensions.get('window').width
const boxSize = (screenWidth - 80) / 6 - 8 // 80 = padding, 8 = gap spacing


export default function OtpInput({ email = '', length = 6, onComplete, onGoBack }: Props) {
  const [digits, setDigits] = useState<string[]>(Array.from({ length }).map(() => ''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const inputs = useRef<Array<TextInput | null>>([])
  const router = useRouter()

  const handleConfirm = async () => {
    const val = digits.join('')
    if (val.length === length && !digits.includes('')) {
      setLoading(true)
      setError('')
      try {
        await verifyOtp(email, val)
        onComplete?.(val)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid or expired code')
      } finally {
        setLoading(false)
      }
    }
  }

  const isComplete = digits.length === length && !digits.includes('')

  const handleChange = (text: string, idx: number) => {
    if (text === '') {
      const next = [...digits]
      next[idx] = ''
      setDigits(next)
      return
    }
    const ch = text.slice(-1)
    const next = [...digits]
    next[idx] = ch
    setDigits(next)
    const nextInput = inputs.current[idx + 1]
    if (nextInput) nextInput.focus()
  }

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, idx: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (digits[idx] === '') {
        const prev = inputs.current[idx - 1]
        if (prev) prev.focus()
      } else {
        const next = [...digits]
        next[idx] = ''
        setDigits(next)
      }
    }
  }

  return (
         <View className='items-center justify-center'>

            <Text className="text-2xl font-bold text-black mb-2">Enter the 6-digit code</Text>
            <Text className="text-sm text-gray-600 mb-6 text-center">We sent a code to the email address associated with your account. Please enter it below to reset your password.</Text>

            <View className="w-full bg-white p-5 rounded-md shadow-md">
                <View className='flex-row items-center justify-start gap-2 mt-2 mb-2'>
                    <Pressable onPress={onGoBack}>
                      <ArrowLeft color="red" size={24} />
                    </Pressable>
                    <Text className="text-sm text-gray-600">We sent a code to  <Text className="text-sm text-gray-600 font-bold">{email}</Text></Text>
                    
                </View>

                    <View style={styles.row}>
                        {digits.map((d, i) => (
                        <TextInput
                            key={i}
                            ref={(ref) => { inputs.current[i] = ref }}
                            value={d}
                            onChangeText={text => handleChange(text, i)}
                            onKeyPress={e => handleKeyPress(e, i)}
                            keyboardType="number-pad"
                            maxLength={1}
                            style={styles.box}
                            textAlign="center"
                            selectionColor="#000"
                            importantForAutofill="no"
                        />
                        ))}
                    </View>
                        
                      <View className='justify-center'>
                          <Pressable onPress={handleConfirm} disabled={!isComplete || loading}>
                            {({ pressed }) => (
                              <View
                                className="w-full rounded py-3 items-center mt-6"
                                style={{
                                  backgroundColor: pressed
                                    ? '#991b1b'
                                    : (isComplete && !loading ? '#dc2626' : '#d1d5db'),
                                  opacity: !isComplete || loading ? 0.6 : 1,
                                  transform: [{ scale: pressed ? 0.98 : 1 }],
                                }}
                              >
                                <Text className="text-white font-bold">{loading ? 'Verifying...' : 'Confirm'}</Text>
                              </View>
                            )}
                          </Pressable>
                        {error && <Text className="text-red-600 text-sm mt-3 text-center">{error}</Text>}
                      </View>


                    <Text  className="text-sm text-justify text-gray-600 mt-4">If you don't see the email in your inbox, check your spam folder and make sure you have an existing Thyra account.</Text>
                <View className="mt-6 items-center">
                    <Text className="text-sm text-gray-600 text-center">
                    If you remembered your password or don't have an account?{' '}
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
          
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    gap: 10,
  } as any,
  box: {
    width: boxSize,
    height: boxSize,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    fontSize: 24,
    fontWeight: '700',
  },
  footer: {
    marginTop: 12,
    fontSize: 12,
    color: '#6B7280',
  },
})
   