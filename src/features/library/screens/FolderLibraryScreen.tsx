import { Pressable, View, Text, Alert, FlatList } from 'react-native';
import BackButton from '../../../components/BackButton';
import FolderCard from '../components/FolderCardWithSetting';
import CreateFolderButton from '../components/CreateFolderButton';
import CreateFolderProvider from '../hooks/CreateFolderModalContext';
import { FolderSearch } from 'lucide-react-native';
import { useEffect, useState, useRef } from 'react';
import { getFolders, createFolder } from 'api/folder';
import { useRouter } from 'expo-router';
import { useToast } from '../../../contexts/ToastContext';

type Folder = {
  id: string;
  title: string;
  itemCount: number;
  date: string;
  description?: string;
};

type FolderFormData = {
  name: string;
  description?: string;
};

type ScreenContentProps = {
  folders: Folder[];
  onCreate: (data: FolderFormData) => void;
  onEdit: (originalName: string | undefined, data: FolderFormData) => void;
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

      <View className='flex-1 items-center'>
         {folders.length === 0 ? (
            <View className="bg-white rounded-xl p-4 items-center justify-center border-2 border-dashed border-gray-300">
              <FolderSearch size={48} color="#9CA3AF" />
              <Text className="text-gray-400 mt-2 text-center">
                No folders here. Create some folders to see them here!
              </Text>
            </View>
          ) : (
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
              columnWrapperStyle={{ justifyContent: 'flex-start', marginHorizontal: -8 }}
              renderItem={({ item }) => (
                <View className="px-2 mb-4" style={{ width: 160 }}>
                  <FolderCard id={item.id} title={item.title} />
                </View>
              )}
            />
          )}  
      </View>

      <CreateFolderButton />
    </View>
  );
}

export default function FolderLibraryScreen() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const { show } = useToast();

  const fetchFolders = async () => {
    try {
      const data = await getFolders();

      const formattedData: Folder[] = data.map((f: any) => ({
        id: f.id,
        title: f.folder_name,
        date: new Date().toISOString().slice(0, 10),        
        description: '',
      }));

      setFolders(formattedData);
    } catch (error: any) {
      
      show('warning','Info', error.message);
      // Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  async function handleCreate(data: FolderFormData) {
    if (!data.name) {
      show('info','Name Required', 'Please provide a folder name');
      return;
    }

    try {
      const createdFolder = await createFolder(data.name);
      
      show('success','Success', 'Successfully created a folder');
      // Alert.alert('Success', 'Successfully created');

      setFolders((prev) => [
        {
          id: createdFolder.id,
          title: createdFolder.folder_name,
          itemCount: 0,
          date: new Date().toISOString().slice(0, 10),
          description: '',
        },
        ...prev,
      ]);
    } catch (error: any) {
      show('warning','Error', 'Could not create folder.');
      // Alert.alert('Error', error.message || 'Could not create folder.');
    }
  }

  function handleEdit(originalName: string | undefined, data: FolderFormData) {
    setFolders((prev) =>
      prev.map((f) =>
        f.title === originalName ? { ...f, title: data.name, description: data.description } : f
      )
    );
    show('success', 'Updated', `Folder renamed to "${data.name}" successfully.`);
  }

  function handleDelete(name?: string) {
    setFolders((prev) => prev.filter((f) => f.title !== name));
    show('success', 'Deleted', `Folder "${name}" has been deleted.`);
  }

  return (
    <CreateFolderProvider onCreate={handleCreate} onEdit={handleEdit} onDelete={handleDelete}>
      <ScreenContent folders={folders} onCreate={handleCreate} onEdit={handleEdit} onDelete={handleDelete} />
    </CreateFolderProvider>
  );
}