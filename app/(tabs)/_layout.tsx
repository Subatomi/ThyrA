import { Tabs } from 'expo-router';
import { Home, ImagePlus, Folder, Menu } from 'lucide-react-native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabIconWrapper = ({ Icon, color, focused }: any) => {
  return (
    <View style={styles.iconWrapper}>
      {/* The white circle is rendered behind the icon */}
      {focused && <View style={styles.bubbleIndicator} />}
      <Icon size={28} color={color} />
    </View>
  );
};

const CustomHeader = () => {
  const insets = useSafeAreaInsets();
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
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

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
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
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
});