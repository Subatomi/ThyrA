import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { CircleX } from 'lucide-react-native';

export type ToastMessageRef = {
    show: (
        type: 'success' | 'danger' | 'info' | 'warning',
        text: string,
        description?: string
    ) => void;
};

type ToastMessageProps = {
    type?: 'success' | 'danger' | 'info' | 'warning';
    text?: string;
    description?: string;
    timeout?: number;
};

const TOAST_TYPE = {
    success: { className: 'bg-green-500', icon: 'check-circle' },
    danger:  { className: 'bg-red-500',   icon: 'exclamation-circle' },
    info:    { className: 'bg-blue-500',   icon: 'info-circle' },
    warning: { className: 'bg-yellow-500', icon: 'exclamation-triangle' },
};

const ToastMessage = forwardRef<ToastMessageRef, ToastMessageProps>(
    ({ type, text, description, timeout = 4000 }, ref) => {  // ✅ longer default

        const [isVisible, setIsVisible] = useState(false);
        const [message, setMessage] = useState({ 
            type: 'success' as 'success' | 'danger' | 'info' | 'warning', 
            text: '', 
            description: '' 
        });
        const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

        const dismiss = () => {
            setIsVisible(false);
            if (timerRef.current) clearTimeout(timerRef.current);
        };

        const showToast = (
            type: 'success' | 'danger' | 'info' | 'warning',
            text: string,
            description: string = ''
        ) => {
            // Clear any existing timer if a new toast comes in
            if (timerRef.current) clearTimeout(timerRef.current);

            setMessage({ type, text, description });
            setIsVisible(true);

            timerRef.current = setTimeout(() => {
                setIsVisible(false);
            }, timeout);
        };

        useImperativeHandle(ref, () => ({ show: showToast }));

        const { className, icon } = TOAST_TYPE[message.type];

        return (
            <>
                {isVisible && (
                    <Animated.View
                        className={`absolute top-16 w-11/12 ${className} rounded-xl px-3 py-2 flex-row items-center shadow-lg`}
                        style={{
                            zIndex: 9999,
                            left: 16,
                            right: 16,
                        }}
                        entering={FadeInUp.delay(200)}
                        exiting={FadeOutUp}
                    >

                        <View className="ml-3 flex-1">
                            <Text className="text-base font-semibold text-white">{message.text}</Text>
                            {message.description ? (
                                <Text className="text-sm font-normal text-white">{message.description}</Text>
                            ) : null}
                        </View>
                        <TouchableOpacity onPress={dismiss} className="ml-2 p-1">
                            <CircleX size={20} color="#FFF" />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </>
        );
    }
);

export default ToastMessage;