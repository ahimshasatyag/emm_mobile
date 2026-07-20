import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { addSop, updateSop, fetchSopById, clearCurrentSop, confirmSop, revisiSop } from '../stores/sopSlice';
import { SopItem } from '../types/sop.types';
import { Alert } from 'react-native';

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

    const handleSave = async (onSuccess?: (id: string) => void) => {
        if (!formData.code_sop || !formData.nm_sop) {
            Alert.alert('Validasi', 'No Document dan Nama Document wajib diisi');
            return;
        }

        setIsSaving(true);
        try {
            if (sopId) {
                if (currentSop?.status === 'FINALIZE') {
                    // Jika status FINALIZE, maka ini adalah proses revisi
                    // Catat history dan ubah status ke IN PROGRESS terlebih dahulu
                    await dispatch(revisiSop(sopId)).unwrap();
                }
                
                await dispatch(updateSop({ id: sopId, payload: formData })).unwrap();
                Alert.alert('Sukses', 'SOP berhasil diupdate');
                if (onSuccess) onSuccess(sopId);
            } else {
                const newSop = await dispatch(addSop(formData)).unwrap();
                Alert.alert('Sukses', 'SOP berhasil ditambahkan');
                if (onSuccess) onSuccess(newSop.id_sop);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Terjadi kesalahan');
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirm = async (onSuccess?: () => void) => {
        if (!sopId) return;
        
        Alert.alert(
            'Confirm SOP?',
            'Anda tidak dapat mengubah data ini lagi ketika sudah di confirm!',
            [
                { text: 'Tidak, batalkan!', style: 'cancel' },
                {
                    text: 'Ya, Confirm!',
                    style: 'destructive',
                    onPress: async () => {
                        setIsSaving(true);
                        try {
                            await dispatch(confirmSop(sopId)).unwrap();
                            Alert.alert('Confirm !', 'SOP berhasil Confirm');
                            if (onSuccess) onSuccess();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Terjadi kesalahan');
                        } finally {
                            setIsSaving(false);
                        }
                    }
                }
            ]
        );
    };

    const handleRevisi = async (onSuccess?: () => void) => {
        if (!sopId) return;
        
        Alert.alert(
            'Revisi SOP?',
            'Status akan kembali menjadi IN PROGRESS dan history akan dicatat.',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Ya, Revisi',
                    style: 'default',
                    onPress: async () => {
                        setIsSaving(true);
                        try {
                            await dispatch(revisiSop(sopId)).unwrap();
                            Alert.alert('Sukses', 'SOP berhasil direvisi');
                            if (onSuccess) onSuccess();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Terjadi kesalahan');
                        } finally {
                            setIsSaving(false);
                        }
                    }
                }
            ]
        );
    };

    return {
        formData,
        handleChange,
        handleSave,
        handleConfirm,
        handleRevisi,
        isSaving,
        loading,
        isRefreshing,
        onRefresh: () => loadData(true),
        currentSop
    };
};
