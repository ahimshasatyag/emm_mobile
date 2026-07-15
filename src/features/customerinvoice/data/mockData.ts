import { CustomerInvoice } from '../types/customerinvoice';

export const mockCustomerInvoices: CustomerInvoice[] = [
    {
        id_invoice: "1",
        nm_customers: "PT. MAJU BERSAMA",
        date_invoice: "2026-07-15",
        code_invoice: "INV-202607-001",
        nm_karyawan: "Budi Santoso",
        code_so: "SO-202607-001",
        vcurrency: "IDR",
        ntot_balance: 5000000,
        ntot_price_netto_amount: 15000000,
        status_invoice: "OPEN",
        customers_address: "Jl. Sudirman No. 123, Jakarta",
        customers_address_invoice: "Jl. Sudirman No. 123, Jakarta",
        customers_phone: "021-1234567",
        nkurs: 1,
        ndp_persen: 0,
        ndp_amount: 0,
        date_so: "2026-07-10",
        nppn_amount: 11,
        no_po_cust: "PO/MB/07/26/01",
        flag_ppn: 1,
        items: [
            {
                id_product: "1",
                code_product: "PRD-001",
                nm_product: "Laptop Asus ROG",
                product_deskripsi: "Gaming Laptop 15 inch",
                product_price: 15000000,
                nqty: 1,
                nm_product_satuan: "PCS",
                nm_product_brand: "Asus"
            }
        ],
        payments: [
            {
                id_invoice_dtl: "1",
                id_payment_method: "1",
                nm_payment_method: "Transfer Bank",
                date_draft: "2026-07-16",
                f_dp: 0,
                payment_ref: "TRF-BCA-001",
                v_amount: 10000000,
                status_payment: "CAIR"
            }
        ]
    },
    {
        id_invoice: "2",
        nm_customers: "CV. JAYA ABADI",
        date_invoice: "2026-07-14",
        code_invoice: "INV-202607-002",
        nm_karyawan: "Agus Supriyanto",
        code_so: "SO-202607-002",
        vcurrency: "IDR",
        ntot_balance: 0,
        ntot_price_netto_amount: 2500000,
        status_invoice: "PAID",
        customers_address: "Jl. Gajah Mada No. 45, Semarang",
        customers_address_invoice: "Jl. Gajah Mada No. 45, Semarang",
        customers_phone: "024-7654321",
        nkurs: 1,
        ndp_persen: 0,
        ndp_amount: 0,
        date_so: "2026-07-12",
        nppn_amount: 11,
        no_po_cust: "PO/JA/07/26/11",
        flag_ppn: 1,
        items: [
            {
                id_product: "2",
                code_product: "PRD-002",
                nm_product: "Printer Epson L3110",
                product_deskripsi: "Printer Warna Inkjet",
                product_price: 2500000,
                nqty: 1,
                nm_product_satuan: "PCS",
                nm_product_brand: "Epson"
            }
        ],
        payments: [
            {
                id_invoice_dtl: "2",
                id_payment_method: "2",
                nm_payment_method: "Giro",
                date_draft: "2026-07-15",
                f_dp: 0,
                payment_ref: "GR-001",
                v_amount: 2500000,
                status_payment: "CAIR"
            }
        ]
    },
    {
        id_invoice: "3",
        nm_customers: "PT. SINAR MAS",
        date_invoice: "2026-07-16",
        code_invoice: "INV-202607-003",
        nm_karyawan: "Siti Rahmawati",
        code_so: "SO-202607-005",
        vcurrency: "USD",
        ntot_balance: 1000,
        ntot_price_netto_amount: 1000,
        status_invoice: "OPEN",
        customers_address: "Jl. Thamrin No. 88, Jakarta",
        customers_address_invoice: "Jl. Thamrin No. 88, Jakarta",
        customers_phone: "021-8888888",
        nkurs: 15000,
        ndp_persen: 0,
        ndp_amount: 0,
        date_so: "2026-07-15",
        nppn_amount: 11,
        no_po_cust: "PO-SM-001",
        flag_ppn: 0,
        items: [
            {
                id_product: "3",
                code_product: "PRD-003",
                nm_product: "Server Dell PowerEdge",
                product_deskripsi: "Rack Server 1U",
                product_price: 1000,
                nqty: 1,
                nm_product_satuan: "PCS",
                nm_product_brand: "Dell"
            }
        ],
        payments: []
    }
];
