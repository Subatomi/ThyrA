import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from 'expo-router'

// Default fallback values
const DEFAULT_BASE_URL = "http://192.168.254.120:8000";

// Use environment variable if available, otherwise use default
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;

// export async function apiRequest(endpoint, options = {}) {
//   // Get token from AsyncStorage (or SecureStore)
//   const token = await AsyncStorage.getItem('access_token');
//   console.log(token)

//   const response = await fetch(`${BASE_URL}${endpoint}`, {
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...options.headers,
//     },
//     ...options,
//   });


//   if (response.status === 204) {
//     return { detail: "Successfully deleted" };
//   }

//   const data = await response.json();

//   if (!response.ok) {
//     let message = "Something went wrong";

//     if (data.detail) {
//       if (typeof data.detail === "string") {
//         message = data.detail;
//       } else if (Array.isArray(data.detail) && data.detail.length > 0) {
//       }
//     }

//     throw new Error(message);
//   }

//   return data;
// }



export async function apiRequest(endpoint, options = {}) {
  const token = await AsyncStorage.getItem("access_token");
  // console.log(token)
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.body instanceof FormData
      ? {} //DO NOT set Content-Type
      : { "Content-Type": "application/json" }),
  "Connection": "close", 
    ...options.headers,
  };
  try{
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return { detail: "Successfully deleted" };
    }

    if (response.status === 401) {
      try {
        await AsyncStorage.removeItem('access_token')
      } catch (e) {
        // ignore
      }
      throw new Error('Unauthorized')
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Check");
    }

    return data;

    
  }catch(err){
    console.warn(`API error [${endpoint}]:`, err.message);
    throw err; 
  }

}






