export interface ApprovalItemData {
    id: string; // rule_id
    approval_name: string;
    description: string;
    approval_type: 'standard' | 'auto';
    module_name: string;
    table_name: string;
    status_column_name: string;
    new_status_approve: string;
    new_status_reject: string;
    rule: string;
    level_ids: string[]; // Array of Users Level IDs
}

export interface ApprovalItemFormData {
    approval_name: string;
    description: string;
    approval_type: 'standard' | 'auto';
    module_name: string;
    table_name: string;
    status_column_name: string;
    new_status_approve: string;
    new_status_reject: string;
    rule: string;
    level_ids: string[];
}
