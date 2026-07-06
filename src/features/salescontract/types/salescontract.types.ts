export interface SalesContractItem {
    id_product: string;
    code_product: string;
    nm_product: string;
    n_qty: string | number;
    product_price: string | number;
}

export interface SalesContract {
    id_sales_contract: string;
    id_so: string;
    code_so: string;
    date_so: string;
    id_customers: string;
    nm_customers: string;
    f_company: boolean | string;
    customers_address?: string;
    vcurrency?: string;
    
    code_sales_contract: string;
    date_contract: string;
    n_amount: string | number;
    dp_persen: string | number;
    dp_nominal: string | number;
    n_sisa: string | number;
    lama_cicilan: string | number;
    jml_cicilan_rp: string | number;
    
    nama_lengkap: string;
    nik: string;
    nib: string;
    npwp: string;
    alamat: string;
    
    items: SalesContractItem[];
}

export interface SOWithoutContract {
    id_so: string;
    code_so: string;
    date_so: string;
    id_customers: string;
    nm_customers: string;
    f_company: boolean | string;
    customers_address?: string;
    vcurrency?: string;
    nama_lengkap?: string;
    nik?: string;
    nib?: string;
    npwp?: string;
    alamat?: string;
    ndp_persen?: string | number;
    ntenor?: string | number;
    items?: SalesContractItem[];
}
