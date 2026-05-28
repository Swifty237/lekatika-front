/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'natural';

interface CustomToastProps {
    message: string;
    type: ToastType;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, type }) => {
    const getStyles = () => {
        switch (type) {
            case 'success':
                return { backgroundColor: '#22c55e', color: 'white' };
            case 'error':
                return { backgroundColor: '#ef4444', color: 'white' };
            case 'natural':
            default:
                return { backgroundColor: '#374151', color: 'white' };
        }
    };

    return (
        <div
            style={{
                ...getStyles(),
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontSize: '0.875rem',
                fontWeight: '500',
            }}
        >
            {message}
        </div>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const showToast = (message: string, type: ToastType = 'natural') => {
    toast.custom(() => <CustomToast message={message} type={type} />, {  // supprimer le paramètre t inutilisé
        duration: type === 'error' ? 4000 : 3000,
    });
};