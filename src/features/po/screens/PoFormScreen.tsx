import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Dropdown } from 'react-native-element-dropdown';
import { PoFormSkeleton } from '../skeleton/PoFormSkeleton';
import { PoTable } from '../components/PoTable';
import { usePo } from '../hooks/usePo';
import Animated, { FadeInUp, FadeInDown, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';

export function PoFormScreen() {
    const navigation = useNavigation<any>();
    const { handleSave, isSaving } = usePo();
    const [isInitializing, setIsInitializing] = useState(true);

    const [form, setForm] = useState({
        date_po: new Date().toISOString().split('T')[0],
        id_suppliers: '',
        nm_suppliers: '',
        id_gudang: '',
        id_mata_uang: 'IDR'
    });

    const [details, setDetails] = useState<any[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitializing(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const suppliersOptions = [
        { label: 'PT. Maju Mundur', value: 'SUP-01' },
        { label: 'CV. Sukses Selalu', value: 'SUP-02' },
    ];

    const gudangOptions = [
        { label: 'Gudang Utama', value: 'GDG-01' },
        { label: 'Gudang Cabang', value: 'GDG-02' },
    ];

    const currencyOptions = [
        { label: 'IDR - Rupiah', value: 'IDR' },
        { label: 'USD - US Dollar', value: 'USD' },
    ];

    const onAddDetail = () => {
        const newProduct = {
            id_product: 'PRD-' + Math.floor(Math.random() * 100),
            code_product: 'BRG-' + Math.floor(Math.random() * 100),
            nm_product: 'Produk Dummy ' + Math.floor(Math.random() * 10),
            qty: 1,
            product_price: 150000,
            satuan: 'Pcs'
        };
        setDetails([...details, newProduct]);
    };

    const onRemoveDetail = (index: number) => {
        const newDetails = [...details];
        newDetails.splice(index, 1);
        setDetails(newDetails);
    };

    const onSubmit = async () => {
        if (!form.id_suppliers) {
            Alert.alert("Error", "Pilih supplier terlebih dahulu");
            return;
        }

        try {
            await handleSave({ ...form, details });
            Alert.alert("Sukses", "Data PO berhasil disimpan", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert("Error", error?.message || "Terjadi kesalahan saat menyimpan");
        }
    };

    if (isInitializing) {
        return (
            <Animated.View exiting={FadeOut.duration(300)} className="flex-1">
                <HeaderNavigator title="MEMUAT DATA" />
                <PoFormSkeleton />
            </Animated.View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="TAMBAH PO" />

            <ScrollView 
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInUp.delay(100).duration(400)}>
                    <View className="mb-4">
                        <Text className="text-sm font-bold text-gray-700 mb-2">Supplier <Text className="text-red-500">*</Text></Text>
                        <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <Dropdown
                                style={{ height: 48, paddingHorizontal: 16 }}
                                placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                selectedTextStyle={{ fontSize: 14, color: '#1F2937' }}
                                data={suppliersOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Pilih Supplier"
                                value={form.id_suppliers}
                                onChange={item => setForm({ ...form, id_suppliers: item.value, nm_suppliers: item.label })}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-bold text-gray-700 mb-2">Tanggal PO</Text>
                        <TextInput
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800"
                            value={form.date_po}
                            editable={false}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-bold text-gray-700 mb-2">Gudang</Text>
                        <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <Dropdown
                                style={{ height: 48, paddingHorizontal: 16 }}
                                placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                selectedTextStyle={{ fontSize: 14, color: '#1F2937' }}
                                data={gudangOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Pilih Gudang"
                                value={form.id_gudang}
                                onChange={item => setForm({ ...form, id_gudang: item.value })}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-bold text-gray-700 mb-2">Mata Uang</Text>
                        <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <Dropdown
                                style={{ height: 48, paddingHorizontal: 16 }}
                                placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                                selectedTextStyle={{ fontSize: 14, color: '#1F2937' }}
                                data={currencyOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Pilih Mata Uang"
                                value={form.id_mata_uang}
                                onChange={item => setForm({ ...form, id_mata_uang: item.value })}
                            />
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                    <PoTable 
                        items={details} 
                        onAdd={onAddDetail} 
                        onRemove={onRemoveDetail} 
                        isReadOnly={false} 
                    />
                </Animated.View>
            </ScrollView>

            <View className="bg-white px-4 py-4 border-t border-gray-100 flex-row justify-between space-x-3">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
                >
                    <Text className="font-bold text-gray-700">Kembali</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onSubmit}
                    disabled={isSaving}
                    className="flex-1 py-3 rounded-xl items-center"
                    style={{ backgroundColor: isSaving ? '#9CA3AF' : theme.colors.primary }}
                >
                    <Text className="font-bold text-white">{isSaving ? 'Menyimpan...' : 'Simpan'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
