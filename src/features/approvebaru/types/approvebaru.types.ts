export interface ApprovebaruItem {
    id: number;
    requester_name: string;
    status: 'Pending' | 'approved' | 'rejected';
    description: string;
    action: string;
}

export interface ApprovebaruProduct {
    id_product: string;
    code_product: string;
    nm_product: string;
    nm_product_satuan: string;
    qty: number;
    price: number;
    status_barang?: string;
    delivery_term?: string;
}

export interface ApprovebaruInfo {
    approval_name: string;
    status: string;
    description: string;
}

export interface ApprovebaruDetail {
    approval_status: string;
    description: string;
    code_so: string;
    code_approval?: string;
    salesperson: string;
    delivery_to: string;
    customer_name: string;
    customer_address: string;
    customer_email: string;
    customer_phone: string;
    date: string;
    estimated_delivery: string;
    currency: string;
    kurs?: string;
    ppn?: string;
    delivery_term?: string;
    biaya_freight?: string;
    biaya_teknisi?: string;
    biaya_forklift?: string;
    metode_payment?: string;
    dp?: string;
    tenor?: string;
    keterangan?: string;
    dp_rp?: string;
    cicilan_rp?: string;
    tipe_pembayaran?: string;
    waktu_bayar?: string;
    kode_so_excel?: string;
    no_po_customer?: string;
    success_fee?: string;
    internal_notes?: string;
    products: ApprovebaruProduct[];
    related_approvals?: ApprovebaruInfo[];
}
