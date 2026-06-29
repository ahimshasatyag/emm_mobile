import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../stores';
import { 
    fetchUnits, 
    createUnit, 
    updateUnit, 
    deleteUnit,
    clearError,
    clearSuccessMessage 
} from '../stores/productUnitSlice';
import { ProductUnitFormData } from '../types/productunit.types';

export function useProductUnits() {
    const dispatch = useDispatch<AppDispatch>();
    const { units, isLoading, error, successMessage } = useSelector((state: RootState) => state.productUnit);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUnits = units.filter(unit => 
        unit.nm_product_satuan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.id_product_satuan.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const loadUnits = useCallback(() => {
        dispatch(fetchUnits());
    }, [dispatch]);

    const addUnit = useCallback(async (data: ProductUnitFormData) => {
        const result = await dispatch(createUnit(data)).unwrap();
        return result;
    }, [dispatch]);

    const editUnit = useCallback(async (id: string, data: ProductUnitFormData) => {
        const result = await dispatch(updateUnit({ id, data })).unwrap();
        return result;
    }, [dispatch]);

    const removeUnit = useCallback(async (id: string) => {
        const result = await dispatch(deleteUnit(id)).unwrap();
        return result;
    }, [dispatch]);

    const dismissError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const dismissSuccess = useCallback(() => {
        dispatch(clearSuccessMessage());
    }, [dispatch]);

    return {
        units: filteredUnits,
        allUnits: units,
        isLoading,
        error,
        successMessage,
        searchQuery,
        setSearchQuery,
        loadUnits,
        addUnit,
        editUnit,
        removeUnit,
        dismissError,
        dismissSuccess
    };
}
