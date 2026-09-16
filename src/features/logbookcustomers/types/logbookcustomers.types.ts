export interface MasterDataCustomer {
    id_customers: string;
    nm_customers: string;
    customers_address?: string;
    customers_phone?: string;
}

export interface LogbookCustomer {
    id_log_book: string;
    id_customers?: string;
    nm_customer?: string;
    nm_customers?: string;
    date_log_book: string;
    masalah?: string;
    solusi?: string;
    catatan?: string;
    username?: string;
    nm_users?: string;
}

export interface LogbookCustomersState {
    list: LogbookCustomer[];
    current: LogbookCustomer | null;
    masterDataCustomers: MasterDataCustomer[];
    isLoading: boolean;
    error: string | null;
}
