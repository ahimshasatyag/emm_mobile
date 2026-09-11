export const terbilang = (angka: number): string => {
    const angkaArray = [
        '',
        'Satu',
        'Dua',
        'Tiga',
        'Empat',
        'Lima',
        'Enam',
        'Tujuh',
        'Delapan',
        'Sembilan',
        'Sepuluh',
        'Sebelas',
    ];

    let hasil = '';

    if (angka < 12) {
        hasil = ' ' + angkaArray[angka];
    } else if (angka < 20) {
        hasil = terbilang(angka - 10) + ' Belas';
    } else if (angka < 100) {
        hasil = terbilang(Math.floor(angka / 10)) + ' Puluh' + terbilang(angka % 10);
    } else if (angka < 200) {
        hasil = ' Seratus' + terbilang(angka - 100);
    } else if (angka < 1000) {
        hasil = terbilang(Math.floor(angka / 100)) + ' Ratus' + terbilang(angka % 100);
    } else if (angka < 2000) {
        hasil = ' Seribu' + terbilang(angka - 1000);
    } else if (angka < 1000000) {
        hasil = terbilang(Math.floor(angka / 1000)) + ' Ribu' + terbilang(angka % 1000);
    } else if (angka < 1000000000) {
        hasil = terbilang(Math.floor(angka / 1000000)) + ' Juta' + terbilang(angka % 1000000);
    } else if (angka < 1000000000000) {
        hasil = terbilang(Math.floor(angka / 1000000000)) + ' Miliar' + terbilang(angka % 1000000000);
    } else if (angka < 1000000000000000) {
        hasil = terbilang(Math.floor(angka / 1000000000000)) + ' Triliun' + terbilang(angka % 1000000000000);
    }

    return hasil;
};

export const formatTerbilang = (angka: number): string => {
    if (angka === 0) return 'Nol Rupiah';
    const num = Math.floor(angka);
    let str = terbilang(num).trim();
    return str + ' Rupiah';
};
