import { UsersLogData } from '../types/userslog.types';
import { api } from '../../../services/api/api';

export const fetchUsersLogApi = async (): Promise<UsersLogData[]> => {
    try {
        const response = await api.get('/userlog');
        
        // Backend returns: { status: 'success', data: [...] }
        const data = response.data.data || [];
        
        return data.map((item: any, index: number) => ({
            id: index.toString(), // Generate a local ID since backend doesn't provide one
            username: item.username,
            activity: item.activity,
            ipAddress: item.ip_address,
            date: item.d_createdate,
        }));
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Terjadi kesalahan saat memuat data log pengguna');
    }
};
