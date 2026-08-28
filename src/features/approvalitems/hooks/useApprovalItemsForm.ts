import { useState, useEffect } from 'react';
import { ApprovalItemData, ApprovalItemFormData } from '../types/approvalitems.types';
import { fetchApprovalItemByIdApi, createApprovalItemApi, updateApprovalItemApi, deleteApprovalItemApi } from '../api/approvalitems.api';
import { fetchUsersLevelApi } from '../../userslevel/api/userslevel.api';
import { UserLevelData } from '../../userslevel/types/userslevel.types';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData } from '../stores/approvalitemsSlice';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { notificationService } from '../../../services/notification/notificationService';

export function useApprovalItemsForm(id?: string) {
    const [formData, setFormData] = useState<ApprovalItemFormData>({
        approval_name: '',
        description: '',
        approval_type: 'standard',
        module_name: '',
        table_name: '',
        status_column_name: '',
        new_status_approve: '',
        new_status_reject: '',
        rule: '',
        level_ids: [],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    // Options for Multi-Select Levels
    const [levelsOption, setLevelsOption] = useState<UserLevelData[]>([]);

    const dispatch = useAppDispatch();
    const { data: globalData } = useAppSelector((state) => state.approvalitems);
    const authUser = useAppSelector((state) => state.auth.user);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (id) {
                const levels = await fetchUsersLevelApi();
                setLevelsOption(levels);
                const itemData = await fetchApprovalItemByIdApi(id);
                setFormData({
                    approval_name: itemData.approval_name,
                    description: itemData.description,
                    approval_type: itemData.approval_type,
                    module_name: itemData.module_name,
                    table_name: itemData.table_name,
                    status_column_name: itemData.status_column_name,
                    new_status_approve: itemData.new_status_approve,
                    new_status_reject: itemData.new_status_reject,
                    rule: itemData.rule,
                    level_ids: [...itemData.level_ids],
                });
            } else {
                const levels = await fetchUsersLevelApi();
                setLevelsOption(levels);
                setFormData({
                    approval_name: '',
                    description: '',
                    approval_type: 'standard',
                    module_name: '',
                    table_name: '',
                    status_column_name: '',
                    new_status_approve: '',
                    new_status_reject: '',
                    rule: '',
                    level_ids: [],
                });
            }
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data form');
        } finally {
            setIsLoading(false);
            setInitialLoadDone(true);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const updateField = (field: keyof ApprovalItemFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const toggleLevel = (levelId: string) => {
        setFormData((prev) => {
            const currentLevels = [...prev.level_ids];
            const index = currentLevels.indexOf(levelId);
            if (index > -1) {
                currentLevels.splice(index, 1);
            } else {
                currentLevels.push(levelId);
            }
            return { ...prev, level_ids: currentLevels };
        });
        if (error) setError(null);
    };

    const validateForm = (): string | null => {
        if (!formData.approval_name) return 'Nama Approval harus diisi';
        if (!formData.module_name) return 'Nama Modul harus diisi';
        if (!formData.table_name) return 'Nama Tabel harus diisi';
        if (!formData.rule) return 'Rule PHP harus diisi';
        return null;
    };

    const save = async (): Promise<ApprovalItemData | false> => {

        setIsSaving(true);
        setError(null);
        try {
            let result: ApprovalItemData;
            if (id) {
                result = await updateApprovalItemApi(id, formData);
                const updatedList = globalData.map((d) => d.id === id ? result : d);
                dispatch(setData(updatedList));

                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'APPROVAL ITEMS',
                    judul: 'Approval Rule Diperbarui',
                    pesan: `Rule ${formData.approval_name} telah berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => { });
            } else {
                result = await createApprovalItemApi(formData);
                dispatch(setData([result, ...globalData]));

                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'APPROVAL ITEMS',
                    judul: 'Approval Rule Baru',
                    pesan: `Rule ${formData.approval_name} telah berhasil ditambahkan oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => { });
            }
            return result;
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan data');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const remove = async (): Promise<boolean> => {
        if (!id) return false;
        setIsSaving(true);
        try {
            await deleteApprovalItemApi(id);
            dispatch(setData(globalData.filter((d) => d.id !== id)));

            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'APPROVAL ITEMS',
                judul: 'Approval Rule Dihapus',
                pesan: `Rule dengan kode ${id} telah dihapus oleh ${authUser?.nm_users}`,
                action: 'Delete'
            }).catch(() => { });

            return true;
        } catch (err: any) {
            setError(err.message || 'Gagal menghapus data');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        levelsOption,
        isLoading,
        isSaving,
        error,
        initialLoadDone,
        updateField,
        toggleLevel,
        save,
        remove,
        loadData,
        validateForm,
    };
}
