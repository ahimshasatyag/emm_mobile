import React, { useCallback } from 'react';
import {
    View, ScrollView, Text, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as Print from 'expo-print';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useIncshipment } from '../hooks/useIncshipment';
import { theme } from '../../../theme/theme';
import { Printer } from 'lucide-react-native';
import { SvgXml } from 'react-native-svg';
import { generateCode128SVG } from '../utils/code128';
import { generatePrintTemplate } from '../utils/printTemplates';

// ─── Screen ───────────────────────────────────────────────────────────────────

export function IncshipmentPrintScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params;

    const { selectedItem, isLoadingDetail, loadDetail, clearSelection } = useIncshipment();
    const [isPrinting, setIsPrinting] = React.useState(false);

    useFocusEffect(
        useCallback(() => {
            loadDetail(id);
            return () => clearSelection();
        }, [id])
    );

    // Override SN untuk testing sesuai permintaan
    const details = (selectedItem?.details || []).map(d => ({
        ...d,
        sn: d.sn ? '40.401.01710.27.04696' : ''
    }));

    const handlePrint = async () => {
        if (!details?.length) {
            Alert.alert('Perhatian', 'Tidak ada detail barang untuk diprint.');
            return;
        }
        const noSN = details.filter(d => !d.sn || d.sn === '');
        if (noSN.length > 0) {
            Alert.alert(
                'Perhatian',
                `${noSN.length} barang belum memiliki Serial Number.\nLakukan Assign SN terlebih dahulu.`
            );
            return;
        }
        setIsPrinting(true);
        try {
            const html = generatePrintTemplate(details);
            await Print.printAsync({ html });
        } catch (error: any) {
            Alert.alert('Gagal', error?.message || 'Gagal membuka printer.');
        } finally {
            setIsPrinting(false);
        }
    };

    if (isLoadingDetail) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text className="mt-3 text-gray-500 text-sm">Memuat data...</Text>
            </View>
        );
    }


    const hasAllSN = details.length > 0 && details.every(d => d.sn && d.sn !== '');

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={`Print Barcode${selectedItem ? ' — ' + selectedItem.code : ''}`}
                showBackButton={true}
                rightComponent={
                    details.length > 0 ? (
                        <TouchableOpacity
                            onPress={handlePrint}
                            disabled={isPrinting}
                            className="w-10 h-10 items-center justify-center rounded-full bg-blue-50 border border-blue-100"
                        >
                            {isPrinting ? (
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            ) : (
                                <Printer size={20} color={theme.colors.primary} />
                            )}
                        </TouchableOpacity>
                    ) : undefined
                }
            />

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>

                {/* Item list preview */}
                <View
                    className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden"
                    style={{ elevation: 2 }}
                >
                    {details.length === 0 ? (
                        <View className="p-8 items-center">
                            <Text className="text-gray-400 text-sm">Tidak ada data barang.</Text>
                        </View>
                    ) : (
                        details.map((item, idx) => {
                            const hasSN = !!(item.sn && item.sn !== '');
                            return (
                                <View
                                    key={String(item.id)}
                                    className={`p-4 ${idx < details.length - 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    <View className="flex-row items-start">
                                        <View className="w-6 h-6 rounded-full bg-blue-50 items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                            <Text className="text-[10px] font-bold text-blue-600">{idx + 1}</Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xs text-gray-600" numberOfLines={2}>
                                                {item.nm_product}
                                            </Text>
                                            <Text className="text-base font-bold text-gray-900 mt-0.5">
                                                {item.code_product}
                                            </Text>
                                            {hasSN ? (
                                                <View className="mt-3 mb-1 self-start">
                                                    {/* Barcode Besar */}
                                                    <View className="bg-white border border-gray-200 p-2 rounded-lg items-center shadow-sm mb-2">
                                                        <SvgXml xml={generateCode128SVG(item.sn, { w: 1, h: 40, showText: false })} />
                                                        <Text className="text-[11px] font-mono font-bold text-gray-800 mt-1.5 tracking-widest">
                                                            {item.sn}
                                                        </Text>
                                                    </View>
                                                    {/* 4 Barcode Kecil */}
                                                    <View className="flex-row flex-wrap">
                                                        {[0, 1, 2, 3].map((idxSmall) => (
                                                            <View key={idxSmall} className="bg-white border border-gray-200 p-1 rounded-lg items-center shadow-sm mr-2 mb-2">
                                                                <SvgXml xml={generateCode128SVG(item.sn, { w: 0.7, h: 25, showText: false })} />
                                                                <Text className="text-[9px] font-mono font-bold text-gray-800 mt-1 tracking-wider">
                                                                    {item.sn}
                                                                </Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>
                                            ) : (
                                                <View className="mt-2 self-start px-2 py-1 rounded border bg-red-50 border-red-200">
                                                    <Text className="text-[10px] font-mono text-red-500 font-semibold">
                                                        ⚠ Belum di-assign SN
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>

                {/* SN warning */}
                {!hasAllSN && details.length > 0 && (
                    <View className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                        <Text className="text-amber-800 text-xs leading-5">
                            ⚠️  Ada barang yang belum memiliki SN. Silakan kembali dan lakukan{' '}
                            <Text className="font-bold">Assign Serial Number</Text> terlebih dahulu.
                        </Text>
                    </View>
                )}

                <View className="h-20" />
            </ScrollView>
        </View>
    );
}
