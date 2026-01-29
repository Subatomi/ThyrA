import React, { createContext, useContext, ReactNode } from 'react';
import CreateFolderModal from '../components/CreateFolderModal';
import EditFolderModal from '../components/EditFolderModal';
import DeleteFolderModal from '../components/DeleteFolderModal';
import { Pressable, Alert } from 'react-native';
import ActionBar from '../components/ActionBar';
import useFolderModals from './useFolderModals';
import { deleteFolder } from 'api/folder';

type CreateHandler = (data: { name: string; description?: string }) => void;

type ContextValue = {
  open: (onCreate?: CreateHandler) => void;
  close: () => void;
  setDefaultHandler: (fn?: CreateHandler) => void;
  openActionBar: (options?: { onEdit?: () => void; onDelete?: () => void }) => void;
  closeActionBar: () => void;
  isActionBarVisible: boolean;
  openEditModal: (initial?: { name?: string; description?: string }) => void;
  openDeleteModal: (name?: string,id?: string) => void;
};

const CreateFolderContext = createContext<ContextValue | null>(null);

export function CreateFolderProvider({ children, onCreate, onEdit, onDelete }: { children: ReactNode; onCreate?: CreateHandler; onEdit?: (originalName: string | undefined, data: { name: string; description?: string }) => void; onDelete?: (name?: string, id?: string) => void; }) {
  const modals = useFolderModals();

  const {
    visible,
    open,
    close,
    pendingHandler,
    setDefaultHandler,
    defaultHandler,
    isActionBarVisible,
    openActionBar,
    closeActionBar,
    actionEditHandler,
    actionDeleteHandler,
    editModalVisible,
    editInitial,
    openEditModal,
    closeEditModal,
    deleteModalVisible,
    deleteTargetName,
    deleteTargetId,
    openDeleteModal,
    closeDeleteModal,
  } = modals;

  function handleCreate(data: { name: string; description?: string }) {
    // prefer explicit onCreate prop, otherwise pending/default handlers
    if (onCreate) {
      onCreate(data);
      close();
      return;
    }
    const handler = pendingHandler ?? defaultHandler;
    try {
      handler?.(data);
    } finally {
      close();
    }
  }

  //Delete Folder function
  async function handleDeleteFolder(name?: string, id?: string) {
    if (!id) {
      Alert.alert('Error', 'Folder ID is missing');
      return;
    }

    try {
      await deleteFolder(id); //backend API call
      Alert.alert('Success', `"${name}" deleted successfully!`);

      //Call onDelete from props to update parent state if available
      if (onDelete) onDelete(name, id);

      closeDeleteModal();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to delete folder');
    }
  }

  return (
    <CreateFolderContext.Provider value={{ open, close, setDefaultHandler, openActionBar, closeActionBar, isActionBarVisible, openEditModal, openDeleteModal }}>
      {children}
      <CreateFolderModal visible={visible} onClose={close} onCreate={handleCreate} />

      {isActionBarVisible && (
        <>
          <Pressable className="absolute inset-0" onPress={closeActionBar} />
          <ActionBar
            onEdit={() => { if (actionEditHandler) actionEditHandler(); else Alert.alert('Edit', 'Edit action'); }}
            onDelete={() => { if (actionDeleteHandler) actionDeleteHandler(); else handleDeleteFolder(deleteTargetName, deleteTargetId); }}
            onClose={closeActionBar}
          />
        </>
      )}

      <EditFolderModal
        visible={editModalVisible}
        initialName={editInitial?.name}
        initialDescription={editInitial?.description}
        onClose={closeEditModal}
        onSave={(data) => {
          if (onEdit) {
            onEdit(editInitial?.name, data);
          } else {
            Alert.alert('Folder updated', `"${data.name}" updated`);
          }
          closeEditModal();
        }}
      />

      <DeleteFolderModal
        visible={deleteModalVisible}
        folderName={deleteTargetName}
        onClose={closeDeleteModal}
        onConfirm={() => handleDeleteFolder(deleteTargetName, deleteTargetId)} 
      />
    </CreateFolderContext.Provider>
  );
}

export function useCreateFolder() {
  const ctx = useContext(CreateFolderContext);
  if (!ctx) throw new Error('useCreateFolder must be used within CreateFolderProvider');
  return ctx;
}

export default CreateFolderProvider;
