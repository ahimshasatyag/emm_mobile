import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchProducts, fetchProductDetail, clearDetail } from '../stores/productPriceAgentSlice';

export function useProductPriceAgent() {
    const dispatch = useAppDispatch();
    const { products, selectedDetail, options, isLoading, isDetailLoading, error } = useAppSelector(
        (state) => state.productPriceAgent
    );

    const loadProducts = useCallback(async () => {
        await dispatch(fetchProducts()).unwrap();
    }, [dispatch]);

    const loadDetail = useCallback(async (id_product: string) => {
        await dispatch(fetchProductDetail(id_product)).unwrap();
    }, [dispatch]);

    const resetDetail = useCallback(() => {
        dispatch(clearDetail());
    }, [dispatch]);

    return {
        products,
        selectedDetail,
        options,
        isLoading,
        isDetailLoading,
        error,
        loadProducts,
        loadDetail,
        resetDetail
    };
}
