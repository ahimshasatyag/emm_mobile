export const formatRp = (value: string | number) => {
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(num)) return 'Rp 0';
    return 'Rp ' + num.toLocaleString('id-ID');
};

export const formatUsd = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '$ 0.00';
    return '$ ' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatInputNumber = (value: string) => {
    if (!value) return '';
    const numeric = value.replace(/[^0-9]/g, '');
    if (!numeric) return '';
    return parseInt(numeric, 10).toLocaleString('id-ID');
};

export const parseInputNumber = (value: string) => {
    if (!value) return '';
    return value.replace(/\./g, '');
};
