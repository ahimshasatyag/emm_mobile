import { UserData } from '../types/users.types';

export const mockUsers: UserData[] = [
    {
        id: '1',
        username: 'admin',
        name: 'Administrator',
        level: 'Super Admin',
        status: 'Active',
        avatarUrl: 'https://ui-avatars.com/api/?name=Administrator&background=random'
    },
    {
        id: '2',
        username: 'budi_teknisi',
        name: 'Budi Santoso',
        level: 'Teknisi',
        status: 'Active',
        avatarUrl: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=random'
    },
    {
        id: '3',
        username: 'siti_hr',
        name: 'Siti Aminah',
        level: 'HRD',
        status: 'Inactive',
        avatarUrl: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=random'
    },
    {
        id: '4',
        username: 'dedi_sales',
        name: 'Dedi Kurniawan',
        level: 'Sales',
        status: 'Active',
        avatarUrl: 'https://ui-avatars.com/api/?name=Dedi+Kurniawan&background=random'
    },
    {
        id: '5',
        username: 'eka_finance',
        name: 'Eka Putri',
        level: 'Finance',
        status: 'Active',
        avatarUrl: 'https://ui-avatars.com/api/?name=Eka+Putri&background=random'
    }
];
