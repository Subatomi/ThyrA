import React, { createContext, useContext, ReactNode } from 'react';
import CreateFolderModal from '../components/CreateFolderModal';
import EditFolderModal from '../components/EditFolderModal';
import DeleteFolderModal from '../components/DeleteFolderModal';
import { Pressable } from 'react-native';
import ActionBar from '../components/ActionBar';
import useFolderModals from './useFolderModals';
import { deleteFolder, updateFolder } from 'api/folder';
import { useToast } from '../../../contexts/ToastContext';

type CreateHandler = (data: { name: string; description?: string }) => void;

type ContextValue = {
  open: (onCreate?: CreateHandler) => void;
  close: () => void;
  setDefaultHandler: (fn?: CreateHandler) => void;
  openActionBar: (options?: { onEdit?: () => void; onDelete?: () => void }) => void;
  closeActionBar: () => void;
  isActionBarVisible: boolean;
  openEditModal: (initial?: { id?: string; name?: string; description?: string }) => void;
  openDeleteModal: (name?: string, id?: string) => void;
};

type ProviderProps = {
  children: ReactNode;
  onCreate?: CreateHandler;
  onEdit?: (originalName: string | undefined, data: { name: string; description?: string }) => void;
  onDelete?: (name?: string, id?: string) => void;
};

const CreateFolderContext = createContext<ContextValue | null>(null);

export function CreateFolderProvider({ children, onCreate, onEdit, onDelete }: ProviderProps) {
  const { toast } = useToast();
  const modals = useFolderModals();

  const {
    visible, open, close,
    pendingHandler, setDefaultHandler, defaultHandler,
    isActionBarVisible, openActionBar, closeActionBar,
    actionEditHandler,actionDeleteHandler,
    editModalVisible, editInitial, openEditModal, closeEditModal,
    deleteModalVisible, deleteTargetName, deleteTargetId,
    openDeleteModal, closeDeleteModal,
  } = modals;

  // ─── Create ──────────────────────────────────────────────────

  function handleCreate(data: { name: string; description?: string }) {
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

  // ─── Edit ────────────────────────────────────────────────────

  async function handleEditFolder(data: { name: string; description?: string }) {
    if (!editInitial?.id) {
      toast?.show('danger', 'Error', 'Folder ID missing');
      return;
    }

    if (!data.name?.trim()) {
      toast?.show('warning', 'Invalid', 'Folder name cannot be empty');
      return;
    }

    try {
      await updateFolder(editInitial.id, data.name);
      toast?.show('success', 'Updated', `"${data.name}" updated successfully`);
      onEdit?.(editInitial.name, data);
      closeEditModal();
    } catch (err: any) {
      toast?.show('danger', 'Error', err.message || 'Failed to update folder');
    }
  }

  // ─── Delete ──────────────────────────────────────────────────

  async function handleDeleteFolder(name?: string, id?: string) {
    if (!id) {
      toast?.show('danger', 'Error', 'Folder ID is missing');
      return;
    }

    try {
      await deleteFolder(id);
      toast?.show('success', 'Deleted', `"${name}" deleted successfully`);
      onDelete?.(name, id);
      closeDeleteModal();
    } catch (err: any) {
      toast?.show('danger', 'Error', err.message || 'Failed to delete folder');
    }
  }

  // ─── Render ──────────────────────────────────────────────────

  return (
    <CreateFolderContext.Provider value={{
      open, close, setDefaultHandler,
      openActionBar, closeActionBar, isActionBarVisible,
      openEditModal, openDeleteModal,
    }}>
      {children}

      <CreateFolderModal
        visible={visible}
        onClose={close}
        onCreate={handleCreate}
      />

      {isActionBarVisible && (
        <>
          <Pressable className="absolute inset-0" onPress={closeActionBar} />
          <ActionBar
            onEdit={() => actionEditHandler?.()}
            onDelete={() => actionDeleteHandler?.()}
            onClose={closeActionBar}
          />
        </>
      )}

      <EditFolderModal
        visible={editModalVisible}
        initialName={editInitial?.name}
        onClose={closeEditModal}
        onSave={handleEditFolder}
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