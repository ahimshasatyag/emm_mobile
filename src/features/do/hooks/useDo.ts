import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchDoList, fetchDoDetail, submitDoAction, clearDetail } from '../stores/doSlice';

export const useDo = () => {
    const dispatch = useAppDispatch();
    const { list, detail, loading, loadingDetail, error } = useAppSelector((state) => state.do);

    const getList = useCallback(() => {
        dispatch(fetchDoList());
    }, [dispatch]);

    const getDetail = useCallback((id: string) => {
        dispatch(fetchDoDetail(id));
    }, [dispatch]);

    const submitAction = useCallback(async (id: string, action: string) => {
        const result = await dispatch(submitDoAction({ id, action }));
        return result;
    }, [dispatch]);

    const resetDetail = useCallback(() => {
        dispatch(clearDetail());
    }, [dispatch]);

    return {
        list,
        detail,
        loading,
        loadingDetail,
        error,
        getList,
        getDetail,
        submitAction,
        resetDetail
    };
};
