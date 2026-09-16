export interface LogbookProduct {
    id_log_book: string;
    id_product: string;
    nm_product: string;
    code_product: string;
    id_type_kerusakan: string;
    nm_type_kerusakan: string;
    date_log_book: string;
    masalah: string;
    solusi: string;
    catatan: string;
    username: string;
    date_entry: string;
}

export interface MasterDataBarang {
    id_product: string;
    code_product: string;
    nm_product: string;
}

export interface MasterDataTypeKerusakan {
    id_type_kerusakan: string;
    nm_type_kerusakan: string;
}

export interface LogbookProductState {
    list: LogbookProduct[];
    current: LogbookProduct | null;
    masterDataBarang: MasterDataBarang[];
    masterDataTypeKerusakan: MasterDataTypeKerusakan[];
    isLoading: boolean;
    error: string | null;
}
