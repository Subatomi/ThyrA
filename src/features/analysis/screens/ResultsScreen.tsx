import React from 'react'
import { View, Text, Image, Button, Dimensions, ScrollView, Pressable } from 'react-native'
import BackButton from '../../../components/BackButton'

const sample = require('assets/img/sampleImages/sample1.jpg')
const screenWidth = Dimensions.get('window').width

export default function ResultsScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      <View className='w-full flex-row items-center mb-4 gap-4'>
        <View>
          <BackButton />
        </View>

        <View className='items-center'>
          <Text className="font-bold text-4xl  text-gray-900">Result</Text>
        </View>
      </View>

      <View className="w-full mt-6">
        <View className="bg-white rounded-xl overflow-hidden p-4 h-80" style={{elevation:1}}>
          <Image source={sample} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>

        <View className="mt-4 bg-white p-4 rounded-xl w-full " style={{elevation:1}}>
            <Text className="text-lg font-semibold mb-2">Details</Text>
            <Text className="text-sm text-gray-600">Filename: sample1.jpg</Text>
            
            <Text className="mt-4 text-lg font-semibold mb-2">Legend</Text> 
            <View className="flex-row justify-around items-center">
                <View className="flex-row items-center gap-2">
                    <View className="w-4 h-4 bg-green-500 rounded-sm" />
                    <Text className="text-gray-800 text-sm">Adequate</Text>
                </View>

                <View className="flex-row items-center gap-2">
                    <View className="w-4 h-4 bg-blue-500 rounded-sm" />
                    <Text className="text-gray-800 text-sm">Inadequate</Text>
                </View>
            </View>


              <Pressable
              className='w-full mt-4'
                  onPress={async () => {
                  }}
              >
                {({ pressed }) => (
                  <View className="py-2 rounded-md items-center justify-center" style={{ backgroundColor: pressed ? '#991b1b' : '#dc2626' }}>
                    <Text className="text-white font-semibold">Download Result</Text>
                  </View>
                )}
              </Pressable>

        </View>
      </View>
    </ScrollView>
  )
}
