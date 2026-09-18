import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchProfileDataApi } from '../api/profile.api';
import { setData, setLoading, setError } from '../store/profileSlice';

export const useProfileData = () => {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.profile);
    const authUser = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (!authUser?.username) return;

            if (!isMounted) return;
            dispatch(setLoading(true));
            try {
                const result = await fetchProfileDataApi(authUser.username);
                if (isMounted) {
                    dispatch(setData(result));
                }
            } catch (err: any) {
                if (isMounted) {
                    dispatch(setError(err.message || 'Gagal memuat data profil'));
                }
            }
        };

        if (authUser?.username) {
            loadData();
        } else {
            dispatch(setLoading(false));
        }

        return () => {
            isMounted = false;
        };
    }, [dispatch, authUser?.username]);

    return { data, isLoading, error };
};
