import React from 'react'
import { View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Slot } from 'expo-router'

export default function AuthLayout() {
	return (
		<SafeAreaView className="flex-1 bg-gray-100">
			<View className="flex-1 justify-center ">
				<Slot />
			</View>
		</SafeAreaView>
	)
}
