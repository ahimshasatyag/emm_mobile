import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchProducts } from '../stores/productsSlice';

export function useProducts() {
    const dispatch = useAppDispatch();
    const { products, loading, error } = useAppSelector((state) => state.products);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;
        
        const lowerQuery = searchQuery.toLowerCase();
        return products.filter(product => 
            product.nm_product.toLowerCase().includes(lowerQuery) ||
            product.code_product.toLowerCase().includes(lowerQuery)
        );
    }, [products, searchQuery]);

    const refreshData = () => {
        dispatch(fetchProducts());
    };

    return {
        products: filteredProducts,
        isLoading: loading,
        error,
        searchQuery,
        setSearchQuery,
        refreshData
    };
}
