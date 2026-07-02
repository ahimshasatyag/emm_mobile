import { CekSerialNumberData, HistoryService } from '../types/cekserialnumber.types';

export const dummyCekSerialNumberData: CekSerialNumberData = {
    code_product: "PRD-2023-001",
    nm_product: "Mesin Potong Kayu YX-500",
    product_deskripsi: "Mesin potong kayu presisi tinggi dengan laser guide.",
    customer: "PT. Maju Mundur Bersama",
    customer_address: "Jl. Industri Raya No. 45, Kawasan Industri Terpadu",
    provinsi: "Jawa Barat",
    kabupaten: "Bekasi",
    customer_phone: "021-5551234",
    customer_mobile: "081234567890",
    do_code: "DO-2023-10025",
    waranty_start: "01-Jan-2024",
    waranty_time: "12",
    waranty_end: "01-Jan-2025",
    waranty_end_raw: "2025-01-01 00:00:00"
};

export const dummyHistoryServices: HistoryService[] = [
    {
        cst_code: "CST-24-001",
        cst_date: "15-Feb-2024",
        catatan_kerusakan: "Akibat kerusakan mendasar pada sistem utamanya, mesin tersebut mati total sehingga seluruh operasionalnya terhenti dan tidak bisa dinyalakan kembali.",
        total_realisasi: "150000",
        laporan_akhir: "Untuk mengatasi masalah kelistrikan pada perangkat ini, teknisi disarankan untuk segera mengganti sekring yang putus sekaligus memasang kabel power baru agar aliran listrik kembali berjalan normal dan aman.",
        teknisi: "Budi Santoso"
    },
    {
        cst_code: "CST-24-052",
        cst_date: "10-Jun-2024",
        catatan_kerusakan: "Laser guide tidak akurat.",
        total_realisasi: "0",
        laporan_akhir: "Kalibrasi ulang laser. Masih dalam garansi.",
        teknisi: "Andi Saputra"
    }
];
