import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Menu } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import LogoTitle from 'assets/icons/LogoTitle'
import { useMenu } from './MenuContext'

export const CustomHeader: React.FC = () => {
  const insets = useSafeAreaInsets()
  const { openMenu } = useMenu()
  return (
    <View className="bg-white border-b border-gray-100">
      <View className="flex-row items-center justify-between px-5 h-[60px]">
        <View className="flex-row items-center">
          <LogoTitle />
        </View>
        <TouchableOpacity onPress={openMenu} className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center">
          <Menu color="#333" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 48,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  bubbleIndicator: {
    position: 'absolute',
    bottom: -45,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    zIndex: -1,
  },
})

export default CustomHeader
