import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useLkt } from '../hooks/useLkt';
import { formatDate } from '../../../utils/helpers/date';
import { api } from '../../../services/api/api';
import * as Print from 'expo-print';
import { Printer } from 'lucide-react-native';
import { theme } from '../../../theme/theme';

const API_URL = api.defaults.baseURL?.replace('/api', '') || 'http://192.168.1.127:8001';

export default function LktPrintBast() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lktCode } = route.params || {};
    const { currentLkt, loadLktDetail, isLoading } = useLkt();
    const dispatch = useDispatch();
    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({ visible: false, type: 'success', message: '' });

    useEffect(() => {
        if (lktCode) {
            loadLktDetail(lktCode);
        }
    }, [lktCode]);

    if (isLoading || !currentLkt) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator title="MEMUAT DATA..." showBackButton onBackPress={() => navigation.goBack()} />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </View>
        );
    }

    const currentDate = new Date();
    const monthYear = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    const nomorUrut = "___";

    const handlePrint = async () => {
        if (!currentLkt) return;

        try {
            const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>BERITA ACARA SERAH TERIMA</title>
    <style type="text/css">
        body { width: 100%; height: 100%; margin: 0; padding: 0; background-color: #FAFAFA; font: 11pt "Times new roman"; }
        * { box-sizing: border-box; -moz-box-sizing: border-box; }
        .tbl_logo, .tbl_logo th, .tbl_logo td { border-collapse: collapse; }
        .page { width: 210mm; height: 326mm; padding: 0mm; margin: 0mm auto; font-size: 11pt; }
        .bca { width: 80mm; height: 10mm; font-size: 12pt; margin-top: 16mm; margin-left: 65mm; text-align: center; }
        .isi_bc { width: 150mm; height: 135mm; margin-top: 9mm; margin-left: 30mm; }
        .ttd_1 { width: 57mm; height: 37mm; float: left; margin-top: 1mm; margin-left: 30mm; text-align: center; }
        .ttd_2 { width: 57mm; height: 37mm; float: right; margin-top: 1mm; margin-right: 25mm; text-align: center; }
        .ttd_ok { width: 57mm; height: 5mm; margin-top: 30mm; }
        @page { size: 210mm 326mm; margin: 0; }
        @media print {
            html, body { width: 210mm; height: 326mm; }
            .page { margin: 0; border: initial; border-radius: initial; width: initial; min-height: initial; box-shadow: initial; background: initial; page-break-after: always; }
        }
    </style>
</head>
<body>
    <div class="book">
        <div class="page">
            <table style="width: 180mm; margin: 15mm auto 0 auto;" class="tbl_logo">
                <tr>
                    <td style="border-bottom: 1px solid black; border-collapse: collapse; text-align: left"><img src="${API_URL}/assets/images/logo_eka_alamat_old.png" style="height: 96px;" /></td>
                    <td style="border-bottom: 1px solid black; border-collapse: collapse; text-align: right"><img src="${API_URL}/assets/images/logo_kan.png" style="height: 71px;" /></td>
                </tr>
            </table>
            <table style="width: 100%; border: none; margin-top: 10mm;">
                <tr>
                    <td style="width: 65%; vertical-align: top; padding-left: 29mm;">
                        <table style="width: 100%; border: none; font: 11pt 'Times new roman';">
                            <tr><td width="70px">No.</td><td width="10px">:</td><td><b>${nomorUrut}/BAST-EMM/${monthYear}</b></td></tr>
                            <tr><td>Lampiran</td><td>:</td><td></td></tr>
                            <tr><td>Perihal</td><td>:</td><td></td></tr>
                        </table>
                    </td>
                    <td style="width: 35%; vertical-align: top; text-align: right; padding-right: 20mm;">
                        Jakarta, ${formatDate(new Date().toISOString())}
                    </td>
                </tr>
            </table>
            <div class="bca">
                <h3 align="center">BERITA ACARA SERAH TERIMA</h3>
            </div>
            <div class="isi_bc">
                <p>Pihak Pembeli :</p>
                <p>
                    <b>${currentLkt.nm_customers || ''}</b><br>
                    <i>${currentLkt.customers_address || ''}</i><br>
                </p>
                <p>Phone : ${currentLkt.customers_mobile || '-'}</p>
                <br>
                <p>Telah dilakukan pemasangan serta pengoprasian (Runing Test) atas :</p>
                <p align="center"><b>1 (SATU) UNIT ${currentLkt.code_product || ''}:${currentLkt.nm_product || ''}</b></p>
                <p align="center"><b>SERIAL NUMBER : ${currentLkt.barcode || ''}</b></p>
                <br>
                <p>Dengan ini menyatakan bahwa mesin telah di terima dalam kondisi baru dan baik,</p>
                <p align="center">&amp;</p>
                <p>pemasangan beserta pengoprasian mesin telah selesai dilakukan dan mesin telah beroprasi dengan lancar.</p>
            </div>
            <div class="ttd_1">
                <b>${currentLkt.nm_customers || ''}</b><br>
                <div class="ttd_ok">(........................................................)</div>
            </div>
            <div class="ttd_2">
                <b>PT. EKA MAJU MESININDO</b><br>
                <div class="ttd_ok">(........................................................)</div>
            </div>
        </div>
    </div>
</body>
</html>
            `;
            await Print.printAsync({ html });

            const shortLktCode = lktCode ? lktCode.slice(-5) : '-';

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
                title="CETAK BAST LKT"
                showBackButton
                onBackPress={() => navigation.goBack()}
                rightComponent={
                    <TouchableOpacity onPress={handlePrint} className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center">
                        <Printer size={20} color="white" />
                    </TouchableOpacity>
                }
            />

            <ScrollView className="flex-1 p-4" contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
                {/* Paper Canvas */}
                <View className="bg-white w-full max-w-2xl p-6" style={{ minHeight: 800, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>

                    {/* Header Logos */}
                    <View className="flex-row justify-between items-end border-b-2 border-black pb-2 mb-6">
                        {/* If images don't exist in RN, we use text placeholders for preview, or load from API */}
                        <Image
                            source={{ uri: `${API_URL}/assets/images/logo_eka_alamat_old.png` }}
                            style={{ height: 60, width: 200 }}
                            resizeMode="contain"
                        />
                        <Image
                            source={{ uri: `${API_URL}/assets/images/logo_kan.png` }}
                            style={{ height: 50, width: 80 }}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Letterhead Information */}
                    <View className="flex-row justify-between mb-8">
                        <View className="flex-1">
                            <View className="flex-row mb-1">
                                <Text className="w-20 text-xs text-black">No.</Text>
                                <Text className="w-4 text-xs text-black">:</Text>
                                <Text className="flex-1 font-bold text-xs text-black">{nomorUrut}/BAST-EMM/{monthYear}</Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="w-20 text-xs text-black">Lampiran</Text>
                                <Text className="w-4 text-xs text-black">:</Text>
                                <Text className="flex-1 text-xs text-black"></Text>
                            </View>
                            <View className="flex-row mb-1">
                                <Text className="w-20 text-xs text-black">Perihal</Text>
                                <Text className="w-4 text-xs text-black">:</Text>
                                <Text className="flex-1 text-xs text-black"></Text>
                            </View>
                        </View>
                        <View className="items-end pl-4">
                            <Text className="text-xs text-black">Jakarta, {formatDate(new Date().toISOString())}</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <View className="items-center mb-8">
                        <Text className="text-base font-bold text-black underline tracking-widest">BERITA ACARA SERAH TERIMA</Text>
                    </View>

                    {/* Content */}
                    <View className="mb-10 px-4">
                        <Text className="text-xs text-black mb-4">Pihak Pembeli :</Text>

                        <View className="mb-6">
                            <Text className="text-xs font-bold text-black">{currentLkt.nm_customers}</Text>
                            <Text className="text-xs text-black italic leading-tight">{currentLkt.customers_address}</Text>
                            <Text className="text-xs text-black mt-2">Phone : {currentLkt.customers_mobile || '-'}</Text>
                        </View>

                        <Text className="text-xs text-black mb-4">
                            Telah dilakukan pemasangan serta pengoprasian (Runing Test) atas :
                        </Text>

                        <Text className="text-xs font-bold text-black text-center mb-1">
                            1 (SATU) UNIT {currentLkt.code_product}:{currentLkt.nm_product}
                        </Text>
                        <Text className="text-xs font-bold text-black text-center mb-6">
                            SERIAL NUMBER : {currentLkt.barcode}
                        </Text>

                        <Text className="text-xs text-black mb-2">
                            Dengan ini menyatakan bahwa mesin telah di terima dalam kondisi baru dan baik,
                        </Text>
                        <Text className="text-xs text-black text-center mb-2">&</Text>
                        <Text className="text-xs text-black">
                            pemasangan beserta pengoprasian mesin telah selesai dilakukan dan mesin telah beroprasi dengan lancar.
                        </Text>
                    </View>

                    {/* Signatures */}
                    <View className="flex-row justify-between px-8 mt-12">
                        <View className="items-center w-40">
                            <Text className="text-xs font-bold text-black text-center h-10">{currentLkt.nm_customers}</Text>
                            <View className="h-20" />
                            <Text className="text-xs text-black">(........................................)</Text>
                        </View>
                        <View className="items-center w-40">
                            <Text className="text-xs font-bold text-black text-center h-10">PT. EKA MAJU MESININDO</Text>
                            <View className="h-20" />
                            <Text className="text-xs text-black">(........................................)</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}
