import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useLkt } from '../hooks/useLkt';
import { formatDate } from '../../../utils/helpers/date';
import * as Print from 'expo-print';

import { Printer } from 'lucide-react-native';
import { theme } from '../../../theme/theme';

export default function LktPrintLabel() {
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

    const isWaranty = true; // Replace with proper check if data available
    const warrantyText = isWaranty ? "(GARANSI)" : "(TIDAK GARANSI)";

    // To match 6 labels on a page (2 cols x 3 rows)
    const labels = Array(6).fill(0);

    const handlePrint = async () => {
        if (!currentLkt) return;

        try {
            // Generate the inner label HTML
            const labelHtml = `
            <div class="page2">
                <div class="page2isi">
                    <b>${currentLkt.cst_code}</b><br>
                    TGL DAFTAR : ${currentLkt.csr_date ? formatDate(currentLkt.csr_date) : '-'}<br>
                    Customer : ${currentLkt.nm_customers}<br>
                    ALAMAT (NO TLP): ${currentLkt.customers_address} ${currentLkt.customers_mobile || ''}<br>
                    Serial Number  : ${currentLkt.barcode}<br> 
                    Produk : ${currentLkt.code_product} ${currentLkt.nm_product} <b>${warrantyText}</b><br>
                    Laporan Kerusakan : ${currentLkt.lap_kerusakan || '-'}       
                </div>
            </div>
            `;

            const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>Halaman Print LKT</title>
<style type="text/css">
    body { width: 100%; height: 100%; margin: 0; padding: 0; background-color: #FAFAFA; font: 10pt "Times new roman"; }
    * { box-sizing: border-box; -moz-box-sizing: border-box; }
    .page { width: 201mm; height: 165mm; padding: 2mm 0mm 0mm 0mm; margin: 0mm auto; }
    .page2 { width: 98mm; height: 50mm; float: left; margin-top: 3mm; margin-left: 1.5mm; border: 0mm; }
    .page2isi { width: 90mm; height: 45mm; margin: 2.5mm 4mm 2.5mm 4mm; background: white; border: 0mm; }
    @page { size: 201mm 165mm; margin: 0; }
    @media print {
        html, body { width: 201mm; height: 165mm; }
        .page { margin: 0; border: initial; border-radius: initial; width: initial; min-height: initial; box-shadow: initial; background: initial; page-break-after: always; }
    }
</style>
</head>
<body>
    <div class="book">
        <div class="page">
            ${labelHtml.repeat(6)}
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
                title="CETAK LABEL LKT"
                showBackButton
                onBackPress={() => navigation.goBack()}
                rightComponent={
                    <TouchableOpacity onPress={handlePrint} className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center">
                        <Printer size={20} color="white" />
                    </TouchableOpacity>
                }
            />

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    {/* Paper Canvas (approximate A4 landscape or label paper size) */}
                    <View className="bg-white p-2 flex-row flex-wrap justify-between" style={{ width: 800, minHeight: 600, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>

                        {labels.map((_, index) => (
                            <View key={index} style={{ width: '49%', height: 180, marginBottom: '2%' }}>
                                <View className="flex-1 bg-white border border-gray-300 p-4 rounded-md">
                                    <Text className="text-sm font-bold text-black mb-1">{currentLkt.cst_code}</Text>
                                    <Text className="text-xs text-black mb-1">
                                        TGL DAFTAR : {currentLkt.csr_date ? formatDate(currentLkt.csr_date) : '-'}
                                    </Text>
                                    <Text className="text-xs text-black mb-1">
                                        Customer : {currentLkt.nm_customers}
                                    </Text>
                                    <Text className="text-xs text-black mb-1 leading-tight" numberOfLines={2}>
                                        ALAMAT (NO TLP): {currentLkt.customers_address} {currentLkt.customers_mobile ? currentLkt.customers_mobile : ''}
                                    </Text>
                                    <Text className="text-xs text-black mb-1">
                                        Serial Number : {currentLkt.barcode}
                                    </Text>
                                    <Text className="text-xs text-black mb-1">
                                        Produk : {currentLkt.code_product} {currentLkt.nm_product} <Text className="font-bold">{warrantyText}</Text>
                                    </Text>
                                    <Text className="text-xs text-black" numberOfLines={2}>
                                        Laporan Kerusakan : {currentLkt.lap_kerusakan || '-'}
                                    </Text>
                                </View>
                            </View>
                        ))}

                    </View>
                </ScrollView>
            </ScrollView>
        </View>
    );
}
