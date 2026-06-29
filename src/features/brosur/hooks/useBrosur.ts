import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchBrosurProducts, clearBrosurData } from '../stores/brosurSlice';
import { brosurApi } from '../api/api';
import { Alert } from 'react-native';

export const useBrosur = () => {
    const dispatch = useAppDispatch();
    const { availableProducts, isLoading, error } = useAppSelector(state => state.brosur);

    const loadProducts = useCallback(() => {
        dispatch(fetchBrosurProducts());
    }, [dispatch]);

    const resetData = useCallback(() => {
        dispatch(clearBrosurData());
    }, [dispatch]);

    const generateBrosur = async (productIds: string[], withCover: boolean) => {
        if (productIds.length === 0) {
            Alert.alert('Perhatian', 'Pilih minimal satu produk untuk di-generate.');
            return null;
        }

        try {
            const result = await brosurApi.generateBrosur(productIds, withCover);
            if (result.success) {
                Alert.alert('Berhasil', `Brosur berhasil di-generate! \nURL: ${result.url}`);
                return result.url;
            }
            return null;
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Terjadi kesalahan saat generate brosur.');
            return null;
        }
    };

    return {
        availableProducts,
        isLoading,
        error,
        loadProducts,
        resetData,
        generateBrosur
    };
};
