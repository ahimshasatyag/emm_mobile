import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import {
    fetchProductPriceMktProducts,
    fetchProductPriceMktDetail,
    clearDetail,
    clearError,
} from '../stores/productPriceMktSlice';

export const useProductPriceMkt = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, selectedDetail, options, isLoading, isDetailLoading, error } = useSelector(
        (state: RootState) => state.productPriceMkt
    );

    const loadProducts = async () => {
        await dispatch(fetchProductPriceMktProducts()).unwrap();
    };

    const loadDetail = async (id_product: string) => {
        await dispatch(fetchProductPriceMktDetail(id_product)).unwrap();
    };

    const resetDetail = () => {
        dispatch(clearDetail());
    };

    const resetError = () => {
        dispatch(clearError());
    };

    return {
        products,
        selectedDetail,
        options,
        isLoading,
        isDetailLoading,
        error,
        loadProducts,
        loadDetail,
        resetDetail,
        resetError,
    };
};
