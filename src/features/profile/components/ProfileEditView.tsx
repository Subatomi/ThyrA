import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { PencilLine, Mail } from 'lucide-react-native';

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  onClose: () => void;
  onEditField: (field: 'first' | 'last' | 'email') => void;
};

export default function ProfileEditView({ firstName, lastName, email, onClose, onEditField }: Props) {
  return (
    <View className="p-4">
      <View className="p-4 mb-4">
        <View className="flex-row items-center justify-between">

            
          <View pointerEvents="none" className=" items-center ">
            <Text className="text-lg font-extrabold">Edit Profile</Text>
          </View>

          <Pressable onPress={onClose} className="px-4 py-2 border-gray-200 bg-white border rounded-md">
            <Text className="text-gray-600">Cancel</Text>
          </Pressable>

        </View>
      </View>

      <View className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <Pressable onPress={() => onEditField('first')} className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
          <View className='flex-1'>
            <Text className="text-xs text-gray-500">First name</Text>
            <Text className="text-base text-gray-800">{firstName}</Text>
          </View>
          <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
            <PencilLine size={15} color="#9CA3AF" />
          </View>
        </Pressable>

        <Pressable onPress={() => onEditField('last')} className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
          <View className='flex-1'>
            <Text className="text-xs text-gray-500">Last name</Text>
            <Text className="text-base text-gray-800">{lastName}</Text>
          </View>
          <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
            <PencilLine size={15} color="#9CA3AF" />
          </View>
        </Pressable>

        <Pressable onPress={() => onEditField('email')} className="flex-row items-center justify-between px-4 py-4">
          <View className='flex-1'>
            <Text className="text-xs text-gray-500">Email</Text>
            <Text className="text-base text-gray-800">{email}</Text>
          </View>
          <View className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
            <Mail size={15} color="#9CA3AF" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
