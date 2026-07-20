import { AssetItem, InventorySchedule, UserItem } from '../types/inventoryschedule.types';

export const DUMMY_ASSETS: AssetItem[] = [
    { id: '1', name: 'Toyota Avanza 2022' },
    { id: '2', name: 'Honda Vario 150' },
    { id: '3', name: 'MacBook Pro M2' },
    { id: '4', name: 'Mesin Genset 5000W' }
];

export const DUMMY_USERS: UserItem[] = [
    { username: 'budi', nm_users: 'Budi Santoso' },
    { username: 'andi', nm_users: 'Andi Wijaya' },
    { username: 'citra', nm_users: 'Citra Lestari' },
    { username: 'dina', nm_users: 'Dina Mariana' }
];

export const DUMMY_SCHEDULES: InventorySchedule[] = [
    {
        id: '1',
        asset_id: '1',
        asset_name: 'Toyota Avanza 2022',
        name: 'Pajak Tahunan',
        deskripsi: 'Pembayaran pajak tahunan kendaraan operasional',
        periode: 'Yearly',
        due_date: '2026-08-15',
        reminder: '7,14',
        pic: [
            { username: 'budi', nm_users: 'Budi Santoso' },
            { username: 'dina', nm_users: 'Dina Mariana' }
        ]
    },
    {
        id: '2',
        asset_id: '4',
        asset_name: 'Mesin Genset 5000W',
        name: 'Maintenance Rutin',
        deskripsi: 'Pengecekan oli dan sparepart',
        periode: 'Monthly',
        due_date: '2026-07-25',
        reminder: '3',
        pic: [
            { username: 'andi', nm_users: 'Andi Wijaya' }
        ]
    }
];
