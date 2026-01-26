import React from 'react'
import { View } from 'react-native'
import { styles } from './TabHeader'

type Props = {
  Icon: any
  color?: string
  focused?: boolean
}

const TabIconWrapper: React.FC<Props> = ({ Icon, color, focused }) => {
  return (
    <View style={styles.iconWrapper}>
      {focused && <View style={styles.bubbleIndicator} />}
      <Icon size={28} color={color} />
    </View>
  )
}

export default TabIconWrapper
