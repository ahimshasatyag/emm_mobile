import { ProfileData } from '../types/profile.types';
import api from '../../../services/api/api';

export const fetchProfileDataApi = async (username: string): Promise<ProfileData> => {
    const response = await api.get(`/profile/${username}`);
    const { user, employee } = response.data.data;

    // Handle avatar URL from backend
    let avatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(employee?.nm_karyawan || user?.nm_users || 'User') + '&background=random';
    if (user?.link_foto && user.link_foto !== 'avatar-1.jpg') {
        // Asumsi foto disimpan di public storage Laravel
        avatarUrl = `http://192.168.1.127:8001/storage/${user.link_foto}`;
    }

    return {
        name: employee?.nm_karyawan || user?.nm_users || 'Unknown User',
        email: employee?.karyawan_email || '-',
        phone: user?.phone || employee?.no_hp || '-',
        avatarUrl: avatarUrl,
        department: employee?.divisi?.nm_karyawan_divisi || '-', // Menggunakan divisi sebagai departemen
        position: employee?.posisi?.nm_karyawan_posisi || '-',
        joinDate: employee?.date_create ? new Date(employee.date_create).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-',
        employeeId: employee?.id_karyawan ? `EMP-${employee.id_karyawan}` : '-',
        division: employee?.divisi?.nm_karyawan_divisi || '-',
        officeLocation: 'Headquarters - Jakarta',
    };
};
