export interface PurchaseRequisitionDetail {
    id_pr_dtl?: string;
    id_pr?: string;
    id_product: string;
    code_product: string;
    nm_product: string;
    product_deskripsi?: string;
    qty: number;
    note: string;
    qty_po: number;
    nm_product_satuan?: string;
}

export interface PurchaseRequisition {
    id_pr: string;
    code_pr: string;
    username: string; // Responsible user
    date_request: string; // e.g. YYYY-MM-DD
    date_deadline: string; // e.g. YYYY-MM-DD
    status_pr: string; // '' or 'PR'
    details?: PurchaseRequisitionDetail[];
}
