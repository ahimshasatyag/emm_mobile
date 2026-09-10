import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useSO } from '../hooks/useSO';
import { formatDate } from '../../../utils/helpers/date';
import { api } from '../../../services/api/api';
import * as Print from 'expo-print';
import { Printer } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

const API_URL = api.defaults.baseURL?.replace('/api', '') || 'http://192.168.1.127:8001';

const formatNumber = (value: number) => {
    return value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export function SOPrintQScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params || {};
    const { currentSO, loadDetail, isLoading } = useSO();
    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
        visible: false, type: 'success', message: '',
    });

    useEffect(() => {
        if (id) loadDetail(id);
    }, [id]);

    if (isLoading || !currentSO) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator title="MEMUAT DATA..." showBackButton onBackPress={() => navigation.goBack()} />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </View>
        );
    }

    const currency = currentSO.vcurrency === 'USD' ? 'USD' : 'RP';
    const currencyDisplay = currentSO.vcurrency === 'USD' ? 'USD' : 'Rp';
    const flagPpn = currentSO.flag_ppn === '1' || (currentSO.flag_ppn as any) === 1;
    const nppnAmount = flagPpn ? parseFloat((currentSO as any).nppn_amount || '11') : 0;

    let subTotal = 0;
    const computedItems = (currentSO.items || []).map((item) => {
        let hargaSatuan = parseFloat((item as any).product_price || (item as any).harga || '0');
        const nqty = parseFloat(item.qty || '0');
        if (flagPpn) hargaSatuan = (100 / (100 + nppnAmount)) * hargaSatuan;
        const lineTotal = hargaSatuan * nqty;
        subTotal += lineTotal;
        return { ...item, hargaSatuan, nqty, lineTotal };
    });

    const ppn = flagPpn ? (nppnAmount / 100) * subTotal : 0;
    const total = subTotal + ppn;
    const karyawanEmail = (currentSO as any).karyawan_email || 'sales-emm@ekamaju.co.id';

    const paymentInfo = [
        currentSO.nm_type_pembayaran,
        parseFloat(currentSO.ndp_persen || '0') > 0 ? `DP ${currentSO.ndp_persen}% ${currency} ${formatNumber(parseFloat(currentSO.ndp_amount || '0'))}` : '',
        parseInt(currentSO.ntenor || '0') > 0 ? `Tenor ${currentSO.ntenor}x ${currency} ${formatNumber(parseFloat(currentSO.ntenor_amount || '0'))}` : '',
        currentSO.nm_waktu_bayar || '',
    ].filter(Boolean).join(' | ');

    const handlePrint = async () => {
        try {
            const rowsHtml = computedItems.map((item, i) => `
                <tr>
                    <td style="text-align:center;border:1px solid black;">${i + 1}</td>
                    <td style="text-align:left;border:1px solid black;">${(item as any).product_code || (item as any).code_product} : ${(item as any).product_name || (item as any).nm_product}</td>
                    <td style="text-align:left;border:1px solid black;">${(item as any).status_barang || '-'} ${(item as any).indent_amount > 0 ? `±${(item as any).indent_amount} Hari` : ''}</td>
                    <td style="border:1px solid black;"><table style="width:100%;border:none;"><tr>
                        <td style="text-align:left;border:none;">${currency}</td>
                        <td style="text-align:right;border:none;">${formatNumber(item.hargaSatuan)}</td>
                    </tr></table></td>
                    <td style="text-align:center;border:1px solid black;">${formatNumber(item.nqty)}</td>
                    <td style="text-align:center;border:1px solid black;">${(item as any).satuan || (item as any).nm_product_satuan || ''}</td>
                    <td style="border:1px solid black;"><table style="width:100%;border:none;"><tr>
                        <td style="text-align:left;border:none;">${currency}</td>
                        <td style="text-align:right;border:none;">${formatNumber(item.lineTotal)}</td>
                    </tr></table></td>
                </tr>
            `).join('');

            const ppnRows = flagPpn ? `
                <tr><td style="text-align:right;" colspan="6">SUB-TOTAL</td>
                    <td><table style="width:100%;border:none;"><tr><td style="text-align:left;border:none;">${currency}</td><td style="text-align:right;border:none;">${formatNumber(subTotal)}</td></tr></table></td>
                </tr>
                <tr><td style="text-align:right;" colspan="6">PPN ${nppnAmount}%</td>
                    <td><table style="width:100%;border:none;"><tr><td style="text-align:left;border:none;">${currency}</td><td style="text-align:right;border:none;">${formatNumber(ppn)}</td></tr></table></td>
                </tr>
            ` : '';

            const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:Arial,sans-serif;font-size:10pt;margin:15px;}
.tbl_border,.tbl_border th,.tbl_border td{border:1px solid black;border-collapse:collapse;}
.tbl_logo,.tbl_logo th,.tbl_logo td{border-collapse:collapse;}
</style></head><body>
<table style="width:100%;" class="tbl_logo"><tr>
    <td style="border-bottom:1px solid black;text-align:left;"><img src="${API_URL}/assets/images/logo_eka_alamat_old.png" style="height:96px"/></td>
    <td style="border-bottom:1px solid black;text-align:right;"><img src="${API_URL}/assets/images/logo_kan.png" style="height:71px"/></td>
</tr>
<tr><td style="text-align:center;" colspan="2"><h2>SURAT PENAWARAN / SALES QUOTATION</h2></td></tr>
</table>
<table style="width:100%;" class="tbl_border">
    <tr>
        <td>Salesperson :</td><td>${currentSO.nm_karyawan || '-'}</td>
        <td>Tanggal :</td><td>${currentSO.date_so ? formatDate(new Date(currentSO.date_so)) : '-'}</td>
    </tr>
    <tr>
        <td>Delivery Terms :</td><td>${currentSO.delivery_term || '-'}</td>
        <td>Nomor :</td><td>${currentSO.code_so}</td>
    </tr>
    <tr>
        <td>Tanggal Pengiriman :</td><td>${currentSO.date_estimasi ? formatDate(new Date(currentSO.date_estimasi)) : '-'}</td>
        <td colspan="2">Informasi Pembeli :</td>
    </tr>
    <tr>
        <td>Cara Pembayaran</td>
        <td>${paymentInfo}</td>
        <td colspan="2" rowspan="2">${currentSO.nm_customers || ''}${currentSO.customers_address ? '<br>' + currentSO.customers_address : ''}${currentSO.customers_email ? '<br>' + currentSO.customers_email : ''}${currentSO.customers_phone ? '<br>' + currentSO.customers_phone : ''}</td>
    </tr>
    <tr>
        <td>Penawaran ini dibuat oleh:</td><td>${(currentSO as any).nm_users || currentSO.nm_karyawan || '-'}</td>
    </tr>
    ${currentSO.keterangan ? `<tr><td colspan="4">Keterangan : ${currentSO.keterangan}</td></tr>` : ''}
</table>
<br>
<table style="width:100%;" class="tbl_border">
    <tr>
        <th style="text-align:center;">No</th><th>Nama dan Deskripsi Barang</th><th>Status Barang</th>
        <th>Harga Satuan</th><th style="text-align:center;">Qty</th><th>UOM</th><th>Line Total</th>
    </tr>
    ${rowsHtml}
    ${ppnRows}
    <tr>
        <td style="text-align:right;" colspan="6">TOTAL</td>
        <td><table style="width:100%;border:none;"><tr><td style="text-align:left;border:none;">${currency}</td><td style="text-align:right;border:none;">${formatNumber(total)}</td></tr></table></td>
    </tr>
</table>
<table style="width:100%;font-size:12px;">
    <tr><td colspan="2">Syarat dan ketentuan:</td></tr>
    <tr><td style="text-align:center;width:20px;">1</td><td>Surat Penawaran ini berlaku 7 hari dari tanggal diatas.</td></tr>
    <tr><td style="text-align:center;">2</td><td>Ketersediaan barang terbatas, selama tidak ada pembayaran uang muka, status ketersediaan barang tidak mengikat.</td></tr>
    <tr><td style="text-align:center;">3</td><td>Jika penawaran dalam mata uang asing, pembayaran akan dikonversikan kedalam mata uang Rupiah pada saat transaksi/jatuh tempo pembayaran.</td></tr>
    <tr><td style="text-align:center;">4</td><td>Surat penawaran ini dibuat menggunakan sistem komputer dan tidak memerlukan tanda tangan. Apabila memerlukan tanda tangan, harap menghubungi salesperson terkait.</td></tr>
    <tr><td style="text-align:center;">5</td><td>Penawaran ini belum termasuk PPN kecuali jika tertera di perincian diatas.</td></tr>
    <tr><td style="text-align:center;">6</td><td>Garansi service dan spare part selama 12 bulan dari tanggal Surat Jalan, garansi tidak termasuk part habis pakai <i>(consumables parts)</i>.</td></tr>
    <tr><td style="text-align:center;">7</td><td>Garansi on-site service/kunjungan teknisi selama masa garansi secara cuma-cuma hanya berlaku untuk daerah Jabodetabek.</td></tr>
    <tr><td style="text-align:center;">8</td><td>Pembayaran hanya berlaku/sah jika dana ditransfer ke rekening perusahaan atas nama PT. EKA MAJU MESININDO.</td></tr>
    <tr><td style="text-align:center;">9</td><td>Harga barang tercantum diatas TIDAK termasuk aksesoris diluar mesin seperti kompresor angin, pendingin (chiller), ataupun accessories lainnya.</td></tr>
</table>
<table style="width:100%;">
    <tr style="font-size:12px;"><td colspan="2">Untuk menyetujui ini, harap tanda tangan dan cap perusahaan dibawah ini dan fax ke nomor (021) 668-5874 atau email di : ${karyawanEmail}</td></tr>
    <tr><td colspan="2">&nbsp;</td></tr><tr><td colspan="2">&nbsp;</td></tr>
    <tr><td colspan="2">____________________________</td></tr>
</table>
</body></html>`;
            await Print.printAsync({ html });
        } catch (e) {
            setToast({ visible: true, type: 'error', message: 'Gagal mencetak dokumen' });
        }
    };

    return (
        <View className="flex-1 bg-gray-100">
            <ToastMessages
                visible={toast.visible} type={toast.type} message={toast.message}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <HeaderNavigator
                title="CETAK SURAT PENAWARAN"
                showBackButton onBackPress={() => navigation.goBack()}
                rightComponent={
                    <TouchableOpacity onPress={handlePrint} className="w-12 h-12 bg-cyan-500 rounded-full items-center justify-center">
                        <Printer size={20} color="white" />
                    </TouchableOpacity>
                }
            />
            <ScrollView className="flex-1 p-4" contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
                <View className="bg-white w-full max-w-2xl p-6" style={{ minHeight: 900, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 5, elevation: 4 }}>

                    {/* Header Logo - Berwarna untuk Quotation */}
                    <View className="flex-row justify-between items-end border-b-2 border-black pb-3 mb-2">
                        <Image source={{ uri: `${API_URL}/assets/images/logo_eka_alamat_old.png` }} style={{ height: 60, width: 180 }} resizeMode="contain" />
                        <Image source={{ uri: `${API_URL}/assets/images/logo_kan.png` }} style={{ height: 50, width: 80 }} resizeMode="contain" />
                    </View>
                    <Text className="text-base font-bold text-black text-center mb-4">SURAT PENAWARAN / SALES QUOTATION</Text>

                    {/* Info Table */}
                    <View className="border border-black mb-4">
                        <View className="flex-row border-b border-black">
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black">Salesperson :</Text>
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black">{currentSO.nm_karyawan || '-'}</Text>
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black">Tanggal :</Text>
                            <Text className="flex-1 text-[10px] text-black p-1.5">{currentSO.date_so ? formatDate(new Date(currentSO.date_so)) : '-'}</Text>
                        </View>
                        <View className="flex-row border-b border-black">
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black">Delivery Terms :</Text>
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black">{currentSO.delivery_term || '-'}</Text>
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black">Nomor :</Text>
                            <Text className="flex-1 text-[10px] font-bold text-black p-1.5">{currentSO.code_so}</Text>
                        </View>
                        <View className="flex-row border-b border-black">
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black">Tanggal Pengiriman :</Text>
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black">
                                {currentSO.date_estimasi ? formatDate(new Date(currentSO.date_estimasi)) : '-'}
                            </Text>
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black" style={{ flex: 2 }}>Informasi Pembeli :</Text>
                        </View>
                        <View className="flex-row border-b border-black">
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black">Cara Pembayaran</Text>
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black">{paymentInfo}</Text>
                            <View className="flex-1 p-1.5" style={{ flex: 2 }}>
                                <Text className="text-[10px] font-bold text-black">{currentSO.nm_customers}</Text>
                                {!!currentSO.customers_address && <Text className="text-[10px] text-black">{currentSO.customers_address}</Text>}
                                {!!currentSO.customers_email && <Text className="text-[10px] text-black">{currentSO.customers_email}</Text>}
                                {!!currentSO.customers_phone && <Text className="text-[10px] text-black">{currentSO.customers_phone}</Text>}
                            </View>
                        </View>
                        <View className="flex-row">
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black">Penawaran ini dibuat oleh:</Text>
                            <Text className="flex-1 text-[10px] text-black p-1.5 border-r border-black">{(currentSO as any).nm_users || currentSO.nm_karyawan}</Text>
                            <View className="flex-1" style={{ flex: 2 }} />
                        </View>
                        {!!currentSO.keterangan && (
                            <View className="border-t border-black p-1.5">
                                <Text className="text-[10px] text-black">Keterangan: {currentSO.keterangan}</Text>
                            </View>
                        )}
                    </View>

                    {/* Items Table */}
                    <View className="border border-black mb-4">
                        <View className="flex-row bg-gray-50 border-b border-black">
                            <Text className="w-6 text-center text-[9px] font-bold text-black py-1 border-r border-black">No</Text>
                            <Text className="flex-1 text-[9px] font-bold text-black py-1 px-1 border-r border-black">Nama dan Deskripsi Barang</Text>
                            <Text className="w-16 text-[9px] font-bold text-black py-1 px-1 border-r border-black">Status Barang</Text>
                            <Text className="w-20 text-[9px] font-bold text-black py-1 px-1 border-r border-black">Harga Satuan</Text>
                            <Text className="w-10 text-center text-[9px] font-bold text-black py-1 border-r border-black">Qty</Text>
                            <Text className="w-10 text-[9px] font-bold text-black py-1 px-1 border-r border-black">UOM</Text>
                            <Text className="w-20 text-[9px] font-bold text-black py-1 px-1">Line Total</Text>
                        </View>
                        {computedItems.map((item, i) => (
                            <View key={i} className="flex-row border-b border-black">
                                <Text className="w-6 text-center text-[9px] text-black py-1 border-r border-black">{i + 1}</Text>
                                <Text className="flex-1 text-[9px] text-black py-1 px-1 border-r border-black">
                                    {(item as any).product_code || (item as any).code_product} : {(item as any).product_name || (item as any).nm_product}
                                </Text>
                                <Text className="w-16 text-[9px] text-black py-1 px-1 border-r border-black">{(item as any).status_barang || '-'}</Text>
                                <View className="w-20 border-r border-black py-1 px-1">
                                    <View className="flex-row justify-between">
                                        <Text className="text-[9px] text-black">{currencyDisplay}</Text>
                                        <Text className="text-[9px] text-black">{formatNumber(item.hargaSatuan)}</Text>
                                    </View>
                                </View>
                                <Text className="w-10 text-center text-[9px] text-black py-1 border-r border-black">{item.nqty}</Text>
                                <Text className="w-10 text-[9px] text-black py-1 px-1 border-r border-black">
                                    {(item as any).satuan || (item as any).nm_product_satuan}
                                </Text>
                                <View className="w-20 py-1 px-1">
                                    <View className="flex-row justify-between">
                                        <Text className="text-[9px] text-black">{currencyDisplay}</Text>
                                        <Text className="text-[9px] text-black">{formatNumber(item.lineTotal)}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}

                        {/* Totals */}
                        {flagPpn && (
                            <>
                                <View className="flex-row border-b border-black">
                                    <Text className="flex-1 text-right text-[9px] text-black py-1 px-1 border-r border-black" style={{ flex: 6 }}>SUB-TOTAL</Text>
                                    <View className="w-20 py-1 px-1">
                                        <View className="flex-row justify-between">
                                            <Text className="text-[9px] text-black">{currencyDisplay}</Text>
                                            <Text className="text-[9px] text-black">{formatNumber(subTotal)}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View className="flex-row border-b border-black">
                                    <Text className="flex-1 text-right text-[9px] text-black py-1 px-1 border-r border-black" style={{ flex: 6 }}>PPN {nppnAmount}%</Text>
                                    <View className="w-20 py-1 px-1">
                                        <View className="flex-row justify-between">
                                            <Text className="text-[9px] text-black">{currencyDisplay}</Text>
                                            <Text className="text-[9px] text-black">{formatNumber(ppn)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </>
                        )}
                        <View className="flex-row">
                            <Text className="flex-1 text-right text-[9px] font-bold text-black py-1 px-1 border-r border-black" style={{ flex: 6 }}>TOTAL</Text>
                            <View className="w-20 py-1 px-1">
                                <View className="flex-row justify-between">
                                    <Text className="text-[9px] font-bold text-black">{currencyDisplay}</Text>
                                    <Text className="text-[9px] font-bold text-black">{formatNumber(total)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Terms */}
                    <View className="mb-4">
                        <Text className="text-[10px] font-bold text-black mb-1">Syarat dan ketentuan:</Text>
                        {[
                            'Surat Penawaran ini berlaku 7 hari dari tanggal diatas.',
                            'Ketersediaan barang terbatas, selama tidak ada pembayaran uang muka, status ketersediaan barang tidak mengikat.',
                            'Jika penawaran dalam mata uang asing, pembayaran akan dikonversikan kedalam mata uang Rupiah pada saat transaksi/jatuh tempo pembayaran.',
                            'Surat penawaran ini dibuat menggunakan sistem komputer dan tidak memerlukan tanda tangan. Apabila memerlukan tanda tangan, harap menghubungi salesperson terkait.',
                            'Penawaran ini belum termasuk PPN kecuali jika tertera di perincian diatas.',
                            'Garansi service dan spare part selama 12 bulan dari tanggal Surat Jalan, garansi tidak termasuk part habis pakai (consumables parts).',
                            'Garansi on-site service/kunjungan teknisi selama masa garansi secara cuma-cuma hanya berlaku untuk daerah Jabodetabek.',
                            'Pembayaran hanya berlaku/sah jika dana ditransfer ke rekening perusahaan atas nama PT. EKA MAJU MESININDO.',
                            'Harga barang tercantum diatas TIDAK termasuk aksesoris diluar mesin seperti kompresor angin (air compressor), pendingin (chiller), ataupun accessories lainnya.',
                        ].map((t, i) => (
                            <View key={i} className="flex-row mb-0.5">
                                <Text className="text-[9px] text-black w-4 text-center">{i + 1}</Text>
                                <Text className="flex-1 text-[9px] text-black">{t}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Sign off */}
                    <View className="mb-4">
                        <Text className="text-[10px] text-black mb-3">
                            Untuk menyetujui ini, harap tanda tangan dan cap perusahaan dibawah ini dan fax ke nomor (021) 668-5874 atau email di : {karyawanEmail}
                        </Text>
                        <View className="h-12" />
                        <Text className="text-[10px] text-black">____________________________</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
