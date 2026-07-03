import { Quotation } from '../types/quotation.types';

export const DUMMY_QUOTATIONS: Quotation[] = [
    {
        id_quotation: '1',
        quotation_number: 'Q-202310-001',
        date_so: '10-10-2023',
        customer_id: 'CUST-001',
        customer_name: 'PT. MAJU BERSAMA',
        sales_person_id: 'EMP-001',
        sales_person_name: 'Budi Santoso',
        price_list: 'Retail',
        total: 15000000,
        status: 'Draft',
        delivery_to: 'Gudang Pusat',
        mata_uang: 'IDR',
        kurs: 1,
        flag_ppn: '1',
        freight_type: '1',
        teknisi_type: '1',
        forklift_type: '1',
        metode_payment: 'CASH',
        keterangan: 'Pengiriman segera',
        items: [
            {
                id_item: 'ITEM-001',
                id_product: 'PROD-101',
                product_code: 'P-101',
                product_name: 'Mesin Potong Rumput',
                status_barang: 'READY',
                harga: 5000000,
                qty: 3,
                satuan: 'Unit',
                delivery_term: 'Ex-Work',
                line_total: 15000000
            }
        ]
    },
    {
        id_quotation: '2',
        quotation_number: 'Q-202310-002',
        date_so: '12-10-2023',
        customer_id: 'CUST-002',
        customer_name: 'CV. KARYA MANDIRI',
        sales_person_id: 'EMP-002',
        sales_person_name: 'Siti Aminah',
        price_list: 'Grosir',
        total: 25000000,
        status: 'Approved',
        delivery_to: 'Cabang Surabaya',
        mata_uang: 'IDR',
        kurs: 1,
        flag_ppn: '1',
        freight_type: '2',
        teknisi_type: '2',
        forklift_type: '2',
        metode_payment: 'CREDIT',
        dp_persen: 30,
        dp_amount: 7500000,
        tenor: 6,
        tenor_amount: 2916666,
        items: [
            {
                id_item: 'ITEM-002',
                id_product: 'PROD-102',
                product_code: 'P-102',
                product_name: 'Genset 5000W',
                status_barang: 'INDENT',
                indent_amount: 14,
                harga: 25000000,
                qty: 1,
                satuan: 'Unit',
                delivery_term: 'FOB',
                line_total: 25000000
            }
        ]
    }
];
