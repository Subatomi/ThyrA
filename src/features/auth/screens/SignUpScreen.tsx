import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, Image, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import LogoTitleVertical from 'assets/icons/LogoTitleVertical'
import { signup } from 'api/auth'
import { Alert } from "react-native";

const SignUpScreen: React.FC = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const router = useRouter()

	//Handle SignUp function
	const handleSignup = async () => {
		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			Alert.alert("Missing fields", "Please fill in all fields.");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Password mismatch", "Passwords do not match.");
			return;
		}

		try {
			setLoading(true);

			const response = await signup({
				first_name: firstName,
				last_name: lastName,
				email,
				password,
			});

			console.log("Signup success:", response);

			//navigate after successful signup
			router.replace("/sign-in");
		} catch (error: any) {
			Alert.alert("Signup failed", error.message);
		} finally {
			setLoading(false);
		}
	};


	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-100">
			<View className="flex-1 items-center justify-center py-16 px-8">
				<LogoTitleVertical width={200} height={200} className="mb-8" />
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

					<Text className="text-sm font-medium text-gray-700 mb-1">First Name</Text>
					<TextInput
						value={firstName}
						onChangeText={setFirstName}
						placeholder="Enter your first name"
						className="border border-gray-300 rounded px-3 py-2 mb-3"
					/>

					<Text className="text-sm font-medium text-gray-700 mb-1">Last Name</Text>
					<TextInput
						value={lastName}
						onChangeText={setLastName}
						placeholder="Enter your last name"
						className="border border-gray-300 rounded px-3 py-2 mb-3"
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
						onPress={handleSignup}
						disabled={loading}
						accessibilityRole="button"
						className={`rounded py-3 items-center ${
  							loading ? "bg-red-400" : "bg-red-600"
						}`}
						style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
					>
						<Text className="text-white font-bold">
							{loading ? "Creating account..." : "Confirm"}
						</Text>
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
