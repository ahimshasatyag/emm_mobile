import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores';
import { inventoryApi } from '../api/inventory.api';
import { InventoryFormData, InventorySerialNumber } from '../types/inventory.types';
import { 
    setLoading, 
    setError, 
    setAssets, 
    setTypes, 
    setCategories,
    addAsset,
    updateAsset,
    deleteAsset
} from '../stores/inventorySlice';

export function useInventory() {
    const dispatch = useDispatch();
    const { assets, types, categories, isLoading, error } = useSelector((state: RootState) => state.inventory);

    const fetchInitialData = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const [fetchedAssets, fetchedTypes, fetchedCategories] = await Promise.all([
                inventoryApi.getAssets(),
                inventoryApi.getTypes(),
                inventoryApi.getCategories()
            ]);
            dispatch(setTypes(fetchedTypes));
            dispatch(setCategories(fetchedCategories));
            dispatch(setAssets(fetchedAssets));
        } catch (err: any) {
            dispatch(setError(err.message || 'Gagal memuat data inventaris'));
        }
    }, [dispatch]);

    const fetchAssets = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await inventoryApi.getAssets();
            dispatch(setAssets(data));
        } catch (err: any) {
            dispatch(setError(err.message || 'Gagal memuat data inventaris'));
        }
    }, [dispatch]);

    const createAsset = useCallback(async (data: InventoryFormData) => {
        dispatch(setLoading(true));
        try {
            const newAsset = await inventoryApi.createAsset(data);
            dispatch(addAsset(newAsset));
            return newAsset;
        } catch (err: any) {
            dispatch(setError(err.message || 'Gagal menambahkan aset'));
            throw err;
        }
    }, [dispatch]);

    const editAsset = useCallback(async (id: string, data: InventoryFormData) => {
        dispatch(setLoading(true));
        try {
            const updatedAsset = await inventoryApi.updateAsset(id, data);
            dispatch(updateAsset(updatedAsset));
            return updatedAsset;
        } catch (err: any) {
            dispatch(setError(err.message || 'Gagal memperbarui aset'));
            throw err;
        }
    }, [dispatch]);

    const removeAsset = useCallback(async (id: string) => {
        dispatch(setLoading(true));
        try {
            await inventoryApi.deleteAsset(id);
            dispatch(deleteAsset(id));
        } catch (err: any) {
            dispatch(setError(err.message || 'Gagal menghapus aset'));
            throw err;
        }
    }, [dispatch]);

    const getAssetSerials = useCallback(async (assetId: string): Promise<InventorySerialNumber[]> => {
        return await inventoryApi.getAssetSerials(assetId);
    }, []);

    return {
        assets,
        types,
        categories,
        isLoading,
        error,
        fetchInitialData,
        fetchAssets,
        createAsset,
        editAsset,
        removeAsset,
        getAssetSerials
    };
}
