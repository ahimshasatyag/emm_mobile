import { useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../stores';
import { 
    fetchSubCategories, 
    createSubCategory, 
    updateSubCategory,
    deleteSubCategory,
    clearMessages 
} from '../stores/productSubCategorySlice';
import { ProductSubCategoryFormData } from '../types/productsubcategory.types';
import { notificationService } from '../../../services/notification/notificationService';
import { useAppSelector } from '../../../hooks/useAppSelector';

export function useProductSubCategories() {
    const dispatch = useDispatch<AppDispatch>();
    
    const authUser = useAppSelector((state: RootState) => state.auth.user);
    
    const { 
        data: subCategories, 
        isLoading, 
        error, 
        successMessage 
    } = useSelector((state: RootState) => state.productSubCategory);

    // Also get categories for the dropdown
    const { categories } = useSelector((state: RootState) => state.productCategory);

    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState<ProductSubCategoryFormData>({
        id_product_kategori: '',
        nm_product_sub_kategori: ''
    });

    const validateForm = (): string | null => {
        if (!formData.id_product_kategori && !formData.nm_product_sub_kategori.trim()) {
            return 'Semua field harus diisi!';
        }

        if (!formData.id_product_kategori) return 'Kategori wajib dipilih!';
        if (!formData.nm_product_sub_kategori.trim()) return 'Nama Sub Kategori wajib diisi!';

        return null;
    };

    const filteredSubCategories = useMemo(() => {
        if (!searchQuery) return subCategories;
        const lowerQuery = searchQuery.toLowerCase();
        return subCategories.filter(sc => 
            (sc.nm_product_sub_kategori || '').toLowerCase().includes(lowerQuery) ||
            (sc.kode_product_sub_kategori || '').toLowerCase().includes(lowerQuery) ||
            (sc.nm_product_kategori || '').toLowerCase().includes(lowerQuery)
        );
    }, [subCategories, searchQuery]);

    const loadSubCategories = useCallback(() => {
        dispatch(fetchSubCategories());
    }, [dispatch]);

    const addSubCategory = useCallback(async (data: ProductSubCategoryFormData) => {
        const result = await dispatch(createSubCategory(data)).unwrap();
        if (authUser?.id_user) {
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level || 1,
                kode_trans: 'PRODUCT SUBCATEGORY',
                judul: 'Sub Category Baru',
                pesan: `Sub Category ${result.nm_product_sub_kategori} berhasil ditambahkan oleh ${authUser.nm_users}`,
                action: 'Create'
            }).catch(() => { });
        }
        return result;
    }, [dispatch, authUser]);

    const editSubCategory = useCallback(async (id: string, data: Partial<ProductSubCategoryFormData>) => {
        const result = await dispatch(updateSubCategory({ id, data })).unwrap();
        if (authUser?.id_user) {
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level || 1,
                kode_trans: 'PRODUCT SUBCATEGORY',
                judul: 'Sub Category Diperbarui',
                pesan: `Sub Category ${result.nm_product_sub_kategori} berhasil diperbarui oleh ${authUser.nm_users}`,
                action: 'Update'
            }).catch(() => { });
        }
        return result;
    }, [dispatch, authUser]);

    const removeSubCategory = useCallback(async (id: string | number) => {
        const subCategory = subCategories.find(c => String(c.id_product_sub_kategori) === String(id));
        const result = await dispatch(deleteSubCategory(id)).unwrap();
        if (authUser?.id_user) {
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level || 1,
                kode_trans: 'PRODUCT SUBCATEGORY',
                judul: 'Sub Category Dihapus',
                pesan: `Sub Category ${subCategory?.nm_product_sub_kategori || id} berhasil dihapus oleh ${authUser.nm_users}`,
                action: 'Delete'
            }).catch(() => { });
        }
        return result;
    }, [dispatch, authUser, subCategories]);

    const clearStatusMessages = useCallback(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    return {
        subCategories: filteredSubCategories,
        categories,
        isLoading,
        error,
        successMessage,
        searchQuery,
        setSearchQuery,
        loadSubCategories,
        addSubCategory,
        editSubCategory,
        removeSubCategory,
        clearStatusMessages,
        formData,
        setFormData,
        validateForm
    };
}
