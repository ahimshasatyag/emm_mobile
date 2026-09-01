import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchProducts, fetchProductDetail, clearDetail } from '../stores/productPriceAgentSlice';
import { productPriceAgentApi } from '../api/api';
import { fetchNotifications } from '../../../stores/notificationSlice';

export function useProductPriceAgent() {
    const dispatch = useAppDispatch();
    const { products, selectedDetail, options, isLoading, isDetailLoading, error } = useAppSelector(
        (state) => state.productPriceAgent
    );
    const user = useAppSelector((state: any) => state.auth?.user);

    const loadProducts = useCallback(async () => {
        await dispatch(fetchProducts()).unwrap();
    }, [dispatch]);

    const loadDetail = useCallback(async (id_product: string) => {
        await dispatch(fetchProductDetail(id_product)).unwrap();
    }, [dispatch]);

    const resetDetail = useCallback(() => {
        dispatch(clearDetail());
    }, [dispatch]);

    const tambahKeranjang = useCallback(async (id_product: string, qty: number = 1) => {
        try {
            const result = await productPriceAgentApi.tambahKeranjang(id_product, qty);
            if (user?.id) {
                dispatch(fetchNotifications(user.id) as any);
            }
            return result;
        } catch (err: any) {
            throw err;
        }
    }, [dispatch, user?.id]);

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
        tambahKeranjang
    };
}
