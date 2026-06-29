export interface StatisticsData {
    csr: number;
    cst: number;
    lkt: number;
    product: number;
    category: number;
    subCategory: number;
    unit: number;
}

export interface RecentActivity {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'csr' | 'cst' | 'lkt' | 'product' | 'system';
}

export interface HomeData {
    statistics: StatisticsData;
    recentActivities: RecentActivity[];
}
