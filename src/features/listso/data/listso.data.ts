import { ListSODetail, ListSOItem } from "../types/listso.types";

export const DUMMY_SO_LIST: ListSOItem[] = [
    {
        id_so: "SO001",
        code_so: "SO-2026-07-001",
        date_so: "2026-07-01",
        id_customers: "CUST001",
        nm_customers: "PT Maju Jaya",
        nm_karyawan: "Budi Sales",
        vcurrency: "IDR",
        tot_qty: 15,
        tot_price_netto: 15000000,
        harga_ppn: 16650000,
        status_so: "SALES ORDER"
    },
    {
        id_so: "SO002",
        code_so: "SO-2026-07-002",
        date_so: "2026-07-02",
        id_customers: "CUST002",
        nm_customers: "CV Makmur Abadi",
        nm_karyawan: "Budi Sales",
        vcurrency: "IDR",
        tot_qty: 5,
        tot_price_netto: 5000000,
        harga_ppn: 5550000,
        status_so: "SALE TO INVOICE"
    },
    {
        id_so: "SO003",
        code_so: "SO-2026-07-003",
        date_so: "2026-07-03",
        id_customers: "CUST003",
        nm_customers: "Toko Bahagia",
        nm_karyawan: "Ani Marketing",
        vcurrency: "USD",
        tot_qty: 100,
        tot_price_netto: 2000,
        harga_ppn: 2000,
        status_so: "BATAL"
    }
];

export const DUMMY_SO_DETAIL: Record<string, ListSODetail> = {
    "SO001": {
        id_so: "SO001",
        code_so: "SO-2026-07-001",
        date_so: "2026-07-01",
        status_so: "SALES ORDER",
        
        id_karyawan: "KARY01",
        nm_karyawan: "Budi Sales",
        id_customers: "CUST001",
        nm_customers: "PT Maju Jaya",
        customers_address: "Jl. Sudirman No 10, Jakarta",
        
        date_estimasi: "2026-07-10",
        vcurrency: "IDR",
        nkurs: 1,
        flag_ppn: 1,
        delivery_term: "FOB Destination",
    
        nm_type_pembayaran: "Credit",
        nm_cara_pembayaran: "Transfer BCA",
        nm_waktu_bayar: "30 Hari",
        ndp_persen: 20,
        ndp_amount: 3330000,
        ntenor: 3,
        ntenor_amount: 4440000,
    
        keterangan: "Tolong dikirim pagi hari",
        nm_users: "Admin01",
    
        items: [
            {
                id_product: "PRD01",
                code_product: "ITM-001",
                nm_product: "Semen Portland",
                product_deskripsi: "50 Kg",
                status_barang: "READY",
                indent_amount: 0,
                product_price: 1000000,
                nqty: 10,
                nm_product_satuan: "Sak",
                delivery_term: "FOB",
                subtotal: 10000000
            },
            {
                id_product: "PRD02",
                code_product: "ITM-002",
                nm_product: "Bata Merah",
                product_deskripsi: "Kualitas A",
                status_barang: "INDENT",
                indent_amount: 1,
                product_price: 1000000,
                nqty: 5,
                nm_product_satuan: "Truk",
                delivery_term: "FOB",
                subtotal: 5000000
            }
        ]
    }
};
