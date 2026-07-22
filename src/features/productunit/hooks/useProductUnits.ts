import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../stores';
import { 
    fetchUnits, 
    createUnit, 
    updateUnit, 
    deleteUnit,
    clearError
} from '../stores/productUnitSlice';
import { ProductUnitFormData } from '../types/productunit.types';

export function useProductUnits() {
    const dispatch = useDispatch<AppDispatch>();
    const { units, isLoading, error } = useSelector((state: RootState) => state.productUnit);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState<ProductUnitFormData>({
        nm_product_satuan: ''
    });

    const validateForm = (): string | null => {
        if (!formData.nm_product_satuan.trim()) {
            return 'Nama Satuan wajib diisi!';
        }
        return null;
    };

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

    return {
        units: filteredUnits,
        allUnits: units,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        formData,
        setFormData,
        validateForm,
        loadUnits,
        addUnit,
        editUnit,
        removeUnit,
        dismissError
    };
}
