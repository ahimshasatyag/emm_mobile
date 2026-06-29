import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ActivityIndicator, ScrollView, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ProductPriceUploadSkeleton } from '../skeleton/ProductPriceUploadSkeleton';
import { FileUp, Download, Save, RefreshCcw, Eye } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { ProductPrice } from '../types/productprice.types';
import { dummyProductPrices } from '../data/dummy';
import { formatRp } from '../../../utils/helpers/money';
import Animated, { FadeOut, LinearTransition, FadeInUp } from 'react-native-reanimated';

export function ProductPriceUploadScreen() {
    const navigation = useNavigation();
    
    // Dummy states simulating a hook
    const [previewData, setPreviewData] = useState<ProductPrice[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<{ name: string; uri: string } | null>(null);

    const pickDocument = () => {
        // Dummy document picker
        setSelectedFile({ name: 'update_price_2026.xlsx', uri: 'dummy-uri' });
        setError(null);
    };

    const viewFile = () => {
        setIsLoading(true);
        setTimeout(() => {
            setPreviewData(dummyProductPrices);
            setIsLoading(false);
        }, 1000);
    };

    const onRefresh = () => {
        setIsRefreshing(true);
        // Even if no file, we can simulate checking
        setTimeout(() => {
            if (selectedFile) {
                setPreviewData(dummyProductPrices);
            }
            setIsRefreshing(false);
        }, 1000);
    };

    const saveData = () => {
        setIsSaving(true);
        // Simulate saving
        setTimeout(() => {
            setIsSaving(false);
            Alert.alert("Success", "Berhasil mengunggah dan menyimpan data!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        }, 1500);
    };

    const resetPreview = () => {
        setPreviewData([]);
        setSelectedFile(null);
        setError(null);
    };

    const handleDownloadTemplate = () => {
        const templateUrl = 'http://your-domain.com/assets/upload/template_upload.xls';
        Linking.openURL(templateUrl);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title={(isLoading || isRefreshing) ? "MEMUAT DATA..." : "UPLOAD PRODUCT PRICE"} 
                showBackButton={true} 
                onBackPress={() => navigation.goBack()} 
            />

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                <Animated.View entering={FadeInUp.delay(100).springify()}>
                    <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
                        <View className="flex-row justify-between mb-4">
                            <TouchableOpacity 
                                className="flex-1 bg-white border border-gray-200 rounded-xl p-3 mr-2 items-center flex-row justify-center shadow-sm"
                                onPress={pickDocument}
                                disabled={isLoading || isSaving}
                            >
                                <FileUp color={theme.colors.primary} size={18} />
                                <Text className="ml-2 font-semibold text-gray-800 text-xs">Pilih File</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                className="flex-1 bg-gray-800 rounded-xl p-3 ml-2 items-center flex-row justify-center shadow-sm"
                                onPress={handleDownloadTemplate}
                            >
                                <Download color="white" size={18} />
                                <Text className="ml-2 font-semibold text-white text-xs">Download Template</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Info and View Button */}
                        <View className="flex-row items-center bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
                            <View className="flex-1 mr-2">
                                <Text className="text-xs text-blue-500 font-bold mb-1">FILE TERPILIH:</Text>
                                <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
                                    {selectedFile ? selectedFile.name : 'Belum ada file'}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                className="bg-blue-600 rounded-lg px-4 py-2 flex-row items-center"
                                onPress={viewFile}
                                disabled={!selectedFile || isLoading || isSaving}
                                style={{ opacity: !selectedFile || isLoading || isSaving ? 0.5 : 1 }}
                            >
                                <Eye color="white" size={16} />
                                <Text className="text-white font-bold text-xs ml-2">View</Text>
                            </TouchableOpacity>
                        </View>

                        {error && (
                            <View className="mb-4 bg-red-50 p-4 rounded-xl border border-red-200">
                                <Text className="text-red-800 font-medium text-center">{error}</Text>
                            </View>
                        )}

                        <View>
                            {(isLoading || (isRefreshing && selectedFile)) ? (
                                <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                                    <ProductPriceUploadSkeleton />
                                </Animated.View>
                            ) : previewData.length > 0 ? (
                                <Animated.View layout={LinearTransition.springify()}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border border-gray-200 rounded-2xl bg-white" contentContainerStyle={{flexGrow: 1}}>
                                        <View>
                                            {/* Table Header */}
                                <View className="flex-row bg-gray-100 p-3 border-b border-gray-200">
                                    <Text className="w-10 text-center font-bold text-gray-700 text-xs">No</Text>
                                    <Text className="w-32 font-bold text-gray-700 text-xs">Product Code</Text>
                                    <Text className="w-48 font-bold text-gray-700 text-xs">Product Name</Text>
                                    <Text className="w-32 font-bold text-gray-700 text-xs text-right">Price (USD)</Text>
                                    <Text className="w-32 font-bold text-gray-700 text-xs text-right">Agent Price (USD)</Text>
                                    <Text className="w-32 font-bold text-gray-700 text-xs text-right">Kurs</Text>
                                    <Text className="w-40 font-bold text-gray-700 text-xs text-right">Est. IDR</Text>
                                    <Text className="w-32 font-bold text-gray-700 text-xs ml-4">Delivery Term</Text>
                                </View>
                                
                                {/* Table Body */}
                                {previewData.map((item, index) => (
                                    <View key={item.id_product} className="flex-row p-3 border-b border-gray-100 bg-white items-center">
                                        <Text className="w-10 text-center text-gray-600 text-xs">{index + 1}</Text>
                                        <Text className="w-32 text-gray-800 text-xs font-bold">{item.code_product}</Text>
                                        <Text className="w-48 text-gray-800 text-xs" numberOfLines={2}>{item.nm_product}</Text>
                                        <Text className="w-32 text-gray-600 text-xs text-right font-medium">${item.product_price}</Text>
                                        <Text className="w-32 text-gray-600 text-xs text-right font-medium">${item.product_price_agent}</Text>
                                        <Text className="w-32 text-gray-600 text-xs text-right font-medium">Rp {item.kurs}</Text>
                                        <Text className="w-40 text-emerald-600 text-xs text-right font-bold">{formatRp(item.est_idr || '0')}</Text>
                                        <Text className="w-32 text-gray-600 text-xs ml-4" numberOfLines={1}>{item.delivery_term || 'FRANCO JKT'}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </Animated.View>
                            ) : (
                                <View className="items-center justify-center py-8">
                                    <FileUp color="#d1d5db" size={48} />
                                    <Text className="text-gray-400 font-medium mt-4 text-center">
                                        Silakan pilih file XLS,{'\n'}lalu klik tombol "View" untuk melihat preview.
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Animated.View>

            {previewData.length > 0 && !isLoading && !isRefreshing && (
                <Animated.View entering={FadeInUp.duration(300)} className="flex-row pb-6">
                    <TouchableOpacity 
                        className="bg-red-50 p-4 rounded-2xl mr-3"
                        onPress={resetPreview}
                        disabled={isSaving}
                    >
                        <RefreshCcw color="#ef4444" size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-1 rounded-2xl p-4 items-center flex-row justify-center shadow-sm"
                        onPress={saveData}
                        disabled={isSaving}
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Save color="white" size={20} />
                                <Text className="ml-2 font-bold text-white text-lg">Upload Data</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            )}
            </ScrollView>
        </View>
    );
}
