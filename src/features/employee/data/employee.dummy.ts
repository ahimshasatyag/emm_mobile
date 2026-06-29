import { EmployeeData, DivisionData, PositionData } from '../types/employee.types';

export const dummyDivisions: DivisionData[] = [
    { id_karyawan_divisi: 'D01', nm_karyawan_divisi: 'IT Department' },
    { id_karyawan_divisi: 'D02', nm_karyawan_divisi: 'Human Resources' },
    { id_karyawan_divisi: 'D03', nm_karyawan_divisi: 'Finance & Accounting' },
    { id_karyawan_divisi: 'D04', nm_karyawan_divisi: 'Marketing' },
    { id_karyawan_divisi: 'D05', nm_karyawan_divisi: 'Operations' },
];

export const dummyPositions: PositionData[] = [
    { id_karyawan_posisi: 'P01', nm_karyawan_posisi: 'Manager' },
    { id_karyawan_posisi: 'P02', nm_karyawan_posisi: 'Staff' },
    { id_karyawan_posisi: 'P03', nm_karyawan_posisi: 'Supervisor' },
    { id_karyawan_posisi: 'P04', nm_karyawan_posisi: 'Director' },
    { id_karyawan_posisi: 'P05', nm_karyawan_posisi: 'Intern' },
];

export let dummyEmployees: EmployeeData[] = [
    {
        id_karyawan: 'E001',
        nm_karyawan: 'Budi Santoso',
        tempat_lahir: 'Jakarta',
        id_karyawan_divisi: 'D01',
        date_lahir: '15-05-1990',
        id_karyawan_posisi: 'P01',
        no_hp: '081234567890',
        jenis_kelamin: 'L',
        karyawan_address: 'Jl. Merdeka No. 1, Jakarta',
        karyawan_email: 'budi.santoso@example.com',
        flag_agent: '0',
        flag_status: '1',
        nm_karyawan_divisi: 'IT Department',
        nm_karyawan_posisi: 'Manager',
    },
    {
        id_karyawan: 'E002',
        nm_karyawan: 'Siti Aminah',
        tempat_lahir: 'Bandung',
        id_karyawan_divisi: 'D02',
        date_lahir: '20-10-1992',
        id_karyawan_posisi: 'P02',
        no_hp: '081987654321',
        jenis_kelamin: 'P',
        karyawan_address: 'Jl. Asia Afrika No. 45, Bandung',
        karyawan_email: 'siti.aminah@example.com',
        flag_agent: '0',
        flag_status: '1',
        nm_karyawan_divisi: 'Human Resources',
        nm_karyawan_posisi: 'Staff',
    },
    {
        id_karyawan: 'E003',
        nm_karyawan: 'Agus Pratama',
        tempat_lahir: 'Surabaya',
        id_karyawan_divisi: 'D04',
        date_lahir: '05-02-1988',
        id_karyawan_posisi: 'P03',
        no_hp: '085612349876',
        jenis_kelamin: 'L',
        karyawan_address: 'Jl. Tunjungan No. 10, Surabaya',
        karyawan_email: 'agus.pratama@example.com',
        flag_agent: '1',
        flag_status: '1',
        nm_karyawan_divisi: 'Marketing',
        nm_karyawan_posisi: 'Supervisor',
    },
];
