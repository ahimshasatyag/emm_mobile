import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useSopForm } from '../hooks/useSopForm';
import { SopEditSkeleton } from '../skeleton/SopEditSkeleton';
import { SopTableRevisi } from '../components/SopTableRevisi';
import { Save, Upload, Pencil, CheckCircle, RefreshCcw, Download } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInUp } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';

type RootStackParamList = {
    SopEditScreen: { id_sop: string };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SopEditRouteProp = RouteProp<RootStackParamList, 'SopEditScreen'>;

export const SopEditScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<SopEditRouteProp>();
    const { id_sop } = route.params;

    const {
        formData,
        handleChange,
        handleSave,
        handleConfirm,
        handleRevisi,
        isSaving,
        loading,
        isRefreshing,
        onRefresh,
        currentSop
    } = useSopForm(id_sop);

    const [isEditMode, setIsEditMode] = useState(false);

    const onSavePress = () => {
        handleSave(() => {
            setIsEditMode(false);
        });
    };

    const statusColor = () => {
        switch (currentSop?.status) {
            case 'DRAFT': return 'bg-gray-100 text-gray-700';
            case 'IN PROGRESS': return 'bg-orange-100 text-orange-700';
            case 'FINALIZE': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : (isEditMode ? `EDIT DAFTAR INDUK DOCUMENT ${formData.divisi}` : `DETAIL DAFTAR INDUK DOCUMENT ${formData.divisi}`)} showBackButton={true} />
            <ScrollView
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {(loading || isRefreshing) ? (
                    <SopEditSkeleton />
                ) : (
                    <Animated.View entering={FadeIn.duration(600)} exiting={FadeOut}>

                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                            {/* Status Bar */}
                            {!isEditMode && (
                                <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                    <Text className="text-gray-500 font-bold">Status Dokumen</Text>
                                    <View className={`px-3 py-1 rounded-full ${statusColor().split(' ')[0]}`}>
                                        <Text className={`text-xs font-bold ${statusColor().split(' ')[1]}`}>{currentSop?.status}</Text>
                                    </View>
                                </View>
                            )}
                            {/* Divisi */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Divisi</Text>
                                <Text className="text-gray-800 font-bold text-base">{formData.divisi}</Text>
                            </View>

                            {/* No Document */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">No Document <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`border border-gray-200 rounded-lg p-3 ${isEditMode ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500'}`}
                                    value={formData.code_sop}
                                    onChangeText={(val) => handleChange('code_sop', val)}
                                    editable={isEditMode}
                                />
                            </View>

                            {/* Nama Document */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Nama Document <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`border border-gray-200 rounded-lg p-3 ${isEditMode ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500'}`}
                                    value={formData.nm_sop}
                                    onChangeText={(val) => handleChange('nm_sop', val)}
                                    editable={isEditMode}
                                />
                            </View>

                            {/* File PDF */}
                            <View className="mb-2">
                                <Text className="text-gray-700 text-sm mb-1">File PDF <Text className="text-red-500">*</Text></Text>
                                {isEditMode ? (
                                    <TouchableOpacity
                                        className="border-2 border-dashed border-gray-300 rounded-lg h-32 items-center justify-center bg-gray-50"
                                        onPress={() => handleChange('file_pdf', 'dummy_uploaded_file_v2.pdf')}
                                    >
                                        {formData.file_pdf ? (
                                            <>
                                                <Text className="text-gray-700 font-bold mb-1">{formData.file_pdf}</Text>
                                                <Text className="text-gray-500 text-xs">Tap to change file</Text>
                                            </>
                                        ) : (
                                            <>
                                                <Upload color="#9ca3af" size={32} className="mb-2" />
                                                <Text className="text-gray-500 font-medium">Upload File PDF</Text>
                                                <Text className="text-gray-400 text-xs mt-1">Max size 1MB</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                ) : (
                                    <View className="bg-gray-100 p-4 rounded-lg flex-row justify-between items-center">
                                        <Text className="text-gray-700 flex-1 mr-2" numberOfLines={1}>{formData.file_pdf || 'Belum ada file'}</Text>
                                        {formData.file_pdf && (
                                            <TouchableOpacity
                                                style={{ backgroundColor: theme.colors.primary }}
                                                className="px-4 py-2 rounded-lg flex-row items-center"
                                            >
                                                <Download color="white" size={16} className="mr-2" />
                                                <Text className="text-white font-bold text-sm">Download</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            </View>
                            {/* Action Buttons based on status and edit mode */}
                            <Animated.View entering={FadeInUp.delay(100)} className="mt-4">
                                {isEditMode ? (
                                    <View className="flex-row gap-4 mt-2">
                                        <TouchableOpacity
                                            onPress={() => setIsEditMode(false)}
                                            className="flex-1 py-4 rounded-xl items-center justify-center bg-gray-100"
                                        >
                                            <Text className="text-gray-700 font-bold text-lg">Batal</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={onSavePress}
                                            disabled={isSaving}
                                            className="flex-1 py-4 rounded-xl flex-row items-center justify-center"
                                            style={{ backgroundColor: theme.colors.primary }}
                                        >
                                            {isSaving ? (
                                                <ActivityIndicator color="white" />
                                            ) : (
                                                <>
                                                    <Save color="white" size={20} className="mr-2" />
                                                    <Text className="text-white font-bold text-lg">Update</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View className="flex-row gap-3 flex-wrap">
                                        {(currentSop?.status === 'DRAFT' || currentSop?.status === 'IN PROGRESS') && (
                                            <>
                                                <TouchableOpacity
                                                    onPress={() => setIsEditMode(true)}
                                                    className="flex-1 min-w-[45%] h-14 rounded-xl flex-row items-center justify-center bg-blue-50 border border-blue-200"
                                                >
                                                    <Pencil color={theme.colors.primary} size={20} className="mr-2" />
                                                    <Text style={{ color: theme.colors.primary }} className="font-bold text-base">Edit</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => handleConfirm()}
                                                    disabled={isSaving}
                                                    className="flex-1 min-w-[45%] h-14 rounded-xl flex-row items-center justify-center bg-green-500"
                                                >
                                                    {isSaving ? <ActivityIndicator color="white" /> : (
                                                        <>
                                                            <CheckCircle color="white" size={20} className="mr-2" />
                                                            <Text className="text-white font-bold text-base">Confirm</Text>
                                                        </>
                                                    )}
                                                </TouchableOpacity>
                                            </>
                                        )}

                                        {currentSop?.status === 'FINALIZE' && (
                                            <TouchableOpacity
                                                onPress={() => setIsEditMode(true)}
                                                disabled={isSaving}
                                                className="flex-1 h-14 rounded-xl flex-row items-center justify-center bg-orange-500"
                                            >
                                                {isSaving ? <ActivityIndicator color="white" /> : (
                                                    <>
                                                        <Pencil color="white" size={20} className="mr-2" />
                                                        <Text className="text-white font-bold text-lg">Revisi</Text>
                                                    </>
                                                )}
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            </Animated.View>

                            {/* History Section */}
                            {!isEditMode && currentSop?.history && (
                                <SopTableRevisi history={currentSop.history} />
                            )}
                        </View>

                        {!isEditMode && <View className="h-20" />}</Animated.View>
                )}
            </ScrollView>
        </View>
    );
};
