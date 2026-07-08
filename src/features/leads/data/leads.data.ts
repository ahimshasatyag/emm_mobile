import { LeadsItem, LeadsDetail } from '../types/leads.types';

export const DUMMY_LEADS_LIST: LeadsItem[] = [
    {
        id: 'L-202310-001',
        code_leads: 'LD-202310-001',
        nm_customers: 'PT. MAJU BERSAMA',
        status: 'OPEN',
    },
    {
        id: 'L-202310-002',
        code_leads: 'LD-202310-002',
        nm_customers: 'CV. BINTANG TERANG',
        status: 'SUCCESS',
    },
    {
        id: 'L-202310-003',
        code_leads: 'LD-202310-003',
        nm_customers: 'TOKO MAKMUR',
        status: 'CANCEL',
    },
    {
        id: 'L-202310-004',
        code_leads: 'LD-202310-004',
        nm_customers: 'PT. LESTARI GEMILANG',
        status: 'OPEN',
    },
    {
        id: 'L-202310-005',
        code_leads: 'LD-202310-005',
        nm_customers: 'CV. KARYA BERSAMA',
        status: 'ONGOING',
    }
];

export const DUMMY_LEADS_DETAIL: Record<string, LeadsDetail> = {
    'L-202310-001': {
        id: 'L-202310-001',
        code_leads: 'LD-202310-001',
        id_customers: 'CUST-001',
        nm_customers: 'PT. MAJU BERSAMA',
        customers_address: 'Jl. Jendral Sudirman No. 10, Jakarta',
        notes: 'Pertemuan pertama berjalan lancar. Klien tertarik dengan Print Pack Premium.',
        kurs: 15500,
        status: 'OPEN',
        products: [
            {
                id_product: 'PROD-001',
                code_product: 'PP-001',
                nm_product: 'Print Pack Premium',
                nm_product_satuan: 'Pcs',
                product_price: 150000,
                nqty: 100,
                persentase: 70,
                subtotal: 15000000,
            },
            {
                id_product: 'PROD-002',
                code_product: 'PL-001',
                nm_product: 'Plastic Standar',
                nm_product_satuan: 'Roll',
                product_price: 50000,
                nqty: 50,
                persentase: 60,
                subtotal: 2500000,
            }
        ],
        visits: [
            {
                id: 'V-001',
                date_visit: '10-10-2023',
                visit_activity: 'Meeting awal dengan tim purchasing PT. Maju Bersama. Penjelasan produk dan demo.'
            },
            {
                id: 'V-002',
                date_visit: '15-10-2023',
                visit_activity: 'Follow up via telepon. Klien meminta penawaran harga (quotation).'
            }
        ]
    },
    'L-202310-002': {
        id: 'L-202310-002',
        code_leads: 'LD-202310-002',
        id_customers: 'CUST-002',
        nm_customers: 'CV. BINTANG TERANG',
        customers_address: 'Jl. Gatot Subroto No. 45, Bandung',
        notes: 'Deal selesai. Klien setuju dengan kontrak tahunan.',
        kurs: 15500,
        status: 'SUCCESS',
        products: [
            {
                id_product: 'PROD-003',
                code_product: 'MC-001',
                nm_product: 'Machinery XYZ',
                nm_product_satuan: 'Unit',
                product_price: 150000000,
                nqty: 2,
                persentase: 100,
                subtotal: 300000000,
            }
        ],
        visits: [
            {
                id: 'V-003',
                date_visit: '05-10-2023',
                visit_activity: 'Demo mesin XYZ di pabrik klien. Klien sangat puas.'
            },
            {
                id: 'V-004',
                date_visit: '12-10-2023',
                visit_activity: 'Negosiasi harga final dan penandatanganan kontrak.'
            }
        ]
    }
};

// Fallback detail for IDs not in the dummy data
export const FALLBACK_LEADS_DETAIL: LeadsDetail = {
    id: 'L-DEFAULT',
    code_leads: 'LD-DEFAULT',
    id_customers: 'CUST-000',
    nm_customers: 'CUSTOMER DEFAULT',
    customers_address: 'Alamat Default',
    notes: 'Ini adalah data detail default karena ID tidak ditemukan.',
    kurs: 15500,
    status: 'OPEN',
    products: [
        {
            id_product: 'PROD-000',
            code_product: 'DEF-001',
            nm_product: 'Produk Default',
            nm_product_satuan: 'Pcs',
            product_price: 10000,
            nqty: 10,
            persentase: 50,
            subtotal: 100000,
        }
    ],
    visits: [
        {
            id: 'V-000',
            date_visit: '01-01-2024',
            visit_activity: 'Kunjungan default.'
        }
    ]
};
