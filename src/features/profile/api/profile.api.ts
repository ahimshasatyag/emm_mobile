import { ProfileData, UserLocation } from '../types/profile.types';
import api from '../../../services/api/api';

export const fetchProfileDataApi = async (username: string): Promise<ProfileData> => {
    const response = await api.get(`/profile/${username}`);
    const { user, employee, locations } = response.data.data;

    // Handle avatar URL from backend
    let avatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(employee?.nm_karyawan || user?.nm_users || 'User') + '&background=random';
    if (user?.link_foto && user.link_foto !== 'avatar-1.jpg') {
        // Asumsi foto disimpan di public storage Laravel
        const baseUrl = api.defaults.baseURL?.replace('/api', '') || 'http://192.168.1.127:8002';
        avatarUrl = `${baseUrl}/storage/${user.link_foto}`;
    }

    // Map locations data if available
    const mappedLocations: UserLocation[] = (locations || []).map((loc: any) => {
        // Handle Point type: assuming format `{ coordinates: [longitude, latitude] }` or direct `x`, `y`
        let longitude = 106.816666;
        let latitude = -6.200000;
        
        if (loc.location) {
            if (typeof loc.location === 'string' && loc.location.includes('POINT')) {
                // Handle WKT "POINT(lon lat)"
                const match = loc.location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
                if (match) {
                    longitude = parseFloat(match[1]);
                    latitude = parseFloat(match[2]);
                }
            } else {
                longitude = Number(loc.location.coordinates?.[0] || loc.location.x || loc.location.longitude) || 106.816666;
                latitude = Number(loc.location.coordinates?.[1] || loc.location.y || loc.location.latitude) || -6.200000;
            }
        }
        
        return {
            id: loc.id,
            latitude: latitude,
            longitude: longitude,
            deviceName: loc.device_name,
            createdAt: loc.created_at ? new Date(loc.created_at).toLocaleString('id-ID') : undefined,
        };
    });

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
        locations: mappedLocations,
    };
};
