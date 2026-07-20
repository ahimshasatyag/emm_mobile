import { AssetItem, AssetCategory, AssetType } from '../types/assests.types';

export const DUMMY_ASSET_CATEGORIES: AssetCategory[] = [
    { id: '1', name: 'Mobil' },
    { id: '2', name: 'Motor' },
    { id: '3', name: 'Elektronik' },
    { id: '4', name: 'Furniture' },
];

export const DUMMY_ASSET_TYPES: AssetType[] = [
    { id: '1', name: 'Kendaraan Operasional' },
    { id: '2', name: 'Perangkat IT' },
    { id: '3', name: 'Aset Tetap' },
];

export const DUMMY_ASSETS: AssetItem[] = [
    {
        id: '1',
        name: 'Toyota Avanza 2022',
        inventory_type_id: '1',
        type_name: 'Kendaraan Operasional',
        inventory_category_id: '1',
        category_name: 'Mobil',
        procured_date: '2022-01-15',
        purchased_date: '2022-01-20',
        deskripsi: 'Mobil operasional kantor pusat',
        serial: 'B 1234 ABC',
        status: 'active',
        f_print: '1',
        serial_numbers: [
            { id: '1', asset_id: '1', name_sn: 'Mesin', serial_number: 'M123456', f_print: '1' }
        ]
    },
    {
        id: '2',
        name: 'MacBook Pro M2',
        inventory_type_id: '2',
        type_name: 'Perangkat IT',
        inventory_category_id: '3',
        category_name: 'Elektronik',
        procured_date: '2023-05-10',
        purchased_date: '2023-05-11',
        deskripsi: 'Laptop untuk tim Developer',
        serial: 'C02123XYZ',
        status: 'normal',
        f_print: '1',
        serial_numbers: [
            { id: '2', asset_id: '2', name_sn: 'MacBook', serial_number: 'C02123XYZ', f_print: '1' },
            { id: '3', asset_id: '2', name_sn: 'Charger', serial_number: 'CHG-987', f_print: null }
        ]
    },
    {
        id: '3',
        name: 'Honda Beat 2021',
        inventory_type_id: '1',
        type_name: 'Kendaraan Operasional',
        inventory_category_id: '2',
        category_name: 'Motor',
        procured_date: '2021-08-05',
        purchased_date: '2021-08-05',
        deskripsi: 'Motor kurir',
        serial: 'B 9999 XYZ',
        status: 'sold',
        f_print: null,
    }
];
