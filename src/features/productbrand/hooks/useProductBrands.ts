import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../stores';
import { fetchBrands, createBrand, updateBrand, deleteBrand, clearError } from '../stores/productBrandSlice';
import { ProductBrandFormData } from '../types/productbrand.types';

export function useProductBrands() {
    const dispatch = useDispatch<AppDispatch>();
    const { data: brands, isLoading, error } = useSelector((state: RootState) => state.productBrand);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState<ProductBrandFormData>({
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
        if (!searchQuery.trim()) return brands;

        const lowerQuery = searchQuery.toLowerCase();
        return brands.filter(brand =>
            brand.nm_product_brand.toLowerCase().includes(lowerQuery) ||
            brand.id_product_brand.toLowerCase().includes(lowerQuery)
        );
    }, [brands, searchQuery]);

    const refreshData = () => {
        dispatch(fetchBrands());
    };

    const addBrand = async (data: ProductBrandFormData) => {
        return dispatch(createBrand(data)).unwrap();
    };

    const editBrand = async (id: string, data: Partial<ProductBrandFormData>) => {
        return dispatch(updateBrand({ id, data })).unwrap();
    };

    const removeBrand = async (id: string) => {
        return dispatch(deleteBrand(id)).unwrap();
    };

    const dismissError = () => dispatch(clearError());

    return {
        brands: filteredBrands,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        formData,
        setFormData,
        validateForm,
        refreshData,
        addBrand,
        editBrand,
        removeBrand,
        dismissError
    };
}
