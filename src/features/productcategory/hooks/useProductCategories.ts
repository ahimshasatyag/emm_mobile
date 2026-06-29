import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchCategories, createCategory, updateCategory, deleteCategory, clearError, clearSuccessMessage } from '../stores/productCategorySlice';
import { ProductCategoryFormData } from '../types/productcategory.types';

export function useProductCategories() {
    const dispatch = useAppDispatch();
    const { categories, loading, error, successMessage } = useAppSelector((state) => state.productCategory);
    const [searchQuery, setSearchQuery] = useState('');

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
        return dispatch(createCategory(data)).unwrap();
    };

    const editCategory = async (id: string, data: Partial<ProductCategoryFormData>) => {
        return dispatch(updateCategory({ id, data })).unwrap();
    };

    const removeCategory = async (id: string) => {
        return dispatch(deleteCategory(id)).unwrap();
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
        addCategory,
        editCategory,
        removeCategory,
        dismissError,
        dismissSuccess
    };
}
