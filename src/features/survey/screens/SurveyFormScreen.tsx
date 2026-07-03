import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, Trash2, Pencil, Save } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInUp } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from '../../../components/ui/button';
import { useSurvey } from '../hooks/useSurvey';
import { SurveyItem } from '../types/survey.types';
import { ProductSurveyModal } from '../components/ProductSurveyModal';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { SurveyFormSkeleton } from '../skeleton/SurveyFormSkeleton';

const TextInputStyled = ({ label, placeholder, value, onChangeText, multiline, keyboardType, readonly }: any) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-600 font-medium mb-1.5">{label}</Text>
        <TextInput
            className={`border border-gray-200 rounded-lg px-3 py-2.5 text-sm ${readonly ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-800'} ${multiline ? 'h-24' : ''}`}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            keyboardType={keyboardType || 'default'}
            editable={!readonly}
        />
    </View>
);

const DropdownStyled = ({ label, placeholder, data, value, onChange, disabled }: any) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-600 font-medium mb-1.5">{label}</Text>
        <View className={`border border-gray-200 rounded-lg overflow-hidden ${disabled ? 'bg-gray-100 opacity-70' : 'bg-gray-50'}`}>
            <Dropdown
                style={{ height: 44, paddingHorizontal: 12 }}
                data={data}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                value={value}
                onChange={(item) => onChange(item.value)}
                disable={disabled}
                containerStyle={{ borderRadius: 8, marginTop: 4, overflow: 'hidden' }}
                placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
            />
        </View>
    </View>
);

