export interface IncshipmentDetail {
    id_dtl: string;
    code_product: string;
    nm_product: string;
    qty: number;
    nm_product_satuan: string;
    sn: string;
    lokasi_source: string;
    lokasi_destination: string;
    options?: {
        id_opt_dtl?: string;
        nm_product_opt: string;
        harga: number;
        selected?: boolean;
    }[];
}

export interface IncshipmentHeader {
    id: string;
    code: string;
    nm_suppliers: string;
    code_po: string;
    date_create: string;
    status_incoming: string;
    f_assign_barcode: number;
    f_print_barcode: number;
    f_ok_receive: number;
    nm_gudang: string;
    date_receive: string | null;
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
