export interface MataUangItem {
    mata_uang: string;
    kurs: number;
    date_create: string; // ISO String format for Date Update
}

export interface MataUangResponse {
    status: boolean;
    data: MataUangItem[];
}
