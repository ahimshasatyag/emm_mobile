import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
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

export function SOPrintScreen() {
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

    const currency = currentSO.vcurrency === 'USD' ? 'USD' : 'Rp';
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

    const handlePrint = async () => {
        try {
            const rowsHtml = computedItems.map((item, i) => `
                <tr>
                    <td class="border_kotak" style="text-align:center;">${i + 1}</td>
                    <td class="border_kotak">${(item as any).product_code || (item as any).code_product || ''}: ${(item as any).product_name || (item as any).nm_product || ''}</td>
                    <td class="border_kotak" style="text-align:center;">${item.nqty} ${(item as any).satuan || (item as any).nm_product_satuan || ''}</td>
                    <td class="border_kotak" style="text-align:right;">${formatNumber(item.hargaSatuan)}</td>
                    <td class="border_kotak" style="text-align:right;">${formatNumber(item.lineTotal)}</td>
                </tr>
            `).join('');

            const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:Arial,sans-serif;font-size:10pt;margin:15px;}
.border_kotak{border:1px solid #000;border-width:1px 1px 1px 1px;}
.tbl_border,.tbl_border th,.tbl_border td{border:1px solid black;border-collapse:collapse;}
.tbl_logo,.tbl_logo th,.tbl_logo td{border-collapse:collapse;}
h1{text-align:center;font-style:italic;}
</style></head><body>
<table style="width:100%;" class="tbl_logo"><tr>
    <td style="border-bottom:1px solid black;text-align:left;"><img src="${API_URL}/assets/images/logo_eka_alamat_old_bw.png" style="height:96px"/></td>
    <td style="border-bottom:1px solid black;text-align:right;"><img src="${API_URL}/assets/images/logo_kan_bw.png" style="height:71px"/></td>
</tr></table>
<table style="width:100%" border="0">
    <tr><td style="text-align:center" colspan="2"><h1>SALES ORDER</h1></td></tr>
    <tr><td style="width:40%"></td><td><b>NO. SO</b> &nbsp;: ${currentSO.code_so}</td></tr>
    <tr><td></td><td><b>TGL SO</b> : ${currentSO.date_so ? formatDate(new Date(currentSO.date_so)) : '-'}</td></tr>
    <tr><td colspan="2">&nbsp;</td></tr>
    <tr>
        <td><b>NO PO</b> : ${currentSO.no_po_cust || '-'}</td>
        <td><b>DATA PELANGGAN &amp; ALAMAT PENGIRIMAN</b></td>
    </tr>
    <tr>
        <td><b>TGL KIRIM</b> : -</td>
        <td>${currentSO.nm_customers || '-'}</td>
    </tr>
    <tr>
        <td>&nbsp;</td>
        <td>${currentSO.customers_address || ''}</td>
    </tr>
    ${(currentSO.customers_phone || (currentSO as any).customers_mobile) ? `<tr><td>&nbsp;</td><td>Telp : ${currentSO.customers_phone || ''} ${(currentSO as any).customers_mobile || ''}</td></tr>` : ''}
</table>
<table style="width:100%;border-collapse:collapse;border:1px solid #000;border-width:1px 0px 0px 0px;">
    <tr>
        <td class="border_kotak" style="text-align:center;"><b>No.</b></td>
        <td class="border_kotak" style="text-align:center;"><b>DESKRIPSI BARANG</b></td>
        <td class="border_kotak" style="text-align:center;"><b>BANYAKNYA</b></td>
        <td class="border_kotak" style="text-align:center;"><b>HARGA SATUAN (${currency})</b></td>
        <td class="border_kotak" style="text-align:center;"><b>TOTAL BARIS (${currency})</b></td>
    </tr>
    ${rowsHtml}
    <tr>
        <td colspan="3" style="border:1px solid #000;border-width:1px 0 0 0;"><b>CARA PEMBAYARAN: ${currentSO.nm_type_pembayaran || ''} ${parseFloat(currentSO.ndp_persen||'0')>0?`DP ${currentSO.ndp_persen}%`:''}${parseInt(currentSO.ntenor||'0')>0?` Tenor ${currentSO.ntenor}x ${formatNumber(parseFloat(currentSO.ntenor_amount||'0'))}`:''}${currentSO.nm_waktu_bayar||''}</b></td>
        <td style="text-align:right;border:1px solid #000;border-width:1px 0 0 0;">SUB TOTAL <b>${currency}</b></td>
        <td style="text-align:right;border:1px solid #000;border-width:1px 0 0 0;">${formatNumber(subTotal)}</td>
    </tr>
    <tr>
        <td colspan="3">Keterangan: ${currentSO.keterangan || ''}</td>
        ${flagPpn ? `<td style="text-align:right;">PAJAK <b>${currency}</b></td><td style="text-align:right;">${formatNumber(ppn)}</td>` : '<td colspan="2"></td>'}
    </tr>
    <tr>
        <td style="text-align:right;" colspan="4"><b>Total</b> <b>${currency}</b></td>
        <td style="text-align:right;">${formatNumber(total)}</td>
    </tr>
</table>
<br><br>
<table style="width:100%;font-size:12px;" border="0">
    <tr><td colspan="2"><b>Syarat dan Ketentuan</b> :</td></tr>
    <tr><td style="width:10px">-</td><td>Konfirmasikan kembali SALES ORDER ini dengan menandatangani dan fax kembali kepada kami (max. 3 hari kerja) ke nomor (021)668-5774/668-5906</td></tr>
    <tr><td>-</td><td>SALES ORDER ini tidak berlaku tanpa adanya pembayaran tanda jadi/down payment</td></tr>
    <tr><td>-</td><td>Pembatalan pemesanan setelah SALES ORDER ditanda tangani akan dikenakan denda sebesar 50% dari tanda jadi/down payment</td></tr>
</table>
<br><br>
<table style="width:100%;" border="0">
    <tr><td style="text-align:center;width:50%"><b>DISETUJUI OLEH</b></td><td style="text-align:center;width:50%"><b>KONFIRMASI PELANGGAN</b></td></tr>
    <tr><td>&nbsp;</td><td style="text-align:center">Tanda tangan &amp; cap perusahaan</td></tr>
    <tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr>
    <tr><td style="text-align:center">(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</td>
        <td style="text-align:center">(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</td></tr>
</table>
<br>
<table style="width:100%;border:1px solid #000;border-collapse:collapse;">
    <tr>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">Input System</td>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">Finance</td>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">DO Process</td>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">SJ</td>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">Lain-Lain</td>
    </tr>
    <tr>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">Date:__________</td>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">Date:__________</td>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">Date:__________</td>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">Date:__________</td>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">Date:__________</td>
    </tr>
    <tr>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">By:</td>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">By:</td>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">By:</td>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">By:</td>
        <td style="border:1px solid #000;border-width:0 0 0 1px;">By:</td>
    </tr>
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
                title="CETAK SALES ORDER"
                showBackButton onBackPress={() => navigation.goBack()}
                rightComponent={
                    <TouchableOpacity onPress={handlePrint} className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center">
                        <Printer size={20} color="white" />
                    </TouchableOpacity>
                }
            />
            <ScrollView className="flex-1 p-4" contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
                <View className="bg-white w-full max-w-2xl p-6" style={{ minHeight: 900, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 5, elevation: 4 }}>

                    {/* Header Logo - BW for SO */}
                    <View className="flex-row justify-between items-end border-b-2 border-black pb-3 mb-4">
                        <Image source={{ uri: `${API_URL}/assets/images/logo_eka_alamat_old_bw.png` }} style={{ height: 60, width: 180 }} resizeMode="contain" />
                        <Image source={{ uri: `${API_URL}/assets/images/logo_kan_bw.png` }} style={{ height: 50, width: 80 }} resizeMode="contain" />
                    </View>

                    {/* Title */}
                    <Text className="text-2xl font-bold text-black text-center italic mb-4">SALES ORDER</Text>

                    {/* Info Rows */}
                    <View className="flex-row mb-4">
                        <View className="flex-1" />
                        <View className="flex-1">
                            <View className="flex-row mb-1">
                                <Text className="text-xs font-bold text-black w-16">NO. SO</Text>
                                <Text className="text-xs text-black"> : {currentSO.code_so}</Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="text-xs font-bold text-black w-16">TGL SO</Text>
                                <Text className="text-xs text-black"> : {currentSO.date_so ? formatDate(new Date(currentSO.date_so)) : '-'}</Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row mb-4">
                        <View className="flex-1">
                            <View className="flex-row mb-1">
                                <Text className="text-xs font-bold text-black w-20">NO PO</Text>
                                <Text className="text-xs text-black"> : {currentSO.no_po_cust || '-'}</Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="text-xs font-bold text-black w-20">TGL KIRIM</Text>
                                <Text className="text-xs text-black"> : -</Text>
                            </View>
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs font-bold text-black mb-1">DATA PELANGGAN & ALAMAT PENGIRIMAN</Text>
                            <Text className="text-xs text-black font-medium">{currentSO.nm_customers}</Text>
                            {!!currentSO.customers_address && <Text className="text-xs text-black">{currentSO.customers_address}</Text>}
                            {!!(currentSO.customers_phone || (currentSO as any).customers_mobile) && (
                                <Text className="text-xs text-black">
                                    Telp: {currentSO.customers_phone || ''} {(currentSO as any).customers_mobile || ''}
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Items Table */}
                    <View className="border-t border-black mb-3">
                        <View className="flex-row bg-gray-50 border-b border-black">
                            <Text className="w-7 text-center text-[10px] font-bold text-black py-1.5 border-r border-black">No.</Text>
                            <Text className="flex-1 text-center text-[10px] font-bold text-black py-1.5 border-r border-black">DESKRIPSI BARANG</Text>
                            <Text className="w-20 text-center text-[10px] font-bold text-black py-1.5 border-r border-black">BANYAKNYA</Text>
                            <Text className="w-24 text-center text-[10px] font-bold text-black py-1.5 border-r border-black">HARGA SATUAN ({currency})</Text>
                            <Text className="w-24 text-center text-[10px] font-bold text-black py-1.5">TOTAL BARIS ({currency})</Text>
                        </View>
                        {computedItems.map((item, i) => (
                            <View key={i} className="flex-row border-b border-black">
                                <Text className="w-7 text-center text-[10px] text-black py-1.5 border-r border-black">{i + 1}</Text>
                                <Text className="flex-1 text-[10px] text-black py-1.5 px-1 border-r border-black">
                                    {(item as any).product_code || (item as any).code_product}: {(item as any).product_name || (item as any).nm_product}
                                </Text>
                                <Text className="w-20 text-center text-[10px] text-black py-1.5 border-r border-black">
                                    {item.nqty} {(item as any).satuan || (item as any).nm_product_satuan}
                                </Text>
                                <Text className="w-24 text-right text-[10px] text-black py-1.5 px-1 border-r border-black">{formatNumber(item.hargaSatuan)}</Text>
                                <Text className="w-24 text-right text-[10px] text-black py-1.5 px-1">{formatNumber(item.lineTotal)}</Text>
                            </View>
                        ))}
                        {/* Sub Total / Payment row */}
                        <View className="flex-row border-b border-black">
                            <View className="flex-1 border-r border-black p-1.5">
                                <Text className="text-[10px] font-bold text-black">
                                    CARA PEMBAYARAN: {currentSO.nm_type_pembayaran}
                                    {parseFloat(currentSO.ndp_persen || '0') > 0 ? ` DP ${currentSO.ndp_persen}%` : ''}
                                    {parseInt(currentSO.ntenor || '0') > 0 ? ` Tenor ${currentSO.ntenor}x` : ''}
                                    {currentSO.nm_waktu_bayar ? ` ${currentSO.nm_waktu_bayar}` : ''}
                                </Text>
                            </View>
                            <Text className="w-24 text-right text-[10px] text-black py-1.5 px-1 border-r border-black">SUB TOTAL {currency}</Text>
                            <Text className="w-24 text-right text-[10px] text-black py-1.5 px-1">{formatNumber(subTotal)}</Text>
                        </View>
                        <View className="flex-row border-b border-black">
                            <View className="flex-1 border-r border-black p-1.5">
                                <Text className="text-[10px] text-black">Keterangan: {currentSO.keterangan}</Text>
                            </View>
                            {flagPpn ? (
                                <>
                                    <Text className="w-24 text-right text-[10px] text-black py-1.5 px-1 border-r border-black">PAJAK {currency}</Text>
                                    <Text className="w-24 text-right text-[10px] text-black py-1.5 px-1">{formatNumber(ppn)}</Text>
                                </>
                            ) : <View className="w-48" />}
                        </View>
                        <View className="flex-row">
                            <View className="flex-1" />
                            <Text className="w-24 text-right text-[10px] font-bold text-black py-1.5 px-1 border-r border-black">Total {currency}</Text>
                            <Text className="w-24 text-right text-[10px] font-bold text-black py-1.5 px-1">{formatNumber(total)}</Text>
                        </View>
                    </View>

                    {/* Terms */}
                    <View className="mb-4">
                        <Text className="text-[10px] font-bold text-black mb-1">Syarat dan Ketentuan :</Text>
                        {[
                            'Konfirmasikan kembali SALES ORDER ini dengan menandatangani dan fax kembali kepada kami (max. 3 hari kerja) ke nomor (021)668-5774/668-5906',
                            'SALES ORDER ini tidak berlaku tanpa adanya pembayaran tanda jadi/down payment',
                            'Pembatalan pemesanan setelah SALES ORDER ditanda tangani akan dikenakan denda sebesar 50% (lima puluh persen) dari tanda jadi/down payment',
                        ].map((t, i) => (
                            <View key={i} className="flex-row mb-0.5">
                                <Text className="text-[10px] text-black w-3">-</Text>
                                <Text className="flex-1 text-[10px] text-black">{t}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="h-6" />

                    {/* Signatures */}
                    <View className="flex-row mb-4">
                        <View className="flex-1 items-center">
                            <Text className="text-[10px] font-bold text-black">DISETUJUI OLEH</Text>
                            <View className="h-20" />
                            <Text className="text-[10px] text-black">(                                        )</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <Text className="text-[10px] font-bold text-black">KONFIRMASI PELANGGAN</Text>
                            <Text className="text-[10px] text-black">Tanda tangan & cap perusahaan</Text>
                            <View className="h-16" />
                            <Text className="text-[10px] text-black">(                                        )</Text>
                        </View>
                    </View>

                    {/* Bottom tracking table */}
                    <View className="border border-black">
                        <View className="flex-row border-b border-black">
                            {['Input System', 'Finance', 'DO Process', 'SJ', 'Lain-Lain'].map((col) => (
                                <Text key={col} className="flex-1 text-[10px] text-black border-r border-black px-1 py-1">{col}</Text>
                            ))}
                        </View>
                        <View className="flex-row border-b border-black">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Text key={i} className="flex-1 text-[10px] text-black border-r border-black px-1 py-1">Date:__________</Text>
                            ))}
                        </View>
                        <View className="flex-row">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Text key={i} className="flex-1 text-[10px] text-black border-r border-black px-1 py-1">By:</Text>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
