export interface CustomerContact {
    id_customers_contact: string;
    nm_customers_contact: string;
    id_customers: string;
    nm_customers?: string; // Dari join ke m_customers
    customers_contact_posisi: string;
    customers_contact_phone: string;
    customers_contact_mobile: string;
    customers_contact_email: string;
    customers_contact_address: string;
}

export interface CustomerContactFormData {
    id_customers_contact?: string;
    nm_customers_contact: string;
    id_customers: string;
    customers_contact_posisi: string;
    customers_contact_phone: string;
    customers_contact_mobile: string;
    customers_contact_email: string;
    customers_contact_address: string;
}
