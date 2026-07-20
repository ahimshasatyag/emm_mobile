import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchMataUangData, setBaseCurrency } from '../stores/matauangSlice';

export const useMataUang = () => {
    const dispatch = useAppDispatch();
    const { items, isLoading, error, baseCurrency } = useAppSelector((state) => state.matauang);

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchMataUangData());
        }
    }, [dispatch, items.length]);

    const handleRefresh = () => {
        dispatch(fetchMataUangData());
    };

    const handleSetBaseCurrency = (currency: string) => {
        dispatch(setBaseCurrency(currency));
    };

    const getBaseCurrencyKurs = () => {
        if (!items || items.length === 0) return 1;
        const found = items.find(item => item.mata_uang === baseCurrency);
        return found ? found.kurs : 1;
    };

    const baseKurs = getBaseCurrencyKurs();

    // Data with calculated rate
    const calculatedItems = items.map(item => ({
        ...item,
        rate: item.kurs / baseKurs
    }));

    return {
        items: calculatedItems,
        isLoading,
        error,
        baseCurrency,
        handleRefresh,
        handleSetBaseCurrency
    };
};
