export interface LeadsItem {
    id: string;
    code_leads: string;
    nm_customers: string;
    status: string;
}

export interface LeadsProduct {
    id_product: string;
    code_product: string;
    nm_product: string;
    nm_product_satuan: string;
    product_price: number;
    nqty: number;
    persentase: number;
    subtotal: number;
}

export interface LeadsVisit {
    id: string;
    date_visit: string;
    visit_activity: string;
}

export interface LeadsDetail {
    id: string;
    code_leads: string;
    id_customers: string;
    nm_customers: string;
    customers_address: string;
    notes: string;
    kurs: number;
    status: string;
    products: LeadsProduct[];
    visits: LeadsVisit[];
}

export interface LeadsFormData {
    id_customers: string;
    customers_address: string;
    notes: string;
    kurs: number;
    products: {
        id_product: string;
        product_price: number;
        nqty: number;
        persentase: number;
    }[];
    visits: {
        date_visit: string;
        visit_activity: string;
    }[];
}
