import { useState, useEffect } from 'react';
import { CounterFormData } from '../types/counter.types';
import { updateCounterApi, fetchCounterByIdApi } from '../api/counter.api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setData } from '../stores/counterSlice';

export function useCounterEdit(id: string) {
    const dispatch = useAppDispatch();
    const counterList = useAppSelector((state) => state.counter.data);

    const [formData, setFormData] = useState<CounterFormData>({
        no_counter: '',
    });
    
    // Display only fields
    const [displayData, setDisplayData] = useState({
        id_counter: '',
        periode: ''
    });

    const [isFetching, setIsFetching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadCounter();
        }
    }, [id]);

    const loadCounter = async () => {
        setIsFetching(true);
        setError(null);
        try {
            const data = await fetchCounterByIdApi(id);
            setFormData({
                no_counter: data.no_counter.toString(),
            });
            setDisplayData({
                id_counter: data.id_counter,
                periode: data.periode,
            });
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data counter');
        } finally {
            setIsFetching(false);
        }
    };

    const validateForm = (): string | null => {
        if (!formData.no_counter) return 'Counter wajib diisi';
        if (isNaN(Number(formData.no_counter))) return 'Counter harus berupa angka';
        return null;
    };

    const handleSave = async (): Promise<boolean> => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return false;
        }

        setIsSaving(true);
        setError(null);
        try {
            const updated = await updateCounterApi(id, formData);
            const newList = counterList.map(item => item.id_counter === id ? updated : item);
            dispatch(setData(newList));
            return true;
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat menyimpan data');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (field: keyof CounterFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    return {
        formData,
        displayData,
        isFetching,
        isSaving,
        error,
        updateField,
        handleSave,
        loadCounter,
    };
}
