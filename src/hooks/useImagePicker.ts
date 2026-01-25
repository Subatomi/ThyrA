import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export function useImagePicker() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  async function requestLibraryPermission() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }

  async function requestCameraPermission() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  }

  async function pickImage() {
    const granted = await requestLibraryPermission();
    if (!granted) {
      alert('Permission to access photos is required.');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality:1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      return uri;
    }

    return null;
  }

  async function takePhoto() {
    const granted = await requestCameraPermission();
    if (!granted) {
      alert('Camera permission required.');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      return uri;
    }

    return null;
  }

  return { imageUri, setImageUri, pickImage, takePhoto } as const;
}
