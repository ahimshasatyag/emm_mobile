import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchCustomers } from '../../customers/stores/customersSlice';
import { fetchProducts } from '../../products/stores/productsSlice';
import { LeadsFormData, LeadsDetail } from '../types/leads.types';
import { Alert } from 'react-native';

const INITIAL_FORM_DATA: LeadsFormData = {
    id_customers: '',
    customers_address: '',
    notes: '',
    kurs: 15500, // Default kurs
    products: [],
    visits: []
};

export function useLeadsForm(initialData?: LeadsDetail) {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    
    // Select reference data from Redux
    const customers = useAppSelector(state => state.customers.data);
    const productsList = useAppSelector(state => state.products.products);
    
    const [formData, setFormData] = useState<LeadsFormData>(INITIAL_FORM_DATA);

    const resetForm = () => {
        if (initialData) {
            setFormData({
                id_customers: initialData.id_customers || '',
                customers_address: initialData.customers_address || '',
                notes: initialData.notes || '',
                kurs: initialData.kurs || 15500,
                products: initialData.products ? initialData.products.map(p => ({
                    id_product: p.id_product || '',
                    product_price: p.product_price || 0,
                    nqty: p.nqty || 1,
                    persentase: p.persentase || 0
                })) : [],
                visits: initialData.visits ? initialData.visits.map(v => ({
                    date_visit: v.date_visit || '',
                    visit_activity: v.visit_activity || ''
                })) : []
            });
        } else {
            setFormData(INITIAL_FORM_DATA);
        }
    };

    useEffect(() => {
        resetForm();
    }, [initialData]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Load Options
    useEffect(() => {
        dispatch(fetchCustomers());
        dispatch(fetchProducts());
    }, [dispatch]);

    const refreshOptions = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                dispatch(fetchCustomers()),
                dispatch(fetchProducts())
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const updateField = (field: keyof LeadsFormData, value: any) => {
        setFormData(prev => {
            const next = { ...prev, [field]: value };
            
            // Auto update address if customer changes
            if (field === 'id_customers') {
                const selectedCustomer = customers.find(c => c.id_customers === value);
                if (selectedCustomer) {
                    next.customers_address = selectedCustomer.customers_address || '';
                }
            }
            
            return next;
        });
    };

    // Product Tab Functions
    const addProductRow = () => {
        setFormData(prev => ({
            ...prev,
            products: [...prev.products, { id_product: '', product_price: 0, nqty: 1, persentase: 0 }]
        }));
    };

    const removeProductRow = (index: number) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index)
        }));
    };

    const updateProductRow = (index: number, field: string, value: any) => {
        setFormData(prev => {
            const newProducts = [...prev.products];
            newProducts[index] = { ...newProducts[index], [field]: value };
            
            // Auto fill price when product is selected
            if (field === 'id_product') {
                const selectedProd = productsList.find(p => p.id_product === value);
                if (selectedProd) {
                    newProducts[index].product_price = selectedProd.product_price * prev.kurs;
                }
            }
            
            return { ...prev, products: newProducts };
        });
    };

    // Visit Tab Functions
    const addVisitRow = () => {
        // format date d-m-Y
        const today = new Date();
        const d = String(today.getDate()).padStart(2, '0');
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const y = today.getFullYear();
        const defaultDate = `${d}-${m}-${y}`;

        setFormData(prev => ({
            ...prev,
            visits: [...prev.visits, { date_visit: defaultDate, visit_activity: '' }]
        }));
    };

    const removeVisitRow = (index: number) => {
        setFormData(prev => ({
            ...prev,
            visits: prev.visits.filter((_, i) => i !== index)
        }));
    };

    const updateVisitRow = (index: number, field: string, value: any) => {
        setFormData(prev => {
            const newVisits = [...prev.visits];
            newVisits[index] = { ...newVisits[index], [field]: value };
            return { ...prev, visits: newVisits };
        });
    };

    const validateForm = (): string | null => {
        const isAllEmpty = !formData.id_customers && formData.products.length === 0 && formData.visits.length === 0;

        if (isAllEmpty) {
            return "Semua field harus diisi!";
        }

        if (!formData.id_customers) {
            return 'Customer wajib diisi';
        }

        const hasEmptyProduct = formData.products.some(p => !p.id_product || p.nqty <= 0);
        if (hasEmptyProduct) {
            return 'Semua baris barang harus memiliki produk dan QTY > 0';
        }

        return null;
    };

    const save = async (): Promise<boolean> => {

        try {
            setIsSaving(true);
            // Simulate API save
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan data');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        customers,
        productsList,
        isLoading,
        isSaving,
        error,
        updateField,
        addProductRow,
        removeProductRow,
        updateProductRow,
        addVisitRow,
        removeVisitRow,
        updateVisitRow,
        refreshOptions,
        resetForm,
        save,
        validateForm
    };
}
