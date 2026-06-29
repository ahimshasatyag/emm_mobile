import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchProfileDataApi } from '../api/profile.api';
import { setData, setLoading, setError } from '../store/profileSlice';

export const useProfileData = () => {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.profile);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (!isMounted) return;
            dispatch(setLoading(true));
            try {
                const result = await fetchProfileDataApi();
                if (isMounted) {
                    dispatch(setData(result));
                }
            } catch (err: any) {
                if (isMounted) {
                    dispatch(setError(err.message || 'Gagal memuat data profil'));
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    return { data, isLoading, error };
};
