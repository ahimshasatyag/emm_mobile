import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { ProductPriceFormData } from '../types/productprice.types';
import { notificationService } from '../../../services/notification/notificationService';
import { 
    fetchProductPrices, 
    createProductPrice, 
    updateProductPrice, 
    deleteProductPrice,
    fetchSupportData,
    clearError 
} from '../stores/productPriceSlice';

export const useProductPrice = () => {
    const dispatch = useDispatch<AppDispatch>();
    const authUser = useSelector((state: RootState) => state.auth.user);
    const { prices, supportData, isLoading, error } = useSelector((state: RootState) => state.productPrice);

    const loadPrices = async () => {
        await dispatch(fetchProductPrices()).unwrap();
    };

    const loadSupportData = async () => {
        await dispatch(fetchSupportData()).unwrap();
    };

    const addPrice = async (data: ProductPriceFormData) => {
        const result = await dispatch(createProductPrice(data)).unwrap();
        if (result) {
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'PRODUCT PRICE',
                judul: 'Product Price Baru',
                pesan: `Product Price ${result.nm_product || data.id_product} berhasil ditambahkan oleh ${authUser?.nm_users}`,
                action: 'Create'
            }).catch(() => {});
        }
        return result;
    };

    const editPrice = async (id: string, data: ProductPriceFormData) => {
        const result = await dispatch(updateProductPrice({ id, data })).unwrap();
        if (result) {
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'PRODUCT PRICE',
                judul: 'Product Price Diperbarui',
                pesan: `Product Price ${result.nm_product || id} berhasil diperbarui oleh ${authUser?.nm_users}`,
                action: 'Update'
            }).catch(() => {});
        }
        return result;
    };

    const removePrice = async (id: string, nm_product?: string) => {
        await dispatch(deleteProductPrice(id)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: 'PRODUCT PRICE',
            judul: 'Product Price Dihapus',
            pesan: `Product Price ${nm_product || id} berhasil dihapus oleh ${authUser?.nm_users}`,
            action: 'Delete'
        }).catch(() => {});
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

        const idProd = data.id_product ?? '';
        const price = data.price ?? data.product_price ?? '';
        const agentPrice = data.agentPrice ?? data.product_price_agent ?? '';
        const kurs = data.kurs ?? data.kurs_bank ?? '';
        const deliveryTerm = data.deliveryTerm ?? data.delivery_term ?? '';
        
        if (!String(idProd).trim()) return 'Pilih Produk terlebih dahulu.';
        if (!String(price).trim() || !String(agentPrice).trim()) return 'Harga Jual dan Harga Agen wajib diisi.';
        if (!String(kurs).trim()) return 'Kurs wajib diisi.';
        if (!String(deliveryTerm).trim()) return 'Delivery Term wajib diisi.';

        return null;
    };

    return {
        prices,
        supportData,
        isLoading,
        error,
        loadPrices,
        loadSupportData,
        addPrice,
        editPrice,
        removePrice,
        resetError,
        validateForm
    };
};
