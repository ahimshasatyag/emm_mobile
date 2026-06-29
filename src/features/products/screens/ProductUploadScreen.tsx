import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useProductUpload } from '../hooks/useProductUpload';
import { ProductUploadSkeleton } from '../skeleton/ProductUploadSkeleton';
import { FileUp, Download, Save, RefreshCcw, Eye } from 'lucide-react-native';
import { theme } from '../../../theme/theme';

export function ProductUploadScreen() {
    const navigation = useNavigation();
    const { 
        previewData, 
        isLoading, 
        isSaving, 
        error, 
        selectedFile,
        pickDocument, 
        viewFile,
        saveData, 
        resetPreview 
    } = useProductUpload();

    const handleDownloadTemplate = () => {
        // Ganti dengan base url Anda yang sebenarnya
        const templateUrl = 'http://your-domain.com/assets/upload/template_upload_product.xlsx';
        Linking.openURL(templateUrl);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title="UPLOAD PRODUCT" 
                showBackButton={true} 
                onBackPress={() => navigation.goBack()} 
            />

            <View className="px-4 pt-4 pb-2">
                <View className="flex-row justify-between mb-2">
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
                <View className="flex-row items-center bg-blue-50 border border-blue-100 rounded-xl p-3">
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
            </View>

            {error && (
                <View className="mx-4 mb-2 bg-red-50 p-4 rounded-xl border border-red-200">
                    <Text className="text-red-800 font-medium text-center">{error}</Text>
                </View>
            )}

            <View className="flex-1 mt-2 mb-20 mx-4">
                {isLoading ? (
                    <ProductUploadSkeleton />
                ) : previewData.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <View>
                            {/* Table Header */}
                            <View className="flex-row bg-gray-100 p-3 border-b border-gray-200">
                                <Text className="w-10 text-center font-bold text-gray-700 text-xs">No</Text>
                                <Text className="w-32 font-bold text-gray-700 text-xs">Product Code</Text>
                                <Text className="w-48 font-bold text-gray-700 text-xs">Product Name</Text>
                                <Text className="w-32 font-bold text-gray-700 text-xs">Kategori</Text>
                                <Text className="w-32 font-bold text-gray-700 text-xs">Sub Kategori</Text>
                                <Text className="w-32 font-bold text-gray-700 text-xs">Brand</Text>
                                <Text className="w-48 font-bold text-gray-700 text-xs">Deskripsi</Text>
                                <Text className="w-48 font-bold text-gray-700 text-xs">Error Message</Text>
                            </View>
                            
                            {/* Table Body */}
                            <FlatList
                                data={previewData}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View className={`flex-row p-3 border-b border-gray-100 ${!item.f_ada ? 'bg-red-50' : 'bg-white'}`}>
                                        <Text className="w-10 text-center text-gray-600 text-xs">{index + 1}</Text>
                                        <Text className={`w-32 text-xs ${!item.f_ada ? 'text-red-600 font-bold' : 'text-gray-800'}`}>{item.i_product_base}</Text>
                                        <Text className="w-48 text-gray-800 text-xs" numberOfLines={2}>{item.e_product_basename}</Text>
                                        <Text className="w-32 text-gray-600 text-xs" numberOfLines={1}>{item.e_nama_kategori}</Text>
                                        <Text className="w-32 text-gray-600 text-xs" numberOfLines={1}>{item.e_nama_sub_kategori}</Text>
                                        <Text className="w-32 text-gray-600 text-xs" numberOfLines={1}>{item.e_brand_name}</Text>
                                        <Text className="w-48 text-gray-600 text-xs" numberOfLines={2}>{item.e_product_name}</Text>
                                        <Text className="w-48 text-red-500 font-medium text-xs" numberOfLines={2}>{item.e_remark}</Text>
                                    </View>
                                )}
                            />
                        </View>
                    </ScrollView>
                ) : (
                    <View className="flex-1 items-center justify-center pt-10">
                        <FileUp color="#d1d5db" size={64} />
                        <Text className="text-gray-400 font-medium mt-4 text-center">
                            Silakan pilih file CSV/Excel,{'\n'}lalu klik tombol "View" untuk melihat tabel preview.
                        </Text>
                    </View>
                )}
            </View>

            {previewData.length > 0 && !isLoading && (
                <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex-row">
                    <TouchableOpacity 
                        className="bg-red-50 p-4 rounded-xl mr-3"
                        onPress={resetPreview}
                        disabled={isSaving}
                    >
                        <RefreshCcw color="#ef4444" size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-1 rounded-xl p-4 items-center flex-row justify-center shadow-sm"
                        onPress={saveData}
                        disabled={isSaving}
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Save color="white" size={20} />
                                <Text className="ml-2 font-bold text-white text-lg">Simpan Data</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
