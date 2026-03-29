import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';
import { PencilLine, Mail } from 'lucide-react-native';
import ProfileEditView from '@/features/profile/components/ProfileEditView';
import EditFirstNameModal from '@/features/profile/components/EditFirstNameModal';
import EditLastNameModal from '@/features/profile/components/EditLastNameModal';
import EditEmailModal from '@/features/profile/components/EditEmailModal';
import ChangePasswordModal from '@/features/profile/components/ChangePasswordModal';
import { getProfileCache, formatFullName } from '../services/profileCache';

const AvatarPlaceholder = () => (
  <View style={{ backgroundColor: 'rgba(255,255,255,0.18)' }} className="w-[88px] h-[88px] rounded-full items-center justify-center">
    <Text className="text-[32px] font-extrabold text-white">U</Text>
  </View>
);

// `ProfileEditView` moved to src/features/profile/components/ProfileEditView.tsx

export default function ProfileDashboardScreen() {
  // TODO: replace with real user data + handlers
  const [firstName, setFirstName] = useState('Jhon');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('jhondoe@example.com');
  const fullName = formatFullName(firstName, lastName, email) || 'User';

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const cached = await getProfileCache();
      if (!mounted || !cached) return;
      setFirstName(cached.firstName);
      setLastName(cached.lastName);
      setEmail(cached.email);
    })();
    return () => { mounted = false; };
  }, []);
  const [isEditing, setIsEditing] = useState(false);

  // modal visibility flags
  const [firstModalVisible, setFirstModalVisible] = useState(false);
  const [lastModalVisible, setLastModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const openFieldModal = (field: 'first'|'last'|'email') => {
    if (field === 'first') setFirstModalVisible(true);
    else if (field === 'last') setLastModalVisible(true);
    else setEmailModalVisible(true);
  };

  const handleSaveFirst = async (value: string) => {
    setFirstName(value);
  };

  const handleSaveLast = async (value: string) => {
    setLastName(value);
  };

  const handleSendEmailVerification = async (newEmail: string, password: string) => {
    // mock re-auth: password must equal 'password123'
    await new Promise((r) => setTimeout(r, 700));
    const ok = password === 'password123';
    if (!ok) return { success: false, error: 'Password incorrect' };
    // simulate sending verification (do not swap primary email yet)
    return { success: true };
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    // mock behavior: current password must be 'password123'
    await new Promise((r) => setTimeout(r, 700));
    if (currentPassword !== 'password123') return { success: false, error: 'Current password is incorrect' };
    // in real implementation call backend to change password, invalidate sessions, etc.
    return { success: true };
  };

  return (
    <View className="flex-1 bg-gray-100">
      <SafeAreaView edges={["top"]} className="bg-[#ff928b] pt-6 pb-4 px-4 border-b border-transparent">
        <View className="relative flex-row items-center mb-6">
          <BackButton />
          <View pointerEvents="none" className="absolute left-0 right-0 items-center">
            <Text className="font-bold text-3xl text-white">Profile</Text>
          </View>
          <View className="w-10" />
        </View>

        <View className="max-w-[900px] mx-auto">
          <View className="items-center mb-4">
            {/* <AvatarPlaceholder /> */}
            <Image source={require('assets/icons/sample_profile_1.png')} style={{width: 150, height: 150}} className="rounded-full bg-gray-300" />
            <Text className="text-lg font-bold text-white mt-3">{fullName}</Text>
            <Text className="text-sm text-white opacity-80 mt-1">{email}</Text>
          </View>
        </View>
      </SafeAreaView>

        {isEditing ? (
          <ProfileEditView firstName={firstName} lastName={lastName} email={email} onClose={() => setIsEditing(false)} onEditField={openFieldModal} />
        ) : (
          <View className="flex-1 p-4">
            <View className='h-34'>
              <Text className="text-lg font-extrabold mb-2">Tools</Text>
              <View className="flex-row gap-2">
                
                <Pressable className="bg-white py-2.5 px-3.5 rounded-md" onPress={() => { setIsEditing(true); }}>
                  <Text className="text-black font-semibold">Edit Profile</Text>
                </Pressable>
                <Pressable className="bg-white py-2.5 px-3.5 rounded-md" onPress={() => { setPasswordModalVisible(true); }}>
                  <Text className="text-black font-semibold">Change Password</Text>
                </Pressable>
              </View>
            </View>
            <View className="mt-3">
              <Text className="text-lg font-extrabold mb-2">Details</Text>
              <View className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <Pressable className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                  <View>
                    <Text className="text-xs text-gray-500">First name</Text>
                    <Text className="text-base text-gray-800">{firstName}</Text>
                  </View>
                </Pressable>

                <Pressable className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100" >
                  <View className='flex-1'>
                    <Text className="text-xs text-gray-500">Last name</Text>
                    <Text className="text-base text-gray-800">{lastName}</Text>
                  </View>
                </Pressable>

                <Pressable className="flex-row items-center justify-between px-4 py-4" >
                  <View className='flex-1'>
                    <Text className="text-xs text-gray-500">Email</Text>
                    <Text className="text-base text-gray-800">{email}</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      
      <EditFirstNameModal visible={firstModalVisible} initialValue={firstName} onClose={() => setFirstModalVisible(false)} onSave={handleSaveFirst} />
      <EditLastNameModal visible={lastModalVisible} initialValue={lastName} onClose={() => setLastModalVisible(false)} onSave={handleSaveLast} />
      <EditEmailModal visible={emailModalVisible} initialValue={email} onClose={() => setEmailModalVisible(false)} onSendVerification={handleSendEmailVerification} />
      <ChangePasswordModal visible={passwordModalVisible} onClose={() => setPasswordModalVisible(false)}/>
    </View>
  );
}

