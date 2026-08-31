import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../stores';
import { fetchBrands, createBrand, updateBrand, deleteBrand, clearError, clearSuccessMessage } from '../stores/productBrandSlice';
import { ProductBrandFormData } from '../types/productbrand.types';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { notificationService } from '../../../services/notification/notificationService';

export function useProductBrands() {
    const dispatch = useDispatch<AppDispatch>();
    const { data: brands, isLoading, error, successMessage } = useSelector((state: RootState) => state.productBrand);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState<ProductBrandFormData>({
        id_product_brand: '',
        nm_product_brand: ''
    });

    const validateForm = (): string | null => {
        if (!formData.nm_product_brand.trim()) {
            return 'Brand Name wajib diisi!';
        }
        return null;
    };

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    const filteredBrands = useMemo(() => {
        if (!searchQuery.trim()) return brands || [];

        const lowerQuery = searchQuery.toLowerCase();
        return (brands || []).filter(brand =>
            (brand.nm_product_brand || '').toLowerCase().includes(lowerQuery) ||
            (String(brand.id_product_brand) || '').toLowerCase().includes(lowerQuery)
        );
    }, [brands, searchQuery]);

    const authUser = useAppSelector((state: RootState) => state.auth.user);

    const refreshData = useCallback(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    const addBrand = useCallback(async (data: ProductBrandFormData) => {
        const result = await dispatch(createBrand(data)).unwrap();
        if (authUser?.id_user) {
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level || 1,
                kode_trans: 'BRAND',
                judul: 'Brand Baru',
                pesan: `Brand ${result.nm_product_brand} berhasil ditambahkan oleh ${authUser.nm_users}`,
                action: 'Create'
            }).catch(() => { });
        }
        return result;
    }, [dispatch, authUser]);

    const editBrand = useCallback(async (id: string, data: ProductBrandFormData) => {
        const result = await dispatch(updateBrand({ id, data })).unwrap();
        if (authUser?.id_user) {
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level || 1,
                kode_trans: 'BRAND',
                judul: 'Brand Diperbarui',
                pesan: `Brand ${result.nm_product_brand} berhasil diperbarui oleh ${authUser.nm_users}`,
                action: 'Update'
            }).catch(() => { });
        }
        return result;
    }, [dispatch, authUser]);

    const removeBrand = useCallback(async (id: string) => {
        const brand = brands?.find(b => b.id_product_brand === id);
        const result = await dispatch(deleteBrand(id)).unwrap();
        if (authUser?.id_user) {
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level || 1,
                kode_trans: 'BRAND',
                judul: 'Brand Dihapus',
                pesan: `Brand ${brand?.nm_product_brand || id} berhasil dihapus oleh ${authUser.nm_users}`,
                action: 'Delete'
            }).catch(() => { });
        }
        return result;
    }, [dispatch, authUser, brands]);

    const dismissError = () => dispatch(clearError());
    const dismissSuccess = () => dispatch(clearSuccessMessage());

    return {
        brands: filteredBrands,
        allBrands: brands || [],
        isLoading,
        error,
        successMessage,
        searchQuery,
        setSearchQuery,
        formData,
        setFormData,
        validateForm,
        refreshData,
        addBrand,
        editBrand,
        removeBrand,
        dismissError,
        dismissSuccess
    };
}
