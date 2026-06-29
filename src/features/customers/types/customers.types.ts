export interface Customer {
    id_customers: string;
    code_customers: string;
    nm_customers: string;
    customers_address: string;
    customers_phone: string;
    customers_mobile: string;
    customers_email: string;
    customers_fax: string;
    f_company: boolean;
    nama_lengkap: string | null;
    nik: string | null;
    nib: string | null;
    npwp: string | null;
    alamat: string | null;
    customers_address_invoice: string;
    provinsi: string;
    kabupaten: string;
    is_blacklist: boolean;
    is_external_sales: boolean;
    jumlah_so?: number; // From Mmaster.php query
}

export interface CustomerContact {
    id_contact?: string; // Client side ID for generating new rows
    id_customers?: string;
    nm_customers_contact: string;
    customers_contact_posisi: string;
    customers_contact_phone: string;
    customers_contact_email: string;
}

export interface CustomerFormData {
    id_customers?: string;
    nm_customers: string;
    customers_address: string;
    customers_address_invoice: string;
    customers_phone: string;
    customers_mobile: string;
    customers_email: string;
    customers_fax: string;
    f_company: boolean;
    nama_lengkap: string;
    nik: string;
    nib: string;
    npwp: string;
    alamat: string;
    provinsi: string;
    kabupaten: string;
    is_blacklist: boolean;
    is_external_sales: boolean;
    contacts: CustomerContact[];
}

export interface Province {
    id: string;
    nama: string;
}

export interface Regency {
    id: string;
    nama_kabupaten: string;
    kode_provinsi: string;
}

export interface CustomerResponse {
    success: boolean;
    data: Customer[];
    message?: string;
}

export interface CustomerDetailResponse {
    success: boolean;
    data: {
        header: Customer;
        items: CustomerContact[];
    };
    message?: string;
}
