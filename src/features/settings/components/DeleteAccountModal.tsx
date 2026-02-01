import React, { useState } from 'react'
import { Modal, View, Text, Pressable, TextInput, Alert } from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
  onDelete: (password: string) => Promise<void>
}

export default function DeleteAccountModal({ visible, onClose, onDelete }: Props) {
  const [password, setPassword] = useState('')
  const [confirmPhrase, setConfirmPhrase] = useState('')
  const REQUIRED_PHRASE = 'DELETE ACCOUNT'
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (confirmPhrase !== REQUIRED_PHRASE) return
    setLoading(true)
    try {
      await onDelete(password)
      Alert.alert('Account deleted', 'Your account deletion request was processed.')
      setPassword('')
      setConfirmPhrase('')
      onClose()
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

          {/* Uncomment these buttons when implementing data export/request backend */}
          {/*
          <Pressable style={{ backgroundColor: '#f3f4f6', padding: 10, borderRadius: 8, marginBottom: 8 }}>
            <Text>Download my data</Text>
          </Pressable>

          <Pressable style={{ backgroundColor: '#f3f4f6', padding: 10, borderRadius: 8, marginBottom: 8 }}>
            <Text>Request data copy</Text>
          </Pressable>
          */}

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
