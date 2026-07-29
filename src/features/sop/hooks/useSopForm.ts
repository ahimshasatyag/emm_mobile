import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { addSop, updateSop, fetchSopById, clearCurrentSop, confirmSop, revisiSop } from '../stores/sopSlice';
import { SopItem } from '../types/sop.types';

interface SopFormData {
    divisi: string;
    code_sop: string;
    nm_sop: string;
    file_pdf: string | null;
}

export const useSopForm = (sopId?: string, defaultDivisi?: string) => {
    const dispatch = useAppDispatch();
    const { currentSop, loading } = useAppSelector(state => state.sop);
    
    const [formData, setFormData] = useState<SopFormData>({
        divisi: defaultDivisi || '',
        code_sop: '',
        nm_sop: '',
        file_pdf: null,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true);
        
        if (sopId) {
            try {
                await dispatch(fetchSopById(sopId)).unwrap();
            } catch (e) {
                console.error(e);
            }
        } else if (showRefresh) {
            // Simulate loading for Add form refresh
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        if (showRefresh) setIsRefreshing(false);
    };

    useEffect(() => {
        loadData();
        return () => {
            dispatch(clearCurrentSop());
        };
    }, [sopId]);

    useEffect(() => {
        if (currentSop && sopId) {
            setFormData({
                divisi: currentSop.divisi,
                code_sop: currentSop.code_sop,
                nm_sop: currentSop.nm_sop,
                file_pdf: currentSop.file_pdf,
            });
        }
    }, [currentSop, sopId]);

    const handleChange = (field: keyof SopFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = (): string | null => {
        if (!formData.divisi && !formData.code_sop?.trim() && !formData.nm_sop?.trim()) {
            return 'Semua field wajib diisi';
        }
        if (!formData.divisi) {
            return 'Divisi wajib dipilih';
        }
        if (!formData.code_sop?.trim()) {
            return 'No Document wajib diisi';
        }
        if (!formData.nm_sop?.trim()) {
            return 'Nama Document wajib diisi';
        }
        return null;
    };

    const handleSave = async (onSuccess?: (id: string) => void) => {
        setIsSaving(true);
        try {
            if (sopId) {
                if (currentSop?.status === 'FINALIZE') {
                    await dispatch(revisiSop(sopId)).unwrap();
                }
                await dispatch(updateSop({ id: sopId, payload: formData })).unwrap();
                if (onSuccess) onSuccess(sopId);
            } else {
                const newSop = await dispatch(addSop(formData)).unwrap();
                if (onSuccess) onSuccess(newSop.id_sop);
            }
        } catch (error: any) {
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirm = async (onSuccess?: () => void) => {
        if (!sopId) return;
        setIsSaving(true);
        try {
            await dispatch(confirmSop(sopId)).unwrap();
            if (onSuccess) onSuccess();
        } catch (error: any) {
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    const handleRevisi = async (onSuccess?: () => void) => {
        if (!sopId) return;
        setIsSaving(true);
        try {
            await dispatch(revisiSop(sopId)).unwrap();
            if (onSuccess) onSuccess();
        } catch (error: any) {
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        handleChange,
        handleSave,
        handleConfirm,
        handleRevisi,
        validateForm,
        isSaving,
        loading,
        isRefreshing,
        onRefresh: () => loadData(true),
        currentSop
    };
};
