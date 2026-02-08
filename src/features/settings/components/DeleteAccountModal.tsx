import React, { useState } from 'react'
import { Modal, View, Text, Pressable, TextInput, Alert } from 'react-native'
import { deleteAccount } from 'api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, useNavigation } from 'expo-router'
import { CommonActions } from '@react-navigation/native'

type Props = {
  visible: boolean
  onClose: () => void
}

export default function DeleteAccountModal({ visible, onClose }: Props) {
  const router = useRouter()
  const navigation = useNavigation()
  const [password, setPassword] = useState('')
  const [confirmPhrase, setConfirmPhrase] = useState('')
  const REQUIRED_PHRASE = 'DELETE ACCOUNT'
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (confirmPhrase !== REQUIRED_PHRASE) return
    setLoading(true)
    try {
      await deleteAccount({ password })
      Alert.alert('Account deleted', 'Your account deletion request was processed.')
      setPassword('')
      setConfirmPhrase('')
      onClose()
      // Clear auth token(s) and navigate to sign-in
      try {
        await AsyncStorage.removeItem('access_token')
      } catch {}
      // Reset navigation stack so back cannot return to previous screens
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: '(auth)',
              state: {
                index: 0,
                routes: [{ name: 'sign-in' }],
              },
            },
          ],
        })
      )
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Deletion failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 justify-center p-5" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
        <View className="bg-white rounded-lg p-4">
          <Text className="text-lg font-bold mb-2">Delete account</Text>
          <Text className="text-gray-700 mb-3">This will permanently delete your account and all associated data. This action cannot be undone.</Text>

          <Text className="font-semibold mb-2">Re-enter your password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            className="border border-gray-200 p-2 rounded-md mb-3"
          />

          <Text className="font-semibold mb-2">Type "<Text className='text-red-600'>DELETE ACCOUNT</Text>" to confirm</Text>
          <TextInput
            value={confirmPhrase}
            onChangeText={setConfirmPhrase}
            placeholder="Type DELETE ACCOUNT"
            className="border border-gray-200 p-2 rounded-md mb-3"
            autoCapitalize="characters"
          />

          <View className="flex-row justify-end">
            <Pressable onPress={() => { setPassword(''); setConfirmPhrase(''); onClose() }} className="px-3 py-2">
              <Text className="text-gray-700">Cancel</Text>
            </Pressable>

            {confirmPhrase === REQUIRED_PHRASE ? (
              <Pressable onPress={handleDelete} className="bg-red-600 px-3 py-2 rounded-md ml-2">
                <Text className="text-white font-semibold">{loading ? 'Deleting...' : 'Delete account'}</Text>
              </Pressable>
            ) : (
              <View className="px-3 py-2 rounded-md opacity-50 ml-2">
                <Text className="text-gray-400">Type the phrase to delete</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}
