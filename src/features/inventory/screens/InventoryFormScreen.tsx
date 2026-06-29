import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save, ChevronLeft, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useInventory } from '../hooks/useInventory';
import { InventoryStatus } from '../types/inventory.types';
import { Button } from '../../../components/ui/button';

export function InventoryFormScreen() {
    const navigation = useNavigation();
    const { types, categories, createAsset, fetchInitialData } = useInventory();

    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState('');
    const [typeId, setTypeId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [procuredDate, setProcuredDate] = useState(new Date().toISOString().split('T')[0]);
    const [purchasedDate, setPurchasedDate] = useState(new Date().toISOString().split('T')[0]);
    const [deskripsi, setDeskripsi] = useState('');
    const [serial, setSerial] = useState('');
    const [status, setStatus] = useState<InventoryStatus>('active');

    const [serialNumbers, setSerialNumbers] = useState([{ name_sn: '', serial_number: '' }]);
    const [fPrint, setFPrint] = useState('');

    useEffect(() => {
        if (types.length === 0 || categories.length === 0) {
            fetchInitialData();
        }
    }, []);

    const selectedCategoryName = categories.find(c => c.id === categoryId)?.name || '';
    const isVehicle = selectedCategoryName === 'Mobil' || selectedCategoryName === 'Motor';
    const labelProcured = isVehicle ? 'BPKB Date' : 'Procured Date';
    const labelPurchased = isVehicle ? 'STNK Date' : 'Purchase Date';

    const handleAddSerialNumber = () => {
        setSerialNumbers([...serialNumbers, { name_sn: '', serial_number: '' }]);
    };

    const handleRemoveSerialNumber = (index: number) => {
        const newSerials = [...serialNumbers];
        if (fPrint === newSerials[index].serial_number) setFPrint('');
        newSerials.splice(index, 1);
        setSerialNumbers(newSerials);
    };

    const handleSerialNumberChange = (index: number, field: 'name_sn' | 'serial_number', value: string) => {
        const newSerials = [...serialNumbers];
        newSerials[index][field] = value;
        setSerialNumbers(newSerials);
    };

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Error', 'Harap isi nama aset.');
            return;
        }

        setIsSaving(true);
        try {
            await createAsset({
                name,
                inventory_type_id: typeId,
                inventory_category_id: categoryId,
                procured_date: procuredDate,
                purchased_date: purchasedDate,
                deskripsi,
                serial,
                status,
                f_print: fPrint,
                serialNumbers: serialNumbers.filter(sn => sn.name_sn && sn.serial_number)
            });
            Alert.alert('Sukses', 'Data inventaris berhasil ditambahkan', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Gagal menyimpan data');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-gray-50">
            <HeaderNavigator title="TAMBAH INVENTARIS" showBackButton={true} onBackPress={() => navigation.goBack()} />

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInUp.delay(100).springify()}>
                    <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                        <View className="mb-5">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Assets Name <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium"
                                value={name}
                                onChangeText={setName}
                                placeholder="Masukkan nama aset"
                            />
                        </View>

                        <View className="mb-5">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Serial Number</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium"
                                value={serial}
                                onChangeText={setSerial}
                                placeholder="Induk Serial Number"
                            />
                        </View>
                        <View className="mb-5">
                            <Text className="text-sm font-bold text-gray-700 mb-2">Status <Text className="text-red-500">*</Text></Text>
                            <View className="border border-gray-200 rounded-xl bg-gray-50">
                                <Dropdown
                                    style={{ height: 56, paddingHorizontal: 16 }}
                                    data={[
                                        { label: 'Active', value: 'active' },
                                        { label: 'Normal', value: 'normal' },
                                        { label: 'Not Assigned', value: 'not_assigned' },
                                        { label: 'Sold', value: 'sold' },
                                        { label: 'Rusak', value: 'rusak' }
                                    ]}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Status"
                                    value={status}
                                    onChange={item => setStatus(item.value as InventoryStatus)}
                                    placeholderStyle={{ color: '#9CA3AF' }}
                                />
                            </View>
                        </View>
                    </View>


                    <Button
                        onPress={handleSave}
                        disabled={isSaving}
                        className="h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600 mb-8"
                        style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <CheckCircle2 color="white" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">Simpan Aset</Text>
                            </>
                        )}
                    </Button>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
