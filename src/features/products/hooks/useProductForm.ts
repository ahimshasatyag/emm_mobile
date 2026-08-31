import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchCategories, fetchSubCategories, fetchBrands, fetchSatuans } from '../stores/productsSlice';
import { productsApi } from '../api/products.api';
import { ProductFormData, ProductOption } from '../types/products.types';
import { Alert } from 'react-native';
import { notificationService } from '../../../services/notification/notificationService';

const INITIAL_FORM_DATA: ProductFormData = {
    code_product: '',
    nm_product: '',
    id_product_kategori: '',
    id_product_sub_kategori: '',
    id_product_brand: '',
    id_product_satuan: '',
    product_deskripsi: '',
    link_brosur: '',
    link_foto: '',
    options: []
};

export function useProductForm(productId?: string, initialData?: ProductFormData) {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const authUser = useAppSelector(state => state.auth.user);

    const { categories, subCategories, brands, satuans } = useAppSelector(state => state.products);

    const [formData, setFormData] = useState<ProductFormData>(initialData || INITIAL_FORM_DATA);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Load Options
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchBrands());
        dispatch(fetchSatuans());
    }, [dispatch]);

    // Fetch SubCategories when Category changes
    useEffect(() => {
        if (formData.id_product_kategori) {
            dispatch(fetchSubCategories(formData.id_product_kategori));
        }
    }, [formData.id_product_kategori, dispatch]);

    const loadInitialData = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await productsApi.fetchProductById(id);
            setFormData({
                code_product: data.code_product,
                nm_product: data.nm_product,
                id_product_kategori: data.id_product_kategori ? data.id_product_kategori.toString() : '',
                id_product_sub_kategori: data.id_product_sub_kategori ? data.id_product_sub_kategori.toString() : '',
                id_product_brand: data.id_product_brand ? data.id_product_brand.toString() : '',
                id_product_satuan: data.id_product_satuan ? data.id_product_satuan.toString() : '',
                product_deskripsi: data.product_deskripsi,
                link_brosur: data.link_brosur || '',
                link_foto: data.link_foto || '',
                options: data.options || []
            });
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data produk');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshOptions = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                dispatch(fetchCategories()),
                dispatch(fetchBrands()),
                dispatch(fetchSatuans())
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const updateField = (field: keyof ProductFormData, value: any) => {
        setFormData(prev => {
            const next = { ...prev, [field]: value };
            // Auto reset sub category if category changes
            if (field === 'id_product_kategori') {
                next.id_product_sub_kategori = '';
            }
            return next;
        });
    };

    const addOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, { nm_product_opt: '' }]
        }));
    };

    const removeOption = (index: number) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const updateOption = (index: number, value: string) => {
        setFormData(prev => {
            const newOptions = [...prev.options];
            newOptions[index].nm_product_opt = value;
            return { ...prev, options: newOptions };
        });
    };

    const validateForm = (): string | null => {
        if (!formData.code_product && !formData.nm_product && !formData.id_product_kategori && !formData.id_product_sub_kategori && !formData.id_product_brand && !formData.id_product_satuan && !formData.product_deskripsi) {
            return 'Semua field wajib diisi';
        }

        if (!formData.code_product) return 'Product Code harus diisi';
        if (!formData.nm_product) return 'Product Name harus diisi';
        if (!formData.id_product_kategori) return 'Category harus diisi';
        if (!formData.id_product_sub_kategori) return 'Sub Category harus diisi';
        if (!formData.id_product_brand) return 'Brand harus diisi';
        if (!formData.id_product_satuan) return 'Satuan harus diisi';
        if (!formData.product_deskripsi) return 'Deskripsi harus diisi';

        // Validate options
        const hasEmptyOption = formData.options.some(opt => !opt.nm_product_opt.trim());
        if (hasEmptyOption) {
            return 'Terdapat nama opsi yang kosong';
        }

        return null;
    };

    const save = async (): Promise<any> => {
        try {
            setIsSaving(true);
            setError(null);
            let res;

            const payloadToSubmit = { ...formData };
            if (payloadToSubmit.id_product_satuan) {
                payloadToSubmit.id_product_satuan = String(payloadToSubmit.id_product_satuan);
            }
            if (payloadToSubmit.id_product_brand) {
                payloadToSubmit.id_product_brand = String(payloadToSubmit.id_product_brand);
            }

            if (typeof payloadToSubmit.link_foto === 'string') delete payloadToSubmit.link_foto;
            if (typeof payloadToSubmit.link_brosur === 'string') delete payloadToSubmit.link_brosur;

            if (productId) {
                res = await productsApi.updateProduct(productId, payloadToSubmit);
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'PRODUCT',
                    judul: 'Product Diperbarui',
                    pesan: `Product ${formData.nm_product} berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => { });
            } else {
                res = await productsApi.createProduct(payloadToSubmit);
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'PRODUCT',
                    judul: 'Product Baru',
                    pesan: `Product ${formData.nm_product} berhasil ditambahkan oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => { });
            }
            setIsSaving(false);
            return res;
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan data');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const deleteProduct = async (id: string, name: string) => {
        try {
            setIsSaving(true);
            await productsApi.deleteProduct(id);
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'PRODUCT',
                judul: 'Product Dihapus',
                pesan: `Product ${name} telah dihapus oleh ${authUser?.nm_users}`,
                action: 'Delete'
            }).catch(() => { });
            navigation.goBack();
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Gagal menghapus produk');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        categories,
        subCategories,
        brands,
        satuans,
        isLoading,
        isSaving,
        error,
        updateField,
        addOption,
        removeOption,
        updateOption,
        loadInitialData,
        refreshOptions,
        validateForm,
        save,
        deleteProduct
    };
}
