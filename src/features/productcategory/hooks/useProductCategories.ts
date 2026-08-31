import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchCategories, createCategory, updateCategory, deleteCategory, clearError, clearSuccessMessage } from '../stores/productCategorySlice';
import { ProductCategoryFormData } from '../types/productcategory.types';
import { notificationService } from '../../../services/notification/notificationService';

export function useProductCategories() {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state) => state.auth.user);
    const { categories, loading, error, successMessage } = useAppSelector((state) => state.productCategory);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState<ProductCategoryFormData>({
        nm_product_kategori: ''
    });

    const validateForm = () => {
        const errors: string[] = [];
        if (!formData.nm_product_kategori.trim()) {
            errors.push('Category Name wajib diisi!');
        }

        if (errors.length > 0) {
            return { isValid: false, message: errors.join('\n') };
        }

        return { isValid: true };
    };

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;

        const lowerQuery = searchQuery.toLowerCase();
        return categories.filter(category =>
            category.nm_product_kategori.toLowerCase().includes(lowerQuery) ||
            category.kode_product_kategori.toLowerCase().includes(lowerQuery)
        );
    }, [categories, searchQuery]);

    const refreshData = () => {
        dispatch(fetchCategories());
    };

    const addCategory = async (data: ProductCategoryFormData) => {
        const result = await dispatch(createCategory(data)).unwrap();
        if (authUser?.id_user) {
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level || 1,
                kode_trans: 'PRODUCT CATEGORY',
                judul: 'Category Baru',
                pesan: `Category ${result.nm_product_kategori} berhasil ditambahkan oleh ${authUser.nm_users}`,
                action: 'Create'
            }).catch(() => { });
        }
        return result;
    };

    const editCategory = async (id: string | number, data: Partial<ProductCategoryFormData>) => {
        const result = await dispatch(updateCategory({ id, data })).unwrap();
        if (authUser?.id_user) {
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level || 1,
                kode_trans: 'PRODUCT CATEGORY',
                judul: 'Category Diperbarui',
                pesan: `Category ${result.nm_product_kategori} berhasil diperbarui oleh ${authUser.nm_users}`,
                action: 'Update'
            }).catch(() => { });
        }
        return result;
    };

    const removeCategory = async (id: string | number) => {
        const category = categories.find(c => String(c.id_product_kategori) === String(id));
        const result = await dispatch(deleteCategory(id)).unwrap();
        if (authUser?.id_user) {
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level || 1,
                kode_trans: 'PRODUCT CATEGORY',
                judul: 'Category Dihapus',
                pesan: `Category ${category?.nm_product_kategori || id} berhasil dihapus oleh ${authUser.nm_users}`,
                action: 'Delete'
            }).catch(() => { });
        }
        return result;
    };

    const dismissError = () => dispatch(clearError());
    const dismissSuccess = () => dispatch(clearSuccessMessage());

    return {
        categories: filteredCategories,
        isLoading: loading,
        error,
        successMessage,
        searchQuery,
        setSearchQuery,
        refreshData,
        formData,
        setFormData,
        validateForm,
        addCategory,
        editCategory,
        removeCategory,
        dismissError,
        dismissSuccess
    };
}
