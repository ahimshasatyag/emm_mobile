import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Save, ArrowLeft, CheckSquare, Square } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { useSalesContract } from '../hooks/useSalesContract';
import { SalesContract } from '../types/salescontract.types';
import { SalesContractFormSkeleton } from '../skeleton/SalesContractFormSkeleton';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    SalesContractForm: { id_so: string };
    SalesContractListSO: undefined;
};

export function SalesContractFormScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'SalesContractForm'>>();
    const { id_so } = route.params;

    const { getSOWithoutContract, currentSOWithoutContract, createContract, isLoading } = useSalesContract();

    const [form, setForm] = useState<Partial<SalesContract>>({});
    const [fCompany, setFCompany] = useState(false);
    const [selectedItemIndices, setSelectedItemIndices] = useState<number[]>([]);

    useEffect(() => {
        getSOWithoutContract(id_so);
    }, [id_so]);

    const onRefresh = () => {
        if (id_so) {
            getSOWithoutContract(id_so);
        }
    };

    useEffect(() => {
        if (currentSOWithoutContract) {
            setForm({
                id_so: currentSOWithoutContract.id_so,
                code_so: currentSOWithoutContract.code_so,
                date_so: currentSOWithoutContract.date_so,
                id_customers: currentSOWithoutContract.id_customers,
                nm_customers: currentSOWithoutContract.nm_customers,
                f_company: currentSOWithoutContract.f_company,
                nama_lengkap: currentSOWithoutContract.nama_lengkap || '',
                nik: currentSOWithoutContract.nik || '',
                nib: currentSOWithoutContract.nib || '',
                npwp: currentSOWithoutContract.npwp || '',
                alamat: currentSOWithoutContract.alamat || '',
                date_contract: new Date().toISOString().split('T')[0],
                dp_persen: currentSOWithoutContract.ndp_persen || '0',
                lama_cicilan: currentSOWithoutContract.ntenor || '0',
                items: currentSOWithoutContract.items || [],
                vcurrency: currentSOWithoutContract.vcurrency || 'IDR'
            });
            setFCompany(currentSOWithoutContract.f_company === true || currentSOWithoutContract.f_company === 'true');
            setSelectedItemIndices(currentSOWithoutContract.items?.map((_, i) => i) || []);
        }
    }, [currentSOWithoutContract]);

    // Derived states
    const activeItems = (form.items || []).filter((_, index) => selectedItemIndices.includes(index));
    const totalSemua = activeItems.reduce((sum, item) => sum + (Number(item.product_price) * Number(item.n_qty)), 0);
    const dpNominal = (totalSemua * Number(form.dp_persen || 0)) / 100;
    const sisa = totalSemua - dpNominal;
    const lamaCicilan = Number(form.lama_cicilan || 1) === 0 ? 1 : Number(form.lama_cicilan || 1);
    const jmlCicilanRp = sisa / lamaCicilan;

    const handleSave = async () => {
        if (!form.nik) {
            Alert.alert("Info", "NIK Tidak Boleh kosong !");
            return;
        }
        if (!form.alamat) {
            Alert.alert("Info", "Alamat Tidak Boleh kosong !");
            return;
        }
        if (fCompany) {
            if (!form.nama_lengkap) {
                Alert.alert("Info", "Nama Lengkap Tidak Boleh kosong !");
                return;
            }
            if (!form.nib) {
                Alert.alert("Info", "NIB Tidak Boleh kosong !");
                return;
            }
            if (!form.npwp) {
                Alert.alert("Info", "NPWP Tidak Boleh kosong !");
                return;
            }
        }
        if (!activeItems || activeItems.length === 0) {
            Alert.alert("Info", "Pilih Barang Minimal 1 !");
            return;
        }

        const payload: SalesContract = {
            ...form as SalesContract,
            f_company: fCompany,
            items: activeItems,
            n_amount: totalSemua,
            dp_nominal: dpNominal,
            n_sisa: sisa,
            jml_cicilan_rp: jmlCicilanRp
        };

        try {
            await createContract(payload);
            Alert.alert("Success", "Sales Contract berhasil dibuat", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert("Error", error?.message || "Terjadi kesalahan");
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title={!currentSOWithoutContract || isLoading ? "MEMUAT DATA..." : "TAMBAH SALES CONTRACT"} 
                showBackButton={true} 
                onBackPress={() => navigation.goBack()}
            />
            
            <ScrollView 
                className="flex-1 px-4 py-4" 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
            >
                {!currentSOWithoutContract || isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <SalesContractFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        {/* SO & Customer Info */}
                <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                    <Text className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Informasi SO</Text>
                    
                    <View className="mb-3">
                        <Text className="text-xs text-gray-500 mb-1">SO Code</Text>
                        <TextInput
                            value={form.code_so}
                            editable={false}
                            className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                        />
                    </View>
                    <View className="mb-3">
                        <Text className="text-xs text-gray-500 mb-1">Customer</Text>
                        <TextInput
                            value={form.nm_customers}
                            editable={false}
                            className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                        />
                    </View>
                </View>

                {/* Company & Personal Info */}
                <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                    <Text className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Data Customer</Text>

                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xs font-medium text-gray-700">Company</Text>
                        <Switch
                            value={fCompany}
                            onValueChange={setFCompany}
                            trackColor={{ false: "#d1d5db", true: theme.colors.primary }}
                        />
                    </View>

                    {fCompany && (
                        <View className="mb-3">
                            <Text className="text-xs text-gray-500 mb-1">Nama Lengkap</Text>
                            <TextInput
                                value={form.nama_lengkap}
                                onChangeText={(t) => setForm({...form, nama_lengkap: t})}
                                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
                            />
                        </View>
                    )}

                    <View className="mb-3">
                        <Text className="text-xs text-gray-500 mb-1">NIK</Text>
                        <TextInput
                            value={form.nik}
                            onChangeText={(t) => setForm({...form, nik: t})}
                            keyboardType="numeric"
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
                        />
                    </View>

                    {fCompany && (
                        <>
                            <View className="mb-3">
                                <Text className="text-xs text-gray-500 mb-1">NIB</Text>
                                <TextInput
                                    value={form.nib}
                                    onChangeText={(t) => setForm({...form, nib: t})}
                                    className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
                                />
                            </View>
                            <View className="mb-3">
                                <Text className="text-xs text-gray-500 mb-1">NPWP</Text>
                                <TextInput
                                    value={form.npwp}
                                    onChangeText={(t) => setForm({...form, npwp: t})}
                                    className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
                                />
                            </View>
                        </>
                    )}

                    <View className="mb-3">
                        <Text className="text-xs text-gray-500 mb-1">Alamat</Text>
                        <TextInput
                            value={form.alamat}
                            onChangeText={(t) => setForm({...form, alamat: t})}
                            multiline
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 h-20"
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Calculation Info */}
                <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                    <Text className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Kalkulasi</Text>

                    <View className="mb-3">
                        <Text className="text-xs text-gray-500 mb-1">Tgl Contract</Text>
                        <TextInput
                            value={form.date_contract}
                            editable={false}
                            className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                        />
                    </View>

                    <View className="mb-3">
                        <Text className="text-xs text-gray-500 mb-1">Total</Text>
                        <TextInput
                            value={totalSemua.toLocaleString('id-ID')}
                            editable={false}
                            className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                        />
                    </View>

                    <View className="flex-row justify-between mb-3">
                        <View className="flex-1 mr-2">
                            <Text className="text-xs text-gray-500 mb-1">DP (%)</Text>
                            <TextInput
                                value={String(form.dp_persen || '')}
                                onChangeText={(t) => setForm({...form, dp_persen: t})}
                                keyboardType="numeric"
                                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
                            />
                        </View>
                        <View className="flex-1 ml-2">
                            <Text className="text-xs text-gray-500 mb-1">DP (Nominal)</Text>
                            <TextInput
                                value={dpNominal.toLocaleString('id-ID')}
                                editable={false}
                                className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                            />
                        </View>
                    </View>

                    <View className="mb-3">
                        <Text className="text-xs text-gray-500 mb-1">Sisa</Text>
                        <TextInput
                            value={sisa.toLocaleString('id-ID')}
                            editable={false}
                            className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                        />
                    </View>

                    <View className="mb-3">
                        <Text className="text-xs text-gray-500 mb-1">Lama Cicilan</Text>
                        <TextInput
                            value={String(form.lama_cicilan || '')}
                            onChangeText={(t) => setForm({...form, lama_cicilan: t})}
                            keyboardType="numeric"
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
                        />
                    </View>

                    <View className="mb-3">
                        <Text className="text-xs text-gray-500 mb-1">Jumlah Cicilan Rp</Text>
                        <TextInput
                            value={jmlCicilanRp.toLocaleString('id-ID')}
                            editable={false}
                            className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
                        />
                    </View>
                </View>

                {/* Items */}
                <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
                    <Text className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Daftar Barang</Text>
                    {form.items?.map((item, index) => {
                        const isSelected = selectedItemIndices.includes(index);
                        const subTotal = Number(item.product_price) * Number(item.n_qty);
                        
                        const toggleSelection = () => {
                            if (isSelected) {
                                setSelectedItemIndices(prev => prev.filter(i => i !== index));
                            } else {
                                setSelectedItemIndices(prev => [...prev, index]);
                            }
                        };

                        return (
                            <TouchableOpacity 
                                key={index} 
                                activeOpacity={0.7}
                                onPress={toggleSelection}
                                className={`mb-3 p-3 rounded-lg border flex-row items-start ${isSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'}`}
                            >
                                <View className="mt-1 mr-3">
                                    {isSelected ? (
                                        <CheckSquare color={theme.colors.primary} size={20} />
                                    ) : (
                                        <Square color="#9CA3AF" size={20} />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className={`font-bold text-sm mb-1 ${isSelected ? 'text-indigo-900' : 'text-gray-600'}`}>
                                        {item.code_product} - {item.nm_product}
                                    </Text>
                                    <View className="flex-row justify-between mt-2">
                                        <View>
                                            <Text className="text-xs text-gray-500">Qty: {item.n_qty}</Text>
                                            <Text className="text-xs text-gray-500">Harga: {Number(item.product_price).toLocaleString('id-ID')}</Text>
                                        </View>
                                        <View className="items-end">
                                            <Text className="text-xs text-gray-500">Sub Total</Text>
                                            <Text className={`text-sm font-bold ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                                                {subTotal.toLocaleString('id-ID')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Animated.View entering={FadeInUp.delay(100)}>
                    <Button
                        onPress={handleSave}
                        disabled={isLoading}
                        className="w-full h-14 rounded-2xl flex-row items-center justify-center mb-8"
                        style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                    >
                        {isLoading ? (
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
        </View>
    );
}
