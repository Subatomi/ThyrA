import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, Image, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'

const SignUpScreen: React.FC = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const router = useRouter()

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-100">
			<View className="flex-1 items-center justify-center py-16 px-6">

                <Image
                    source={require('../../../../assets/img/Group 110.png')}
                    className="w-52 h-52"
                    resizeMode="contain"
                />

				<Text className="text-2xl font-bold text-black mb-1">Create a free account</Text>
				<Text className="text-sm text-gray-600 mb-6">Provide your email and choose a password</Text>

				<View className="w-full max-w-md bg-white p-5 rounded-md shadow-md">
					<Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
					<TextInput
						value={email}
						onChangeText={setEmail}
						placeholder="Enter your email"
						className="border border-gray-300 rounded px-3 py-2 mb-3"
						keyboardType="email-address"
						autoCapitalize="none"
					/>

					<Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
					<TextInput
						value={password}
						onChangeText={setPassword}
						placeholder="Choose a password"
						secureTextEntry
						className="border border-gray-300 rounded px-3 py-2 mb-3"
					/>

					<Text className="text-sm font-medium text-gray-700 mb-1">Confirm Password</Text>
					<TextInput
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						placeholder="Confirm your password"
						secureTextEntry
						className="border border-gray-300 rounded px-3 py-2 mb-4"
					/>

					<Pressable
						onPress={() => router.push('/home')}
						accessibilityRole="button"
						className="bg-red-600 rounded py-3 items-center"
						style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
					>
						<Text className="text-white font-bold">Confirm</Text>
					</Pressable>
				</View>

				<View className="flex-row justify-center mt-4">
					<Text className="text-sm text-gray-600">Already have an account? </Text>
					<Pressable onPress={() => router.push('/sign-in')}>
						<Text className="text-red-600 font-bold">Log in</Text>
					</Pressable>
				</View>
			</View>
		</ScrollView>
	)
}

export default SignUpScreen
