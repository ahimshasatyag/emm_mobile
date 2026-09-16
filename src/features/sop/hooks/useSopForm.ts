import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { addSop, updateSop, fetchSopById, clearCurrentSop, confirmSop } from '../stores/sopSlice';
import { getLegacyDivisiCode } from '../api/sopApi';

interface SopFormData {
    divisi: string;
    code_sop: string;
    nm_sop: string;
    file_pdf: any;
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
        if (currentSop?.header && sopId) {
            setFormData({
                divisi: currentSop.header.divisi.toString(),
                code_sop: currentSop.header.code_sop,
                nm_sop: currentSop.header.nm_sop,
                file_pdf: currentSop.header.file_pdf,
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
            const formDataToSubmit = new FormData();
            
            // Map the numeric ID back to legacy string for backend compatibility
            const legacyDivisi = getLegacyDivisiCode(formData.divisi);
            formDataToSubmit.append('divisi', legacyDivisi);
            
            formDataToSubmit.append('code_sop', formData.code_sop);
            formDataToSubmit.append('nm_sop', formData.nm_sop);
            
            if (formData.file_pdf && typeof formData.file_pdf === 'object' && formData.file_pdf.uri) {
                if (formData.file_pdf.file) {
                    // Web platform: append the actual File object
                    formDataToSubmit.append('file_pdf', formData.file_pdf.file);
                } else {
                    // Mobile platform: append the { uri, name, type } structure
                    formDataToSubmit.append('file_pdf', {
                        uri: formData.file_pdf.uri,
                        type: formData.file_pdf.mimeType || 'application/pdf',
                        name: formData.file_pdf.name || 'document.pdf'
                    } as any);
                }
            }

            if (sopId) {
                formDataToSubmit.append('id_sop', sopId);
                if (currentSop?.header.status === 'FINALIZE') {
                    formDataToSubmit.append('f_revisi', 't');
                }
                const response = await dispatch(updateSop(formDataToSubmit)).unwrap();
                await dispatch(fetchSopById(sopId)).unwrap(); // Reload updated data
                if (onSuccess) onSuccess(sopId);
            } else {
                const response = await dispatch(addSop(formDataToSubmit)).unwrap();
                if (response?.status && onSuccess) onSuccess(response.kode);
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
            await dispatch(fetchSopById(sopId)).unwrap(); // Reload data to get FINALIZE status
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
        validateForm,
        isSaving,
        loading,
        isRefreshing,
        onRefresh: () => loadData(true),
        currentSop
    };
};
