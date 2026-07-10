import { IncshipmentHeader } from '../types/incshipment.types';

export const DUMMY_INCSHIPMENT_LIST: IncshipmentHeader[] = [
    {
        id: 'INC-20230001',
        code: 'IS-2023-0001',
        nm_suppliers: 'PT. SUMBER MAKMUR',
        code_po: 'PO-2023-0012',
        date_create: '2023-10-01 10:00:00',
        status_incoming: 'READY TO RECEIVE',
        f_assign_barcode: 0,
        f_print_barcode: 0,
        f_ok_receive: 1,
        nm_gudang: 'GUDANG UTAMA',
        date_receive: null,
        details: [
            {
                id_dtl: 'DTL-001',
                code_product: 'PRD-001',
                nm_product: 'Laptop Asus ROG',
                qty: 5,
                nm_product_satuan: 'PCS',
                sn: '-',
                lokasi_source: 'VENDOR',
                lokasi_destination: 'RAK A1',
                options: [
                    {
                        id_opt_dtl: 'OPT-001',
                        nm_product_opt: 'RAM 16GB Upgrade',
                        harga: 1500000,
                        selected: true
                    },
                    {
                        id_opt_dtl: 'OPT-002',
                        nm_product_opt: 'SSD 1TB Upgrade',
                        harga: 2000000,
                        selected: false
                    }
                ]
            },
            {
                id_dtl: 'DTL-002',
                code_product: 'PRD-002',
                nm_product: 'Mouse Logitech',
                qty: 10,
                nm_product_satuan: 'PCS',
                sn: '-',
                lokasi_source: 'VENDOR',
                lokasi_destination: 'RAK A2'
            }
        ]
    },
    {
        id: 'INC-20230002',
        code: 'IS-2023-0002',
        nm_suppliers: 'PT. MAJU BERSAMA',
        code_po: 'PO-2023-0015',
        date_create: '2023-10-02 11:30:00',
        status_incoming: 'READY TO RECEIVE',
        f_assign_barcode: 1,
        f_print_barcode: 0,
        f_ok_receive: 1,
        nm_gudang: 'GUDANG ELEKTRONIK',
        date_receive: null,
        details: [
            {
                id_dtl: 'DTL-003',
                code_product: 'PRD-003',
                nm_product: 'Monitor Samsung 24"',
                qty: 3,
                nm_product_satuan: 'PCS',
                sn: 'SN-SMSG-001',
                lokasi_source: 'VENDOR',
                lokasi_destination: 'RAK B1'
            }
        ]
    },
    {
        id: 'INC-20230003',
        code: 'IS-2023-0003',
        nm_suppliers: 'PT. JAYA ABADI',
        code_po: 'PO-2023-0020',
        date_create: '2023-10-03 09:15:00',
        status_incoming: 'READY TO RECEIVE',
        f_assign_barcode: 1,
        f_print_barcode: 1,
        f_ok_receive: 1,
        nm_gudang: 'GUDANG SPAREPART',
        date_receive: null,
        details: [
            {
                id_dtl: 'DTL-004',
                code_product: 'PRD-004',
                nm_product: 'Keyboard Mechanical',
                qty: 2,
                nm_product_satuan: 'PCS',
                sn: 'SN-KYB-001',
                lokasi_source: 'VENDOR',
                lokasi_destination: 'RAK C1'
            },
            {
                id_dtl: 'DTL-005',
                code_product: 'PRD-005',
                nm_product: 'Headset Gaming',
                qty: 2,
                nm_product_satuan: 'PCS',
                sn: 'SN-HS-001',
                lokasi_source: 'VENDOR',
                lokasi_destination: 'RAK C2'
            }
        ]
    },
    {
        id: 'INC-20230004',
        code: 'IS-2023-0004',
        nm_suppliers: 'PT. BINTANG TERANG',
        code_po: 'PO-2023-0022',
        date_create: '2023-10-05 14:00:00',
        status_incoming: 'RECEIVED',
        f_assign_barcode: 1,
        f_print_barcode: 1,
        f_ok_receive: 1,
        nm_gudang: 'GUDANG UTAMA',
        date_receive: '2023-10-06 10:00:00',
        details: [
            {
                id_dtl: 'DTL-006',
                code_product: 'PRD-006',
                nm_product: 'Printer Canon',
                qty: 1,
                nm_product_satuan: 'PCS',
                sn: 'SN-PRT-001',
                lokasi_source: 'VENDOR',
                lokasi_destination: 'RAK D1'
            }
        ]
    }
];
