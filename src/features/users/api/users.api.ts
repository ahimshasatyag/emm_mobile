import { UserData, UserFormData } from '../types/users.types';
import { mockUsers } from '../data/users.dummy';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUsersApi = async (): Promise<UserData[]> => {
    await delay(1200);
    return [...mockUsers];
};

export const fetchUserByIdApi = async (id: string): Promise<UserData> => {
    await delay(800);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('Pengguna tidak ditemukan');
    return { ...user };
};

export const createUserApi = async (data: UserFormData): Promise<UserData> => {
    await delay(1500);

    // Simulate unique username check
    if (mockUsers.some(u => u.username === data.username)) {
        throw new Error('Username sudah digunakan');
    }

    const newUser: UserData = {
        id: Math.random().toString(36).substr(2, 9),
        username: data.username,
        name: data.name,
        level: data.level,
        status: data.status as 'Active' | 'Inactive',
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`
    };

    mockUsers.unshift(newUser);
    return newUser;
};

export const updateUserApi = async (id: string, data: UserFormData): Promise<UserData> => {
    await delay(1500);

    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Pengguna tidak ditemukan');

    const updatedUser: UserData = {
        ...mockUsers[index],
        name: data.name,
        level: data.level,
        status: data.status as 'Active' | 'Inactive',
        // Note: avatar not updated in mock to preserve image, but can be
    };

    mockUsers[index] = updatedUser;
    return updatedUser;
};
