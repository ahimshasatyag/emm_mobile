import { SettingData } from '../types/setting.types';

export const DUMMY_SETTINGS: SettingData[] = [
    {
        setting_id: '1',
        setting_label: 'Alamat Perusahaan',
        setting_key: 'COMPANY_ADDRESS',
        setting_value: 'Jl. Merdeka No. 45, Jakarta',
        setting_note: 'Alamat lengkap untuk faktur dan surat',
        setting_flag: '1',
    },
    {
        setting_id: '2',
        setting_label: 'Email Support',
        setting_key: 'SUPPORT_EMAIL',
        setting_value: 'support@emma-erp.com',
        setting_note: 'Email tujuan untuk komplain pelanggan',
        setting_flag: '1',
    },
    {
        setting_id: '3',
        setting_label: 'Maintenance Mode',
        setting_key: 'MAINTENANCE_MODE',
        setting_value: 'false',
        setting_note: 'Aktifkan jika sistem sedang diperbaiki',
        setting_flag: '0',
    },
];
