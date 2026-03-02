import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, Image, ScrollView, ImageBackground } from 'react-native'
import { useRouter } from 'expo-router'
import LogoTitleVertical from 'assets/icons/LogoTitleVertical'
import { login } from 'api/auth'
import { refreshProfileFromServer } from '@/features/profile/services/refreshProfile'
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'

const SignInScreen: React.FC = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false);
	const router = useRouter()


	//Handle log in function
	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert("Missing fields", "Please fill in all fields.");
			return;
		}
		try {
			setLoading(true);

			const response = await login({
				email,
				password,
			});

			const token = response?.access_token;
			if (!token || typeof token !== 'string') {
				throw new Error('Login did not return access_token');
			}
			await AsyncStorage.setItem('access_token', token);
			// Refresh profile cache before navigating
			await refreshProfileFromServer();
			
			router.replace("/home");
		} catch (error: any) {
			console.log(error)
			Alert.alert("Log In failed", error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<ImageBackground source={require('assets/img/topographic_background.jpg')} resizeMode="cover" blurRadius={8} className="flex-1 ">
					<View className="flex-1 items-center justify-center py-16 px-8">
					<LogoTitleVertical width={200} height={200} className="mb-8" />
					<Text className="text-2xl font-bold text-black mb-1">Login to your account</Text>
					<Text className="text-sm text-gray-600 mb-6">Enter your email and password</Text>

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
							placeholder="Enter your password"
							secureTextEntry
							className="border border-gray-300 rounded px-3 py-2 mb-4"
						/>

						<View className="w-full flex-row justify-center mb-4">
							<Pressable onPress={() => router.push('/forgot-password')}>
								<Text className="text-sm text-red-600">Forgot password?</Text>
							</Pressable>
						</View>

						<Pressable
							onPress={handleLogin}
							disabled={loading}
							accessibilityRole="button"
							className={`rounded py-3 items-center ${loading ? "bg-red-400" : "bg-red-600"
								}`}
							style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
						>
							<Text className="text-white font-bold">
								{loading ? "Logging In..." : "Log In"}
							</Text>
						</Pressable>
					</View>

					<View className="flex-row items-center justify-center mt-4">
						<Text className="text-sm text-center h-full text-gray-600">Don't have an account? </Text>
						<Pressable onPress={() => router.push('/sign-up')}>
							<Text className="text-sm text-red-600 font-extrabold">Sign up</Text>
						</Pressable>
					</View>
				</View>
			</ImageBackground>
		</ScrollView>
	)
}

export default SignInScreen
