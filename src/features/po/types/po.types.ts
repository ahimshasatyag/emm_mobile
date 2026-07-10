export interface PoDetail {
    id_po_dtl: string;
    id_po: string;
    id_product: string;
    code_product: string;
    nm_product: string;
    product_deskripsi?: string;
    qty: number;
    product_price: number;
    notes?: string;
    satuan?: string;
    options?: any[];
}

export interface PoHeader {
    id_po: string;
    code_po: string;
    date_po: string; // YYYY-MM-DD
    status_po: string;
    date_schdl?: string;
    id_suppliers: string;
    nm_suppliers: string;
    id_gudang: string;
    nm_gudang?: string;
    id_mata_uang?: string;
    mata_uang?: string;
    id_product_lokasi?: string;
    nm_product_lokasi?: string;
    details?: PoDetail[];
}

export interface PoState {
    items: PoHeader[];
    selectedItem: PoHeader | null;
    isLoadingList: boolean;
    isLoadingDetail: boolean;
    isLoadingSave: boolean;
    error: string | null;
}
