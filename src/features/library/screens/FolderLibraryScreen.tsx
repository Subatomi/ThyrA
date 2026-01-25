import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from '../../../components/BackButton';
import FolderCard from '../components/FolderCardWithSetting';
import CreateFolderButton from '../components/CreateFolderButton';
import { Alert } from 'react-native';
import CreateFolderProvider from '../hooks/CreateFolderModalContext';
import { useEffect, useState } from 'react';

function ScreenContent({ folders, onCreate, onEdit, onDelete }: { folders: Array<{ id: string; title: string; itemCount: number; date: string; description?: string }>; onCreate: (data: { name: string; description?: string }) => void; onEdit: (originalName: string | undefined, data: { name: string; description?: string }) => void; onDelete: (name?: string) => void }) {

  return (
    <View className='flex-1'>
      <ScrollView
        className="flex-1 bg-gray-100"
        contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
        <View style={{ width: '100%', marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
          <BackButton />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text className="font-bold text-4xl text-center text-gray-900">Folder Library</Text>
          </View>
          <View style={{ width: 48 }} />
        </View>
        
        <View className="w-full flex-row flex-wrap items-center justify-between gap-4">
          {folders.map((f) => (
            <FolderCard key={f.id} title={f.title} itemCount={f.itemCount} date={f.date} />
          ))}
        </View>
      </ScrollView>

      <CreateFolderButton />
    </View>
  );
}

export default function FolderLibraryScreen() {
  const [folders, setFolders] = useState<Array<{ id: string; title: string; itemCount: number; date: string; description?: string }>>([
    { id: '1', title: 'Personal', itemCount: 12, date: '2024-05-15' },
    { id: '2', title: 'Work', itemCount: 8, date: '2024-03-22' },
    { id: '3', title: 'Receipts', itemCount: 4, date: '2023-12-01' },
  ]);

  function handleCreate(data: { name: string; description?: string }) {
    if (!data.name) {
      Alert.alert('Name required', 'Please provide a folder name.');
      return;
    }
    const id = String(Date.now());
    setFolders((s) => [{ id, title: data.name, itemCount: 0, date: new Date().toISOString().slice(0, 10), description: data.description }, ...s]);
  }

  function handleEdit(originalName: string | undefined, data: { name: string; description?: string }) {
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