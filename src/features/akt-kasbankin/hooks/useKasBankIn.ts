import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { 
    fetchKasBankIns, 
    fetchMasterData, 
    fetchKasBankInById, 
    saveKasBankIn, 
    clearCurrentKasBankIn 
} from '../stores/kasbankinSlice';
import { KasBankInHeader, KasBankInDetail } from '../types/kasbankin.types';

export const useKasBankIn = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const {
        kasBankIns,
        banks,
        coas,
        sos,
        currentHeader,
        currentDetails,
        isLoading,
        isSubmitting,
        error
    } = useSelector((state: RootState) => state.kasbankin);

    const loadKasBankIns = useCallback(async () => {
        await dispatch(fetchKasBankIns()).unwrap();
    }, [dispatch]);

    const loadMasterData = useCallback(async () => {
        await dispatch(fetchMasterData()).unwrap();
    }, [dispatch]);

    const loadKasBankInById = useCallback(async (id: string) => {
        await dispatch(fetchKasBankInById(id)).unwrap();
    }, [dispatch]);

    const submitKasBankIn = useCallback(async (data: { header: Partial<KasBankInHeader>, details: Partial<KasBankInDetail>[] }) => {
        await dispatch(saveKasBankIn(data)).unwrap();
    }, [dispatch]);

    const resetCurrent = useCallback(() => {
        dispatch(clearCurrentKasBankIn());
    }, [dispatch]);

    return {
        kasBankIns,
        banks,
        coas,
        sos,
        currentHeader,
        currentDetails,
        isLoading,
        isSubmitting,
        error,
        loadKasBankIns,
        loadMasterData,
        loadKasBankInById,
        submitKasBankIn,
        resetCurrent,
    };
};
