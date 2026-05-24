import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageSourcePropType,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import LogoTitle from 'assets/icons/LogoTitle';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

const DATA: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Assessment Tool',
    description: 'Instantly upload a cytology slide image for automated thyrocyte adequacy detection',
    image: require('../../../../assets/img/assessment-tool-graphic.png'),
  },
  {
    id: '2',
    title: 'Case Management',
    description: 'Access a centralized library of all analyzed slides',
    image: require('../../../../assets/img/case-management-graphic.png'),
  },
  {
    id: '3',
    title: 'Analysis Tools',
    description: 'View visual summaries and summary of adequacy rate of the uploaded cytology slide',
    image: require('../../../../assets/img/analysis-tool-graphic.png'),
  },
];

const OnBoardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // After completing onboarding, mark as shown and send user to the home page
      (async () => {
        try {
          await AsyncStorage.setItem('onboarding_shown', '1');
        } catch (e) {
          // ignore storage errors
        }
        router.push('/home');
      })();
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const renderItem = ({ item }: { item: OnboardingSlide }) => (
    <View className="w-full items-center justify-center p-10" style={{ width }}>
      <View>
        <Image source={item.image} className="w-80 h-80" resizeMode="contain" />
      </View>
      <View className="items-center">
        <Text className="font-bold text-2xl my-3">{item.title}</Text>
        <Text className="text-sm text-[#444444] text-center leading-5">{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row justify-between items-center mt-5 px-5">
        {currentIndex > 0 ? (
          <Pressable
            onPress={goBack}
            className="w-10 h-10 rounded-full justify-center items-center bg-white shadow-sm active:bg-gray-200"
            style={{ elevation: 1 }}
          >
            <ArrowLeft stroke="#000" size={24} />
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}

        <View className="justify-center items-center w-fit h-fit">
          <LogoTitle width={200} height={40} />
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />

      {/* Footer */}
      <View className="px-8 pb-10">
        <Pressable
          onPress={goNext}
          className="bg-red-700 rounded-lg py-4 mb-5 items-center active:bg-red-800 shadow-lg"
          style={{ elevation: 1 }}
        >
          <Text className="font-bold text-base text-white">{currentIndex === DATA.length - 1 ? 'Done' : 'Continue'}</Text>
        </Pressable>

        <View className="flex-row justify-center">
          {DATA.map((_, i) => (
            <View
              className="h-3 w-1/4 rounded-md mx-2"
              key={i}
              style={[{ backgroundColor: currentIndex === i ? '#C62828' : '#D1D1D1' }]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnBoardingScreen;
