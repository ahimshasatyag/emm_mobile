import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Check, X, Save, Edit3 } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useSalesRetur } from '../hooks/useSalesRetur';
import Animated, { FadeInDown, FadeOut, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { SalesReturItem } from '../types/salesretur.types';
import { SalesReturEditSkeleton } from '../skeleton/SalesReturEditSkeleton';

export function SalesReturEditScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { id } = route.params;

    const { currentRetur, getCustomers, getDOByCustomer, getDODetails, updateRetur, loadReturById, clearRetur } = useSalesRetur();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [customers, setCustomers] = useState<any[]>([]);
    const [doList, setDoList] = useState<any[]>([]);
    const [items, setItems] = useState<SalesReturItem[]>([]);

    const [selectedCustomer, setSelectedCustomer] = useState<string>('');
    const [selectedDO, setSelectedDO] = useState<string>('');
    const [tanggal, setTanggal] = useState<string>('');
    const [keterangan, setKeterangan] = useState('');

    useEffect(() => {
        loadData();
        return () => clearRetur();
    }, [id]);

    const resetForm = () => {
        if (currentRetur) {
            setSelectedCustomer(currentRetur.id_customers);
            setSelectedDO(currentRetur.id_do);
            setTanggal(currentRetur.date || new Date().toISOString().split('T')[0]);
            setKeterangan(currentRetur.keterangan || '');

            if (currentRetur.items) {
                setItems(currentRetur.items);
            }
        }
    };

    useEffect(() => {
        resetForm();
    }, [currentRetur]);

    useEffect(() => {
        if (selectedCustomer) {
            getDOByCustomer(selectedCustomer).then(setDoList);
        }
    }, [selectedCustomer]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                loadReturById(id),
                getCustomers().then(setCustomers)
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = () => {
        loadData();
    };

    const handleCustomerChange = async (val: string) => {
        setSelectedCustomer(val);
        setSelectedDO('');
        setItems([]);
    };

    const handleDOChange = async (val: string) => {
        setSelectedDO(val);
        try {
            const details = await getDODetails(val);
            setItems(details.map((d: any) => ({ ...d, selected: true })));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleItem = (index: number) => {
        if (!isEditing) return;
        const newItems = [...items];
        newItems[index] = { ...newItems[index], selected: !newItems[index].selected };
        setItems(newItems);
    };

    const handleSave = async () => {
        if (!selectedCustomer) {
            Alert.alert("Warning", "Pilih Customer terlebih dahulu");
            return;
        }
        if (!selectedDO) {
            Alert.alert("Warning", "Pilih DO terlebih dahulu");
            return;
        }

        const selectedItems = items.filter(item => item.selected);
        if (selectedItems.length === 0) {
            Alert.alert("Warning", "Pilih minimal 1 barang untuk diretur");
            return;
        }

        setIsSaving(true);
        try {
            await updateRetur(id, {
                id_customers: selectedCustomer,
                id_do: selectedDO,
                date: tanggal,
                keterangan,
                items: selectedItems
            });
            Alert.alert("Success", "Sales Retur berhasil diperbarui", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Gagal menyimpan");
        } finally {
            setIsSaving(false);
        }
    };

    const canEdit = currentRetur?.status === 'DRAFT';

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : (isEditing ? "EDIT SALES RETUR" : "DETAIL SALES RETUR")}
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
                            <SalesReturEditSkeleton />
                        </Animated.View>
                    ) : currentRetur ? (
                        <Animated.View key="content" entering={FadeInDown.duration(400).delay(200)}>
                            <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">

                                <View className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <Text className="text-gray-500 text-xs">No. Retur</Text>
                                    <Text className="text-gray-800 font-semibold">{currentRetur.code_sr}</Text>
                                </View>

                                {/* Customer Selection */}
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-medium mb-2 text-sm">Customer <Text className="text-red-500">*</Text></Text>
                                    <Dropdown
                                        style={{
                                            height: 45,
                                            backgroundColor: !isEditing ? '#f3f4f6' : '#f9fafb',
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
                                        disable={!isEditing}
                                    />
                                </View>

                                {/* DO Selection */}
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-medium mb-2 text-sm">Delivery Order <Text className="text-red-500">*</Text></Text>
                                    <Dropdown
                                        style={{
                                            height: 45,
                                            backgroundColor: !isEditing ? '#f3f4f6' : '#f9fafb',
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
                                        disable={!isEditing || !selectedCustomer}
                                    />
                                </View>

                                {/* Date Selection */}
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-medium mb-2 text-sm">Tanggal Retur <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className={`border border-gray-200 rounded-lg px-4 py-3 text-sm ${!isEditing ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-800'}`}
                                        value={tanggal}
                                        onChangeText={setTanggal}
                                        editable={isEditing}
                                    />
                                </View>

                                {/* Keterangan */}
                                <View className="mb-6">
                                    <Text className="text-gray-700 font-medium mb-2 text-sm">Keterangan</Text>
                                    <TextInput
                                        className={`border border-gray-200 rounded-lg px-4 py-3 text-sm min-h-[100px] ${!isEditing ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-800'}`}
                                        placeholder="Masukkan keterangan retur..."
                                        placeholderTextColor="#9ca3af"
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        value={keterangan}
                                        onChangeText={setKeterangan}
                                        editable={isEditing}
                                    />
                                </View>

                                {/* Items List */}
                                {items.length > 0 && (
                                    <View className="mb-8">
                                        <Text className="text-gray-700 font-semibold mb-3 text-sm">Barang Retur <Text className="text-red-500">*</Text></Text>
                                        {items.map((item, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                activeOpacity={isEditing ? 0.7 : 1}
                                                onPress={() => toggleItem(index)}
                                                className={`flex-row items-center p-3 mb-2 rounded-xl border ${item.selected && isEditing ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                                            >
                                                {isEditing && (
                                                    <View className={`w-5 h-5 rounded flex items-center justify-center mr-3 border ${item.selected ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'}`}>
                                                        {item.selected && <Check size={14} color="#fff" />}
                                                    </View>
                                                )}
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

                            {canEdit && (
                                <Animated.View entering={FadeInUp.delay(100)} className="mt-10">
                                    {!isEditing ? (
                                        <Button
                                            onPress={() => setIsEditing(true)}
                                            className="w-full h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
                                            style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                        >
                                            <Edit3 color="white" size={20} className="mr-2" />
                                            <Text className="text-white font-bold text-lg">Edit</Text>
                                        </Button>
                                    ) : (
                                        <View className="flex-row gap-4">
                                            <Button
                                                variant="outline"
                                                onPress={() => {
                                                    setIsEditing(false);
                                                    resetForm();
                                                }}
                                                className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                            >
                                                <X color={theme.colors.primary} size={20} className="mr-2" />
                                                <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                            </Button>
                                            <Button
                                                onPress={handleSave}
                                                disabled={isSaving}
                                                className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-green-600"
                                                style={{ elevation: 4, shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
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
                                        </View>
                                    )}
                                </Animated.View>
                            )}
                        </Animated.View>
                    ) : null}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
