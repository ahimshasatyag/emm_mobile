import { ApprovalItemData } from '../types/approvalitems.types';

export const DUMMY_APPROVAL_ITEMS: ApprovalItemData[] = [
    {
        id: 'APP001',
        approval_name: 'Approval Pembelian Rutin',
        description: 'Persetujuan untuk pembelian rutin bulanan di bawah Rp 50.000.000',
        approval_type: 'standard',
        module_name: 'Purchasing',
        table_name: 'tm_po',
        status_column_name: 'status_po',
        new_status_approve: 'Approved',
        new_status_reject: 'Rejected',
        rule: 'return $data["total_amount"] < 50000000;',
        level_ids: ['LV002', 'LV003'], // Manager, SPV
    },
    {
        id: 'APP002',
        approval_name: 'Auto Approve Cuti Tahunan',
        description: 'Auto approve cuti tahunan reguler',
        approval_type: 'auto',
        module_name: 'HR',
        table_name: 'tm_leave',
        status_column_name: 'status',
        new_status_approve: 'Approved',
        new_status_reject: '',
        rule: 'return $data["leave_type"] == "Annual" && $data["days"] <= 3;',
        level_ids: [],
    },
    {
        id: 'APP003',
        approval_name: 'Approval Pencairan Dana Besar',
        description: 'Persetujuan untuk pencairan dana di atas Rp 100 Juta',
        approval_type: 'standard',
        module_name: 'Finance',
        table_name: 'tm_cash_out',
        status_column_name: 'approval_status',
        new_status_approve: 'Disetujui Direksi',
        new_status_reject: 'Ditolak Direksi',
        rule: 'return $data["amount"] >= 100000000;',
        level_ids: ['LV001'], // Direktur
    },
];
