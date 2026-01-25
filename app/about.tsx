import React, { useRef, useState } from 'react';
import { 
  StyleSheet, View, Text, Image, FlatList, 
  Dimensions, Pressable,
  NativeSyntheticEvent, NativeScrollEvent, ImageSourcePropType 
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

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
    image: require('../assets/img/assessment-tool-graphic.png'),
  },
  {
    id: '2',
    title: 'Case Management',
    description: 'Access a centralized library of all analyzed slides',
    image: require('../assets/img/case-management-graphic.png'),
  },
  {
    id: '3',
    title: 'Analysis Tools',
    description: 'View visual summaries and summary of adequacy rate of the uploaded cytology slide',
    image: require('../assets/img/analysis-tool-graphic.png'),
  },
];

type RootStackParamList = {
  Home: undefined;
};

const About = () => {
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
      router.push('/home');
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
      <View className='items-center'>
        <Text className='font-bold text-2xl my-3'>{item.title}</Text>
        <Text className="text-sm text-[#444444] text-center leading-5">{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-gray-100' edges={['top']}>
      {/* Header */}
       <View className='flex-row justify-between items-center mt-5 px-5'>
        {currentIndex > 0 ? (
          <Pressable
            onPress={goBack}
            className="w-10 h-10 rounded-full justify-center items-center bg-white shadow-sm active:bg-gray-200"
            style={{ elevation: 1 }}
          >
            <ArrowLeft stroke="#000" size={24} />
          </Pressable>
        ) : <View style={{ width: 40 }} />}
        
        <View className='justify-center items-center'>
          <Image source={require('../assets/img/logo-2.png')} style={{width: 150, height: 50}} resizeMode='contain' />
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
      <View className='px-8 pb-10'>
        <Pressable
          onPress={goNext}
          className="bg-red-700 rounded-lg py-4 mb-5 items-center active:bg-red-800 shadow-lg"
          style={{ elevation: 1 }}
        >
          <Text className='font-bold text-base text-white'>
            {currentIndex === DATA.length - 1 ? 'Done' : 'Continue'}
          </Text>
        </Pressable>

        <View className='flex-row justify-center'>
          {DATA.map((_, i) => (
            <View
              className='h-3 w-1/4 rounded-md mx-2'
              key={i}
              style={[
                { backgroundColor: currentIndex === i ? '#C62828' : '#D1D1D1' },
              ]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   // container: { flex: 1, backgroundColor: '#F5F5F5'},
//   // header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20 },
//   // backButton: { padding: 8, width: 40, height: 40, borderRadius: 20 , justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', elevation: 1 },
//   // backButtonPressed:{backgroundColor: '#F0F0F0'},
//   // logoContainer: { justifyContent: 'center', alignItems: 'center' },
//   logoText: { fontSize: 24, fontWeight: 'bold', color: '#9e7e7eff' },
//   // slide: { width, alignItems: 'center', justifyContent: 'center', padding: 40 },
//   imageContainer: { width: 250, height: 250, borderRadius: 125, backgroundColor: '#FFE5E5', justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
//   // image: { width: 300, height: 300 },
//   // textContainer: { alignItems: 'center' },
//   // title: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 10 },
//   // description: { fontSize: 14, color: '#444', textAlign: 'center', lineHeight: 20 },
//   // footer: { paddingHorizontal: 30, paddingBottom: 40 },
//   // continueButton: { backgroundColor: '#C62828', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20, elevation: 1 },
//   // continueButtonPressed: { backgroundColor: '#A81E1E' },
//   // continueText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
//   // paginationContainer: { flexDirection: 'row', justifyContent: 'center' },
//   paginationBar: { height: 8, width: width * 0.25, borderRadius: 4, marginHorizontal: 5 },
// });

export default About;
