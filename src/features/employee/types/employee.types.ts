export interface EmployeeData {
    id_karyawan: string;
    nm_karyawan: string;
    tempat_lahir: string;
    id_karyawan_divisi: string;
    date_lahir: string;
    id_karyawan_posisi: string;
    no_hp: string;
    jenis_kelamin: 'L' | 'P';
    karyawan_address: string;
    karyawan_email: string;
    flag_agent: '0' | '1';
    flag_status: '0' | '1';
    nm_karyawan_divisi?: string;
    nm_karyawan_posisi?: string;
}

export interface DivisionData {
    id_karyawan_divisi: string;
    nm_karyawan_divisi: string;
}

export interface PositionData {
    id_karyawan_posisi: string;
    nm_karyawan_posisi: string;
}
