import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Save, X } from 'lucide-react-native';
import { Dropdown } from "react-native-element-dropdown";
import Animated, { FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { useLogbookCustomersForm } from '../hooks/useLogbookCustomersForm';
import { logbookCustomersApi } from '../api/logbookCustomersApi';
import { dummyCustomersDropdown } from '../data/dummyCustomers';
import { LogbookCustomersFormSkeleton } from '../skeleton/LogbookCustomersFormSkeleton';

export function LogbookCustomersFormScreen() {
    const navigation = useNavigation<any>();
    const { formData, updateField, validate } = useLogbookCustomersForm();
    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            const initialize = async () => {
                setIsInitializing(true);
                await new Promise(resolve => setTimeout(resolve, 800));
                if (isActive) setIsInitializing(false);
            };
            initialize();
            return () => { isActive = false; setIsInitializing(true); };
        }, [])
    );

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsRefreshing(false);
    };

    const handleSave = async () => {
        const errorMsg = validate();
        if (errorMsg) {
            Alert.alert("Perhatian", errorMsg);
            return;
        }
        
        setIsSaving(true);
        try {
            await logbookCustomersApi.create(formData);
            Alert.alert("Sukses", "Data berhasil disimpan!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert("Error", "Gagal menyimpan data.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title={(isInitializing || isRefreshing) ? "MEMUAT DATA..." : "TAMBAH LOGBOOK CUSTOMERS"}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
                disableAnimation={true}
                isLoading={isInitializing || isRefreshing}
            />

            <View style={{ padding: 12, flex: 1, paddingBottom: 0 }}>
                <ScrollView 
                    className="flex-1" 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                    }
                >
                    {(isInitializing || isRefreshing) ? (
                        <LogbookCustomersFormSkeleton />
                    ) : (
                        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                        
                        <View className="mb-5">
                            <Text className="text-xs font-bold text-gray-700 mb-2">Customer <Text className="text-red-500">*</Text></Text>
                            <View className="border border-gray-300 rounded-lg justify-center h-[42px] bg-white">
                                <Dropdown
                                    style={{ paddingHorizontal: 12 }}
                                    data={dummyCustomersDropdown}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Customer"
                                    value={formData.id_customers}
                                    onChange={(item) => updateField('id_customers', item.value)}
                                    selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
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
                                className="bg-white p-3 border border-gray-300 rounded-lg text-sm text-gray-800"
                                style={{ minHeight: 80, textAlignVertical: 'top' }}
                                multiline
                                value={formData.masalah}
                                onChangeText={(t) => updateField('masalah', t)}
                                placeholder="Jelaskan masalah..."
                            />
                        </View>

                        <View className="mb-5">
                            <Text className="text-xs font-bold text-gray-700 mb-2">Solution <Text className="text-red-500">*</Text></Text>
                            <TextInput 
                                className="bg-white p-3 border border-gray-300 rounded-lg text-sm text-gray-800"
                                style={{ minHeight: 80, textAlignVertical: 'top' }}
                                multiline
                                value={formData.solusi}
                                onChangeText={(t) => updateField('solusi', t)}
                                placeholder="Jelaskan solusi..."
                            />
                        </View>

                        <View className="mb-5">
                            <Text className="text-xs font-bold text-gray-700 mb-2">Note</Text>
                            <TextInput 
                                className="bg-white p-3 border border-gray-300 rounded-lg text-sm text-gray-800"
                                style={{ minHeight: 80, textAlignVertical: 'top' }}
                                multiline
                                value={formData.catatan}
                                onChangeText={(t) => updateField('catatan', t)}
                                placeholder="Tambahan catatan..."
                            />
                        </View>
                        
                        {/* Actions */}
                        <Animated.View entering={FadeInUp.delay(100)} className="mt-4 flex-row gap-4">
                            <Button
                                variant="outline"
                                onPress={() => navigation.goBack()}
                                className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                            >
                                <X color={theme.colors.primary} size={20} className="mr-2" />
                                <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                            </Button>
                            <Button 
                                onPress={handleSave}
                                disabled={isSaving}
                                className={`flex-1 h-14 rounded-2xl flex-row items-center justify-center ${isSaving ? 'bg-gray-400' : 'bg-green-600'}`}
                                style={isSaving ? {} : { elevation: 4, shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                <Save color="white" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">{isSaving ? 'Menyimpan...' : 'Simpan'}</Text>
                            </Button>
                        </Animated.View>

                    </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}
