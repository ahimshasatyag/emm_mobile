import { ListPaymentItem, ListPaymentSummaryItem } from '../types/listpayment.types';

export const DUMMY_LIST_PAYMENT_ITEMS: ListPaymentItem[] = [
    {
        id_so: '1',
        code_so: 'SO-EMM/2026/07/001',
        date_so: '01/07/2026',
        nm_customers: 'PT DUMMY CUSTOMER',
        type_kategori: 'PP',
        vcurrency: 'IDR',
        harga_ppn: '100000',
        tot_qty: '10',
        code_product: 'PRD001',
        nm_product: 'Produk Dummy',
        nm_product_brand: 'Brand A',
        nm_karyawan: 'Sales Budi',
        nm_type_pembayaran: 'Kredit',
        term_pembayaran: 'Tenor 3x Rp 30.000',
        keterangan: 'Dummy notes',
        detail_payment: 'Rp 30.000 ( CAIR ) LUNAS 01/07/2026 Transfer BCA',
        date_invoice: '05/07/2026',
        code_invoice: 'INV/2026/07/001',
        date_delivery: '04/07/2026',
        success_fee: 5000,
        freight_notes: 'EMM',
        teknisi_notes: 'EMM',
        forklift_notes: 'EMM',
        tax_amount: '11000',
        subtotal: '1110000'
    },
    {
        id_so: '2',
        code_so: 'SO-EMM/2026/07/002',
        date_so: '02/07/2026',
        nm_customers: 'CV MAJU JAYA',
        type_kategori: 'PL',
        vcurrency: 'IDR',
        harga_ppn: '50000',
        tot_qty: '20',
        code_product: 'PRD002',
        nm_product: 'Produk Dummy 2',
        nm_product_brand: 'Brand B',
        nm_karyawan: 'Sales Andi',
        nm_type_pembayaran: 'Cash',
        term_pembayaran: 'Tidak Ada DP',
        keterangan: 'Segera kirim',
        detail_payment: 'Rp 1.000.000 ( CAIR ) LUNAS 02/07/2026 Cash',
        date_invoice: '06/07/2026',
        code_invoice: 'INV/2026/07/002',
        date_delivery: '05/07/2026',
        success_fee: 0,
        freight_notes: 'Customer bayar ditempat',
        teknisi_notes: 'Transportasi',
        forklift_notes: 'Customer sediakan sendiri',
        tax_amount: '0',
        subtotal: '1000000'
    }
];

export const DUMMY_LIST_PAYMENT_SUMMARY: ListPaymentSummaryItem[] = [
    { kategori: 'month', type_kategori: 'PP', product_price: 1000000, nqty: 10 },
    { kategori: 'month', type_kategori: 'PL', product_price: 1000000, nqty: 20 },
    { kategori: 'month', type_kategori: 'AX', product_price: 0, nqty: 0 },
    { kategori: 'ytd', type_kategori: 'PP', product_price: 5000000, nqty: 50 },
    { kategori: 'ytd', type_kategori: 'PL', product_price: 3000000, nqty: 60 },
    { kategori: 'ytd', type_kategori: 'AX', product_price: 0, nqty: 0 }
];
