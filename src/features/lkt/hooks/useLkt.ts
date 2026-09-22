import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores';
import {
    fetchLkts, fetchLktById, createLkt, updateLkt, doneLkt, cancelLkt,
    fetchTeknisiOptions,
    createRealisasi, updateRealisasi, confirmRealisasi, closeRealisasi, cancelRealisasi, rejectRealisasi,
    setFilter, clearCurrentLkt
} from '../stores/lktSlice';
import { LktFilter } from '../types/lkt.types';
import { notificationService } from '../../../services/notification/notificationService';

export const useLkt = () => {
    const dispatch = useDispatch<any>();
    const { items, currentLkt, teknisiOptions, isLoading, error, filter } = useSelector((state: RootState) => state.lkt);
    const authUser = useSelector((state: RootState) => state.auth.user);

    // ===== LKT List =====
    const loadLkts = useCallback(async (currentFilter?: LktFilter) => {
        const result = await dispatch(fetchLkts());
        return result.payload;
    }, [dispatch]);

    // ===== LKT Detail =====
    const loadLktDetail = useCallback(async (id: string) => {
        const result = await dispatch(fetchLktById(id));
        return result.payload;
    }, [dispatch]);

    // ===== Create LKT =====
    const handleCreateLkt = async (payload: any): Promise<{ success: boolean; lkt_code?: string; message?: string }> => {
        try {
            const result = await dispatch(createLkt(payload)).unwrap();
            if (result?.status) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'LKT',
                    judul: 'LKT Baru',
                    pesan: `LKT berhasil dibuat oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => {});
                return { success: true, lkt_code: result.lkt_code };
            }
            return { success: false, message: result?.message || 'Gagal membuat LKT' };
        } catch (err: any) {
            return { success: false, message: err?.message || 'Terjadi kesalahan' };
        }
    };

    // ===== Update LKT =====
    const handleUpdateLkt = async (id: string, payload: any): Promise<{ success: boolean; message?: string }> => {
        try {
            const result = await dispatch(updateLkt({ id, payload })).unwrap();
            if (result?.status) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'LKT',
                    judul: 'LKT Diperbarui',
                    pesan: `LKT ${id} berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => {});
            }
            return { success: result?.status === true, message: result?.message };
        } catch (err: any) {
            return { success: false, message: err?.message || 'Terjadi kesalahan' };
        }
    };

    // ===== Done/Close LKT =====
    const handleDoneLkt = async (id: string, payload: any): Promise<{ success: boolean; message?: string }> => {
        try {
            const result = await dispatch(doneLkt({ id, payload })).unwrap();
            if (result?.status) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'LKT',
                    judul: 'LKT Selesai',
                    pesan: `LKT ${id} berhasil diselesaikan oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => {});
            }
            return { success: result?.status === true, message: result?.message };
        } catch (err: any) {
            return { success: false, message: err?.message || 'Terjadi kesalahan' };
        }
    };

    // ===== Cancel LKT =====
    const handleCancelLkt = async (id: string, payload: any): Promise<{ success: boolean; message?: string }> => {
        try {
            const result = await dispatch(cancelLkt({ id, payload })).unwrap();
            if (result?.status) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'LKT',
                    judul: 'LKT Dibatalkan',
                    pesan: `LKT ${id} dibatalkan oleh ${authUser?.nm_users}`,
                    action: 'Cancel'
                }).catch(() => {});
            }
            return { success: result?.status === true, message: result?.message };
        } catch (err: any) {
            return { success: false, message: err?.message || 'Terjadi kesalahan' };
        }
    };

    // ===== Teknisi Options =====
    const loadTeknisiOptions = useCallback(async () => {
        await dispatch(fetchTeknisiOptions());
    }, [dispatch]);

    // ===== Realisasi: Create Visit =====
    const handleCreateRealisasi = async (lktId: string, payload: any): Promise<{ success: boolean; lkt_sub_code?: number; message?: string }> => {
        try {
            const result = await dispatch(createRealisasi({ lktId, payload })).unwrap();
            if (result?.status) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'REALISASI',
                    judul: 'Realisasi Baru',
                    pesan: `Realisasi visit berhasil dibuat oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => {});
                return { success: true, lkt_sub_code: result.lkt_sub_code };
            }
            return { success: false, message: result?.message || 'Gagal membuat visit' };
        } catch (err: any) {
            return { success: false, message: err?.message || 'Terjadi kesalahan' };
        }
    };

    // ===== Realisasi: Update Visit =====
    const handleUpdateRealisasi = async (lktSubCode: string, payload: any): Promise<{ success: boolean; message?: string }> => {
        try {
            const result = await dispatch(updateRealisasi({ lktSubCode, payload })).unwrap();
            if (result?.status) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'REALISASI',
                    judul: 'Realisasi Diperbarui',
                    pesan: `Realisasi visit diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => {});
            }
            return { success: result?.status === true, message: result?.message };
        } catch (err: any) {
            return { success: false, message: err?.message || 'Terjadi kesalahan' };
        }
    };

    // ===== Realisasi: Confirm Visit =====
    const handleConfirmRealisasi = async (lktSubCode: string, payload?: any): Promise<{ success: boolean; message?: string }> => {
        try {
            const result = await dispatch(confirmRealisasi({ lktSubCode, payload })).unwrap();
            if (result?.status) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'REALISASI',
                    judul: 'Realisasi Dikonfirmasi',
                    pesan: `Realisasi visit dikonfirmasi oleh ${authUser?.nm_users}`,
                    action: 'Confirm'
                }).catch(() => {});
            }
            return { success: result?.status === true, message: result?.message };
        } catch (err: any) {
            return { success: false, message: err?.message || 'Terjadi kesalahan' };
        }
    };

    // ===== Realisasi: Close Visit =====
    const handleCloseRealisasi = async (lktSubCode: string, payload?: any): Promise<{ success: boolean; message?: string }> => {
        try {
            const result = await dispatch(closeRealisasi({ lktSubCode, payload })).unwrap();
            if (result?.status) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'REALISASI',
                    judul: 'Realisasi Ditutup',
                    pesan: `Realisasi visit ditutup oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => {});
            }
            return { success: result?.status === true, message: result?.message };
        } catch (err: any) {
            return { success: false, message: err?.message || 'Terjadi kesalahan' };
        }
    };

    // ===== Realisasi: Cancel Visit =====
    const handleCancelRealisasi = async (lktSubCode: string, payload?: any): Promise<{ success: boolean; message?: string }> => {
        try {
            const result = await dispatch(cancelRealisasi({ lktSubCode, payload })).unwrap();
            if (result?.status) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'REALISASI',
                    judul: 'Realisasi Dibatalkan',
                    pesan: `Realisasi visit dibatalkan oleh ${authUser?.nm_users}`,
                    action: 'Cancel'
                }).catch(() => {});
            }
            return { success: result?.status === true, message: result?.message };
        } catch (err: any) {
            return { success: false, message: err?.message || 'Terjadi kesalahan' };
        }
    };

    // ===== Realisasi: Reject Visit =====
    const handleRejectRealisasi = async (lktSubCode: string, payload?: any): Promise<{ success: boolean; message?: string }> => {
        try {
            const result = await dispatch(rejectRealisasi({ lktSubCode, payload })).unwrap();
            if (result?.status) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'REALISASI',
                    judul: 'Realisasi Ditolak',
                    pesan: `Realisasi visit ditolak oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => {});
            }
            return { success: result?.status === true, message: result?.message };
        } catch (err: any) {
            return { success: false, message: err?.message || 'Terjadi kesalahan' };
        }
    };

    // ===== Filter =====
    const updateFilter = useCallback((newFilter: Partial<LktFilter>) => {
        dispatch(setFilter(newFilter));
    }, [dispatch]);

    // ===== Reset =====
    const resetCurrentLkt = useCallback(() => {
        dispatch(clearCurrentLkt());
    }, [dispatch]);

    // ===== Client-side filter for LKT list =====
    const applyFilter = useCallback((f: LktFilter) => {
        let result = [...items];
        if (f.searchQuery) {
            const q = f.searchQuery.toLowerCase();
            result = result.filter(item =>
                item.lkt_code?.toLowerCase().includes(q) ||
                item.cst_code?.toLowerCase().includes(q) ||
                item.nm_customers?.toLowerCase().includes(q)
            );
        }
        if (!f.isAll && f.statusFilter && f.statusFilter !== 'ALL') {
            result = result.filter(item => item.flag_done === f.statusFilter);
        }
        if (f.startDate) {
            result = result.filter(item => item.starting_date >= f.startDate!);
        }
        if (f.endDate) {
            result = result.filter(item => item.starting_date <= f.endDate!);
        }
        return result;
    }, [items]);

    // ===== Validation =====
    const validateLktForm = (data: { typeTransport?: string; description?: string; startingDate?: any }): string | null => {
        if (!data.startingDate) return 'Start Date harus diisi';
        if (!data.typeTransport) return 'Type Transport harus diisi';
        if (!data.description) return 'Tambahan Catatan Kerusakan harus diisi';
        return null;
    };

    const validateRealisasiForm = (data: { nmTeknisi?: any[]; actualDay?: string; actualDescription?: string }): string | null => {
        if (!data.actualDescription) return 'Actual Catatan harus diisi';
        if (!data.nmTeknisi || data.nmTeknisi.length === 0) return 'Nama Teknisi harus dipilih';
        if (!data.actualDay) return 'Actual Day harus diisi';
        return null;
    };

    const validateSparepartForm = (data: { nama_part?: string; qty?: string; harga?: string }): string | null => {
        if (!data.nama_part) return 'Nama Part harus diisi';
        if (!data.harga) return 'Harga harus diisi';
        if (!data.qty) return 'Qty harus diisi';
        return null;
    };

    return {
        items,
        currentLkt,
        teknisiOptions,
        isLoading,
        error,
        filter,
        loadLkts,
        loadLktDetail,
        handleCreateLkt,
        handleUpdateLkt,
        handleDoneLkt,
        handleCancelLkt,
        loadTeknisiOptions,
        handleCreateRealisasi,
        handleUpdateRealisasi,
        handleConfirmRealisasi,
        handleCloseRealisasi,
        handleCancelRealisasi,
        handleRejectRealisasi,
        updateFilter,
        resetCurrentLkt,
        applyFilter,
        validateLktForm,
        validateRealisasiForm,
        validateSparepartForm,
    };
};
