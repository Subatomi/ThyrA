import React from 'react'
import { Modal, View, Text, Pressable } from 'react-native'
import { TriangleAlertIcon } from 'lucide-react-native'

type Props = {
  visible: boolean
  reportName?: string
  onClose: () => void
  onConfirm: () => void
}

const DeleteReportModal: React.FC<Props> = ({ visible, reportName = '', onClose, onConfirm }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/40 items-center justify-center">
        <View className="w-11/12 bg-white rounded-xl p-6">
            <View className='items-center'>
                <Text className="text-lg font-semibold mb-3">Delete report</Text>
                <TriangleAlertIcon size={80} color="#ef4444" className="mb-2" />
            </View>
            <Text className="mb-4 text-center">Are you sure you want to delete  <Text className="font-bold text-red-600">{reportName ?? 'this report'}</Text>? This action cannot be undone.</Text>

            <View className="flex-row justify-end">
            <Pressable onPress={onClose} className="px-4 py-2 mr-2">
              <Text className="text-gray-700">Cancel</Text>
            </Pressable>
            <Pressable onPress={onConfirm} className="px-4 py-2 bg-red-600 rounded-md">
              <Text className="text-white">Delete</Text>
            </Pressable>
            </View>
        </View>
      </View>
    </Modal>
  )
}

export default DeleteReportModal
