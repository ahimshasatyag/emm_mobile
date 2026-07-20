import { MataUangItem } from '../types/matauang.types';

export const DUMMY_MATAUANG: MataUangItem[] = [
    { mata_uang: 'AUD', kurs: 10450.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'BND', kurs: 11400.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'CAD', kurs: 11600.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'CHF', kurs: 17200.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'CNY', kurs: 2150.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'DKK', kurs: 2200.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'EUR', kurs: 16500.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'GBP', kurs: 19200.00, date_create: '2023-10-15 08:30:00' },
    { HKD: 'HKD', kurs: 1980.00, date_create: '2023-10-15 08:30:00' } as any, // Cast any because 'mata_uang' is required
    { mata_uang: 'HKD', kurs: 1980.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'IDR', kurs: 1.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'JPY', kurs: 105.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'KRW', kurs: 11.50, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'KWD', kurs: 50500.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'MYR', kurs: 3350.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'NOK', kurs: 1400.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'NZD', kurs: 9500.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'PGK', kurs: 4100.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'PHP', kurs: 280.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'SAR', kurs: 4150.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'SEK', kurs: 1450.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'SGD', kurs: 11400.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'THB', kurs: 430.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'USD', kurs: 15500.00, date_create: '2023-10-15 08:30:00' },
    { mata_uang: 'VND', kurs: 0.65, date_create: '2023-10-15 08:30:00' }
];

// Clean up duplicate/malformed HKD
const uniqueDummy = DUMMY_MATAUANG.filter(item => item.mata_uang);

export { uniqueDummy as CLEAN_DUMMY_MATAUANG };
