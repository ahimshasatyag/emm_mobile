import { QuotationAP } from '../types/quotationsap.types';

export const DUMMY_QUOTATIONS_AP: QuotationAP[] = [
    {
        id_po: "1",
        code_po: "QAP-202607-0001",
        date_po: "2026-07-01",
        status_po: "QUOTATION",
        date_schdl: "2026-07-10",
        id_suppliers: "SUP-001",
        nm_suppliers: "PT. SUMBER REJEKI",
        id_gudang: "GDG-01",
        id_mata_uang: "IDR",
        partner_ref: "REF-001",
        notes: "Penawaran harga bahan baku kertas",
        amount_total: 15000000,
        id_product_lokasi: "LOC-01",
        date_create: "2026-07-01 10:00:00",
        details: [
            {
                id_po_dtl: "1",
                id_po: "1",
                id_product: "PRD-001",
                code_product: "P-001",
                nm_product: "Kertas HVS A4",
                product_deskripsi: "Kertas HVS A4 80gsm",
                qty: 100,
                product_price: 50000,
                notes: "Kirim secepatnya",
                options: [
                    {
                        id_po_opt_dtl: "1",
                        id_po_dtl: "1",
                        id_product: "PRD-001",
                        id_po: "1",
                        nm_product_opt: "Packing Kayu",
                        harga: 25000
                    }
                ]
            },
            {
                id_po_dtl: "2",
                id_po: "1",
                id_product: "PRD-002",
                code_product: "P-002",
                nm_product: "Tinta Printer Hitam",
                product_deskripsi: "Tinta cair hitam 1 Liter",
                qty: 50,
                product_price: 200000,
                notes: "",
            }
        ]
    },
    {
        id_po: "2",
        code_po: "QAP-202607-0002",
        date_po: "2026-07-03",
        status_po: "DRAFT",
        date_schdl: "2026-07-15",
        id_suppliers: "SUP-002",
        nm_suppliers: "CV. MAJU BERSAMA",
        id_gudang: "GDG-01",
        id_mata_uang: "IDR",
        partner_ref: "REF-002",
        notes: "Draft untuk material tambahan",
        amount_total: 5000000,
        id_product_lokasi: "LOC-02",
        date_create: "2026-07-03 14:30:00",
        details: [
            {
                id_po_dtl: "3",
                id_po: "2",
                id_product: "PRD-003",
                code_product: "P-003",
                nm_product: "Lakban Bening",
                product_deskripsi: "Lakban bening ukuran besar",
                qty: 200,
                product_price: 25000,
                notes: "",
            }
        ]
    },
    {
        id_po: "3",
        code_po: "QAP-202607-0003",
        date_po: "2026-07-05",
        status_po: "CANCEL",
        date_schdl: null,
        id_suppliers: "SUP-003",
        nm_suppliers: "PT. INDO PLASTIK",
        id_gudang: "GDG-02",
        id_mata_uang: "USD",
        partner_ref: "REF-003",
        notes: "Dibatalkan karena salah spesifikasi",
        amount_total: 2000,
        id_product_lokasi: "LOC-01",
        date_create: "2026-07-05 09:15:00",
        details: []
    }
];
