import { ListSODetail, ListSOFilter, ListSOItem } from "../types/listso.types";
import { DUMMY_SO_LIST, DUMMY_SO_DETAIL } from "../data/listso.data";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getSOList = async (filters: ListSOFilter): Promise<ListSOItem[]> => {
    await delay(800); // Simulate network latency

    let result = [...DUMMY_SO_LIST];

    // Simple mock filtering
    if (filters.id_customers && filters.id_customers !== "ALL") {
        result = result.filter(item => item.id_customers === filters.id_customers);
    }

    if (filters.periode && filters.periode !== "ALL") {
        const filterYearMonth = filters.periode; // e.g., '2026-07'
        result = result.filter(item => item.date_so.startsWith(filterYearMonth));
    }

    return result;
};

export const getSODetail = async (id: string): Promise<ListSODetail | null> => {
    await delay(800);
    return DUMMY_SO_DETAIL[id] || null;
};
