import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Check, X, Save } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useSalesRetur } from '../hooks/useSalesRetur';
import Animated, { FadeInDown, FadeOut, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { SalesReturItem } from '../types/salesretur.types';
import { SalesReturFormSkeleton } from '../skeleton/SalesReturFormSkeleton';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages } from '../../../components/ui/ToastMessages';

export function SalesReturFormScreen() {
    const navigation = useNavigation();
    const { getCustomers, getDOByCustomer, getDODetails, createRetur, validateForm } = useSalesRetur();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [customers, setCustomers] = useState<any[]>([]);
    const [doList, setDoList] = useState<any[]>([]);
    const [items, setItems] = useState<SalesReturItem[]>([]);

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ visible: boolean; type: 'success' | 'error' | 'warning' | 'info'; message: string }>({
        visible: false,
        type: 'info',
        message: ''
    });

    const [selectedCustomer, setSelectedCustomer] = useState<string>('');
    const [selectedDO, setSelectedDO] = useState<string>('');
    const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
    const [keterangan, setKeterangan] = useState('');

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = () => {
        setSelectedCustomer('');
        setSelectedDO('');
        setItems([]);
        setKeterangan('');
        setTanggal(new Date().toISOString().split('T')[0]);
        setIsLoading(true);
        loadInitialData();
    };

    const handleCustomerChange = async (val: string) => {
        setSelectedCustomer(val);
        setSelectedDO('');
        setItems([]);

        try {
            const dos = await getDOByCustomer(val);
            setDoList(dos);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDOChange = async (val: string) => {
        setSelectedDO(val);
        try {
            const details = await getDODetails(val);
            setItems(details.map((d: any) => ({ ...d, selected: false })));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleItem = (index: number) => {
        const newItems = [...items];
        newItems[index].selected = !newItems[index].selected;
        setItems(newItems);
    };

    const handleSave = () => {
        const selectedItems = items.filter(item => item.selected);
        const errorMsg = validateForm(selectedCustomer, selectedDO, selectedItems);

        if (errorMsg) {
            setToastConfig({ visible: true, type: 'warning', message: errorMsg });
            return;
        }

        setConfirmVisible(true);
    };

    const executeSave = async () => {
        setConfirmVisible(false);
        setIsSaving(true);
        try {
            const res = await createRetur({
                id_customers: selectedCustomer,
                id_do: selectedDO,
                date: tanggal,
                keterangan,
                items: items.filter(item => item.selected)
            });
            navigation.replace('SalesReturEdit' as never, { id: res.id, showSuccessToast: true } as never);
        } catch (error: any) {
            setToastConfig({ visible: true, type: 'error', message: error.message || "Gagal menyimpan" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toastConfig.visible}
                type={toastConfig.type}
                message={toastConfig.message}
                onClose={() => setToastConfig(prev => ({ ...prev, visible: false }))}
            />
            <ModalConfirm
                visible={confirmVisible}
                title="Konfirmasi Simpan"
                message="Apakah Anda yakin ingin menyimpan data Sales Retur ini?"
                onConfirm={executeSave}
                onCancel={() => setConfirmVisible(false)}
            />
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : "TAMBAH SALES RETUR"}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
                >
                    {isLoading ? (
                        <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                            <SalesReturFormSkeleton />
                        </Animated.View>
                    ) : (
                        <Animated.View key="content" entering={FadeInDown.duration(400).delay(200)}>
                            <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                                {/* Customer Selection */}
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-medium mb-2 text-sm">Customer <Text className="text-red-500">*</Text></Text>
                                    <Dropdown
                                        style={{
                                            height: 45,
                                            backgroundColor: '#f9fafb',
                                            borderRadius: 8,
                                            paddingHorizontal: 12,
                                            borderWidth: 1,
                                            borderColor: '#e5e7eb',
                                        }}
                                        data={customers}
                                        search
                                        searchPlaceholder="Cari customer..."
                                        labelField="nm_customers"
                                        valueField="id_customers"
                                        placeholder="Pilih Customer"
                                        value={selectedCustomer}
                                        onChange={item => handleCustomerChange(item.id_customers)}
                                    />
                                </View>

                                {/* DO Selection */}
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-medium mb-2 text-sm">Delivery Order <Text className="text-red-500">*</Text></Text>
                                    <Dropdown
                                        style={{
                                            height: 45,
                                            backgroundColor: '#f9fafb',
                                            borderRadius: 8,
                                            paddingHorizontal: 12,
                                            borderWidth: 1,
                                            borderColor: '#e5e7eb',
                                        }}
                                        data={doList}
                                        search
                                        searchPlaceholder="Cari DO..."
                                        labelField="code_do"
                                        valueField="id_do"
                                        placeholder="Pilih DO"
                                        value={selectedDO}
                                        onChange={item => handleDOChange(item.id_do)}
                                        disable={!selectedCustomer}
                                    />
                                </View>

                                {/* Date Selection */}
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-medium mb-2 text-sm">Tanggal Retur <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700"
                                        value={tanggal}
                                        editable={false}
                                    />
                                </View>

                                {/* Keterangan */}
                                <View className="mb-6">
                                    <Text className="text-gray-700 font-medium mb-2 text-sm">Keterangan</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-sm min-h-[100px]"
                                        placeholder="Masukkan keterangan retur..."
                                        placeholderTextColor="#9ca3af"
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        value={keterangan}
                                        onChangeText={setKeterangan}
                                    />
                                </View>

                                {/* Items List */}
                                {items.length > 0 && (
                                    <View className="mb-8">
                                        <Text className="text-gray-700 font-semibold mb-3 text-sm">Barang Retur <Text className="text-red-500">*</Text></Text>
                                        {items.map((item, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                activeOpacity={0.7}
                                                onPress={() => toggleItem(index)}
                                                className={`flex-row items-center p-3 mb-2 rounded-xl border ${item.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                                            >
                                                <View className={`w-5 h-5 rounded flex items-center justify-center mr-3 border ${item.selected ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'}`}>
                                                    {item.selected && <Check size={14} color="#fff" />}
                                                </View>
                                                <View className="flex-1">
                                                    <Text className={`font-semibold text-sm ${item.selected ? 'text-gray-900' : 'text-gray-800'}`}>
                                                        {item.code_product}
                                                    </Text>
                                                    <Text className={`text-sm mt-0.5 ${item.selected ? 'text-gray-700' : 'text-gray-600'}`}>
                                                        {item.nm_product}
                                                    </Text>
                                                    <Text className="text-xs text-gray-500 mt-0.5">SN: {item.nbarcode}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <Animated.View entering={FadeInUp.delay(100)} className="mt-10">
                                <Button
                                    onPress={handleSave}
                                    disabled={isSaving}
                                    className="w-full h-14 rounded-2xl flex-row items-center justify-center mb-8"
                                    style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Save color="white" size={20} className="mr-2" />
                                            <Text className="text-white font-bold text-lg">Simpan</Text>
                                        </>
                                    )}
                                </Button>
                            </Animated.View>
                        </Animated.View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
