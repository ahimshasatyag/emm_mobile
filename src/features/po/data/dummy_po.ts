import { PoHeader } from "../types/po.types";

export const DUMMY_PO_LIST: PoHeader[] = [
    {
        id_po: "PO-001",
        code_po: "PO-202310-001",
        date_po: "2023-10-15",
        status_po: "PO PURCHASE",
        date_schdl: "2023-10-20",
        id_suppliers: "SUP-01",
        nm_suppliers: "PT. Maju Mundur",
        id_gudang: "GDG-01",
        nm_gudang: "Gudang Utama",
        id_mata_uang: "IDR",
        mata_uang: "Rupiah",
        id_product_lokasi: "LOC-01",
        nm_product_lokasi: "Lantai 1",
        details: [
            {
                id_po_dtl: "DTL-001",
                id_po: "PO-001",
                id_product: "PRD-001",
                code_product: "BRG-01",
                nm_product: "Laptop Asus ROG",
                product_deskripsi: "Laptop gaming high end",
                qty: 5,
                product_price: 25000000,
                notes: "Warna hitam",
                satuan: "Unit",
                options: [
                    { id_po_opt_dtl: "OPT-01", nm_product_opt: "RAM 32GB Upgrade", harga: 1500000, selected: true },
                    { id_po_opt_dtl: "OPT-02", nm_product_opt: "Extended Warranty 2 Years", harga: 500000, selected: false }
                ]
            },
            {
                id_po_dtl: "DTL-002",
                id_po: "PO-001",
                id_product: "PRD-002",
                code_product: "BRG-02",
                nm_product: "Mouse Logitech",
                product_deskripsi: "Mouse wireless",
                qty: 10,
                product_price: 500000,
                notes: "",
                satuan: "Pcs"
            }
        ]
    },
    {
        id_po: "PO-002",
        code_po: "PO-202310-002",
        date_po: "2023-10-16",
        status_po: "DRAFT PO",
        date_schdl: "2023-10-22",
        id_suppliers: "SUP-02",
        nm_suppliers: "CV. Sukses Selalu",
        id_gudang: "GDG-02",
        nm_gudang: "Gudang Cabang",
        id_mata_uang: "USD",
        mata_uang: "US Dollar",
        id_product_lokasi: "LOC-02",
        nm_product_lokasi: "Lantai 2",
        details: [
            {
                id_po_dtl: "DTL-003",
                id_po: "PO-002",
                id_product: "PRD-003",
                code_product: "BRG-03",
                nm_product: "Keyboard Mechanical",
                product_deskripsi: "Keyboard RGB",
                qty: 20,
                product_price: 1500000,
                notes: "Switch merah",
                satuan: "Unit"
            }
        ]
    }
];
