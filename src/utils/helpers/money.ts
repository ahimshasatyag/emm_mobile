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
