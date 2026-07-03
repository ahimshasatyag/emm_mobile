import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save, ArrowLeft, ChevronDown, Plus } from 'lucide-react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useQuotations } from '../hooks/useQuotations';
import { Quotation } from '../types/quotation.types';
import Animated, { FadeIn, FadeInUp, FadeOut } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { ProductQuotationModal } from '../components/ProductQuotationModal';
import { QuotationFormSkeleton } from '../skeleton/QuotationFormSkeleton';
import { RefreshControl } from 'react-native';
const RadioGroup = ({ label, options, selectedValue, onSelect }: any) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-600 font-medium mb-2">{label}</Text>
        <View className="flex-row flex-wrap gap-2">
            {options.map((opt: any) => (
                <TouchableOpacity
                    key={opt.value}
                    onPress={() => onSelect(opt.value)}
                    className={`px-3 py-2 rounded-lg border ${selectedValue === opt.value ? 'bg-indigo-50 border-indigo-500' : 'bg-gray-50 border-gray-200'}`}
                >
                    <Text className={`text-xs ${selectedValue === opt.value ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>
                        {opt.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

const TextInputStyled = ({ label, placeholder, value, onChangeText, multiline, keyboardType, readonly }: any) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-600 font-medium mb-1.5">{label}</Text>
        <TextInput
            className={`border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 text-sm ${readonly ? 'bg-gray-100' : 'bg-gray-50'} ${multiline ? 'h-24' : ''}`}
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

const DropdownStyled = ({ label, placeholder, data, value, onChange }: any) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-600 font-medium mb-1.5">{label}</Text>
        <View className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
            <Dropdown
                style={{ height: 44, paddingHorizontal: 12 }}
                data={data}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                value={value}
                onChange={(item) => onChange(item.value)}
                selectedTextStyle={{ color: '#1f2937', fontSize: 14 }}
                placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                itemTextStyle={{ fontSize: 14 }}
            />
        </View>
    </View>
);

export function QuotationFormScreen() {
    const navigation = useNavigation();
    const { addQuotation } = useQuotations();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    
    const handleRefresh = () => {
        setIsFetching(true);
        setTimeout(() => setIsFetching(false), 1000);
    };

    // Comprehensive Form State mapping vformadd.php
    const [formData, setFormData] = useState({
        sales_person_name: '',
        customer_name: '',
        informasi_pembeli: '',
        date_estimasi: '',
        mata_uang: 'IDR',
        kurs: '1',
        ppn: '1',
        delivery_term: '',

        freight: '1', // 1: EMM, 2: Customer bayar ditempat, 3: Customer Charge
        freight_charge: '0',

        teknisi: '1', // 1: EMM, 2: Customer, 6: Customer Charge
        teknisi_charge: '0',

        forklift: '1', // 1: EMM, 2: Customer sediakan sendiri, 3: Customer Charge
        forklift_charge: '0',

        date_so: new Date().toLocaleDateString('id-ID'),
        payment_method: 'Tunai',
        payment_type: '',
        payment_time: '',
        dp_persen: '',
        dp_rp: '',
        tenor: '',
        cicilan_rp: '',

        keterangan: '',
        code_so_excel: '',
        no_po_cust: '',
        success_fee: '0',
        internal_notes: '',

        items: [] as any[],
        total: '0' // For summary
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState<number | undefined>(undefined);

    const handleSaveItem = (itemData: any, index?: number) => {
        if (index !== undefined) {
            setFormData(prev => {
                const newItems = [...prev.items];
                newItems[index] = itemData;
                return { ...prev, items: newItems };
            });
        } else {
            setFormData(prev => ({ ...prev, items: [...prev.items, itemData] }));
        }
        setIsModalVisible(false);
    };

    const updateField = (key: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!formData.customer_name || !formData.sales_person_name) {
            Alert.alert('Error', 'Silakan lengkapi data customer dan sales');
            return;
        }

        setIsLoading(true);
        const newQuotation: Quotation = {
            id_quotation: Date.now().toString(),
            quotation_number: `Q-${Date.now().toString().slice(-6)}`,
            date_so: formData.date_so,
            customer_id: 'CUST-NEW',
            customer_name: formData.customer_name,
            sales_person_id: 'EMP-NEW',
            sales_person_name: formData.sales_person_name,
            total: parseInt(formData.total) || 0,
            status: 'Draft',
            mata_uang: formData.mata_uang as any,
            keterangan: formData.keterangan,
            items: formData.items
        };

        await addQuotation(newQuotation);
        setIsLoading(false);
        Alert.alert('Sukses', 'Penawaran berhasil disimpan!', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <HeaderNavigator
                title="TAMBAH PENAWARAN"
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
                        <QuotationFormSkeleton />
                    </Animated.View>
                ) : (
                    <>
                    <Animated.View key="content" entering={FadeIn.duration(400)} className="space-y-4">

                    {/* SECTION: INFORMASI UMUM */}
                    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <Text className="text-xs font-bold text-gray-500 uppercase mb-4 border-b border-gray-100 pb-2">Informasi Umum</Text>
                        <DropdownStyled
                            label="Sales Person"
                            placeholder="Pilih Sales..."
                            data={[{ label: 'Sales A', value: 'Sales A' }, { label: 'Sales B', value: 'Sales B' }]}
                            value={formData.sales_person_name}
                            onChange={(v: string) => updateField('sales_person_name', v)}
                        />
                        <DropdownStyled
                            label="Delivery To"
                            placeholder="Pilih Customer..."
                            data={[{ label: 'Customer A', value: 'Customer A' }, { label: 'Customer B', value: 'Customer B' }]}
                            value={formData.customer_name}
                            onChange={(v: string) => updateField('customer_name', v)}
                        />
                        <TextInputStyled label="Informasi Pembeli" placeholder="Informasi..." value={formData.informasi_pembeli} onChangeText={(v: string) => updateField('informasi_pembeli', v)} multiline readonly />
                        <TextInputStyled label="Estimasi Pengiriman" placeholder="DD-MM-YYYY" value={formData.date_estimasi} onChangeText={(v: string) => updateField('date_estimasi', v)} />

                        <DropdownStyled
                            label="Mata Uang"
                            placeholder="Pilih Mata Uang"
                            data={[{ label: 'IDR', value: 'IDR' }, { label: 'USD', value: 'USD' }]}
                            value={formData.mata_uang}
                            onChange={(v: string) => updateField('mata_uang', v)}
                        />
                        {formData.mata_uang === 'USD' && (
                            <TextInputStyled label="Kurs" placeholder="0" value={formData.kurs} onChangeText={(v: string) => updateField('kurs', v)} keyboardType="numeric" />
                        )}

                        <DropdownStyled
                            label="PPN"
                            placeholder="Pilih PPN"
                            data={[{ label: 'YA', value: '1' }, { label: 'TIDAK', value: '0' }]}
                            value={formData.ppn}
                            onChange={(v: string) => updateField('ppn', v)}
                        />
                        <TextInputStyled label="Delivery Term" placeholder="Pilih Delivery Term..." value={formData.delivery_term} onChangeText={(v: string) => updateField('delivery_term', v)} />

                        {/* SECTION: BIAYA */}
                        <Text className="text-xs font-bold text-gray-500 uppercase mb-4 mt-4 border-b border-gray-100 pb-2">Opsi Biaya</Text>

                        {/* Freight */}
                        <RadioGroup
                            label="Biaya Freight"
                            options={[
                                { label: 'EMM', value: '1' },
                                { label: 'Cust Bayar Ditempat', value: '2' },
                                { label: 'Cust Charge (Include Mesin)', value: '3' }
                            ]}
                            selectedValue={formData.freight}
                            onSelect={(v: string) => updateField('freight', v)}
                        />
                        {formData.freight === '3' && (
                            <TextInputStyled label="Freight Charge (Rp)" placeholder="0" value={formData.freight_charge} onChangeText={(v: string) => updateField('freight_charge', v)} keyboardType="numeric" />
                        )}

                        {/* Teknisi */}
                        <RadioGroup
                            label="Biaya Teknisi"
                            options={[
                                { label: 'EMM', value: '1' },
                                { label: 'Customer', value: '2' },
                                { label: 'Cust Charge (Include Mesin)', value: '6' }
                            ]}
                            selectedValue={formData.teknisi}
                            onSelect={(v: string) => updateField('teknisi', v)}
                        />
                        {formData.teknisi === '6' && (
                            <TextInputStyled label="Teknisi Charge (Rp)" placeholder="0" value={formData.teknisi_charge} onChangeText={(v: string) => updateField('teknisi_charge', v)} keyboardType="numeric" />
                        )}

                        {/* Forklift */}
                        <RadioGroup
                            label="Biaya Forklift"
                            options={[
                                { label: 'EMM', value: '1' },
                                { label: 'Cust Sediakan Sendiri', value: '2' },
                                { label: 'Cust Charge (Include Mesin)', value: '3' }
                            ]}
                            selectedValue={formData.forklift}
                            onSelect={(v: string) => updateField('forklift', v)}
                        />
                        {formData.forklift === '3' && (
                            <TextInputStyled label="Forklift Charge (Rp)" placeholder="0" value={formData.forklift_charge} onChangeText={(v: string) => updateField('forklift_charge', v)} keyboardType="numeric" />
                        )}

                        {/* SECTION: PEMBAYARAN */}
                        <Text className="text-xs font-bold text-gray-500 uppercase mb-4 mt-4 border-b border-gray-100 pb-2">Informasi Pembayaran</Text>
                        <TextInputStyled label="Tanggal SO" placeholder="DD-MM-YYYY" value={formData.date_so} onChangeText={(v: string) => updateField('date_so', v)} readonly />

                        <DropdownStyled
                            label="Metode Payment"
                            placeholder="Pilih Metode Payment"
                            data={[{ label: 'Cash', value: 'Cash' }, { label: 'TOP', value: 'TOP' }, { label: 'Leasing', value: 'Leasing' }]}
                            value={formData.payment_method}
                            onChange={(v: string) => updateField('payment_method', v)}
                        />

                        {['TOP', 'Leasing'].includes(formData.payment_method) && (
                            <View className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                                <View className="flex-row gap-4">
                                    <View className="flex-1">
                                        <TextInputStyled label="DP (%)" placeholder="0" value={formData.dp_persen} onChangeText={(v: string) => updateField('dp_persen', v)} keyboardType="numeric" />
                                    </View>
                                    <View className="flex-1">
                                        <TextInputStyled label="DP (Rp)" placeholder="0" value={formData.dp_rp} onChangeText={(v: string) => updateField('dp_rp', v)} keyboardType="numeric" />
                                    </View>
                                </View>
                                <View className="flex-row gap-4 mb-[-16px]">
                                    <View className="flex-1">
                                        <TextInputStyled label="Tenor (Bulan)" placeholder="0" value={formData.tenor} onChangeText={(v: string) => updateField('tenor', v)} keyboardType="numeric" />
                                    </View>
                                    <View className="flex-1">
                                        <TextInputStyled label="Cicilan (Rp)" placeholder="0" value={formData.cicilan_rp} onChangeText={(v: string) => updateField('cicilan_rp', v)} keyboardType="numeric" />
                                    </View>
                                </View>
                            </View>
                        )}

                        <DropdownStyled
                            label="Tipe Pembayaran"
                            placeholder="Pilih Tipe Pembayaran"
                            data={[{ label: 'Transfer', value: 'Transfer' }, { label: 'Tunai', value: 'Tunai' }, { label: 'Giro', value: 'Giro' }]}
                            value={formData.payment_type}
                            onChange={(v: string) => updateField('payment_type', v)}
                        />
                        <DropdownStyled
                            label="Waktu Bayar"
                            placeholder="Pilih Waktu Bayar"
                            data={[{ label: 'Sebelum Kirim', value: 'Sebelum Kirim' }, { label: 'Sesudah Kirim', value: 'Sesudah Kirim' }, { label: '14 Hari', value: '14 Hari' }]}
                            value={formData.payment_time}
                            onChange={(v: string) => updateField('payment_time', v)}
                        />
                        {/* SECTION: LAIN-LAIN */}
                        <Text className="text-xs font-bold text-gray-500 uppercase mb-4 mt-4 border-b border-gray-100 pb-2">Informasi Tambahan</Text>
                        <TextInputStyled label="Keterangan" placeholder="Keterangan tambahan..." value={formData.keterangan} onChangeText={(v: string) => updateField('keterangan', v)} multiline />
                        <TextInputStyled label="Kode SO Excel" placeholder="Masukan Kode SO Excel..." value={formData.code_so_excel} onChangeText={(v: string) => updateField('code_so_excel', v)} />
                        <TextInputStyled label="No PO Customer" placeholder="Masukan No PO..." value={formData.no_po_cust} onChangeText={(v: string) => updateField('no_po_cust', v)} />
                        <TextInputStyled label="Success fee (Rp)" placeholder="0" value={formData.success_fee} onChangeText={(v: string) => updateField('success_fee', v)} keyboardType="numeric" />
                        <TextInputStyled label="Internal Notes" placeholder="Catatan internal..." value={formData.internal_notes} onChangeText={(v: string) => updateField('internal_notes', v)} />

                        <View className="flex-row items-center justify-end mb-2 mt-2">
                            <Button
                                onPress={() => {
                                    setEditingItemIndex(undefined);
                                    setIsModalVisible(true);
                                }}
                                variant="default"
                                className="h-9 px-3 rounded-lg flex-row items-center gap-1"
                            >
                                <Plus size={16} color="white" />
                                <Text className="text-white font-bold text-xs">Tambah</Text>
                            </Button>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                            <View className="border border-gray-200 rounded-xl overflow-hidden min-w-[900px]">
                                <View className="flex-row bg-gray-100 p-2 border-b border-gray-200">
                                    <Text className="w-10 text-xs font-bold text-gray-600 text-center">No</Text>
                                    <Text className="w-24 text-xs font-bold text-gray-600">Kode</Text>
                                    <Text className="w-50 text-xs font-bold text-gray-600">Nama Produk</Text>
                                    <Text className="w-14 text-xs font-bold text-gray-600">Status</Text>
                                    <Text className="w-24 text-xs font-bold text-gray-600 text-right">Harga</Text>
                                    <Text className="w-16 text-xs font-bold text-gray-600 text-center">Qty</Text>
                                    <Text className="w-20 text-xs font-bold text-gray-600 text-center">Satuan</Text>
                                    <Text className="w-24 text-xs font-bold text-gray-600">Delivery</Text>
                                    <Text className="w-32 text-xs font-bold text-gray-600 text-right">Total</Text>
                                </View>

                                {formData.items.length === 0 ? (
                                    <View className="p-4 items-center justify-center">
                                        <Text className="text-xs text-gray-400">Belum ada barang ditambahkan</Text>
                                    </View>
                                ) : (
                                    formData.items.map((item, index) => {
                                        const lineTotal = (parseInt(item.harga) || 0) * (parseInt(item.qty) || 0);
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                className="flex-row p-2 border-b border-gray-100 items-center"
                                                activeOpacity={0.7}
                                                onPress={() => {
                                                    setEditingItemIndex(index);
                                                    setIsModalVisible(true);
                                                }}
                                            >
                                                <Text className="w-10 text-xs text-gray-600 text-center">{index + 1}</Text>
                                                <Text className="w-24 text-xs text-gray-800">{item.product_code}</Text>
                                                <Text className="w-40 text-xs text-gray-800">{item.product_name}</Text>
                                                <Text className="w-24 text-xs text-gray-800">{item.status_barang}</Text>
                                                <Text className="w-24 text-xs text-gray-800 text-right">{item.harga}</Text>
                                                <Text className="w-16 text-xs text-gray-800 text-center">{item.qty}</Text>
                                                <Text className="w-20 text-xs text-gray-800 text-center">{item.satuan}</Text>
                                                <Text className="w-24 text-xs text-gray-800">{item.delivery_term}</Text>
                                                <Text className="w-32 text-xs text-gray-800 text-right font-bold">{lineTotal}</Text>
                                            </TouchableOpacity>
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
                                    <Text className="text-white font-bold text-lg">Simpan</Text>
                                </>
                            )}
                        </Button>
                    </Animated.View>
                    </Animated.View>
                    </>
                )}
            </ScrollView>

            <ProductQuotationModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSave={handleSaveItem}
                initialData={editingItemIndex !== undefined ? formData.items[editingItemIndex] : undefined}
                editIndex={editingItemIndex}
            />
        </KeyboardAvoidingView>
    );
}
