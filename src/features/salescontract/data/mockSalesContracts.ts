import { SalesContract, SOWithoutContract } from '../types/salescontract.types';

export const mockSalesContracts: SalesContract[] = [
    {
        id_sales_contract: 'SC-001',
        id_so: 'SO-001',
        code_so: 'SO/2023/10/001',
        date_so: '2023-10-01',
        id_customers: 'CUST-001',
        nm_customers: 'PT Maju Jaya',
        f_company: true,
        customers_address: 'Jl. Merdeka No. 1, Jakarta',
        vcurrency: 'IDR',
        code_sales_contract: 'SC/2023/10/001',
        date_contract: '2023-10-05',
        n_amount: 15000000,
        dp_persen: 30,
        dp_nominal: 4500000,
        n_sisa: 10500000,
        lama_cicilan: 3,
        jml_cicilan_rp: 3500000,
        nama_lengkap: 'Budi Santoso',
        nik: '1234567890123456',
        nib: '1234567',
        npwp: '01.234.567.8-901.234',
        alamat: 'Jl. Merdeka No. 1, Jakarta',
        items: [
            {
                id_product: 'PROD-001',
                code_product: 'P001',
                nm_product: 'Product A',
                n_qty: 10,
                product_price: 1000000
            },
            {
                id_product: 'PROD-002',
                code_product: 'P002',
                nm_product: 'Product B',
                n_qty: 10,
                product_price: 500000
            }
        ]
    },
    {
        id_sales_contract: 'SC-002',
        id_so: 'SO-002',
        code_so: 'SO/2023/10/002',
        date_so: '2023-10-02',
        id_customers: 'CUST-002',
        nm_customers: 'CV Makmur Sejahtera',
        f_company: true,
        customers_address: 'Jl. Sudirman No. 10, Bandung',
        vcurrency: 'IDR',
        code_sales_contract: 'SC/2023/10/002',
        date_contract: '2023-10-06',
        n_amount: 5000000,
        dp_persen: 50,
        dp_nominal: 2500000,
        n_sisa: 2500000,
        lama_cicilan: 5,
        jml_cicilan_rp: 500000,
        nama_lengkap: 'Andi M',
        nik: '2234567890123456',
        nib: '2234567',
        npwp: '02.234.567.8-901.234',
        alamat: 'Jl. Sudirman No. 10, Bandung',
        items: [
            {
                id_product: 'PROD-003',
                code_product: 'P003',
                nm_product: 'Product C',
                n_qty: 5,
                product_price: 1000000
            }
        ]
    }
];

export const mockSOWithoutContracts: SOWithoutContract[] = [
    {
        id_so: 'SO-003',
        code_so: 'SO/2023/10/003',
        date_so: '2023-10-03',
        id_customers: 'CUST-003',
        nm_customers: 'Individu Bapak C',
        f_company: false,
        customers_address: 'Jl. Ahmad Yani No 5, Surabaya',
        vcurrency: 'IDR',
        nama_lengkap: 'Bapak C',
        nik: '3234567890123456',
        alamat: 'Jl. Ahmad Yani No 5, Surabaya',
        ndp_persen: 20,
        ntenor: 10,
        items: [
            {
                id_product: 'PROD-004',
                code_product: 'P004',
                nm_product: 'Product D',
                n_qty: 2,
                product_price: 2000000
            }
        ]
    },
    {
        id_so: 'SO-004',
        code_so: 'SO/2023/10/004',
        date_so: '2023-10-04',
        id_customers: 'CUST-004',
        nm_customers: 'PT Angkasa',
        f_company: true,
        customers_address: 'Jl. Pemuda No 15, Semarang',
        vcurrency: 'IDR',
        nama_lengkap: 'Doni',
        nik: '4234567890123456',
        nib: '4234567',
        npwp: '04.234.567.8-901.234',
        alamat: 'Jl. Pemuda No 15, Semarang',
        ndp_persen: 10,
        ntenor: 5,
        items: [
            {
                id_product: 'PROD-001',
                code_product: 'P001',
                nm_product: 'Product A',
                n_qty: 5,
                product_price: 1000000
            }
        ]
    }
];
