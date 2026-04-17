import React from 'react';
import { View, Text, Modal, Pressable, Platform, Linking } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import * as IntentLauncher from 'expo-intent-launcher';

interface PermissionAlertModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PermissionAlertModal({ visible, onClose }: PermissionAlertModalProps) {
  const handleGoToSettings = () => {
    onClose();
    if (Platform.OS === 'android') {
      IntentLauncher.startActivityAsync('android.settings.APPLICATION_DETAILS_SETTINGS', {
        data: 'package:com.thyra.app',
      });
    } else {
      Linking.openURL('app-settings:');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 p-4">
        <View className="bg-white rounded-2xl w-full max-w-sm p-6">
          {/* Icon */}
          <View className="items-center mb-4">
            <View className="w-12 h-12 rounded-full bg-orange-100 items-center justify-center mb-3">
              <AlertTriangle size={24} color="#EA580C" />
            </View>
            <Text className="text-lg font-bold text-gray-900">Permission Required</Text>
          </View>

          {/* Message */}
          <Text className="text-gray-600 text-center mb-6">
            Enable photo access in Settings to save your analysis results to the gallery.
          </Text>

          {/* Buttons */}
          <View className="gap-3">
            <Pressable onPress={handleGoToSettings}>
              <View style={{ elevation: 3 }} className="bg-red-500 py-3 rounded-lg items-center justify-center">
                <Text className="text-white font-bold text-base">Go to Settings</Text>
              </View>
            </Pressable>
            <Pressable onPress={onClose}>
              <View className="py-3 rounded-lg items-center justify-center border border-gray-300">
                <Text className="text-gray-700 font-medium text-base">Cancel</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
