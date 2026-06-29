export interface ApprovalSchemeData {
    id: string;
    scheme_name: string;
    description: string;
    rule_ids: string[];
    date_create?: string;
    date_update?: string;
}

export interface ApprovalSchemeFormData {
    scheme_name: string;
    description: string;
    rule_ids: string[];
}

// Untuk opsi rule/approval items pada form
export interface ApprovalRuleOption {
    id: string;
    approval_name: string;
}
