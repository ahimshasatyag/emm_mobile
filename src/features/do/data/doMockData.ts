import { DoItem, DoDetail } from '../types/do.types';

export const mockDoList: DoItem[] = [
    {
        id_do: '1',
        code_do: 'DO-202308-001',
        date_do: '2023-08-15',
        nm_customers: 'PT Maju Bersama',
        code_so: 'SO-202308-005',
        status_do: 'DRAFT DELIVERY ORDER'
    },
    {
        id_do: '2',
        code_do: 'DO-202308-002',
        date_do: '2023-08-16',
        nm_customers: 'CV Abadi Jaya',
        code_so: 'SO-202308-006',
        status_do: 'WAITING AVAILABILITY'
    },
    {
        id_do: '3',
        code_do: 'DO-202308-003',
        date_do: '2023-08-18',
        nm_customers: 'UD Sinar Terang',
        code_so: 'SO-202308-010',
        status_do: 'READY TO DELIVER'
    },
    {
        id_do: '4',
        code_do: 'DO-202308-004',
        date_do: '2023-08-20',
        nm_customers: 'PT Makmur Sentosa',
        code_so: 'SO-202308-015',
        status_do: 'DELIVERED'
    }
];

export const mockDoDetail: Record<string, DoDetail> = {
    '1': {
        id_do: '1',
        code_do: 'DO-202308-001',
        date_do: '2023-08-15',
        id_customers: 'C001',
        nm_customers: 'PT Maju Bersama',
        customers_address: 'Jl. Sudirman No. 123, Jakarta Selatan',
        code_so: 'SO-202308-005',
        keterangan_so: 'Pengiriman diutamakan siang hari.',
        freight: '1',
        freight_amount: '0',
        forklift: '2',
        forklift_amount: '0',
        date_estimasi: '2023-08-17',
        date_delivery: null,
        keterangan: 'Menunggu konfirmasi gudang',
        status_do: 'DRAFT DELIVERY ORDER',
        flag_payment: '1',
        items: [
            {
                id_do_dtl: '101',
                id_product: 'P01',
                code_product: 'BRG-001',
                nm_product: 'Mesin Potong Kayu',
                nqty: '2',
                nm_product_satuan: 'UNIT',
                nbarcode: null,
                leasing_tahun: null,
                leasing_plat: null
            },
            {
                id_do_dtl: '102',
                id_product: 'P02',
                code_product: 'BRG-002',
                nm_product: 'Mata Pisau Potong',
                nqty: '10',
                nm_product_satuan: 'PCS',
                nbarcode: null,
                leasing_tahun: null,
                leasing_plat: null
            }
        ]
    },
    '2': {
        id_do: '2',
        code_do: 'DO-202308-002',
        date_do: '2023-08-16',
        id_customers: 'C002',
        nm_customers: 'CV Abadi Jaya',
        customers_address: 'Jl. Merdeka No. 10, Bandung',
        code_so: 'SO-202308-006',
        keterangan_so: 'Tolong pastikan alat lengkap.',
        freight: '2',
        freight_amount: '0',
        forklift: '3',
        forklift_amount: '150000',
        date_estimasi: '2023-08-18',
        date_delivery: null,
        keterangan: 'Menunggu ketersediaan barang',
        status_do: 'WAITING AVAILABILITY',
        flag_payment: '0',
        items: [
            {
                id_do_dtl: '201',
                id_product: 'P01',
                code_product: 'BRG-001',
                nm_product: 'Mesin Potong Kayu',
                nqty: '1',
                nm_product_satuan: 'UNIT',
                nbarcode: null,
                leasing_tahun: null,
                leasing_plat: null
            }
        ]
    },
    '3': {
        id_do: '3',
        code_do: 'DO-202308-003',
        date_do: '2023-08-18',
        id_customers: 'C003',
        nm_customers: 'UD Sinar Terang',
        customers_address: 'Jl. Ahmad Yani No. 45, Surabaya',
        code_so: 'SO-202308-010',
        keterangan_so: null,
        freight: '3',
        freight_amount: '500000',
        forklift: '1',
        forklift_amount: '0',
        date_estimasi: '2023-08-19',
        date_delivery: null,
        keterangan: 'Barang sudah dipacking',
        status_do: 'READY TO DELIVER',
        flag_payment: '1',
        items: [
            {
                id_do_dtl: '301',
                id_product: 'P03',
                code_product: 'BRG-003',
                nm_product: 'Genset 5000W',
                nqty: '1',
                nm_product_satuan: 'UNIT',
                nbarcode: 'SN-GS-5001-A',
                leasing_tahun: '2023',
                leasing_plat: 'B 1234 CD'
            },
            {
                id_do_dtl: '302',
                id_product: 'P04',
                code_product: 'BRG-004',
                nm_product: 'Pompa Air',
                nqty: '5',
                nm_product_satuan: 'UNIT',
                nbarcode: null,
                leasing_tahun: null,
                leasing_plat: null
            }
        ]
    },
    '4': {
        id_do: '4',
        code_do: 'DO-202308-004',
        date_do: '2023-08-20',
        id_customers: 'C004',
        nm_customers: 'PT Makmur Sentosa',
        customers_address: 'Jl. Gatot Subroto No. 8, Medan',
        code_so: 'SO-202308-015',
        keterangan_so: null,
        freight: '1',
        freight_amount: '0',
        forklift: '2',
        forklift_amount: '0',
        date_estimasi: '2023-08-21',
        date_delivery: '2023-08-22',
        keterangan: 'Selesai dikirim',
        status_do: 'DELIVERED',
        flag_payment: '1',
        items: [
            {
                id_do_dtl: '401',
                id_product: 'P04',
                code_product: 'BRG-004',
                nm_product: 'Pompa Air',
                nqty: '5',
                nm_product_satuan: 'UNIT',
                nbarcode: null,
                leasing_tahun: null,
                leasing_plat: null
            }
        ]
    }
};
