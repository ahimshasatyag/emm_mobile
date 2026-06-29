import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores';
import * as DocumentPicker from 'expo-document-picker';
import { productUploadApi } from '../api/productUploadApi';
import { 
    setUploadLoading, 
    setSavingLoading, 
    setPreviewData, 
    setError, 
    setSuccess, 
    clearPreview 
} from '../stores/productUploadSlice';
import { Alert } from 'react-native';

export function useProductUpload() {
    const dispatch = useDispatch();
    const { previewData, isLoading, isSaving, error, successMessage } = useSelector(
        (state: RootState) => state.productUpload
    );
    const [selectedFile, setSelectedFile] = useState<{uri: string, name: string, type: string} | null>(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/vnd.ms-excel'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                setSelectedFile({
                    uri: file.uri,
                    name: file.name,
                    type: file.mimeType || 'application/octet-stream'
                });
            }
        } catch (err) {
            console.error('Error picking document:', err);
            dispatch(setError('Gagal memilih file.'));
        }
    };

    const viewFile = () => {
        if (!selectedFile) {
            Alert.alert('Perhatian', 'Pilih file terlebih dahulu.');
            return;
        }
        uploadForPreview(selectedFile.uri, selectedFile.name, selectedFile.type);
    };

    const uploadForPreview = async (uri: string, name: string, type: string) => {
        dispatch(setUploadLoading(true));
        try {
            const response = await productUploadApi.uploadPreview(uri, name, type);
            if (response.status && response.data) {
                dispatch(setPreviewData(response.data));
            } else {
                dispatch(setError(response.message || 'Gagal memuat preview data.'));
            }
        } catch (err: any) {
            console.error('Error uploading preview:', err);
            dispatch(setError(err?.response?.data?.message || 'Terjadi kesalahan saat mengunggah file.'));
        }
    };

    const saveData = async () => {
        if (!previewData || previewData.length === 0) {
            Alert.alert('Error', 'Tidak ada data untuk disimpan.');
            return;
        }

        // Optional: Check if all items are valid
        // const hasError = previewData.some(item => !item.f_ada);
        // if (hasError) {
        //     Alert.alert('Peringatan', 'Terdapat baris data yang error. Lanjutkan menyimpan baris yang valid?');
        // }

        dispatch(setSavingLoading(true));
        try {
            const response = await productUploadApi.saveUploadData(previewData);
            if (response.status) {
                dispatch(setSuccess('Data berhasil disimpan!'));
                dispatch(clearPreview());
                Alert.alert('Sukses', 'Data berhasil disimpan!');
            } else {
                dispatch(setError(response.message || 'Gagal menyimpan data.'));
                Alert.alert('Error', response.message || 'Gagal menyimpan data.');
            }
        } catch (err: any) {
            console.error('Error saving data:', err);
            const errorMessage = err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.';
            dispatch(setError(errorMessage));
            Alert.alert('Error', errorMessage);
        } finally {
            dispatch(setSavingLoading(false));
        }
    };

    const resetPreview = () => {
        dispatch(clearPreview());
    };

    return {
        previewData,
        isLoading,
        isSaving,
        error,
        successMessage,
        selectedFile,
        pickDocument,
        viewFile,
        saveData,
        resetPreview
    };
}
