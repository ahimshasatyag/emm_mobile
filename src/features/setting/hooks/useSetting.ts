import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setData, setLoading, setError } from '../stores/settingSlice';
import { fetchSettingsApi } from '../api/setting.api';

export function useSetting() {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.setting);

    useEffect(() => {
        if (data.length === 0) {
            loadSettings();
        }
    }, []);

    const loadSettings = async () => {
        dispatch(setLoading(true));
        try {
            const result = await fetchSettingsApi();
            dispatch(setData(result));
        } catch (err: any) {
            dispatch(setError(err.message || 'Terjadi kesalahan'));
        }
    };

    return {
        data,
        isLoading,
        error,
        loadSettings,
    };
}
