import { Tabs } from 'expo-router'
import { Home, ImagePlus, Folder } from 'lucide-react-native'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CustomHeader from '../../src/features/tabs/TabHeader'
import TabIconWrapper from '../../src/features/tabs/TabIconWrapper'

export default function TabLayout() {
  const insets = useSafeAreaInsets()

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
          tabBarStyle: {
            backgroundColor: '#E31837',
            borderTopWidth: 0,
            paddingTop: 12,
            paddingHorizontal: '18%',
            flexDirection: 'row',
            justifyContent: 'center',
            elevation: 1,
          },
        }}
        backBehavior="history"
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIconWrapper Icon={Home} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="analysis"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIconWrapper Icon={ImagePlus} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="folder"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIconWrapper Icon={Folder} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="report-folder"
          options={{
            href: null,
          }}
        />

          
        <Tabs.Screen
          name="report-analysis"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="result"
          options={{
            href: null,
          }}
        />
        
      </Tabs>
    </View>
  )
}