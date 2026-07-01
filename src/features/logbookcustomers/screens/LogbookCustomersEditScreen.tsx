import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Save, Edit3, Trash2, X } from 'lucide-react-native';
import { Dropdown } from "react-native-element-dropdown";
import Animated, { FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { fetchLogbookCustomerDetail, clearCurrent } from '../stores/logbookcustomersSlice';
import { RootState, AppDispatch } from '../../../stores';
import { LogbookCustomersEditSkeleton } from '../skeleton/LogbookCustomersEditSkeleton';
import { useLogbookCustomersForm } from '../hooks/useLogbookCustomersForm';
import { logbookCustomersApi } from '../api/logbookCustomersApi';
import { dummyCustomersDropdown } from '../data/dummyCustomers';

export function LogbookCustomersEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dispatch = useDispatch<AppDispatch>();
    
    const { id } = route.params || {};
    const { current, isLoading } = useSelector((state: RootState) => state.logbookcustomers || { current: null, isLoading: false });
    
    const [isEditing, setIsEditing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form Hook
    const { formData, updateField, validate } = useLogbookCustomersForm(current || undefined);

    useEffect(() => {
        if (id) {
            loadData();
        }
        return () => { dispatch(clearCurrent()); };
    }, [id]);

    useEffect(() => {
        if (current) {
            updateField('id_customers', current.id_customers);
            updateField('masalah', current.masalah);
            updateField('solusi', current.solusi);
            updateField('catatan', current.catatan);
            updateField('date_log_book', current.date_log_book);
        }
    }, [current]);

    const loadData = async () => {
        await dispatch(fetchLogbookCustomerDetail(id));
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const handleUpdate = async () => {
        const errorMsg = validate();
        if (errorMsg) {
            Alert.alert("Perhatian", errorMsg);
            return;
        }
        
        setIsSaving(true);
        try {
            await logbookCustomersApi.update(id, formData);
            Alert.alert("Sukses", "Data berhasil diupdate!", [
                { text: "OK", onPress: () => setIsEditing(false) }
            ]);
            await loadData();
        } catch (e) {
            Alert.alert("Error", "Gagal mengupdate data.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Apakah anda yakin ?",
            "Anda tidak akan dapat memulihkan data ini!",
            [
                { text: "Tidak, batalkan!", style: "cancel" },
                { 
                    text: "Ya, hapus!", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logbookCustomersApi.delete(id);
                            Alert.alert("Dihapus!", "Data berhasil dihapus");
                            navigation.goBack();
                        } catch (e) {
                            Alert.alert("Error", "Gagal menghapus data.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title={isLoading || isRefreshing ? "MEMUAT DATA..." : (isEditing ? "EDIT LOGBOOK CUSTOMERS" : "DETAIL LOGBOOK CUSTOMERS")}
                showBackButton={true}
                onBackPress={() => {
                    if (isEditing) {
                        setIsEditing(false);
                    } else {
                        navigation.goBack();
                    }
                }}
                disableAnimation={true}
            />

            <View style={{ padding: 12, flex: 1, paddingBottom: 0 }}>
                <ScrollView 
                    className="flex-1" 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#0ea5e9']} />
                    }
                >
                    {(isLoading || isRefreshing) ? (
                        <LogbookCustomersEditSkeleton />
                    ) : (
                        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                            
                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Customer <Text className="text-red-500">*</Text></Text>
                                <View className={`border border-gray-300 rounded-lg justify-center h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                    <Dropdown
                                        style={{ paddingHorizontal: 12 }}
                                        data={dummyCustomersDropdown}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Customer"
                                        value={formData.id_customers}
                                        onChange={(item) => updateField('id_customers', item.value)}
                                        selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                        disable={!isEditing}
                                    />
                                </View>
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Date</Text>
                                <View className="bg-gray-100 px-3 justify-center border border-gray-200 rounded-lg h-[42px]">
                                    <Text className="text-sm text-gray-800">{formData.date_log_book}</Text>
                                </View>
                            </View>

                            <View className="h-px bg-gray-200 mb-5" />

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Problem <Text className="text-red-500">*</Text></Text>
                                <TextInput 
                                    className={`p-3 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                                    multiline
                                    value={formData.masalah}
                                    onChangeText={(t) => updateField('masalah', t)}
                                    editable={isEditing}
                                    placeholder="Jelaskan masalah..."
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Solution <Text className="text-red-500">*</Text></Text>
                                    <TextInput 
                                    className={`p-3 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                                    multiline
                                    value={formData.solusi}
                                    onChangeText={(t) => updateField('solusi', t)}
                                    editable={isEditing}
                                    placeholder="Jelaskan solusi..."
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-xs font-bold text-gray-700 mb-2">Note</Text>
                                    <TextInput 
                                    className={`p-3 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                                    multiline
                                    value={formData.catatan}
                                    onChangeText={(t) => updateField('catatan', t)}
                                    editable={isEditing}
                                    placeholder="Tambahan catatan..."
                                />
                            </View>
                            
                            {/* Actions */}
                            <Animated.View entering={FadeInUp.delay(100)} className="mt-4 flex-row gap-4">
                                {!isEditing ? (
                                    <>
                                        <Button 
                                            onPress={() => setIsEditing(true)}
                                            className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
                                            style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                        >
                                            <Edit3 color="white" size={20} className="mr-2" />
                                            <Text className="text-white font-bold text-lg">Edit</Text>
                                        </Button>
                                        <Button 
                                            onPress={handleDelete}
                                            className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-red-600"
                                            style={{ elevation: 4, shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                        >
                                            <Trash2 color="white" size={20} className="mr-2" />
                                            <Text className="text-white font-bold text-lg">Hapus</Text>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            onPress={() => setIsEditing(false)}
                                            className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                        >
                                            <X color={theme.colors.primary} size={20} className="mr-2" />
                                            <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                        </Button>
                                        <Button 
                                            onPress={handleUpdate}
                                            disabled={isSaving}
                                            className={`flex-1 h-14 rounded-2xl flex-row items-center justify-center ${isSaving ? 'bg-gray-400' : 'bg-green-600'}`}
                                            style={isSaving ? {} : { elevation: 4, shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                        >
                                            <Save color="white" size={20} className="mr-2" />
                                            <Text className="text-white font-bold text-lg">{isSaving ? 'Menyimpan...' : 'Simpan'}</Text>
                                        </Button>
                                    </>
                                )}
                            </Animated.View>

                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}
