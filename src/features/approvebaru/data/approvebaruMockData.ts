import { ApprovebaruItem, ApprovebaruDetail } from '../types/approvebaru.types';

export const mockPendingApprovals: ApprovebaruItem[] = [
    {
        id: 101,
        requester_name: 'John Doe',
        status: 'Pending',
        description: 'Sales Order SO-2023-10-001',
        action: 'Request Approval SO'
    },
    {
        id: 102,
        requester_name: 'Jane Smith',
        status: 'Pending',
        description: 'Sales Order SO-2023-10-002',
        action: 'Request Approval SO'
    },
    {
        id: 103,
        requester_name: 'Alice Johnson',
        status: 'Pending',
        description: 'Sales Order SO-2023-10-003',
        action: 'Request Approval SO'
    }
];

export const mockApprovalDetail: Record<number, ApprovebaruDetail> = {
    101: {
        approval_status: 'Pending',
        description: 'Sales Order SO-2023-10-001',
        code_so: 'SO-2023-10-001',
        code_approval: 'QO-EMM/2026/07/00001',
        salesperson: 'Andi Sales',
        delivery_to: 'Gudang Utama, Jakarta',
        customer_name: 'PT Jaya Abadi',
        customer_address: 'Jl. Merdeka No 123, Jakarta',
        customer_email: 'contact@jayaabadi.com',
        customer_phone: '021-5551234',
        date: '13-07-2026',
        estimated_delivery: '01-01-1970',
        currency: 'USD',
        kurs: '16400',
        ppn: 'Ya',
        delivery_term: 'FRANCO SIDOARJO',
        biaya_freight: '0',
        biaya_teknisi: '0',
        biaya_forklift: '0',
        metode_payment: 'Panen Arta',
        dp: '0.00000000',
        tenor: '0',
        keterangan: 'Est reprehenderit v',
        dp_rp: '0',
        cicilan_rp: '0',
        tipe_pembayaran: 'Transfer',
        waktu_bayar: '14 Hari',
        kode_so_excel: 'SO/2026/001',
        no_po_customer: 'PO-9912',
        success_fee: '0',
        internal_notes: 'Segera diproses',
        products: [
            {
                id_product: 'P001',
                code_product: 'PRD-001',
                nm_product: 'Laptop Lenovo ThinkPad',
                nm_product_satuan: 'Unit',
                qty: 2,
                price: 15000000,
                status_barang: 'Ready Stock',
                delivery_term: 'FOB Jakarta'
            },
            {
                id_product: 'P002',
                code_product: 'PRD-002',
                nm_product: 'Monitor Dell 24 Inch',
                nm_product_satuan: 'Unit',
                qty: 5,
                price: 3000000,
                status_barang: 'Indent',
                delivery_term: 'Franco Tangerang'
            }
        ],
        related_approvals: [
            {
                approval_name: 'Konfirmasi Success Fee',
                status: 'passed',
                description: 'Cek success fee jika > 0'
            },
            {
                approval_name: 'Diskon barang SO GM',
                status: 'passed',
                description: 'Diskon barang SO GM'
            },
            {
                approval_name: 'Diskon barang SO Direktur',
                status: 'passed',
                description: 'Diskon barang SO Direktur'
            },
            {
                approval_name: 'Batal Quotation',
                status: 'pending',
                description: 'Batal Quotation'
            },
            {
                approval_name: 'Diskon Barang Option',
                status: 'passed',
                description: 'Beda Harga dengan di price list maka harus approval'
            }
        ]
    },
    102: {
        approval_status: 'Pending',
        description: 'Sales Order SO-2023-10-002',
        code_so: 'SO-2023-10-002',
        code_approval: 'QO-EMM/2026/07/00002',
        salesperson: 'Budi Sales',
        delivery_to: 'Cabang Bandung',
        customer_name: 'CV Makmur Sejahtera',
        customer_address: 'Jl. Asia Afrika No 88, Bandung',
        customer_email: 'info@makmursejahtera.co.id',
        customer_phone: '022-4445678',
        date: '14-10-2023',
        estimated_delivery: '21-10-2023',
        currency: 'IDR',
        products: [
            {
                id_product: 'P003',
                code_product: 'PRD-003',
                nm_product: 'Mechanical Keyboard',
                nm_product_satuan: 'Pcs',
                qty: 2,
                price: 1200000
            }
        ],
        related_approvals: [
            {
                approval_name: 'Diskon Barang Option',
                status: 'passed',
                description: 'Beda Harga dengan di price list maka harus approval'
            }
        ]
    },
    103: {
        approval_status: 'Pending',
        description: 'Sales Order SO-2023-10-003',
        code_so: 'SO-2023-10-003',
        code_approval: 'QO-EMM/2026/07/00003',
        salesperson: 'Citra Sales',
        delivery_to: 'Kantor Pusat Surabaya',
        customer_name: 'PT Teknologi Bangsa',
        customer_address: 'Jl. Pemuda No 10, Surabaya',
        customer_email: 'procurement@teknologi.com',
        customer_phone: '031-7778899',
        date: '15-10-2023',
        estimated_delivery: '22-10-2023',
        currency: 'USD',
        products: [
            {
                id_product: 'P004',
                code_product: 'PRD-004',
                nm_product: 'Server Rack 42U',
                nm_product_satuan: 'Set',
                qty: 1,
                price: 5000
            },
            {
                id_product: 'P005',
                code_product: 'PRD-005',
                nm_product: 'Enterprise Switch 24-Port',
                nm_product_satuan: 'Unit',
                qty: 3,
                price: 1200
            }
        ],
        related_approvals: [
            {
                approval_name: 'Konfirmasi Success Fee',
                status: 'passed',
                description: 'Cek success fee jika > 0'
            },
            {
                approval_name: 'Diskon barang SO GM',
                status: 'passed',
                description: 'Diskon barang SO GM'
            }
        ]
    }
};
