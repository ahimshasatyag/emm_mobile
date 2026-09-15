export interface IncshipmentDetail {
    id: string; // From backend 'id'
    incoming_hdr_id: string;
    id_product: string;
    qty: number;
    qty_terima: number;
    sn: string | null;
    status: string;
    id_product_lokasi_source: string | null;
    id_product_lokasi_destination: string | null;
    code_product: string;
    nm_product: string;
    nm_product_satuan: string;
    lokasi_source: string | null;
    lokasi_destination: string | null;
}

export interface IncshipmentHeader {
    id: string;
    code: string;
    id_suppliers?: string;
    id_po?: string;
    nm_suppliers: string;
    code_po: string;
    date_create: string;
    date_receive: string | null;
    status_incoming: string;
    f_assign_barcode: number;
    f_print_barcode: number;
    f_ok_receive: number;
    id_gudang?: string;
    nm_gudang?: string;
    details?: IncshipmentDetail[];
}

export interface IncshipmentState {
    items: IncshipmentHeader[];
    selectedItem: IncshipmentHeader | null;
    isLoadingList: boolean;
    isLoadingDetail: boolean;
    isSaving: boolean;
    error: string | null;
}
