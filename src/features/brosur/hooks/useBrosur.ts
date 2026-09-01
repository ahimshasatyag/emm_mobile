import { useCallback, useState } from 'react';
import { Linking } from 'react-native';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchBrosurProducts, clearBrosurData } from '../stores/brosurSlice';
import { brosurApi } from '../api/api';
import { BrosurProduct } from '../types/brosur.types';

export interface SelectedRow {
    id: string;
    product: BrosurProduct | null;
}


export const useBrosur = () => {
    const dispatch = useAppDispatch();
    const { availableProducts, isLoading, error } = useAppSelector(state => state.brosur);
    
    const [rows, setRows] = useState<SelectedRow[]>([]);

    const loadProducts = useCallback(() => {
        dispatch(fetchBrosurProducts());
    }, [dispatch]);

    const resetData = useCallback(() => {
        dispatch(clearBrosurData());
        setRows([]);
    }, [dispatch]);

    const addRow = () => {
        setRows(prev => [...prev, { id: Date.now().toString(), product: null }]);
    };

    const removeRow = (id: string) => {
        setRows(prev => prev.filter(row => row.id !== id));
    };

    const updateRowProduct = (id: string, product: BrosurProduct) => {
        setRows(prev => prev.map(row => row.id === id ? { ...row, product } : row));
    };

    const resetRows = () => setRows([]);

    const validateForm = (): string | null => {
        const selectedIds = rows
            .filter(r => r.product !== null)
            .map(r => r.product!.id_product);
        const uniqueIds = Array.from(new Set(selectedIds));

        if (uniqueIds.length === 0) {
            return 'Data Barang Kosong. Silakan pilih barang terlebih dahulu.';
        }
        return null;
    };

    const generateBrosur = async (withCover: boolean): Promise<{ success: boolean; message: string; url?: string }> => {
        const selectedIds = rows
            .filter(r => r.product !== null)
            .map(r => r.product!.id_product);
        const uniqueIds = Array.from(new Set(selectedIds));

        if (uniqueIds.length === 0) {
            return { success: false, message: 'Pilih minimal satu produk untuk di-generate.' };
        }

        try {
            const result = await brosurApi.generateBrosur(uniqueIds, withCover);
            if (result.success && result.url) {
                // Membuka URL di browser untuk memicu download PDF
                await Linking.openURL(result.url);
                return { success: true, message: 'Brosur berhasil di-generate!', url: result.url };
            }
            return { success: false, message: 'Gagal men-generate brosur.' };
        } catch (err: any) {
            return { success: false, message: err.message || 'Terjadi kesalahan saat generate brosur.' };
        }
    };

    return {
        availableProducts,
        isLoading,
        error,
        rows,
        loadProducts,
        resetData,
        addRow,
        removeRow,
        updateRowProduct,
        resetRows,
        validateForm,
        generateBrosur
    };
};
