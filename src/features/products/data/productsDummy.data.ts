import { ProductData } from '../types/products.types';

export const initialDummyProducts: ProductData[] = [
    {
        id_product: '1',
        code_product: 'PRD-001',
        nm_product: 'Laptop Asus ROG',
        id_product_kategori: 'KAT-01',
        nm_product_kategori: 'Elektronik',
        id_product_sub_kategori: 'SUB-01',
        nm_product_sub_kategori: 'Laptop',
        id_product_brand: 'BRD-01',
        nm_product_brand: 'Asus',
        id_product_satuan: 'SAT-01',
        nm_product_satuan: 'Pcs',
        product_deskripsi: 'Laptop gaming asus republic of gamers dengan spesifikasi tinggi.',
        link_foto: 'https://via.placeholder.com/150',
        f_status: 't',
        options: [
            { id_product_price_opt: 'OPT-01', nm_product_opt: 'Warna Hitam' },
            { id_product_price_opt: 'OPT-02', nm_product_opt: 'Warna Merah' }
        ]
    },
    {
        id_product: '2',
        code_product: 'PRD-002',
        nm_product: 'Samsung S24 Ultra',
        id_product_kategori: 'KAT-01',
        nm_product_kategori: 'Elektronik',
        id_product_sub_kategori: 'SUB-02',
        nm_product_sub_kategori: 'Handphone',
        id_product_brand: 'BRD-02',
        nm_product_brand: 'Samsung',
        id_product_satuan: 'SAT-01',
        nm_product_satuan: 'Pcs',
        product_deskripsi: 'Smartphone flagship dari samsung terbaru.',
        f_status: 't',
        options: []
    },
    {
        id_product: '3',
        code_product: 'PRD-003',
        nm_product: 'Apple MacBook Pro M3',
        id_product_kategori: 'KAT-01',
        nm_product_kategori: 'Elektronik',
        id_product_sub_kategori: 'SUB-01',
        nm_product_sub_kategori: 'Laptop',
        id_product_brand: 'BRD-03',
        nm_product_brand: 'Apple',
        id_product_satuan: 'SAT-01',
        nm_product_satuan: 'Pcs',
        product_deskripsi: 'MacBook Pro terbaru dengan chip M3 super cepat.',
        f_status: 'f',
        options: [
            { id_product_price_opt: 'OPT-03', nm_product_opt: 'Space Grey' },
            { id_product_price_opt: 'OPT-04', nm_product_opt: 'Silver' }
        ]
    },
    {
        id_product: '4',
        code_product: 'PRD-004',
        nm_product: 'Kemeja Flanel Uniqlo',
        id_product_kategori: 'KAT-02',
        nm_product_kategori: 'Pakaian',
        id_product_sub_kategori: 'SUB-03',
        nm_product_sub_kategori: 'Baju',
        id_product_brand: 'BRD-04',
        nm_product_brand: 'Uniqlo',
        id_product_satuan: 'SAT-01',
        nm_product_satuan: 'Pcs',
        product_deskripsi: 'Kemeja flanel lengan panjang yang nyaman dipakai.',
        f_status: 't',
        options: [
            { id_product_price_opt: 'OPT-05', nm_product_opt: 'Ukuran M' },
            { id_product_price_opt: 'OPT-06', nm_product_opt: 'Ukuran L' }
        ]
    },
    {
        id_product: '5',
        code_product: 'PRD-005',
        nm_product: 'Celana Chino Erigo',
        id_product_kategori: 'KAT-02',
        nm_product_kategori: 'Pakaian',
        id_product_sub_kategori: 'SUB-04',
        nm_product_sub_kategori: 'Celana',
        id_product_brand: 'BRD-05',
        nm_product_brand: 'Erigo',
        id_product_satuan: 'SAT-01',
        nm_product_satuan: 'Pcs',
        product_deskripsi: 'Celana chino kasual cocok untuk kegiatan sehari-hari.',
        f_status: 't',
        options: []
    }
];
