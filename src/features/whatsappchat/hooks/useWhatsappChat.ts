import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchContacts, fetchMessages, fetchLogs, sendMessage, clearActiveMessages } from '../stores/whatsappchatSlice';

export const useWhatsappChat = () => {
    const dispatch = useAppDispatch();
    const { contacts, activeMessages, logs, loading, sending, error } = useAppSelector(state => state.whatsappchat);

    const loadContacts = useCallback(async () => {
        await dispatch(fetchContacts());
    }, [dispatch]);

    const loadMessages = useCallback(async (contactNumber: string) => {
        await dispatch(fetchMessages(contactNumber));
    }, [dispatch]);

    const loadLogs = useCallback(async () => {
        await dispatch(fetchLogs());
    }, [dispatch]);

    const handleSendMessage = useCallback(async (mobile_number_receive: string, message: string, onSuccess?: () => void) => {
        try {
            await dispatch(sendMessage({ mobile_number_receive, message })).unwrap();
            // Refresh messages after sending
            await dispatch(fetchMessages(mobile_number_receive));
            // Also refresh contacts to update order
            dispatch(fetchContacts());
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Failed to send message', err);
        }
    }, [dispatch]);

    const clearMessages = useCallback(() => {
        dispatch(clearActiveMessages());
    }, [dispatch]);

    return {
        contacts,
        activeMessages,
        logs,
        loading,
        sending,
        error,
        loadContacts,
        loadMessages,
        loadLogs,
        handleSendMessage,
        clearMessages
    };
};
