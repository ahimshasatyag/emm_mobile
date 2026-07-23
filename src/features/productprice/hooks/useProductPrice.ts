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

    const validateForm = (data: any): string | null => {
        if (Array.isArray(data)) {
            if (data.length === 0) return 'Tambahkan minimal 1 data.';
            
            const isValid = data.every(item => {
                const idProd = item.idProduct ?? item.id_product ?? item.code_product ?? 'valid';
                const price = item.price ?? item.product_price ?? '';
                const agentPrice = item.agentPrice ?? item.product_price_agent ?? '';
                const kurs = item.kurs ?? item.kurs_bank ?? '';
                const deliveryTerm = item.deliveryTerm ?? item.delivery_term ?? '';
                
                return String(idProd).trim() && String(price).trim() && String(agentPrice).trim() && String(kurs).trim() && String(deliveryTerm).trim();
            });
            
            return isValid ? null : 'Harap isi semua field yang wajib pada semua baris.';
        }

        const price = data.price ?? data.product_price ?? '';
        const agentPrice = data.agentPrice ?? data.product_price_agent ?? '';
        
        if (!String(price).trim() || !String(agentPrice).trim()) {
            return 'Harga Jual dan Harga Agen wajib diisi.';
        }

        return null;
    };

    return {
        prices,
        isLoading,
        error,
        loadPrices,
        addPrice,
        editPrice,
        resetError,
        validateForm
    };
};
