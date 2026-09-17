import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchListPayment, setFilters, fetchPaymentDetail, clearDetail } from '../stores/listpaymentSlice';
import { Alert } from 'react-native';

export const useListPayment = () => {
    const dispatch = useAppDispatch();
    const { items, summary, currentDetail, isLoading, isLoadingDetail, filters, error } = useAppSelector((state) => state.listpayment);

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

    const loadDetail = useCallback((id: string) => {
        dispatch(fetchPaymentDetail(id));
    }, [dispatch]);

    const resetDetail = useCallback(() => {
        dispatch(clearDetail());
    }, [dispatch]);

    return {
        items,
        summary,
        currentDetail,
        isLoading,
        isLoadingDetail,
        error,
        periode,
        setPeriode,
        ckPeriode,
        setCkPeriode,
        idCustomer,
        setIdCustomer,
        idProduct,
        setIdProduct,
        handleSearch,
        loadDetail,
        resetDetail
    };
};
