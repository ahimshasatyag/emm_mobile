export interface LogbookCustomer {
    id_log_book: string;
    id_customers: string;
    nm_customer: string;
    date_log_book: string;
    masalah: string;
    solusi: string;
    catatan: string;
    username: string;
}

export interface LogbookCustomersState {
    list: LogbookCustomer[];
    current: LogbookCustomer | null;
    isLoading: boolean;
    error: string | null;
}
