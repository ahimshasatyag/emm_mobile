export interface Technician {
    no: number;
    date: string;
    name: string;
}

export interface LktSchedule {
    no: number;
    lktCode: string;
    cstCode: string;
    customer: string;
    location: string;
    product: string;
    damage: string;
    request: string;
}

export interface ProductRank {
    no: number;
    name: string;
    count: number;
}

export const techniciansPP: Technician[] = [
    { no: 1, date: '22-May-2026', name: 'Agus Setiawan' },
    { no: 2, date: '22-May-2026', name: 'Dedi Kurniawan' },
    { no: 3, date: '22-May-2026', name: 'Fajar Nugroho' },
];

export const techniciansPL: Technician[] = [
    { no: 1, date: '22-May-2026', name: 'Bambang Tri' },
    { no: 2, date: '22-May-2026', name: 'Hendra Wijaya' },
];

export const workloadPP = [
    { name: 'Agus Setiawan', percentage: 85 },
    { name: 'Dedi Kurniawan', percentage: 60 },
    { name: 'Fajar Nugroho', percentage: 40 },
    { name: 'Hendra Saputra', percentage: 95 },
];

export const workloadPL = [
    { name: 'Bambang Tri', percentage: 70 },
    { name: 'Hendra Wijaya', percentage: 50 },
    { name: 'Rian Hidayat', percentage: 30 },
];

export const todayLktSchedules: LktSchedule[] = [
    {
        no: 1,
        lktCode: 'LKT-4091',
        cstCode: 'CST-2940',
        customer: 'PT. Indofood CBP Sukses Makmur',
        location: 'Cikarang, Bekasi',
        product: 'Flexo Folder Gluer (FFG 8.20)',
        damage: 'Sensors on folding guide misaligned, causing folder jams.',
        request: 'Urgent troubleshooting needed for production line.'
    },
    {
        no: 2,
        lktCode: 'LKT-4092',
        cstCode: 'CST-2941',
        customer: 'PT. Mayora Indah Tbk',
        location: 'Tangerang',
        product: 'High Speed Shrink Wrapper',
        damage: 'Heater strip failed to reach sealing temperature.',
        request: 'Check heater elements and replace temperature controller.'
    },
    {
        no: 3,
        lktCode: 'LKT-4093',
        cstCode: 'CST-2942',
        customer: 'PT. Kalbe Farma Tbk',
        location: 'Cikarang',
        product: 'Blister Packaging Machine',
        damage: 'Forming film feeder motor slippage reported.',
        request: 'Calibrate tension controls and inspect servo motor gears.'
    }
];

export const kpiTechnicians = [
    { name: 'Agus Setiawan', score: 92 },
    { name: 'Dedi Kurniawan', score: 87 },
    { name: 'Fajar Nugroho', score: 79 },
    { name: 'Bambang Tri', score: 94 },
    { name: 'Hendra Wijaya', score: 85 }
];

export const topPriceCheckProducts: ProductRank[] = [
    { no: 1, name: 'EM-FLEX-01 (Flexo Gluer Single Shaft)', count: 48 },
    { no: 2, name: 'EM-SHRINK-H (High Temp Wrapper)', count: 35 },
    { no: 3, name: 'EM-BLIST-P (Pneumatic Blister Packer)', count: 29 },
    { no: 4, name: 'EM-CART-120 (Cartoning Automated Line)', count: 24 },
    { no: 5, name: 'EM-FILL-FLOW (Rotary Bottle Filler)', count: 22 },
    { no: 6, name: 'EM-STRAP-M (Manual Hand Strapper)', count: 18 },
    { no: 7, name: 'EM-CONV-HD (Heavy Duty Belt Conveyor)', count: 15 },
    { no: 8, name: 'EM-LABEL-S (Double Sided Labeler)', count: 12 }
];

export const topQuotationProducts: ProductRank[] = [
    { no: 1, name: 'EM-FLEX-01 (Flexo Gluer Single Shaft)', count: 15 },
    { no: 2, name: 'EM-CART-120 (Cartoning Automated Line)', count: 12 },
    { no: 3, name: 'EM-SHRINK-H (High Temp Wrapper)', count: 10 },
    { no: 4, name: 'EM-BLIST-P (Pneumatic Blister Packer)', count: 9 },
    { no: 5, name: 'EM-LABEL-S (Double Sided Labeler)', count: 7 },
    { no: 6, name: 'EM-CONV-HD (Heavy Duty Belt Conveyor)', count: 6 },
    { no: 7, name: 'EM-FILL-FLOW (Rotary Bottle Filler)', count: 5 }
];

export const statisticsRatios = {
    total_quotations: 36,
    quotations: 18,
    total_so: 12,
    total_cancelled: 6,
    success_rate: 33.3
};
