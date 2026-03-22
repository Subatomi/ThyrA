import { createContext, useContext, useEffect } from 'react'
import { DeviceEventEmitter } from 'react-native'

export function useRefreshListener(event: string, callback: (payload?: any) => void) {
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(event, callback)
    return () => sub.remove()
  }, [event])
}