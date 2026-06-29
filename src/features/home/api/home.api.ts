import { HomeData } from '../types/home.types';

// Simulasi network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchHomeDataApi = async (): Promise<HomeData> => {
    // Simulasi loading selama 1.5 detik agar skeleton terlihat
    await delay(1500);

    return {
        statistics: {
            csr: 14,
            cst: 5,
            lkt: 8,
            product: 1240,
            category: 12,
            subCategory: 45,
            unit: 8,
        },
        recentActivities: [
            { id: '1', title: 'CSR Baru Dibuat', description: 'CSR-2026-001 dari PT. ABC', time: '10 menit yang lalu', type: 'csr' },
            { id: '2', title: 'LKT Selesai', description: 'Perbaikan Mesin CNC selesai', time: '1 jam yang lalu', type: 'lkt' },
            { id: '3', title: 'Produk Diperbarui', description: 'Stok Filter Udara ditambah 50', time: '3 jam yang lalu', type: 'product' },
            { id: '4', title: 'CST Menunggu Validasi', description: 'CST-2026-042 membutuhkan persetujuan', time: 'Kemarin', type: 'cst' },
        ]
    };
};
