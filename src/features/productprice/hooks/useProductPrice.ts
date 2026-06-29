import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { ProductPriceFormData } from '../types/productprice.types';
import { 
    fetchProductPrices, 
    createProductPrice, 
    updateProductPrice, 
    clearError 
} from '../stores/productPriceSlice';

export const useProductPrice = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { prices, isLoading, error } = useSelector((state: RootState) => state.productPrice);

    const loadPrices = async () => {
        await dispatch(fetchProductPrices()).unwrap();
    };

    const addPrice = async (data: ProductPriceFormData) => {
        return await dispatch(createProductPrice(data)).unwrap();
    };

    const editPrice = async (id: string, data: ProductPriceFormData) => {
        return await dispatch(updateProductPrice({ id, data })).unwrap();
    };

    const resetError = () => {
        dispatch(clearError());
    };

    return {
        prices,
        isLoading,
        error,
        loadPrices,
        addPrice,
        editPrice,
        resetError
    };
};
