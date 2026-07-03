import { SalesOrder } from '../types/so.types';

export const DUMMY_SO_LIST: SalesOrder[] = [
    {
        id_so: "1",
        date_so: "2024-02-15",
        code_so: "SO-2024-001",
        status_so: "SALES ORDER",
        id_karyawan: "K-01",
        nm_karyawan: "Budi Santoso",
        id_customers: "C-101",
        nm_customers: "PT. Maju Mundur",
        customers_address: "Jl. Jendral Sudirman No. 1, Jakarta Pusat",
        customers_email: "info@majumundur.co.id",
        customers_phone: "021-5551234",
        no_po_cust: "PO/MM/02/24",
        
        date_estimasi: "2024-02-25",
        delivery_term: "EXW",
        freight: "1",
        freight_amount: "0",
        teknisi: "1",
        teknisi_amount: "0",
        teknisi_customer1_select: "",
        forklift: "1",
        forklift_amount: "0",

        vcurrency: "IDR",
        nkurs: "1",
        flag_ppn: "1",
        id_type_pembayaran: "TP-01",
        nm_type_pembayaran: "Kredit",
        ndp_persen: "20",
        ndp_amount: "10000000",
        ntenor: "3",
        ntenor_amount: "13333333",
        id_cara_pembayaran: "CP-02",
        nm_cara_pembayaran: "Transfer BCA",
        id_waktu_bayar: "WB-01",
        nm_waktu_bayar: "30 Hari",

        keterangan: "Tolong kirim sebelum akhir bulan.",
        code_so_excel: "SO-EX-001",
        success_fee: "1500000",
        internal_notes: "Pelanggan prioritas",

        items: [
            {
                id_item: "I-01",
                product_code: "P-001",
                product_name: "Mesin Potong Rumput XYZ",
                status_barang: "Ready",
                harga: "25000000",
                qty: "2",
                satuan: "Unit",
                delivery_term: "EXW"
            }
        ]
    },
    {
        id_so: "2",
        date_so: "2024-02-16",
        code_so: "SO-2024-002",
        status_so: "DRAFT SALES ORDER",
        id_karyawan: "K-02",
        nm_karyawan: "Siti Aminah",
        id_customers: "C-102",
        nm_customers: "CV. Sentosa Abadi",
        customers_address: "Jl. Malioboro No. 2, Yogyakarta",
        customers_email: "purchasing@sentosaabadi.com",
        customers_phone: "0274-123456",
        no_po_cust: "PO/SA/02/005",
        
        date_estimasi: "2024-03-01",
        delivery_term: "FOB",
        freight: "2",
        freight_amount: "500000",
        teknisi: "2",
        teknisi_amount: "0",
        teknisi_customer1_select: "4",
        forklift: "2",
        forklift_amount: "0",

        vcurrency: "IDR",
        nkurs: "1",
        flag_ppn: "0",
        id_type_pembayaran: "TP-02",
        nm_type_pembayaran: "Tunai",
        ndp_persen: "0",
        ndp_amount: "0",
        ntenor: "0",
        ntenor_amount: "0",
        id_cara_pembayaran: "CP-01",
        nm_cara_pembayaran: "Tunai",
        id_waktu_bayar: "WB-02",
        nm_waktu_bayar: "COD",

        keterangan: "Packing kayu tebal",
        code_so_excel: "",
        success_fee: "0",
        internal_notes: "Baru DP, minta dirakit dulu",

        items: [
            {
                id_item: "I-02",
                product_code: "P-002",
                product_name: "Mesin Bor Besar ABC",
                status_barang: "Indent",
                harga: "15000000",
                qty: "1",
                satuan: "Unit",
                delivery_term: "FOB"
            }
        ]
    }
];
