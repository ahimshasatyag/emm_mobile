import { useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../stores';
import { 
    fetchSubCategories, 
    createSubCategory, 
    updateSubCategory,
    clearMessages 
} from '../stores/productSubCategorySlice';
import { ProductSubCategoryFormData } from '../types/productsubcategory.types';

export function useProductSubCategories() {
    const dispatch = useDispatch<AppDispatch>();
    
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
            sc.nm_product_sub_kategori.toLowerCase().includes(lowerQuery) ||
            sc.kode_product_sub_kategori.toLowerCase().includes(lowerQuery) ||
            sc.nm_product_kategori.toLowerCase().includes(lowerQuery)
        );
    }, [subCategories, searchQuery]);

    const loadSubCategories = useCallback(() => {
        dispatch(fetchSubCategories());
    }, [dispatch]);

    const addSubCategory = useCallback(async (data: ProductSubCategoryFormData) => {
        const result = await dispatch(createSubCategory(data)).unwrap();
        return result;
    }, [dispatch]);

    const editSubCategory = useCallback(async (id: string, data: Partial<ProductSubCategoryFormData>) => {
        const result = await dispatch(updateSubCategory({ id, data })).unwrap();
        return result;
    }, [dispatch]);

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
        clearStatusMessages,
        formData,
        setFormData,
        validateForm
    };
}
