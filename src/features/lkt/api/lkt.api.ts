import { LktDetail, LktFilter } from '../types/lkt.types';
import { DUMMY_LKT_DATA } from '../data/lkt.dummy';

const DELAY = 800;

export const lktApi = {
    getLkts: async (filter: LktFilter): Promise<LktDetail[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredData = [...DUMMY_LKT_DATA];

                // Filter by search query
                if (filter.searchQuery) {
                    const query = filter.searchQuery.toLowerCase();
                    filteredData = filteredData.filter(item => 
                        item.lkt_code.toLowerCase().includes(query) ||
                        item.cst_code.toLowerCase().includes(query) ||
                        item.nm_customers.toLowerCase().includes(query)
                    );
                }

                // Filter by status
                if (!filter.isAll && filter.statusFilter !== 'ALL') {
                    filteredData = filteredData.filter(item => item.status === filter.statusFilter);
                }

                // Sorting
                filteredData.sort((a, b) => new Date(b.actual_starting_date).getTime() - new Date(a.actual_starting_date).getTime());

                resolve(filteredData);
            }, DELAY);
        });
    },

    getLktById: async (id: string): Promise<LktDetail | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const lkt = DUMMY_LKT_DATA.find(item => item.lkt_code === id || item.id_afs_lkt === id);
                resolve(lkt);
            }, DELAY);
        });
    },

    closeLkt: async (id: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[API] Closing LKT: ${id}`);
                resolve(true);
            }, DELAY);
        });
    },

    cancelLkt: async (id: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[API] Cancelling LKT: ${id}`);
                resolve(true);
            }, DELAY);
        });
    }
};
