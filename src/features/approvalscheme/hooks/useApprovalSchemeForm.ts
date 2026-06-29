import { useState, useEffect } from 'react';
import { ApprovalSchemeFormData, ApprovalRuleOption } from '../types/approvalscheme.types';
import { 
    createApprovalSchemeApi, 
    updateApprovalSchemeApi, 
    fetchApprovalSchemeByIdApi, 
    fetchApprovalRulesApi 
} from '../api/approvalscheme.api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { fetchApprovalSchemes } from '../stores/approvalschemeSlice';

export function useApprovalSchemeForm(id?: string) {
    const dispatch = useAppDispatch();

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
            const rules = await fetchApprovalRulesApi();
            setRulesOption(rules);

            if (id) {
                const schemeData = await fetchApprovalSchemeByIdApi(id);
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

    const save = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return false;
        }

        setIsSaving(true);
        setError(null);
        try {
            if (id) {
                await updateApprovalSchemeApi(id, formData);
            } else {
                await createApprovalSchemeApi(formData);
            }
            dispatch(fetchApprovalSchemes());
            return true;
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
        loadData
    };
}
