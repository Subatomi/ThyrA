import { Text, View, Image, Pressable } from 'react-native';
import { router } from 'expo-router';

const Index = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image
        source={require('../assets/img/Group 110.png')}
        className="w-52 h-52"
        resizeMode="contain"
      />

      <Text className="mt-2 mb-8 text-gray-600">
        Thyroid Adequacy testing app
      </Text>

      {/* Button styling with ThyrA Red */}
      <Pressable 
        onPress={() => router.push('/onboarding')}
        className="bg-[#E31837] px-10 py-4 rounded-lg active:bg-red-800"
      >
        <Text className="text-white font-bold text-base">
          Get Started
        </Text>
      </Pressable>
    </View>
  );
};

export default Index;