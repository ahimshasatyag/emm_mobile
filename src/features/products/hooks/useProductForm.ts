import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchCategories, fetchSubCategories, fetchBrands, fetchSatuans } from '../stores/productsSlice';
import { productsApi } from '../api/products.api';
import { ProductFormData, ProductOption } from '../types/products.types';
import { Alert } from 'react-native';

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

export function useProductForm(productId?: string) {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    
    const { categories, subCategories, brands, satuans } = useAppSelector(state => state.products);
    
    const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
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
                id_product_kategori: data.id_product_kategori,
                id_product_sub_kategori: data.id_product_sub_kategori,
                id_product_brand: data.id_product_brand,
                id_product_satuan: data.id_product_satuan,
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

    const validate = (): boolean => {
        if (!formData.code_product || !formData.nm_product || !formData.id_product_kategori || !formData.id_product_sub_kategori || !formData.id_product_brand || !formData.id_product_satuan || !formData.product_deskripsi) {
            setError('Semua field wajib diisi');
            return false;
        }
        
        // Validate options
        const hasEmptyOption = formData.options.some(opt => !opt.nm_product_opt.trim());
        if (hasEmptyOption) {
            setError('Terdapat nama opsi yang kosong');
            return false;
        }

        setError(null);
        return true;
    };

    const save = async (): Promise<boolean> => {
        if (!validate()) return false;

        try {
            setIsSaving(true);
            if (productId) {
                await productsApi.updateProduct(productId, formData);
            } else {
                await productsApi.createProduct(formData);
            }
            return true;
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan data');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            setIsSaving(true);
            await productsApi.deleteProduct(id);
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
        save,
        deleteProduct
    };
}
