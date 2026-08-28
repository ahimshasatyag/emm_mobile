import { useState, useEffect } from 'react';
import { ApprovalSchemeFormData, ApprovalRuleOption } from '../types/approvalscheme.types';
import { 
    createApprovalSchemeApi, 
    updateApprovalSchemeApi, 
    fetchApprovalSchemeByIdApi, 
    fetchApprovalRulesApi 
} from '../api/approvalscheme.api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchApprovalSchemes } from '../stores/approvalschemeSlice';
import { notificationService } from '../../../services/notification/notificationService';

export function useApprovalSchemeForm(id?: string) {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state) => state.auth.user);

    const [formData, setFormData] = useState<ApprovalSchemeFormData>({
        scheme_name: '',
        description: '',
        rule_ids: []
    });

    const [rulesOption, setRulesOption] = useState<ApprovalRuleOption[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [rules, schemeData] = await Promise.all([
                fetchApprovalRulesApi(),
                id ? fetchApprovalSchemeByIdApi(id) : Promise.resolve(null),
                new Promise(resolve => setTimeout(resolve, 800))
            ]);

            setRulesOption(rules);

            if (schemeData) {
                setFormData({
                    scheme_name: schemeData.scheme_name,
                    description: schemeData.description,
                    rule_ids: schemeData.rule_ids || []
                });
            }
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data skema approval');
        } finally {
            setIsLoading(false);
            setInitialLoadDone(true);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const updateField = (field: keyof ApprovalSchemeFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleRule = (ruleId: string) => {
        setFormData(prev => {
            const exists = prev.rule_ids.includes(ruleId);
            if (exists) {
                return { ...prev, rule_ids: prev.rule_ids.filter(id => id !== ruleId) };
            } else {
                return { ...prev, rule_ids: [...prev.rule_ids, ruleId] };
            }
        });
    };

    const validate = () => {
        if (!formData.scheme_name.trim()) return 'Nama skema harus diisi';
        if (!formData.description.trim()) return 'Deskripsi harus diisi';
        return null;
    };

    const save = async (): Promise<any> => {

        setIsSaving(true);
        setError(null);
        try {
            let result;
            if (id) {
                result = await updateApprovalSchemeApi(id, formData);
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'APPROVAL SCHEME',
                    judul: 'Skema Approval Diperbarui',
                    pesan: `Skema ${formData.scheme_name} telah berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => { });
            } else {
                result = await createApprovalSchemeApi(formData);
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'APPROVAL SCHEME',
                    judul: 'Skema Approval Baru',
                    pesan: `Skema ${formData.scheme_name} telah berhasil ditambahkan oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => { });
            }
            dispatch(fetchApprovalSchemes());
            return result;
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan data');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        rulesOption,
        isLoading,
        isSaving,
        error,
        initialLoadDone,
        updateField,
        toggleRule,
        save,
        loadData,
        validate
    };
}
