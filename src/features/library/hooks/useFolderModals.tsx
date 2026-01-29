import { useCallback, useState } from 'react';

type CreateHandler = (data: { name: string; description?: string }) => void;

export default function useFolderModals() {
  const [visible, setVisible] = useState(false);
  const [pendingHandler, setPendingHandler] = useState<CreateHandler | undefined>(undefined);
  const [defaultHandler, setDefaultHandlerState] = useState<CreateHandler | undefined>(undefined);

  // action bar state
  const [isActionBarVisible, setActionBarVisible] = useState(false);
  const [actionEditHandler, setActionEditHandler] = useState<(() => void) | undefined>(undefined);
  const [actionDeleteHandler, setActionDeleteHandler] = useState<(() => void) | undefined>(undefined);

  // edit/delete modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editInitial, setEditInitial] = useState<{ name?: string; description?: string } | undefined>(undefined);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTargetName, setDeleteTargetName] = useState<string | undefined>(undefined);
  const [deleteTargetId, setDeleteTargetId] = useState<string | undefined>(undefined);

  const open = useCallback((onCreate?: CreateHandler) => {
    setPendingHandler(() => onCreate);
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setPendingHandler(undefined);
  }, []);

  const setDefaultHandler = useCallback((fn?: CreateHandler) => {
    setDefaultHandlerState(() => fn);
  }, []);

  const openActionBar = useCallback((options?: { onEdit?: () => void; onDelete?: () => void }) => {
    setActionEditHandler(() => options?.onEdit);
    setActionDeleteHandler(() => options?.onDelete);
    setActionBarVisible(true);
  }, []);

  const closeActionBar = useCallback(() => {
    setActionBarVisible(false);
    setActionEditHandler(undefined);
    setActionDeleteHandler(undefined);
  }, []);

  const openEditModal = useCallback((initial?: { name?: string; description?: string }) => {
    setEditInitial(initial);
    setEditModalVisible(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalVisible(false);
    setEditInitial(undefined);
  }, []);

  const openDeleteModal = useCallback((name?: string, id?: string) => {
    setDeleteTargetName(name);
    setDeleteTargetId(id);
    setDeleteModalVisible(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalVisible(false);
    setDeleteTargetName(undefined);
    setDeleteTargetId(undefined);
  }, []);

  return {
    // create modal
    visible,
    open,
    close,
    pendingHandler,
    setDefaultHandler,
    defaultHandler,
    // action bar
    isActionBarVisible,
    openActionBar,
    closeActionBar,
    actionEditHandler,
    actionDeleteHandler,
    // edit/delete modals
    editModalVisible,
    editInitial,
    openEditModal,
    closeEditModal,
    deleteModalVisible,
    deleteTargetName,
    deleteTargetId,
    openDeleteModal,
    closeDeleteModal,
  } as const;
}
