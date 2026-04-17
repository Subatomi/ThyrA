import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FolderType = {
  id: string;
  folder_name: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  folders: FolderType[];
  loading: boolean;
  onSelectFolder: (folder: FolderType) => void;
};

export default function FolderSelectionModal({
  visible,
  onClose,
  folders,
  loading,
  onSelectFolder,
}: Props) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const listHeight = 160;

  const FolderItem = ({ folder }: { folder: FolderType }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-200 active:bg-gray-50"
      onPress={() => onSelectFolder(folder)}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-800">{folder.folder_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View style={{ paddingBottom: insets.bottom }} className="bg-white rounded-t-3xl max-h-3/4">
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-bold text-gray-900">Select Folder</Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-lg text-gray-500">✕</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-gray-600">Choose where to save the image</Text>
          </View>
          {loading ? (
            <View className="p-6 items-center">
              <ActivityIndicator />
              <Text className="text-gray-500 mt-2">Loading folders...</Text>
            </View>
          ) : (
            <View style={{ height: listHeight }}>
              <FlatList
                data={folders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <FolderItem folder={item} />}
                scrollEnabled={true}
                persistentScrollbar={true}
                scrollIndicatorInsets={{ right: 1 }}
                showsVerticalScrollIndicator={true}
                indicatorStyle="default"
                ListEmptyComponent={
                  <View className="p-6 items-center">
                    <Text className="text-gray-500">No folders found</Text>
                  </View>
                }
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
