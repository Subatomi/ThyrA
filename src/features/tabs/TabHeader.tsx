import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Menu } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const CustomHeader: React.FC = () => {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <View style={styles.logoGroup}>
          <View style={styles.logoCircle}>
            <View style={styles.logoIcon} />
          </View>
          <Text style={styles.headerTitle}>ThyrA</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Menu color="#333" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logoGroup: { flexDirection: 'row', alignItems: 'center' },
  logoCircle: {
    width: 32,
    height: 32,
    backgroundColor: '#E31837',
    borderRadius: 16,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: { width: 14, height: 14, backgroundColor: '#fff', borderRadius: 2 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#E31837' },
  menuButton: {
    backgroundColor: '#F5F5F5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
