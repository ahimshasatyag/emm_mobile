import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores';
import { productsnApi } from '../api/productsn.api';
import { ProductSnFormData } from '../types/productsn.types';
import {
    setLoading,
    setError,
    setProductSns,
    setSupportData,
    addProductSn,
    updateProductSn,
    deleteProductSn
} from '../stores/productsnSlice';
import { notificationService } from '../../../services/notification/notificationService';
import { fetchNotifications } from '../../../stores/notificationSlice';

export function useProductsn() {
    const dispatch = useDispatch();
    const { productSns, supportData, isLoading, error } = useSelector((state: RootState) => state.productsn);
    const { user } = useSelector((state: RootState) => state.auth);

    const fetchInitialData = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const [fetchedProductSns, fetchedSupport] = await Promise.all([
                productsnApi.getProductSns(),
                productsnApi.getSupportData()
            ]);
            dispatch(setSupportData(fetchedSupport.data_barang || []));
            dispatch(setProductSns(fetchedProductSns));
        } catch (err: any) {
            dispatch(setError(err.message || 'Gagal memuat data Product SN'));
        }
    }, [dispatch]);

    const fetchProductSns = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await productsnApi.getProductSns();
            dispatch(setProductSns(data));
        } catch (err: any) {
            dispatch(setError(err.message || 'Gagal memuat data Product SN'));
        }
    }, [dispatch]);

    const createProductSn = useCallback(async (data: ProductSnFormData) => {
        dispatch(setLoading(true));
        try {
            const newProductSn = await productsnApi.createProductSn(data);
            dispatch(addProductSn(newProductSn));

            await notificationService.store({
                user_id: user?.id_user ?? 1,
                id_users_level: user?.id_users_level ?? 1,
                kode_trans: 'SERIAL NUMBER',
                judul: 'Serial Number Baru',
                pesan: `Serial Number ${data.sn} berhasil ditambahkan oleh ${user?.nm_users ?? 'Sistem'}`,
                action: 'Create'
            }).catch(() => { });

            if (user?.id_user) {
                dispatch(fetchNotifications(user.id_user) as any);
            }

            return newProductSn;
        } catch (err: any) {
            dispatch(setError(err.message || 'Gagal menambahkan Product SN'));
            throw err;
        }
    }, [dispatch, user]);

    const editProductSn = useCallback(async (id: string, data: ProductSnFormData) => {
        dispatch(setLoading(true));
        try {
            const updatedProductSn = await productsnApi.updateProductSn(id, data);
            dispatch(updateProductSn(updatedProductSn));

            await notificationService.store({
                user_id: user?.id_user ?? 1,
                id_users_level: user?.id_users_level ?? 1,
                kode_trans: 'SERIAL NUMBER',
                judul: 'Serial Number Diperbarui',
                pesan: `Serial Number ${data.sn} berhasil diperbarui oleh ${user?.nm_users ?? 'Sistem'}`,
                action: 'Update'
            }).catch(() => { });

            if (user?.id_user) {
                dispatch(fetchNotifications(user.id_user) as any);
            }

            return updatedProductSn;
        } catch (err: any) {
            dispatch(setError(err.message || 'Gagal memperbarui Product SN'));
            throw err;
        }
    }, [dispatch, user]);

    const removeProductSn = useCallback(async (id: string) => {
        dispatch(setLoading(true));
        try {
            const productSnToDelete = productSns.find(p => String(p.id_product_sn) === String(id));
            await productsnApi.deleteProductSn(id);
            dispatch(deleteProductSn(id));

            if (productSnToDelete) {
                await notificationService.store({
                    user_id: user?.id_user ?? 1,
                    id_users_level: user?.id_users_level ?? 1,
                    kode_trans: 'SERIAL NUMBER',
                    judul: 'Serial Number Dihapus',
                    pesan: `Serial Number ${productSnToDelete.sn} berhasil dihapus oleh ${user?.nm_users ?? 'Sistem'}`,
                    action: 'Delete'
                }).catch(() => { });

                if (user?.id_user) {
                    dispatch(fetchNotifications(user.id_user) as any);
                }
            }

        } catch (err: any) {
            dispatch(setError(err.message || 'Gagal menghapus Product SN'));
            throw err;
        }
    }, [dispatch, user, productSns]);

    const validateForm = (data: Partial<ProductSnFormData>): string | null => {
        if (!data.id_product) return 'Harap pilih produk.';
        if (!data.sn?.trim()) return 'Harap isi Serial Number (SN).';
        if (data.nqty === undefined || data.nqty === null) return 'Harap isi QTY.';
        return null;
    };

    return {
        productSns,
        supportData,
        isLoading,
        error,
        fetchInitialData,
        fetchProductSns,
        createProductSn,
        editProductSn,
        removeProductSn,
        validateForm
    };
}
