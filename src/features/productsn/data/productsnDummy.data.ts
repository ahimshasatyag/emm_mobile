import { ProductsnAsset, ProductsnCategory, ProductsnSerialNumber, ProductsnType } from '../types/productsn.types';

export const DUMMY_PRODUCTSN_TYPES: ProductsnType[] = [
    { id: 'T001', name: 'Elektronik' },
    { id: 'T002', name: 'Kendaraan' },
    { id: 'T003', name: 'Furnitur' },
];

export const DUMMY_PRODUCTSN_CATEGORIES: ProductsnCategory[] = [
    { id: 'C001', name: 'Laptop' },
    { id: 'C002', name: 'Mobil' },
    { id: 'C003', name: 'Motor' },
    { id: 'C004', name: 'Meja' },
];

export const DUMMY_PRODUCTSN_ASSETS: ProductsnAsset[] = [
    {
        id: 'INV001',
        name: 'Laptop ASUS ROG',
        productsn_type_id: 'T001',
        productsn_category_id: 'C001',
        procured_date: '2023-01-15',
        purchased_date: '2023-01-10',
        deskripsi: 'Laptop gaming untuk tim desain',
        serial: 'ASUS-ROG-2023',
        status: 'active',
        f_print: 'SN-001',
    },
    {
        id: 'INV002',
        name: 'Toyota Avanza 2022',
        productsn_type_id: 'T002',
        productsn_category_id: 'C002',
        procured_date: '2022-05-20', // BPKB
        purchased_date: '2022-06-01', // STNK
        deskripsi: 'Kendaraan operasional kantor',
        serial: 'B 1234 CD',
        status: 'normal',
        f_print: 'SN-002',
    },
];

export const DUMMY_PRODUCTSN_SERIALS: ProductsnSerialNumber[] = [
    {
        id: 'SN1',
        asset_id: 'INV001',
        name_sn: 'Unit A',
        serial_number: 'SN-001',
    },
    {
        id: 'SN2',
        asset_id: 'INV002',
        name_sn: 'Mesin',
        serial_number: 'SN-002',
    },
];
