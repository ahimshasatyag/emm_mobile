import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { notificationService } from '../../../services/notification/notificationService';
import {
    fetchQuotations,
    fetchQuotationById,
    createQuotation,
    updateQuotation,
    deleteQuotation
} from '../stores/quotationSlice';
import { Quotation } from '../types/quotation.types';

export const MATA_UANG_OPTIONS = [
    { label: 'IDR', value: 'IDR' },
    { label: 'USD', value: 'USD' }
];

export const PPN_OPTIONS = [
    { label: 'YA', value: '1' },
    { label: 'TIDAK', value: '0' }
];

export const METODE_PAYMENT_OPTIONS = [
    { label: 'Cash', value: '1' },
    { label: 'TOP', value: '2' },
    { label: 'Leasing', value: '3' }
];

export const WAKTU_BAYAR_OPTIONS = [
    { label: 'Sebelum Kirim', value: '1' },
    { label: 'Sesudah Kirim', value: '2' }
];

export const DELIVERY_TERM_OPTIONS = [
    { label: 'FRANCO JKT', value: 'FRANCO JKT' },
    { label: 'FRANCO SEMARANG', value: 'FRANCO SEMARANG' },
    { label: 'FRANCO SIDOARJO', value: 'FRANCO SIDOARJO' },
    { label: 'FRANCO BANDUNG', value: 'FRANCO BANDUNG' },
    { label: 'CIF Jakarta', value: 'CIF Jakarta' },
    { label: 'CIF Surabaya', value: 'CIF Surabaya' },
    { label: 'CIF Semarang', value: 'CIF Semarang' },
    { label: 'FRANCO SURABAYA', value: 'FRANCO SURABAYA' },
    { label: 'FRANCO BOGOR', value: 'FRANCO BOGOR' },
    { label: 'FRANCO MALANG', value: 'FRANCO MALANG' }
];

export const CARA_PEMBAYARAN_OPTIONS_MAP: Record<string, { label: string, value: string }[]> = {
    '1': [
        { label: 'Cash', value: '1' },
        { label: 'Transfer', value: '2' },
        { label: 'BG', value: '6' }
    ],
    '2': [
        { label: 'BG', value: '3' },
        { label: 'Transfer', value: '4' },
        { label: 'Cash', value: '7' }
    ],
    '3': [
        { label: 'Panen Arta', value: '5' },
        { label: 'PT BFI Finance Indonesia Tbk', value: '9' },
        { label: 'PT. Mega Finance', value: '11' }
    ]
};

export const useQuotations = () => {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state) => state.auth.user);
    const {
        quotations,
        currentQuotation,
        isLoading,
        error
    } = useAppSelector((state) => state.quotations);

    const handleRefresh = async () => {
        await dispatch(fetchQuotations());
    };

    const handleFetchById = async (id: string) => {
        await dispatch(fetchQuotationById(id));
    };

    const handleAddQuotation = async (data: Quotation) => {
        const result = await dispatch(createQuotation(data)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: result.quotation_number || result.id_quotation || 'QUOTATION',
            judul: data.is_revision ? 'Revisi Quotation' : 'Quotation Baru',
            pesan: data.is_revision
                ? `Revisi quotation ${result.quotation_number} berhasil dibuat oleh ${authUser?.nm_users}`
                : `Quotation baru ${result.quotation_number} berhasil dibuat oleh ${authUser?.nm_users}`,
            action: 'Create'
        }).catch(() => { });
        return result;
    };

    const handleUpdateQuotation = async (id: string, data: Quotation) => {
        const result = await dispatch(updateQuotation({ id, data })).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: data.quotation_number || id || 'QUOTATION',
            judul: 'Quotation Diperbarui',
            pesan: `Quotation ${data.quotation_number || id} berhasil diperbarui oleh ${authUser?.nm_users}`,
            action: 'Update'
        }).catch(() => { });
        return result;
    };

    const handleDeleteQuotation = async (id: string) => {
        const result = await dispatch(deleteQuotation(id)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: id || 'QUOTATION',
            judul: 'Quotation Dihapus',
            pesan: `Quotation ${id} telah dihapus oleh ${authUser?.nm_users}`,
            action: 'Delete'
        }).catch(() => { });
        return result;
    };

    const validateForm = (formData: any) => {
        if (!formData.customer_name && !formData.sales_person_name) {
            return 'Semua field harus diisi';
        }
        if (!formData.customer_name) return 'Customer harus dipilih';
        if (!formData.sales_person_name) return 'Sales harus dipilih';
        if (formData.items.length === 0) return 'Barang tidak boleh kosong';
        return '';
    };

    const validateAddItem = (formData: any) => {
        if (!formData.sales_person_name) {
            return 'Silahkan pilih Sales Person';
        }
        return '';
    };

    const validateConfirmSO = (approvalData: any[]) => {
        const hasPendingApproval = approvalData.some(a => a.status === 'Pending' && a.rule_code !== 'SO_004');
        if (hasPendingApproval) {
            return 'Tidak bisa Confirm SO karena masih ada approval yang Pending.';
        }
        return '';
    };

    return {
        quotations,
        currentQuotation,
        isLoading,
        error,
        refresh: handleRefresh,
        fetchById: handleFetchById,
        addQuotation: handleAddQuotation,
        updateQuotation: handleUpdateQuotation,
        deleteQuotation: handleDeleteQuotation,
        validateForm,
        validateAddItem,
        validateConfirmSO
    };
};
