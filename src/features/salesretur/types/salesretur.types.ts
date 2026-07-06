export interface SalesRetur {
    id: string; // from id
    code_sr: string;
    date: string;
    id_customers: string;
    nm_customers?: string;
    id_do: string;
    code_do?: string;
    keterangan: string;
    status: string;
    items?: SalesReturItem[];
}

export interface SalesReturItem {
    id_product: string;
    code_product: string;
    nm_product: string;
    id_product_sn: string;
    nbarcode: string;
    selected?: boolean; // For UI state when adding/editing
}

// Dummy responses
export interface SalesReturListResponse {
    data: SalesRetur[];
}

export interface SalesReturDetailResponse {
    data: SalesRetur;
}
