import { EmployeeData, DivisionData, PositionData } from '../types/employee.types';
import { dummyEmployees, dummyDivisions, dummyPositions } from '../data/employee.dummy';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchEmployeesApi = async (): Promise<EmployeeData[]> => {
    await delay(800);
    return [...dummyEmployees];
};

export const fetchEmployeeByIdApi = async (id: string): Promise<EmployeeData> => {
    await delay(500);
    const employee = dummyEmployees.find(e => e.id_karyawan === id);
    if (!employee) throw new Error('Karyawan tidak ditemukan');
    return { ...employee };
};

export const createEmployeeApi = async (data: Omit<EmployeeData, 'id_karyawan' | 'nm_karyawan_divisi' | 'nm_karyawan_posisi'>): Promise<EmployeeData> => {
    await delay(800);
    const newId = `E${String(dummyEmployees.length + 1).padStart(3, '0')}`;
    
    const division = dummyDivisions.find(d => d.id_karyawan_divisi === data.id_karyawan_divisi);
    const position = dummyPositions.find(p => p.id_karyawan_posisi === data.id_karyawan_posisi);
    
    const newEmployee: EmployeeData = {
        ...data,
        id_karyawan: newId,
        nm_karyawan_divisi: division?.nm_karyawan_divisi || '',
        nm_karyawan_posisi: position?.nm_karyawan_posisi || '',
    };
    
    dummyEmployees.push(newEmployee);
    return newEmployee;
};

export const updateEmployeeApi = async (id: string, data: Partial<EmployeeData>): Promise<EmployeeData> => {
    await delay(800);
    const index = dummyEmployees.findIndex(e => e.id_karyawan === id);
    if (index === -1) throw new Error('Karyawan tidak ditemukan');
    
    const division = data.id_karyawan_divisi 
        ? dummyDivisions.find(d => d.id_karyawan_divisi === data.id_karyawan_divisi)
        : null;
        
    const position = data.id_karyawan_posisi
        ? dummyPositions.find(p => p.id_karyawan_posisi === data.id_karyawan_posisi)
        : null;
    
    const updatedEmployee = { 
        ...dummyEmployees[index], 
        ...data,
        ...(division && { nm_karyawan_divisi: division.nm_karyawan_divisi }),
        ...(position && { nm_karyawan_posisi: position.nm_karyawan_posisi }),
    };
    
    dummyEmployees[index] = updatedEmployee;
    return updatedEmployee;
};

export const fetchDivisionsApi = async (): Promise<DivisionData[]> => {
    await delay(300);
    return [...dummyDivisions];
};

export const fetchPositionsApi = async (): Promise<PositionData[]> => {
    await delay(300);
    return [...dummyPositions];
};