export function SurveyFormScreen() {
    const navigation = useNavigation();
    const { createNewSurvey, isLoading } = useSurvey();
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);

    const [formData, setFormData] = useState({
        nm_karyawan: '',
        nm_customers: '',
        customers_address: '',
        date_estimasi: '',
        vcurrency: '',
        nkurs: '1',
        flag_ppn: '1',
        delivery_term: '',
        date_so: '',
        nm_type_pembayaran: '',
        ndp_persen: '',
        ndp_amount: '',
        ntenor: '',
        ntenor_amount: '',
        nm_cara_pembayaran: '',
        nm_waktu_bayar: '',
        keterangan: '',
        items: [] as SurveyItem[]
    });

    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        // mock initial loading delay
        const timer = setTimeout(() => setIsFetching(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleRefresh = () => {
        setIsFetching(true);
        setTimeout(() => setIsFetching(false), 500);
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddItem = (item: SurveyItem) => {
        setFormData(prev => ({ ...prev, items: [...prev.items, item] }));
        setIsProductModalVisible(false);
    };

    const handleRemoveItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        if (!formData.nm_customers) {
            Alert.alert('Error', 'Silakan pilih Customer terlebih dahulu');
            return;
        }

        try {
            await createNewSurvey({
                id_survey: '',
                code_survey: `SRV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                date_request: new Date().toLocaleDateString('id-ID'),
                survey_status: 'Draft',
                ...formData
            });
            Alert.alert('Sukses', 'Survey berhasil disimpan', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Gagal menyimpan Survey');
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <HeaderNavigator
                title="TAMBAH SURVEY"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isFetching ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <SurveyFormSkeleton />
                    </Animated.View>
                ) : (
                    <>
                    <Animated.View key="content" entering={FadeIn.duration(400)} className="space-y-4">

                    {/* SECTION: INFORMASI UMUM */}
                    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                        <Text className="text-xs font-bold text-gray-500 uppercase mb-4 border-b border-gray-100 pb-2">Informasi Umum</Text>

                        <DropdownStyled
                            label="Sales Person"
                            placeholder="Pilih Sales..."
                            data={[{ label: 'Budi Santoso', value: 'Budi Santoso' }, { label: 'Siti Aminah', value: 'Siti Aminah' }]}
                            value={formData.nm_karyawan}
                            onChange={(v: string) => updateField('nm_karyawan', v)}
                        />
                        <DropdownStyled
                            label="Delivery To"
                            placeholder="Pilih Customer..."
                            data={[{ label: 'PT. Maju Mundur', value: 'PT. Maju Mundur' }, { label: 'CV. Sentosa Abadi', value: 'CV. Sentosa Abadi' }]}
                            value={formData.nm_customers}
                            onChange={(v: string) => updateField('nm_customers', v)}
                        />
                        <TextInputStyled label="Informasi Pembeli" placeholder="Informasi..." value={formData.customers_address} onChangeText={(v: string) => updateField('customers_address', v)} multiline />
                        <TextInputStyled label="Estimasi Pengiriman" placeholder="DD-MM-YYYY" value={formData.date_estimasi} onChangeText={(v: string) => updateField('date_estimasi', v)} />

                        <DropdownStyled
                            label="Mata Uang"
                            placeholder="Pilih Mata Uang"
                            data={[{ label: 'IDR', value: 'IDR' }, { label: 'USD', value: 'USD' }]}
                            value={formData.vcurrency}
                            onChange={(v: string) => updateField('vcurrency', v)}
                        />
                        <TextInputStyled label="Kurs" placeholder="1" value={formData.nkurs} onChangeText={(v: string) => updateField('nkurs', v)} keyboardType="numeric" />
                        <DropdownStyled
                            label="PPN"
                            placeholder="Pilih PPN"
                            data={[{ label: 'YA', value: '1' }, { label: 'TIDAK', value: '0' }]}
                            value={formData.flag_ppn}
                            onChange={(v: string) => updateField('flag_ppn', v)}
                        />
                        <DropdownStyled
                            label="Delivery Term"
                            placeholder="Pilih Delivery Term"
                            data={[{ label: 'FRANCO JKT', value: 'FRANCO JKT' }]}
                            value={formData.delivery_term}
                            onChange={(v: string) => updateField('delivery_term', v)}
                        />

                        {/* SECTION: PEMBAYARAN */}
                        <Text className="text-xs font-bold text-gray-500 uppercase mb-4 mt-4 border-b border-gray-100 pb-2">Informasi Pembayaran</Text>
                        <TextInputStyled label="Tanggal SO/Survey" placeholder="DD-MM-YYYY" value={formData.date_so} onChangeText={(v: string) => updateField('date_so', v)} />

                        <DropdownStyled
                            label="Metode Payment"
                            placeholder="Pilih Metode Payment"
                            data={[{ label: 'Kredit', value: 'Kredit' }, { label: 'Tunai', value: 'Tunai' }]}
                            value={formData.nm_type_pembayaran}
                            onChange={(v: string) => updateField('nm_type_pembayaran', v)}
                        />

                        {formData.nm_type_pembayaran === 'Kredit' && (
                            <View className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                                <View className="flex-row gap-4">
                                    <View className="flex-1">
                                        <TextInputStyled label="DP (%)" placeholder="0" value={formData.ndp_persen} onChangeText={(v: string) => updateField('ndp_persen', v)} keyboardType="numeric" />
                                    </View>
                                    <View className="flex-1">
                                        <TextInputStyled label="DP (Rp)" placeholder="0" value={formData.ndp_amount} onChangeText={(v: string) => updateField('ndp_amount', v)} keyboardType="numeric" />
                                    </View>
                                </View>
                                <View className="flex-row gap-4 mb-[-16px]">
                                    <View className="flex-1">
                                        <TextInputStyled label="Tenor (Bulan)" placeholder="0" value={formData.ntenor} onChangeText={(v: string) => updateField('ntenor', v)} keyboardType="numeric" />
                                    </View>
                                    <View className="flex-1">
                                        <TextInputStyled label="Cicilan (Rp)" placeholder="0" value={formData.ntenor_amount} onChangeText={(v: string) => updateField('ntenor_amount', v)} keyboardType="numeric" />
                                    </View>
                                </View>
                            </View>
                        )}

                        <DropdownStyled
                            label="Tipe Pembayaran"
                            placeholder="Pilih Tipe Pembayaran"
                            data={[{ label: 'Transfer BCA', value: 'Transfer BCA' }, { label: 'Tunai', value: 'Tunai' }]}
                            value={formData.nm_cara_pembayaran}
                            onChange={(v: string) => updateField('nm_cara_pembayaran', v)}
                        />
                        <DropdownStyled
                            label="Waktu Bayar"
                            placeholder="Pilih Waktu Bayar"
                            data={[{ label: '30 Hari', value: '30 Hari' }, { label: 'COD', value: 'COD' }]}
                            value={formData.nm_waktu_bayar}
                            onChange={(v: string) => updateField('nm_waktu_bayar', v)}
                        />

                        <TextInputStyled label="Keterangan" placeholder="Keterangan tambahan..." value={formData.keterangan} onChangeText={(v: string) => updateField('keterangan', v)} multiline />

                        <View className="flex-row items-center justify-between mt-4 mb-4 border-b border-gray-100 pb-2">
                            <Text className="text-xs font-bold text-gray-500 uppercase">Daftar Barang</Text>
                            <TouchableOpacity
                                className="px-3 py-2 rounded flex-row items-center"
                                style={{ backgroundColor: theme.colors.primary }}
                                onPress={() => setIsProductModalVisible(true)}
                            >
                                <Plus size={14} color="white" />
                                <Text className="text-white text-xs font-bold ml-1">Tambah Barang</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                            <View className="border border-gray-200 rounded-xl overflow-hidden min-w-[900px]">
                                <View className="flex-row bg-gray-100 p-2 border-b border-gray-200">
                                    <Text className="w-10 text-xs font-bold text-gray-600 text-center">No</Text>
                                    <Text className="w-24 text-xs font-bold text-gray-600">Kode</Text>
                                    <Text className="w-48 text-xs font-bold text-gray-600">Nama Produk</Text>
                                    <Text className="w-24 text-xs font-bold text-gray-600">Status</Text>
                                    <Text className="w-24 text-xs font-bold text-gray-600 text-right">Harga</Text>
                                    <Text className="w-16 text-xs font-bold text-gray-600 text-center">Qty</Text>
                                    <Text className="w-20 text-xs font-bold text-gray-600 text-center">Satuan</Text>
                                    <Text className="w-24 text-xs font-bold text-gray-600">Delivery</Text>
                                    <Text className="w-32 text-xs font-bold text-gray-600 text-right">Total</Text>
                                    <Text className="w-16 text-xs font-bold text-gray-600 text-center">Aksi</Text>
                                </View>

                                {formData.items.length === 0 ? (
                                    <View className="p-4 items-center justify-center">
                                        <Text className="text-xs text-gray-400">Belum ada barang ditambahkan</Text>
                                    </View>
                                ) : (
                                    formData.items.map((item, index) => {
                                        const lineTotal = (parseInt(item.harga) || 0) * (parseInt(item.qty) || 0);
                                        return (
                                            <View key={index} className="flex-row p-2 border-b border-gray-100 items-center">
                                                <Text className="w-10 text-xs text-gray-600 text-center">{index + 1}</Text>
                                                <Text className="w-24 text-xs text-gray-800">{item.product_code}</Text>
                                                <Text className="w-48 text-xs text-gray-800">{item.product_name}</Text>
                                                <Text className="w-24 text-xs text-gray-800">{item.status_barang}</Text>
                                                <Text className="w-24 text-xs text-gray-800 text-right">{item.harga}</Text>
                                                <Text className="w-16 text-xs text-gray-800 text-center">{item.qty}</Text>
                                                <Text className="w-20 text-xs text-gray-800 text-center">{item.satuan}</Text>
                                                <Text className="w-24 text-xs text-gray-800">{item.delivery_term}</Text>
                                                <Text className="w-32 text-xs text-gray-800 text-right font-bold">{lineTotal}</Text>
                                                <View className="w-16 items-center justify-center">
                                                    <TouchableOpacity onPress={() => handleRemoveItem(index)} className="p-1">
                                                        <Trash2 size={16} color="#EF4444" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    })
                                )}
                            </View>
                        </ScrollView>
                    </View>

                    <Animated.View entering={FadeInUp.delay(100)} className="mt-10 mb-8">
                        <Button
                            onPress={handleSave}
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl flex-row items-center justify-center"
                            style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Save color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Simpan Survey</Text>
                                </>
                            )}
                        </Button>
                    </Animated.View>
                </Animated.View>
                </>
                )}
            </ScrollView>

            <ProductSurveyModal
                visible={isProductModalVisible}
                onClose={() => setIsProductModalVisible(false)}
                onSave={handleAddItem}
            />
        </KeyboardAvoidingView>
    );
}
