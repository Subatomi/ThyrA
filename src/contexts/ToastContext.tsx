import { createContext, useContext, useRef, useCallback } from 'react';
import { View } from 'react-native';
import ToastMessage, { ToastMessageRef } from '../components/ToastMessage';

type ToastType = 'success' | 'danger' | 'info' | 'warning';

type ToastContextValue = {
  show: (type: ToastType, text: string, description?: string) => void;
};

const ToastContext = createContext<ToastContextValue>({ show: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastRef = useRef<ToastMessageRef>(null);

  const show = useCallback((type: ToastType, text: string, description?: string) => {
    toastRef.current?.show(type, text, description);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      <View style={{ flex: 1 }}>
        {children}
        <ToastMessage ref={toastRef} timeout={2000} />
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}