import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Printer } from 'lucide-react-native';
import * as Print from 'expo-print';
import { getQuotationById } from '../api/quotationApi';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { api } from '../../../services/api/api';
import { METODE_PAYMENT_OPTIONS, WAKTU_BAYAR_OPTIONS, CARA_PEMBAYARAN_OPTIONS_MAP } from '../hooks/useQuotations';
import { formatDate } from '../../../utils/helpers/date';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { notificationService } from '../../../services/notification/notificationService';

const API_URL = api.defaults.baseURL?.replace('/api', '') || 'http://192.168.1.127:8001';

const formatRupiahNumber = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(angka);
};

export function QuotationEditPdfScreen({ route }: any) {
    const { id } = route.params;
    const navigation = useNavigation<any>();
    const authUser = useAppSelector(state => state.auth.user);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const resData = await getQuotationById(id);
            if (resData) {
                setData(resData);
            } else {
                setToastType('error');
                setToastMessage('Data tidak ditemukan');
                setToastVisible(true);
                setTimeout(() => navigation.goBack(), 1500);
            }
        } catch (error) {
            setToastType('error');
            setToastMessage('Gagal memuat data');
            setToastVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const generateHtml = () => {
        if (!data) return '';
        
        const currencyStr = data.mata_uang === 'USD' ? 'USD' : 'RP';
        
        const itemsHtml = data.items?.map((item: any, index: number) => {
            let nama_product = `${item.product_code || ''} : ${item.product_name || ''}`;
            const indent_text = parseFloat(item.indent_amount) > 0 ? ` ±${item.indent_amount} Hari` : '';

            return `
                <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td style="text-align: left;">${nama_product}</td>
                    <td style="text-align: left;">${item.status_barang || ''}${indent_text}</td>
                    <td>
                        <table style="width: 100%; border: none !important;">
                            <tr>
                                <td style="text-align: left; border: none !important;">${currencyStr}</td>
                                <td style="text-align: right; border: none !important;">${formatRupiahNumber(item.harga || 0)}</td>
                            </tr>
                        </table>
                    </td>
                    <td style="text-align: center;">${item.qty || 1}</td>
                    <td style="text-align: center;">${item.satuan || 'UNIT'}</td>
                    <td>
                        <table style="width: 100%; border: none !important;">
                            <tr>
                                <td style="text-align: left; border: none !important;">${currencyStr}</td>
                                <td style="text-align: right; border: none !important;">${formatRupiahNumber((item.harga || 0) * (item.qty || 1))}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        }).join('') || '';

        const subtotal = data.items?.reduce((sum: number, item: any) => sum + ((item.harga || 0) * (item.qty || 1)), 0) || 0;
        const ppn = data.flag_ppn === '1' || data.flag_ppn === 'Y' ? (subtotal * (data.nppn_amount || 11)) / 100 : 0;
        const grandTotal = subtotal + ppn;

        const getPaymentLabel = (methodVal: string, typeVal: string) => {
            let options = CARA_PEMBAYARAN_OPTIONS_MAP[methodVal] || [];
            let found = options.find(o => o.value === typeVal);
            if (!found) {
                for (const key in CARA_PEMBAYARAN_OPTIONS_MAP) {
                    found = CARA_PEMBAYARAN_OPTIONS_MAP[key].find(o => o.value === typeVal);
                    if (found) break;
                }
            }
            return found?.label || typeVal;
        };
        const getWaktuBayarLabel = (val: string) => WAKTU_BAYAR_OPTIONS.find(o => o.value === val)?.label || val;

        let caraPembayaranText = getPaymentLabel(data.metode_payment, data.tipe_pembayaran) || '';
        if (parseFloat(data.dp_persen) > 0) {
            caraPembayaranText += `<br> DP ${data.dp_persen}% ${currencyStr} ${formatRupiahNumber(data.dp_amount)} `;
        }
        if (parseInt(data.tenor) > 0) {
            caraPembayaranText += ` Tenor ${data.tenor}x ${currencyStr} ${formatRupiahNumber(data.tenor_amount)} `;
        }
        caraPembayaranText += ` ${getWaktuBayarLabel(data.waktu_bayar) || ''}`;

        let customerInfo = [];
        if (data.customer_name) customerInfo.push(data.customer_name);
        if (data.informasi_pembeli) customerInfo.push(data.informasi_pembeli); 
        const customerInfoHtml = customerInfo.join('<br>');

        const keteranganHtml = data.keterangan ? `<tr><td colspan="4">Keterangan : ${data.keterangan}</td></tr>` : '';

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SURAT PENAWARAN / SALES QUOTATION</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; font-size: 12px; }
                .tbl_border, .tbl_border th, .tbl_border td {
                    border: 1px solid black;
                    border-collapse: collapse;
                }
                .tbl_logo, .tbl_logo th, .tbl_logo td {
                    border-collapse: collapse;
                }
                .dontsplit {
                    page-break-inside: avoid;
                }
                .tbl_border td { padding: 5px; }
            </style>
        </head>
        <body>
            <table style="width: 100%;" class="tbl_logo">
                <tr>
                    <td style="border-bottom: 1px solid black; text-align: left">
                        <img src="${API_URL}/assets/images/logo_eka_alamat_old.png" style="height: 96px" />
                    </td>
                    <td style="border-bottom: 1px solid black; text-align: right">
                        <img src="${API_URL}/assets/images/logo_kan.png" style="height: 71px" />
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;" colspan="2">
                        <h2>SURAT PENAWARAN / SALES QUOTATION</h2>
                    </td>
                </tr>
            </table>
            
            <table style="width: 100%;" class="tbl_border">
                <tr>
                    <td>Salesperson :</td>
                    <td>${data.sales_person_name || '-'}</td>
                    <td>Tanggal :</td>
                    <td>${data.date_so ? formatDate(new Date(data.date_so)) : '-'}</td>
                </tr>
                <tr>
                    <td>Delivery Terms :</td>
                    <td>${data.delivery_term_header || '-'}</td>
                    <td>Nomor :</td>
                    <td>${data.quotation_number || '-'}</td>
                </tr>
                <tr>
                    <td>Tanggal Pengiriman :</td>
                    <td>${data.estimasi_pengiriman ? formatDate(new Date(data.estimasi_pengiriman)) : '-'}</td>
                    <td colspan="2">Informasi Pembeli :</td>
                </tr>
                <tr>
                    <td>Cara Pembayaran</td>
                    <td>${caraPembayaranText}</td>
                    <td colspan="2" rowspan="2">${customerInfoHtml}</td>
                </tr>
                <tr>
                    <td>Penawaran ini dibuat oleh:</td>
                    <td>${data.created_by_name || '-'}</td>
                </tr>
                ${keteranganHtml}
            </table>
            <br>

            <table style="width: 100%;" class="tbl_border">
                <tr>
                    <th style="text-align: center;">No</th>
                    <th style="text-align: center;">Nama dan Deskripsi Barang</th>
                    <th style="text-align: center;">Status Barang</th>
                    <th style="text-align: center;">Harga Satuan</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: center;">UOM</th>
                    <th style="text-align: center;">Line Total</th>
                </tr>
                ${itemsHtml}
                <tr>
                    <td style="text-align: right;" colspan="6">SUB-TOTAL</td>
                    <td>
                        <table style="width: 100%; border: none !important;">
                            <tr>
                                <td style="text-align: left; border: none !important;">${currencyStr}</td>
                                <td style="text-align: right; border: none !important;">${formatRupiahNumber(subtotal)}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                ${ppn > 0 ? `
                <tr>
                    <td style="text-align: right;" colspan="6">PPN</td>
                    <td>
                        <table style="width: 100%; border: none !important;">
                            <tr>
                                <td style="text-align: left; border: none !important;">${currencyStr}</td>
                                <td style="text-align: right; border: none !important;">${formatRupiahNumber(ppn)}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                ` : ''}
                <tr>
                    <td style="text-align: right;" colspan="6">TOTAL</td>
                    <td>
                        <table style="width: 100%; border: none !important;">
                            <tr>
                                <td style="text-align: left; border: none !important;">${currencyStr}</td>
                                <td style="text-align: right; border: none !important;">${formatRupiahNumber(grandTotal)}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table style="width: 100%; margin-top: 20px;">
                <tr style="font-size: 12px;">
                    <td colspan="2">Syarat dan ketentuan:</td>
                </tr>
                <tr style="font-size: 12px;">
                    <td style="text-align: center; vertical-align: top; width: 20px;">1</td>
                    <td>Surat Penawaran ini berlaku 7 hari dari tanggal diatas.</td>
                </tr>
                <tr style="font-size: 12px;">
                    <td style="text-align: center; vertical-align: top;">2</td>
                    <td>Ketersediaan barang terbatas, selama tidak ada pembayaran uang muka, status ketersediaan barang tidak mengikat.</td>
                </tr>
                <tr style="font-size: 12px;">
                    <td style="text-align: center; vertical-align: top;">3</td>
                    <td>Jika penawaran dalam mata uang asing, pembayaran akan dikonversikan kedalam mata uang Rupiah pada saat transaksi/jatuh tempo pembayaran.</td>
                </tr>
                <tr style="font-size: 12px;">
                    <td style="text-align: center; vertical-align: top;">4</td>
                    <td>Surat penawaran ini dibuat menggunakan sistem komputer dan tidak memerlukan tanda tangan. Apabila memerlukan tanda tangan, harap menghubungi salesperson terkait.</td>
                </tr>
                <tr style="font-size: 12px;">
                    <td style="text-align: center; vertical-align: top;">5</td>
                    <td>Penawaran ini belum termasuk PPN kecuali jika tertera di perincian diatas.</td>
                </tr>
                <tr style="font-size: 12px;">
                    <td style="text-align: center; vertical-align: top;">6</td>
                    <td>Garansi service dan spare part selama 12 bulan dari tanggal Surat Jalan, garansi tidak termasuk part habis pakai <i>(consumables parts)</i>. Untuk klaim garansi spare part hanya untuk kerusakan yang disebabkan oleh cacat pabrik dan hanya bisa diklaim 1x untuk kerusakan yang sama. Kerusakan yang dikarenakan kesalahan pengoprasian tidak termasuk garansi.</td>
                </tr>
                <tr style="font-size: 12px;">
                    <td style="text-align: center; vertical-align: top;">7</td>
                    <td>Garansi on-site service/kunjungan teknisi selama masa garansi secara cuma-cuma hanya berlaku untuk daerah Jabodetabek. Untuk diluar daerah akan dikenakan biaya transportasi dan akomodasi untuk kunjungan teknisi, biaya teknisi tidak dibebankan selama masa garansi.</td>
                </tr>
                <tr style="font-size: 12px;">
                    <td style="text-align: center; vertical-align: top;">8</td>
                    <td>Pembayaran hanya berlaku/sah jika dana ditransfer ke rekening perusahaan atas nama PT. EKA MAJU MESININDO. <br />Kami tidak bertanggung jawab atas pembayaran yang dilakukan dengan cara lainnya.</td>
                </tr>
                <tr style="font-size: 12px;">
                    <td style="text-align: center; vertical-align: top;">9</td>
                    <td>Harga barang tercantum diatas TIDAK termasuk aksesoris diluar mesin seperti kompresor angin (air compressor), pendingin (chiller), ataupun accessories lainnya.</td>
                </tr>
                <tr style="font-size: 12px;">
                    <td style="text-align: center; vertical-align: top;">10</td>
                    <td>Harga barang tercantum diatas termasuk peletakan barang di LANTAI DASAR. Jika peletakan barang di LANTAI DUA atau lebih, akan dilakukan survei dan dikenakan biaya tambahan.</td>
                </tr>
            </table>
            
            <table style="width: 100%; margin-top: 20px;" class="dontsplit">
                <tr style="font-size: 12px;">
                    <td colspan="2">Untuk menyetujui ini, harap tanda tangan dan cap perusahaan dibawah ini dan fax ke nomor (021) 668-5874 atau email di : sales-emm@ekamaju.co.id</td>
                </tr>
                <tr><td colspan="2">&nbsp;</td></tr>
                <tr><td colspan="2">&nbsp;</td></tr>
                <tr>
                    <td colspan="2">____________________________</td>
                </tr>
            </table>
        </body>
        </html>
        `;
    };

    const handlePrint = async () => {
        try {
            await Print.printAsync({
                html: generateHtml(),
            });
            // Kirim notifikasi setelah cetak berhasil
            if (authUser && data) {
                try {
                    await notificationService.store({
                        user_id: authUser.id_user,
                        id_users_level: authUser.id_users_level,
                        kode_trans: data.quotation_number || String(id),
                        judul: 'Quotation Dicetak',
                        pesan: `Quotation ${data.quotation_number || id} telah dicetak/diexport menjadi PDF.`,
                        action: 'Update'
                    });
                } catch (_) {}
            }
        } catch (error) {
            setToastType('error');
            setToastMessage('Gagal memproses PDF');
            setToastVisible(true);
        }
    };

    if (loading || !data) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator title="MEMUAT DATA..." showBackButton onBackPress={() => navigation.goBack()} />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </View>
        );
    }

    const subtotal = data.items?.reduce((sum: number, item: any) => sum + ((item.harga || 0) * (item.qty || 1)), 0) || 0;
    const ppn = data.flag_ppn === '1' || data.flag_ppn === 'Y' ? (subtotal * (data.nppn_amount || 11)) / 100 : 0;
    const grandTotal = subtotal + ppn;
    
    const currencyStr = data.mata_uang === 'USD' ? 'USD' : 'RP';

    const getPaymentLabel = (methodVal: string, typeVal: string) => {
        let options = CARA_PEMBAYARAN_OPTIONS_MAP[methodVal] || [];
        let found = options.find(o => o.value === typeVal);
        if (!found) {
            for (const key in CARA_PEMBAYARAN_OPTIONS_MAP) {
                found = CARA_PEMBAYARAN_OPTIONS_MAP[key].find(o => o.value === typeVal);
                if (found) break;
            }
        }
        return found?.label || typeVal;
    };
    const getWaktuBayarLabel = (val: string) => WAKTU_BAYAR_OPTIONS.find(o => o.value === val)?.label || val;

    return (
        <View className="flex-1 bg-gray-100">
            <ToastMessages
                visible={toastVisible}
                type={toastType}
                message={toastMessage}
                onHide={() => setToastVisible(false)}
            />
            <HeaderNavigator
                title="CETAK QUOTATION"
                showBackButton
                onBackPress={() => navigation.goBack()}
                rightComponent={
                    <TouchableOpacity onPress={handlePrint} className="w-12 h-12 bg-indigo-500 rounded-full items-center justify-center">
                        <Printer size={20} color="white" />
                    </TouchableOpacity>
                }
            />

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    {/* Paper Canvas */}
                    <View className="bg-white p-8" style={{ width: 800, minHeight: 800, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                        
                        {/* Header Logos & Title */}
                        <View className="flex-row items-center justify-between border-b border-black pb-4 mb-4">
                            <Image source={{ uri: `${API_URL}/assets/images/logo_eka_alamat_old.png` }} style={{ width: 120, height: 60 }} resizeMode="contain" />
                            <Image source={{ uri: `${API_URL}/assets/images/logo_kan.png` }} style={{ width: 100, height: 50 }} resizeMode="contain" />
                        </View>
                        <View className="items-center mb-6">
                            <Text className="font-bold text-lg text-black">SURAT PENAWARAN / SALES QUOTATION</Text>
                        </View>

                        {/* Metadata Table */}
                        <View className="border-t border-l border-black mb-6">
                            <View className="flex-row border-b border-black">
                                <View className="w-1/4 border-r border-black p-2"><Text className="text-xs text-black">Salesperson :</Text></View>
                                <View className="w-1/4 border-r border-black p-2"><Text className="text-xs text-black">{data.sales_person_name || '-'}</Text></View>
                                <View className="w-1/4 border-r border-black p-2"><Text className="text-xs text-black">Tanggal :</Text></View>
                                <View className="w-1/4 border-r border-black p-2"><Text className="text-xs text-black">{data.date_so ? formatDate(new Date(data.date_so)) : '-'}</Text></View>
                            </View>
                            <View className="flex-row border-b border-black">
                                <View className="w-1/4 border-r border-black p-2"><Text className="text-xs text-black">Delivery Terms :</Text></View>
                                <View className="w-1/4 border-r border-black p-2"><Text className="text-xs text-black">{data.delivery_term_header || '-'}</Text></View>
                                <View className="w-1/4 border-r border-black p-2"><Text className="text-xs text-black">Nomor :</Text></View>
                                <View className="w-1/4 border-r border-black p-2"><Text className="text-xs text-black font-bold">{data.quotation_number || '-'}</Text></View>
                            </View>
                            
                            {/* Row with rowspan equivalent */}
                            <View className="flex-row border-b border-black">
                                <View className="w-1/2">
                                    <View className="flex-row border-b border-black">
                                        <View className="w-1/2 border-r border-black p-2"><Text className="text-xs text-black">Tanggal Pengiriman :</Text></View>
                                        <View className="w-1/2 border-r border-black p-2"><Text className="text-xs text-black">{data.estimasi_pengiriman ? formatDate(new Date(data.estimasi_pengiriman)) : '-'}</Text></View>
                                    </View>
                                    <View className="flex-row border-b border-black">
                                        <View className="w-1/2 border-r border-black p-2"><Text className="text-xs text-black">Cara Pembayaran</Text></View>
                                        <View className="w-1/2 border-r border-black p-2">
                                            <Text className="text-xs text-black">{getPaymentLabel(data.metode_payment, data.tipe_pembayaran) || '-'}</Text>
                                            {parseFloat(data.dp_persen) > 0 && <Text className="text-xs text-black">DP {data.dp_persen}% {currencyStr} {formatRupiahNumber(data.dp_amount)}</Text>}
                                            {parseInt(data.tenor) > 0 && <Text className="text-xs text-black">Tenor {data.tenor}x {currencyStr} {formatRupiahNumber(data.tenor_amount)}</Text>}
                                            <Text className="text-xs text-black">{getWaktuBayarLabel(data.waktu_bayar) || ''}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row">
                                        <View className="w-1/2 border-r border-black p-2"><Text className="text-xs text-black">Penawaran ini dibuat oleh:</Text></View>
                                        <View className="w-1/2 border-r border-black p-2"><Text className="text-xs text-black">{data.created_by_name || '-'}</Text></View>
                                    </View>
                                </View>
                                <View className="w-1/2">
                                    <View className="flex-row h-full">
                                        <View className="w-full border-r border-black p-2">
                                            <Text className="text-xs text-black mb-1">Informasi Pembeli :</Text>
                                            <Text className="text-xs text-black font-bold">{data.customer_name || ''}</Text>
                                            <Text className="text-xs text-black">{data.informasi_pembeli || ''}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            
                            {data.keterangan ? (
                                <View className="flex-row border-b border-black">
                                    <View className="w-full border-r border-black p-2"><Text className="text-xs text-black">Keterangan : {data.keterangan}</Text></View>
                                </View>
                            ) : null}
                        </View>

                        {/* Items Table */}
                        <View className="border-t border-l border-black mb-8">
                            {/* Table Header */}
                            <View className="flex-row border-b border-black">
                                <View className="w-8 border-r border-black p-2 items-center justify-center"><Text className="font-bold text-xs text-black text-center">No</Text></View>
                                <View className="flex-1 border-r border-black p-2 items-center justify-center"><Text className="font-bold text-xs text-black text-center">Nama dan Deskripsi Barang</Text></View>
                                <View className="w-24 border-r border-black p-2 items-center justify-center"><Text className="font-bold text-xs text-black text-center">Status Barang</Text></View>
                                <View className="w-28 border-r border-black p-2 items-center justify-center"><Text className="font-bold text-xs text-black text-center">Harga Satuan</Text></View>
                                <View className="w-12 border-r border-black p-2 items-center justify-center"><Text className="font-bold text-xs text-black text-center">Qty</Text></View>
                                <View className="w-16 border-r border-black p-2 items-center justify-center"><Text className="font-bold text-xs text-black text-center">UOM</Text></View>
                                <View className="w-28 border-r border-black p-2 items-center justify-center"><Text className="font-bold text-xs text-black text-center">Line Total</Text></View>
                            </View>
                            
                            {/* Table Body */}
                            {data.items?.map((item: any, index: number) => {
                                const indent_text = parseFloat(item.indent_amount) > 0 ? ` ±${item.indent_amount} Hari` : '';
                                return (
                                <View key={index} className="flex-row border-b border-black">
                                    <View className="w-8 border-r border-black p-2 items-center"><Text className="text-xs text-black">{index + 1}</Text></View>
                                    <View className="flex-1 border-r border-black p-2"><Text className="text-xs text-black">{item.product_code || ''} : {item.product_name || ''}</Text></View>
                                    <View className="w-24 border-r border-black p-2"><Text className="text-xs text-black">{item.status_barang || ''}{indent_text}</Text></View>
                                    
                                    <View className="w-28 border-r border-black p-2 flex-row justify-between">
                                        <Text className="text-xs text-black">{currencyStr}</Text>
                                        <Text className="text-xs text-black">{formatRupiahNumber(item.harga || 0)}</Text>
                                    </View>
                                    
                                    <View className="w-12 border-r border-black p-2 items-center"><Text className="text-xs text-black">{item.qty || 1}</Text></View>
                                    <View className="w-16 border-r border-black p-2 items-center"><Text className="text-xs text-black">{item.satuan || 'UNIT'}</Text></View>
                                    
                                    <View className="w-28 border-r border-black p-2 flex-row justify-between">
                                        <Text className="text-xs text-black">{currencyStr}</Text>
                                        <Text className="text-xs text-black">{formatRupiahNumber((item.harga || 0) * (item.qty || 1))}</Text>
                                    </View>
                                </View>
                            )})}

                            {/* Table Footer */}
                            <View className="flex-row border-b border-black">
                                <View className="flex-1 border-r border-black p-2 items-end"><Text className="text-xs text-black">SUB-TOTAL</Text></View>
                                <View className="w-28 border-r border-black p-2 flex-row justify-between">
                                    <Text className="text-xs text-black">{currencyStr}</Text>
                                    <Text className="text-xs text-black">{formatRupiahNumber(subtotal)}</Text>
                                </View>
                            </View>
                            {ppn > 0 && (
                                <View className="flex-row border-b border-black">
                                    <View className="flex-1 border-r border-black p-2 items-end"><Text className="text-xs text-black">PPN</Text></View>
                                    <View className="w-28 border-r border-black p-2 flex-row justify-between">
                                        <Text className="text-xs text-black">{currencyStr}</Text>
                                        <Text className="text-xs text-black">{formatRupiahNumber(ppn)}</Text>
                                    </View>
                                </View>
                            )}
                            <View className="flex-row border-b border-black">
                                <View className="flex-1 border-r border-black p-2 items-end"><Text className="text-xs text-black">TOTAL</Text></View>
                                <View className="w-28 border-r border-black p-2 flex-row justify-between">
                                    <Text className="text-xs text-black">{currencyStr}</Text>
                                    <Text className="text-xs text-black">{formatRupiahNumber(grandTotal)}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Footer Notes */}
                        <View className="mb-4">
                            <Text className="text-[11px] text-black mb-1">Syarat dan ketentuan:</Text>
                            
                            <View className="flex-row mb-1">
                                <Text className="text-[11px] text-black w-5 text-center">1</Text>
                                <Text className="text-[11px] text-black flex-1">Surat Penawaran ini berlaku 7 hari dari tanggal diatas.</Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="text-[11px] text-black w-5 text-center">2</Text>
                                <Text className="text-[11px] text-black flex-1">Ketersediaan barang terbatas, selama tidak ada pembayaran uang muka, status ketersediaan barang tidak mengikat.</Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="text-[11px] text-black w-5 text-center">3</Text>
                                <Text className="text-[11px] text-black flex-1">Jika penawaran dalam mata uang asing, pembayaran akan dikonversikan kedalam mata uang Rupiah pada saat transaksi/jatuh tempo pembayaran.</Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="text-[11px] text-black w-5 text-center">4</Text>
                                <Text className="text-[11px] text-black flex-1">Surat penawaran ini dibuat menggunakan sistem komputer dan tidak memerlukan tanda tangan. Apabila memerlukan tanda tangan, harap menghubungi salesperson terkait.</Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="text-[11px] text-black w-5 text-center">5</Text>
                                <Text className="text-[11px] text-black flex-1">Penawaran ini belum termasuk PPN kecuali jika tertera di perincian diatas.</Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="text-[11px] text-black w-5 text-center">6</Text>
                                <Text className="text-[11px] text-black flex-1">Garansi service dan spare part selama 12 bulan dari tanggal Surat Jalan, garansi tidak termasuk part habis pakai (consumables parts). Untuk klaim garansi spare part hanya untuk kerusakan yang disebabkan oleh cacat pabrik dan hanya bisa diklaim 1x untuk kerusakan yang sama. Kerusakan yang dikarenakan kesalahan pengoprasian tidak termasuk garansi.</Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="text-[11px] text-black w-5 text-center">7</Text>
                                <Text className="text-[11px] text-black flex-1">Garansi on-site service/kunjungan teknisi selama masa garansi secara cuma-cuma hanya berlaku untuk daerah Jabodetabek. Untuk diluar daerah akan dikenakan biaya transportasi dan akomodasi untuk kunjungan teknisi, biaya teknisi tidak dibebankan selama masa garansi.</Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="text-[11px] text-black w-5 text-center">8</Text>
                                <Text className="text-[11px] text-black flex-1">Pembayaran hanya berlaku/sah jika dana ditransfer ke rekening perusahaan atas nama PT. EKA MAJU MESININDO. {"\n"}Kami tidak bertanggung jawab atas pembayaran yang dilakukan dengan cara lainnya.</Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="text-[11px] text-black w-5 text-center">9</Text>
                                <Text className="text-[11px] text-black flex-1">Harga barang tercantum diatas TIDAK termasuk aksesoris diluar mesin seperti kompresor angin (air compressor), pendingin (chiller), ataupun accessories lainnya.</Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="text-[11px] text-black w-5 text-center">10</Text>
                                <Text className="text-[11px] text-black flex-1">Harga barang tercantum diatas termasuk peletakan barang di LANTAI DASAR. Jika peletakan barang di LANTAI DUA atau lebih, akan dilakukan survei dan dikenakan biaya tambahan.</Text>
                            </View>
                        </View>

                        <View className="mt-6">
                            <Text className="text-[11px] text-black mb-8">Untuk menyetujui ini, harap tanda tangan dan cap perusahaan dibawah ini dan fax ke nomor (021) 668-5874 atau email di : sales-emm@ekamaju.co.id</Text>
                            <Text className="text-[11px] text-black">____________________________</Text>
                        </View>

                    </View>
                </ScrollView>
            </ScrollView>
        </View>
    );
}
