import { ApprovalSchemeData, ApprovalRuleOption } from '../types/approvalscheme.types';

export const mockApprovalRules: ApprovalRuleOption[] = [
    { id: '1', approval_name: 'Approve PO Standar' },
    { id: '2', approval_name: 'Approve SO Manager' },
    { id: '3', approval_name: 'Auto Approve Cuti' },
    { id: '4', approval_name: 'Approve Pengeluaran Kas' },
];

export const mockApprovalSchemes: ApprovalSchemeData[] = [
    {
        id: '1',
        scheme_name: 'Skema Direksi',
        description: 'Skema approval untuk pengeluaran besar',
        rule_ids: ['1', '4'],
        date_create: '2023-01-01 10:00:00',
    },
    {
        id: '2',
        scheme_name: 'Skema Manager HRD',
        description: 'Approval cuti dan lembur',
        rule_ids: ['3'],
        date_create: '2023-01-10 14:00:00',
    },
];
