import { ProfileData } from '../types/profile.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchProfileDataApi = async (): Promise<ProfileData> => {
    // Simulasi loading 1.5 detik
    await delay(1500);

    return {
        name: 'Dedi Kurniawan',
        email: 'dedi.kurniawan@ekamaju.com',
        phone: '+62 812-3456-7890',
        avatarUrl: 'https://ui-avatars.com/api/?name=Dedi+Kurniawan&background=random',
        department: 'Teknikal',
        position: 'Teknisi Senior',
        joinDate: '12 Januari 2020',
        employeeId: 'EMP-2020-0042',
        division: 'Maintenance & Service',
        officeLocation: 'Headquarters - Jakarta',
        onlineStatus: 'Online',
        lastAccess: 'Baru saja'
    };
};
