import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchListPayment, setFilters } from '../stores/listpaymentSlice';
import { Alert } from 'react-native';

export const useListPayment = () => {
    const dispatch = useAppDispatch();
    const { items, summary, isLoading, filters, error } = useAppSelector((state) => state.listpayment);

    const [periode, setPeriode] = useState(filters.periode);
    const [ckPeriode, setCkPeriode] = useState(filters.ck_periode);
    const [idCustomer, setIdCustomer] = useState(filters.id_customers);
    const [idProduct, setIdProduct] = useState(filters.id_product);

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = () => {
        if (ckPeriode && idCustomer === '' && idProduct === '') {
            Alert.alert('Perhatian', 'Pilih Customer atau Product Terlebih Dahulu jika All periode');
            return;
        }

        dispatch(setFilters({
            periode,
            ck_periode: ckPeriode,
            id_customers: idCustomer,
            id_product: idProduct
        }));

        dispatch(fetchListPayment({
            periode,
            ck_periode: ckPeriode,
            id_customers: idCustomer,
            id_product: idProduct
        }));
    };

    return {
        items,
        summary,
        isLoading,
        error,
        periode,
        setPeriode,
        ckPeriode,
        setCkPeriode,
        idCustomer,
        setIdCustomer,
        idProduct,
        setIdProduct,
        handleSearch
    };
};
