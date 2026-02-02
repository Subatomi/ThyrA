import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function useAuth() {
  const router = useRouter()

  async function logout() {
    try {
      // clear auth tokens and any related stored data
      await AsyncStorage.removeItem('access_token')
      // navigate to the root / sign-in page
      router.replace('/')
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  return { logout }
}
