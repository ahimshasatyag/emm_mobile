import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useDo } from '../hooks/useDo';
import { formatDate } from '../../../utils/helpers/date';
import { api } from '../../../services/api/api';
import * as Print from 'expo-print';
import { Printer } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { useCallback, useState } from 'react';

const API_URL = api.defaults.baseURL?.replace('/api', '') || 'http://192.168.1.127:8001';

export default function DoPrintSjScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params || {};
    const { detail, loadingDetail, getDetail, resetDetail } = useDo();
    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
        visible: false,
        type: 'success',
        message: '',
    });

    useFocusEffect(
        useCallback(() => {
            if (id) getDetail(id);
            return () => resetDetail();
        }, [id])
    );

    if (loadingDetail || !detail) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator title="MEMUAT DATA..." showBackButton onBackPress={() => navigation.goBack()} />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </View>
        );
    }

    const formatDeliveryDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return formatDate(new Date(dateStr));
    };

    const handlePrint = async () => {
        try {
            const itemsHtml = ((detail as any)?.items || (detail as any)?.details || []).map((item: any, index: number) => `
                <tr>
                    <td style="text-align: center; padding: 6px; border: 1px solid black;">${index + 1}</td>
                    <td style="text-align: left; padding: 6px; border: 1px solid black;">
                        ${item.code_product} : ${item.nm_product}
                        ${item.leasing_tahun ? `<br/>Tahun : ${item.leasing_tahun}` : ''}
                        ${item.leasing_plat ? `<br/>Serial Number : ${item.leasing_plat}` : ''}
                    </td>
                    <td style="text-align: center; padding: 6px; border: 1px solid black;">${item.nqty} ${item.nm_product_satuan}</td>
                    <td style="text-align: center; padding: 6px; border: 1px solid black;">${item.nbarcode || '-'}</td>
                </tr>
                <tr><td colspan="4" style="border: 1px solid black; height: 40px;"></td></tr>
            `).join('');

            const keteranganHtml = detail.keterangan ? `
                <br/>
                <table style="width: 50%; border-collapse: collapse; border: 1px solid black;">
                    <tr><td style="padding: 8px; border: 1px solid black;">${detail.keterangan.replace(/\n/g, '<br/>')}</td></tr>
                </table>
            ` : '';

            const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Jalan</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; margin: 20px; }
        .tbl_border, .tbl_border th, .tbl_border td { border: 1px solid black; border-collapse: collapse; }
        .tbl_logo, .tbl_logo th, .tbl_logo td { border-collapse: collapse; }
        h2 { text-align: center; }
    </style>
</head>
<body>
    <table style="width: 100%;" class="tbl_logo">
        <tr>
            <td style="border-bottom: 1px solid black; text-align: left;">
                <img src="${API_URL}/assets/images/logo_eka_alamat_old.png" style="height: 71px;" />
            </td>
            <td style="border-bottom: 1px solid black; text-align: right;">
                <img src="${API_URL}/assets/images/logo_kan.png" style="height: 71px;" />
            </td>
        </tr>
    </table>

    <h2>SURAT JALAN</h2>

    <table>
        <tr><td>NOMOR SURAT JALAN</td><td>: ${detail.code_do || '-'}</td></tr>
        <tr><td>TANGGAL KIRIM</td><td>: ${formatDeliveryDate(detail.date_delivery)}</td></tr>
        <tr><td>NOMOR PO</td><td>: ${detail.keterangan_so || '-'}</td></tr>
        <tr><td>NOMOR SO</td><td>: ${detail.code_so || '-'}</td></tr>
    </table>

    <br/><br/>
    <b>PEMBELI/BUYER:</b><br/><br/>
    <b>${detail.nm_customers || '-'}</b><br/>
    ${detail.customers_address ? detail.customers_address + '<br/>' : ''}

    <br/>
    <table style="width: 100%;" class="tbl_border">
        <thead>
            <tr>
                <th style="text-align: center; padding: 6px;">No</th>
                <th style="text-align: center; padding: 6px;">Nama dan Deskripsi Barang</th>
                <th style="text-align: center; padding: 6px; max-width: 100px;">Qty</th>
                <th style="text-align: center; padding: 6px;">Nomor Barcode</th>
            </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
    </table>

    ${keteranganHtml}

    <br/><br/><br/>

    <table style="width: 100%;">
        <tr>
            <td style="width: 25%; text-align: center;">
                <div>Kepala Gudang</div>
                <div style="height: 80px;"></div>
                <div style="border-top: 1px solid black;">(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</div>
            </td>
            <td style="width: 25%; text-align: center;">
                <div>Security</div>
                <div style="height: 80px;"></div>
                <div style="border-top: 1px solid black;">(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</div>
            </td>
            <td style="width: 25%; text-align: center;">
                <div>Supir</div>
                <div style="height: 80px;"></div>
                <div style="border-top: 1px solid black;">(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</div>
            </td>
            <td style="width: 25%; text-align: center;">
                <div>Customer</div>
                <div style="height: 80px;"></div>
                <div style="border-top: 1px solid black;">(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</div>
            </td>
        </tr>
    </table>
</body>
</html>`;

            await Print.printAsync({ html });
        } catch (error) {
            setToast({ visible: true, type: 'error', message: 'Gagal mencetak dokumen' });
            console.error(error);
        }
    };

    return (
        <View className="flex-1 bg-gray-100">
            <ToastMessages
                visible={toast.visible}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <HeaderNavigator
                title="CETAK SURAT JALAN"
                showBackButton
                onBackPress={() => navigation.goBack()}
                rightComponent={
                    <TouchableOpacity onPress={handlePrint} className="w-12 h-12 bg-teal-500 rounded-full items-center justify-center">
                        <Printer size={20} color="white" />
                    </TouchableOpacity>
                }
            />

            <ScrollView className="flex-1 p-4" contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
                {/* Paper Canvas */}
                <View
                    className="bg-white w-full max-w-2xl p-6"
                    style={{ minHeight: 900, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 5, elevation: 4 }}
                >
                    {/* Header Logo */}
                    <View className="flex-row justify-between items-end border-b-2 border-black pb-3 mb-5">
                        <Image
                            source={{ uri: `${API_URL}/assets/images/logo_eka_alamat_old.png` }}
                            style={{ height: 55, width: 180 }}
                            resizeMode="contain"
                        />
                        <Image
                            source={{ uri: `${API_URL}/assets/images/logo_kan.png` }}
                            style={{ height: 50, width: 80 }}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Title */}
                    <Text className="text-xl font-bold text-black text-center mb-5 tracking-wider">SURAT JALAN</Text>

                    {/* Info Header */}
                    <View className="mb-5">
                        {[
                            { label: 'NOMOR SURAT JALAN', value: detail.code_do || '-' },
                            { label: 'TANGGAL KIRIM', value: formatDeliveryDate(detail.date_delivery) },
                            { label: 'NOMOR PO', value: detail.keterangan_so || '-' },
                            { label: 'NOMOR SO', value: detail.code_so || '-' },
                        ].map((row, i) => (
                            <View key={i} className="flex-row mb-1">
                                <Text className="w-44 text-xs text-black">{row.label}</Text>
                                <Text className="w-4 text-xs text-black">:</Text>
                                <Text className="flex-1 text-xs font-medium text-black">{row.value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Buyer Info */}
                    <View className="mb-5">
                        <Text className="text-xs font-bold text-black mb-1">PEMBELI/BUYER:</Text>
                        <Text className="text-xs font-bold text-black">{detail.nm_customers || '-'}</Text>
                        {!!detail.customers_address && (
                            <Text className="text-xs text-black leading-5">{detail.customers_address}</Text>
                        )}
                    </View>

                    {/* Items Table */}
                    <View className="border border-black mb-4">
                        {/* Table Header */}
                        <View className="flex-row border-b border-black bg-gray-50">
                            <Text className="w-8 text-center text-xs font-bold text-black py-2 border-r border-black">No</Text>
                            <Text className="flex-1 text-center text-xs font-bold text-black py-2 border-r border-black">Nama dan Deskripsi Barang</Text>
                            <Text className="w-20 text-center text-xs font-bold text-black py-2 border-r border-black">Qty</Text>
                            <Text className="w-24 text-center text-xs font-bold text-black py-2">Nomor Barcode</Text>
                        </View>

                        {/* Table Rows */}
                        {((detail as any)?.items || (detail as any)?.details || []).map((item: any, index: number) => (
                            <View key={item.id_do_dtl || index}>
                                <View className="flex-row border-b border-black">
                                    <Text className="w-8 text-center text-xs text-black py-2 border-r border-black">{index + 1}</Text>
                                    <View className="flex-1 py-2 px-1 border-r border-black">
                                        <Text className="text-xs text-black font-medium">
                                            {item.code_product} : {item.nm_product}
                                        </Text>
                                        {!!item.leasing_tahun && (
                                            <Text className="text-xs text-black">Tahun : {item.leasing_tahun}</Text>
                                        )}
                                        {!!item.leasing_plat && (
                                            <Text className="text-xs text-black">Serial Number : {item.leasing_plat}</Text>
                                        )}
                                    </View>
                                    <Text className="w-20 text-center text-xs text-black py-2 border-r border-black">
                                        {item.nqty} {item.nm_product_satuan}
                                    </Text>
                                    <Text className="w-24 text-center text-xs text-black py-2">{item.nbarcode || '-'}</Text>
                                </View>
                                {/* Spacer row */}
                                <View className="h-8 border-b border-black" />
                            </View>
                        ))}
                    </View>

                    {/* Keterangan Box */}
                    {!!detail.keterangan && (
                        <View className="border border-black p-3 mb-5 w-1/2">
                            <Text className="text-xs text-black">{detail.keterangan}</Text>
                        </View>
                    )}

                    {/* Spacer */}
                    <View className="h-10" />

                    {/* Signature Section */}
                    <View className="flex-row justify-between mt-4">
                        {['Kepala Gudang', 'Security', 'Supir', 'Customer'].map((role) => (
                            <View key={role} className="flex-1 items-center mx-1">
                                <Text className="text-xs text-black text-center mb-1">{role}</Text>
                                <View className="h-20" />
                                <View className="w-full border-t border-black">
                                    <Text className="text-xs text-black text-center mt-1">(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
