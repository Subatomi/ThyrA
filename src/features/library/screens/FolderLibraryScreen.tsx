import { View, Text, Alert, FlatList } from 'react-native';
import BackButton from '../../../components/BackButton';
import FolderCard from '../components/FolderCardWithSetting';
import CreateFolderButton from '../components/CreateFolderButton';
import CreateFolderProvider from '../hooks/CreateFolderModalContext';
import { FolderSearch } from 'lucide-react-native';
import { useEffect, useState } from 'react';

type Folder = { id: string; title: string; itemCount: number; date: string; description?: string };
type CreateData = { name: string; description?: string };
type ScreenContentProps = {
  folders: Folder[];
  onCreate: (data: CreateData) => void;
  onEdit: (originalName: string | undefined, data: CreateData) => void;
  onDelete: (name?: string) => void;
};

function ScreenContent({ folders, onCreate, onEdit, onDelete }: ScreenContentProps) {

  return (
    <View className='flex-1 bg-gray-100 p-5'>
      <View className="w-full mb-4 flex-row items-center px-5 py-2">
        <BackButton />
        <View className="flex-1 items-center">
          <Text className="font-bold text-4xl text-left text-gray-900">Folder Library</Text>
        </View>
        <View className="w-12" />
      </View>

      <View className='flex-1 items-center '>
        <FlatList
          data={folders}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          columnWrapperStyle={{ justifyContent: 'flex-start', marginHorizontal: -8 }}
          renderItem={({ item }) => (
            <View className="px-2 mb-4" style={{ width: 160 }}>
              <FolderCard title={item.title} itemCount={item.itemCount} date={item.date} />
            </View>
          )}
        />
        {/* <View className="bg-white rounded-xl p-4 items-center justify-center border-2 border-dashed border-gray-300">
          <FolderSearch size={48} color="#9CA3AF" />
          <Text className="text-gray-400 mt-2 text-center">
            No folders here. Create some folders to see them here!
          </Text>
        </View> */}
      </View>

      <CreateFolderButton />
    </View>
  )
}

export default function FolderLibraryScreen() {
  const [folders, setFolders] = useState<Folder[]>([
    { id: '1', title: 'Personal', itemCount: 12, date: '2024-05-15' },
    { id: '2', title: 'Work', itemCount: 8, date: '2024-03-22' },
    { id: '3', title: 'Receipts', itemCount: 4, date: '2023-12-01' },
  ]);

  function handleCreate(data: CreateData) {
    if (!data.name) {
      Alert.alert('Name required', 'Please provide a folder name.');
      return;
    }
    const id = String(Date.now());
    setFolders((s) => [{ id, title: data.name, itemCount: 0, date: new Date().toISOString().slice(0, 10), description: data.description }, ...s]);
  }

  function handleEdit(originalName: string | undefined, data: CreateData) {
    setFolders((s) => s.map((f) => (f.title === originalName ? { ...f, title: data.name, description: data.description } : f)));
  }

  function handleDelete(name?: string) {
    setFolders((s) => s.filter((f) => f.title !== name));
  }

  return (
    <CreateFolderProvider onCreate={handleCreate} onEdit={handleEdit} onDelete={handleDelete}>
      <ScreenContent folders={folders} onCreate={handleCreate} onEdit={handleEdit} onDelete={handleDelete} />
    </CreateFolderProvider>
  );
}