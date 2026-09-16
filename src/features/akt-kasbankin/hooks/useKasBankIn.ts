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
import { notificationService } from '../../../services/notification/notificationService';
import { formatRp } from '../../../utils/helpers/money';

export const useKasBankIn = () => {
    const dispatch = useDispatch<AppDispatch>();
    const authUser = useSelector((state: RootState) => state.auth.user);

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
        const result = await dispatch(saveKasBankIn(data)).unwrap();

        const isUpdate = !!data.header.id_kb_masuk;
        const tipeKas = data.header.type_kb === 'k' ? 'Kas' : 'Bank';
        const msg = `Penerimaan ${tipeKas} sejumlah ${formatRp(data.header.v_amount || 0)} berhasil ${isUpdate ? 'diperbarui' : 'ditambahkan'} oleh ${authUser?.nm_users}`;

        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: data.header.code_kb_masuk ?? '',
            judul: isUpdate ? 'Kas/Bank Masuk Diperbarui' : 'Kas/Bank Masuk Baru',
            pesan: msg,
            action: isUpdate ? 'Update' : 'Create'
        }).catch(() => { });

        return result;
    }, [dispatch, authUser]);

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
