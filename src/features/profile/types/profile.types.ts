export interface UserLocation {
    id: number;
    latitude: number;
    longitude: number;
    deviceName?: string;
    createdAt?: string;
}

export interface ProfileData {
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    department: string;
    position: string;
    joinDate: string;
    employeeId: string;
    division: string;
    officeLocation: string;
    locations?: UserLocation[];
}
