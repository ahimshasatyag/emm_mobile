import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { notificationService } from '../../../services/notification/notificationService';
import {
    fetchSalesContracts,
    getSalesContractById,
    fetchSOWithoutContractList,
    getSOWithoutContractById,
    createSalesContract,
    updateSalesContract,
    clearCurrentContract,
    clearCurrentSOWithoutContract
} from '../stores/salescontractSlice';
import { SalesContract } from '../types/salescontract.types';

export function useSalesContract() {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state) => state.auth.user);
    const {
        items,
        soWithoutContracts,
        currentContract,
        currentSOWithoutContract,
        isLoading,
        error
    } = useAppSelector(state => state.salescontract);

    const loadContracts = useCallback(() => {
        dispatch(fetchSalesContracts());
    }, [dispatch]);

    const getContractById = useCallback((id: string) => {
        dispatch(getSalesContractById(id));
    }, [dispatch]);

    const loadSOWithoutContract = useCallback(() => {
        dispatch(fetchSOWithoutContractList());
    }, [dispatch]);

    const getSOWithoutContract = useCallback((id: string) => {
        dispatch(getSOWithoutContractById(id));
    }, [dispatch]);

    const createContract = useCallback(async (data: any) => {
        const res = await dispatch(createSalesContract(data)).unwrap();
        if (res) {
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'SALES CONTRACT',
                judul: 'Sales Contract Baru',
                pesan: `Sales Contract ${res.kode || ''} berhasil ditambahkan oleh ${authUser?.nm_users || 'User'}`,
                action: 'Create'
            }).catch(() => {});
        }
        return res;
    }, [dispatch, authUser]);

    const updateContract = useCallback(async (id: string, data: Partial<SalesContract>) => {
        const res = await dispatch(updateSalesContract({ id, data })).unwrap();
        if (res) {
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'SALES CONTRACT',
                judul: 'Sales Contract Diperbarui',
                pesan: `Sales Contract berhasil diperbarui oleh ${authUser?.nm_users || 'User'}`,
                action: 'Update'
            }).catch(() => {});
        }
        return res;
    }, [dispatch, authUser]);

    const clearContract = useCallback(() => {
        dispatch(clearCurrentContract());
    }, [dispatch]);

    const clearSOWithoutContract = useCallback(() => {
        dispatch(clearCurrentSOWithoutContract());
    }, [dispatch]);

    const validateForm = useCallback((form: Partial<SalesContract>, fCompany: boolean, activeItems: any[]): string | null => {
        const isAllEmpty = fCompany
            ? (!form.nik && !form.alamat && !form.nama_lengkap && !form.nib && !form.npwp)
            : (!form.nik && !form.alamat);

        if (isAllEmpty) {
            return "Semua field harus diisi!";
        }

        if (!form.nik) return "NIK Tidak Boleh kosong!";
        if (!form.alamat) return "Alamat Tidak Boleh kosong!";
        if (fCompany) {
            if (!form.nama_lengkap) return "Nama Lengkap Tidak Boleh kosong!";
            if (!form.nib) return "NIB Tidak Boleh kosong!";
            if (!form.npwp) return "NPWP Tidak Boleh kosong!";
        }
        if (!activeItems || activeItems.length === 0) return "Pilih Barang Minimal 1 !";

        return null;
    }, []);

    return {
        items,
        soWithoutContracts,
        currentContract,
        currentSOWithoutContract,
        isLoading,
        error,
        loadContracts,
        getContractById,
        loadSOWithoutContract,
        getSOWithoutContract,
        createContract,
        updateContract,
        clearContract,
        clearSOWithoutContract,
        validateForm
    };
}
