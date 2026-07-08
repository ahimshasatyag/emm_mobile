export interface SupplierContact {
    nm_suppliers_contact: string;
    suppliers_contact_posisi: string;
    suppliers_contact_phone: string;
    suppliers_contact_email: string;
}

export interface Supplier {
    id_suppliers: string;
    nm_suppliers: string;
    suppliers_mobile: string;
    suppliers_email: string;
    suppliers_address: string;
    suppliers_phone: string;
    suppliers_fax: string;
    suppliers_website: string;
    mata_uang: string;
    suppliers_logo: string | null;
    qty_purchase?: number;
    contacts: SupplierContact[];
}
