import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { addTandaTerimaCust, updateTandaTerimaCust, fetchTandaTerimaCustById, clearCurrentItem, fetchCustomers, deleteTandaTerimaCust } from '../stores/tandaterimacustSlice';
import { TandaTerimaCustFile } from '../types/tandaterimacust.types';

interface TandaTerimaFormData {
    id_customers: string;
    date_tanda_terima: string;
    keterangan: string;
    files: Omit<TandaTerimaCustFile, 'id_tanda_terima_cust' | 'id_tanda_terima_cust_item'>[];
}

export const useTandaTerimaCust = (itemId?: string) => {
    const dispatch = useAppDispatch();
    const { currentItem, loading, customers } = useAppSelector(state => state.tandaterimacust);

    // Format date string as 'DD-MM-YYYY' for default if needed, or simply 'YYYY-MM-DD'
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState<TandaTerimaFormData>({
        id_customers: '',
        date_tanda_terima: today,
        keterangan: '',
        files: [],
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true);

        const promises: Promise<any>[] = [dispatch(fetchCustomers())];

        if (itemId) {
            promises.push(dispatch(fetchTandaTerimaCustById(itemId)).unwrap().catch(e => console.error(e)));
        } else if (showRefresh) {
            promises.push(new Promise(resolve => setTimeout(resolve, 800)));
        }

        await Promise.all(promises);

        if (showRefresh) setIsRefreshing(false);
    };

    useEffect(() => {
        loadData();
        return () => {
            dispatch(clearCurrentItem());
        };
    }, [itemId]);

    useEffect(() => {
        if (currentItem && itemId) {
            setFormData({
                id_customers: currentItem.id_customers,
                date_tanda_terima: currentItem.date_tanda_terima,
                keterangan: currentItem.keterangan || '',
                files: currentItem.files || [],
            });
        }
    }, [currentItem, itemId]);

    const handleChange = (field: keyof TandaTerimaFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddFile = (fileName: string, keterangan?: string) => {
        setFormData(prev => ({
            ...prev,
            files: [...prev.files, { file: fileName, nama: fileName, keterangan }]
        }));
    };

    const handleRemoveFile = (index: number) => {
        setFormData(prev => {
            const newFiles = [...prev.files];
            newFiles.splice(index, 1);
            return { ...prev, files: newFiles };
        });
    };

    const handleSave = async (onSuccess?: () => void) => {
        if (!formData.id_customers) {
            return;
        }

        setIsSaving(true);
        try {
            if (itemId) {
                await dispatch(updateTandaTerimaCust({ id: itemId, payload: formData as any })).unwrap();
                if (onSuccess) onSuccess();
            } else {
                await dispatch(addTandaTerimaCust(formData as any)).unwrap();
                if (onSuccess) onSuccess();
            }
        } catch (error: any) {
            console.error('Error saving:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (onSuccess?: () => void) => {
        if (!itemId) return;
        setIsSaving(true);
        try {
            await dispatch(deleteTandaTerimaCust(itemId)).unwrap();
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error('Error deleting:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        customers,
        handleChange,
        handleAddFile,
        handleRemoveFile,
        handleSave,
        handleDelete,
        isSaving,
        loading,
        isRefreshing,
        onRefresh: () => loadData(true),
        currentItem
    };
};
