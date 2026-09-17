import { useAppSelector } from '../../../hooks/useAppSelector';

export const useHomeData = () => {
    const { data, isLoading, error } = useAppSelector((state) => state.home);
    return { data, isLoading, error };
};
