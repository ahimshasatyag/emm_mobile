import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { useHomeData } from '../hooks/useHomeData';
import { theme } from '../../../theme/theme';

export function DashboardProductStats() {
    const { data } = useHomeData();
    const topPriceCheckProducts = data?.topPriceCheck || [];
    const topQuotationProducts = data?.topProductsQuotation || [];
    const statisticsRatios = data?.quotationStats || {
        quotations: 0,
        total_quotations: 0,
        total_so: 0,
        total_cancelled: 0,
        success_rate: 0
    };

    const [periode, setPeriode] = useState('09-2026'); // Can be synced with a global state later
    const [pricePage, setPricePage] = useState(1);
    const [quotationPage, setQuotationPage] = useState(1);
    const itemsPerPage = 5;

    const paginatedPrice = topPriceCheckProducts.slice((pricePage - 1) * itemsPerPage, pricePage * itemsPerPage);
    const paginatedQuotation = topQuotationProducts.slice((quotationPage - 1) * itemsPerPage, quotationPage * itemsPerPage);

    const totalPricePages = Math.ceil(topPriceCheckProducts.length / itemsPerPage) || 1;
    const totalQuotationPages = Math.ceil(topQuotationProducts.length / itemsPerPage) || 1;

    const totalSegments = Number(statisticsRatios.quotations) + Number(statisticsRatios.total_so) + Number(statisticsRatios.total_cancelled);
    const safeTotal = totalSegments === 0 ? 1 : totalSegments;

    const pQuotes = (Number(statisticsRatios.quotations) / safeTotal) * 100;
    const pSO = (Number(statisticsRatios.total_so) / safeTotal) * 100;
    const pCancel = (Number(statisticsRatios.total_cancelled) / safeTotal) * 100;

    const offsetQuotes = 25;
    const offsetSO = 25 - pQuotes;
    const offsetCancel = offsetSO - pSO;

    return (
        <View className="px-6 mb-6">
            <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                {/* Filter */}
                <View className="bg-gray-50 p-4 rounded-xl mb-6 flex-row items-end justify-between hidden">
                    <View className="flex-1 mr-4">
                        <Text className="text-xs font-bold text-gray-500 mb-1">Filter Periode:</Text>
                        <TextInput 
                            value={periode}
                            onChangeText={setPeriode}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700"
                            placeholder="MM-YYYY"
                        />
                    </View>
                    <TouchableOpacity 
                        className="rounded-lg py-2 px-6 items-center justify-center"
                        style={{ backgroundColor: theme.colors.primary }}
                        onPress={() => Alert.alert('Filter', `Searching stats for ${periode}...`)}
                    >
                        <Text className="text-white font-bold text-xs">Search</Text>
                    </TouchableOpacity>
                </View>

                {/* Top Price Check Products */}
                <View className="mb-8">
                    <Text className="text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">
                        Top Price Check Products
                    </Text>
                    <View className="flex-row border-b border-gray-200 pb-2 mb-2">
                        <Text className="w-8 text-center text-[11px] font-bold text-gray-500">No</Text>
                        <Text className="flex-1 text-left text-[11px] font-bold text-gray-500 ml-2">Product Name</Text>
                        <Text className="w-16 text-center text-[11px] font-bold text-gray-500">Checks</Text>
                    </View>
                    {paginatedPrice.map((prod, index) => (
                        <View key={index} className="flex-row py-2 border-b border-gray-100 items-center">
                            <Text className="w-8 text-center text-[11px] font-bold text-gray-400">
                                {(pricePage - 1) * itemsPerPage + index + 1}
                            </Text>
                            <Text className="flex-1 text-[11px] font-semibold text-gray-800 ml-2" numberOfLines={1}>{prod.nm_product}</Text>
                            <Text style={{ color: theme.colors.primary }} className="w-16 text-center text-[11px] font-bold">{prod.total}</Text>
                        </View>
                    ))}
                    {topPriceCheckProducts.length === 0 && (
                        <Text className="text-center text-xs text-gray-400 py-4">Tidak ada data price check di bulan ini</Text>
                    )}
                    {/* Pagination */}
                    {topPriceCheckProducts.length > 0 && (
                        <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100">
                            <TouchableOpacity 
                                disabled={pricePage === 1}
                                onPress={() => setPricePage(p => p - 1)}
                                className={`px-3 py-1 bg-gray-100 rounded ${pricePage === 1 ? 'opacity-50' : ''}`}
                            >
                                <Text className="text-[10px] font-semibold text-gray-700">Prev</Text>
                            </TouchableOpacity>
                            <Text className="text-[10px] text-gray-500">Page <Text className="font-bold text-gray-700">{pricePage}</Text> of {totalPricePages}</Text>
                            <TouchableOpacity 
                                disabled={pricePage >= totalPricePages}
                                onPress={() => setPricePage(p => p + 1)}
                                className={`px-3 py-1 bg-gray-100 rounded ${pricePage >= totalPricePages ? 'opacity-50' : ''}`}
                            >
                                <Text className="text-[10px] font-semibold text-gray-700">Next</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Top Quotations Products */}
                <View className="mb-8">
                    <Text className="text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">
                        Top Products by Quotations
                    </Text>
                    <View className="flex-row border-b border-gray-200 pb-2 mb-2">
                        <Text className="w-8 text-center text-[11px] font-bold text-gray-500">No</Text>
                        <Text className="flex-1 text-left text-[11px] font-bold text-gray-500 ml-2">Product Name</Text>
                        <Text className="w-16 text-center text-[11px] font-bold text-gray-500">Quotes</Text>
                    </View>
                    {paginatedQuotation.map((prod, index) => (
                        <View key={index} className="flex-row py-2 border-b border-gray-100 items-center">
                            <Text className="w-8 text-center text-[11px] font-bold text-gray-400">
                                {(quotationPage - 1) * itemsPerPage + index + 1}
                            </Text>
                            <Text className="flex-1 text-[11px] font-semibold text-gray-800 ml-2" numberOfLines={1}>{prod.nm_product}</Text>
                            <Text className="w-16 text-center text-[11px] font-bold text-teal-600">{prod.total}</Text>
                        </View>
                    ))}
                    {topQuotationProducts.length === 0 && (
                        <Text className="text-center text-xs text-gray-400 py-4">Tidak ada data quotation di bulan ini</Text>
                    )}
                    {topQuotationProducts.length > 0 && (
                        <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100">
                            <TouchableOpacity 
                                disabled={quotationPage === 1}
                                onPress={() => setQuotationPage(p => p - 1)}
                                className={`px-3 py-1 bg-gray-100 rounded ${quotationPage === 1 ? 'opacity-50' : ''}`}
                            >
                                <Text className="text-[10px] font-semibold text-gray-700">Prev</Text>
                            </TouchableOpacity>
                            <Text className="text-[10px] text-gray-500">Page <Text className="font-bold text-gray-700">{quotationPage}</Text> of {totalQuotationPages}</Text>
                            <TouchableOpacity 
                                disabled={quotationPage >= totalQuotationPages}
                                onPress={() => setQuotationPage(p => p + 1)}
                                className={`px-3 py-1 bg-gray-100 rounded ${quotationPage >= totalQuotationPages ? 'opacity-50' : ''}`}
                            >
                                <Text className="text-[10px] font-semibold text-gray-700">Next</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Donut Chart Statistics */}
                <View className="mb-4">
                    <Text className="text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-3 text-center">
                        Quotation and SO Statistics
                    </Text>
                    <View className="items-center justify-center py-4">
                        <Svg width="180" height="180" viewBox="0 0 36 36">
                            <Circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                            {pQuotes > 0 && (
                                <Circle
                                    cx="18" cy="18" r="15.915"
                                    fill="none"
                                    stroke="#3DB9DC"
                                    strokeWidth="3.5"
                                    strokeDasharray={`${pQuotes} ${100 - pQuotes}`}
                                    strokeDashoffset={offsetQuotes}
                                />
                            )}
                            {pSO > 0 && (
                                <Circle
                                    cx="18" cy="18" r="15.915"
                                    fill="none"
                                    stroke="#1BB99A"
                                    strokeWidth="3.5"
                                    strokeDasharray={`${pSO} ${100 - pSO}`}
                                    strokeDashoffset={offsetSO}
                                />
                            )}
                            {pCancel > 0 && (
                                <Circle
                                    cx="18" cy="18" r="15.915"
                                    fill="none"
                                    stroke="#FF5D48"
                                    strokeWidth="3.5"
                                    strokeDasharray={`${pCancel} ${100 - pCancel}`}
                                    strokeDashoffset={offsetCancel}
                                />
                            )}
                            <G transform="translate(0, 1.5)">
                                <SvgText x="18" y="17" fontSize="4.5" fontWeight="bold" fill="#1f2937" textAnchor="middle">
                                    {statisticsRatios.success_rate}%
                                </SvgText>
                                <SvgText x="18" y="21" fontSize="2.5" fontWeight="bold" fill="#9ca3af" textAnchor="middle">
                                    SUCCESS RATE
                                </SvgText>
                            </G>
                        </Svg>
                    </View>
                    <View className="flex-row justify-center mt-2 flex-wrap px-2">
                        <View className="flex-row items-center mr-3 mb-2">
                            <View className="w-2.5 h-2.5 bg-[#3DB9DC] rounded-full mr-1.5" />
                            <Text className="text-[10px] font-semibold text-gray-600">Quotes ({statisticsRatios.quotations})</Text>
                        </View>
                        <View className="flex-row items-center mr-3 mb-2">
                            <View className="w-2.5 h-2.5 bg-[#1BB99A] rounded-full mr-1.5" />
                            <Text className="text-[10px] font-semibold text-gray-600">SO ({statisticsRatios.total_so})</Text>
                        </View>
                        <View className="flex-row items-center mb-2">
                            <View className="w-2.5 h-2.5 bg-[#FF5D48] rounded-full mr-1.5" />
                            <Text className="text-[10px] font-semibold text-gray-600">Cancel ({statisticsRatios.total_cancelled})</Text>
                        </View>
                    </View>

                    {/* Total cards */}
                    <View className="mt-4 flex-col">
                        <View className="bg-blue-500 rounded-xl p-3 flex-row justify-between items-center shadow-sm mb-2">
                            <Text className="text-white text-xs font-bold">Total Quotations</Text>
                            <View className="bg-white/20 px-2.5 py-0.5 rounded-full">
                                <Text className="text-white text-xs font-bold">{statisticsRatios.total_quotations}</Text>
                            </View>
                        </View>
                        <View className="bg-emerald-500 rounded-xl p-3 flex-row justify-between items-center shadow-sm">
                            <Text className="text-white text-xs font-bold">Success SO Rate</Text>
                            <Text className="text-white text-xs font-bold">{statisticsRatios.success_rate}%</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
