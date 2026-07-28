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

    const validateForm = (headerData: Partial<KasBankInHeader>, detailData: Partial<KasBankInDetail>[]) => {
        if (!headerData.id_bank) return "Bank/Kas harus dipilih!";
        if (headerData.f_dp && !headerData.id_so) return "No. SO harus dipilih jika tipe DP!";
        if (detailData.length === 0) return "Minimal 1 detail COA harus diisi!";
        
        const totalDetail = detailData.reduce((sum, item) => sum + (item.v_amount || 0), 0);
        if (totalDetail !== (headerData.v_amount || 0)) return "Total nilai detail harus sama dengan Total (Amount)!";
        
        return null;
    };

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
        validateForm,
    };
};
