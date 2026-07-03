import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, CornerDownLeft, Pencil, Shield, Check, X, Printer, FileText, Trash2 } from 'lucide-react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useSO } from '../hooks/useSO';
import { SalesOrder, SOItem } from '../types/so.types';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { ProductSOModal } from '../components/ProductSOModal';
import { ExtGaransiModal } from '../components/ExtGaransiModal';
import { SOEditSkeleton } from '../skeleton/SOEditSkeleton';

const RadioGroup = ({ label, options, selectedValue, onSelect, disabled }: any) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-600 font-medium mb-2">{label}</Text>
        <View className="flex-row flex-wrap gap-2">
            {options.map((opt: any) => (
                <TouchableOpacity
                    key={opt.value}
                    onPress={() => !disabled && onSelect(opt.value)}
                    activeOpacity={disabled ? 1 : 0.7}
                    className={`px-3 py-2 rounded-lg border ${selectedValue === opt.value ? 'bg-indigo-50 border-indigo-500' : 'bg-gray-50 border-gray-200'} ${disabled ? 'opacity-70' : ''}`}
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
                selectedTextStyle={{ color: disabled ? '#9ca3af' : '#1f2937', fontSize: 14 }}
                placeholderStyle={{ color: '#9ca3af', fontSize: 14 }}
                itemTextStyle={{ fontSize: 14 }}
                disable={disabled}
            />
        </View>
    </View>
);

export function SOEditScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params as { id: string };
    const { items } = useSO();
    const [isFetching, setIsFetching] = useState(true);

    const [formData, setFormData] = useState<Partial<SalesOrder>>({
        nm_karyawan: '',
        nm_customers: '',
        customers_address: '',
        date_estimasi: '',
        vcurrency: 'IDR',
        nkurs: '1',
        flag_ppn: '1',
        delivery_term: '',

        freight: '1',
        freight_amount: '0',

        teknisi: '1',
        teknisi_amount: '0',
        teknisi_customer1_select: '',

        forklift: '1',
        forklift_amount: '0',

        date_so: new Date().toLocaleDateString('id-ID'),
        nm_type_pembayaran: 'Tunai',
        nm_cara_pembayaran: '',
        nm_waktu_bayar: '',
        ndp_persen: '',
        ndp_amount: '',
        ntenor: '',
        ntenor_amount: '',

        keterangan: '',
        code_so_excel: '',
        no_po_cust: '',
        success_fee: '0',
        internal_notes: '',

        items: []
    });

    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [isGaransiModalVisible, setIsGaransiModalVisible] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState<number | undefined>(undefined);
    const [extGaransis, setExtGaransis] = useState<{ id: string, name: string, status: string, durasi: string }[]>([]);
    const [editingGaransiId, setEditingGaransiId] = useState<string | undefined>(undefined);

    const loadInitialData = () => {
        const so = items.find(s => s.id_so === id);
        if (so) {
            setFormData(so);
        }
    };

    const handleRefresh = () => {
        setIsFetching(true);
        setTimeout(() => {
            loadInitialData();
            setIsFetching(false);
        }, 1000);
    };

    useEffect(() => {
        loadInitialData();
        setIsFetching(false);
    }, [id, items]);

    const handleSaveItem = (itemData: SOItem, index?: number) => {
        if (index !== undefined) {
            setFormData(prev => {
                const newItems = [...(prev.items || [])];
                newItems[index] = itemData;
                return { ...prev, items: newItems };
            });
        } else {
            setFormData(prev => ({ ...prev, items: [...(prev.items || []), itemData] }));
        }
        setIsProductModalVisible(false);
    };

    const updateField = (key: keyof SalesOrder, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };



    const handleExtGaransi = (durasi: string) => {
        if (editingGaransiId) {
            setExtGaransis(prev => prev.map(p => p.id === editingGaransiId ? { ...p, name: `Garansi Sparepart ${durasi} Hari`, durasi } : p));
            Alert.alert('Sukses', `Berhasil mengubah Extend Garansi menjadi ${durasi} hari!`);
        } else {
            setExtGaransis(prev => [
                ...prev,
                { id: Date.now().toString(), name: `Garansi Sparepart ${durasi} Hari`, status: 'Menunggu', durasi }
            ]);
            Alert.alert('Sukses', `Berhasil menambahkan Extend Garansi selama ${durasi} hari!`);
        }
        setIsGaransiModalVisible(false);
        setEditingGaransiId(undefined);
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <HeaderNavigator
                title={isFetching ? "MEMUAT DATA..." : "DETAIL SALES ORDER"}
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
                        <SOEditSkeleton />
                    </Animated.View>
                ) : (
                    <>
                        <Animated.View key="content" entering={FadeIn.duration(400)} className="space-y-4">

                            {/* SECTION: ACTION BUTTONS (TOP) */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4" contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity className="bg-blue-400 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => navigation.goBack()}>
                                    <CornerDownLeft size={14} color="white" />
                                    <Text className="text-white text-xs font-bold ml-1">Kembali</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="bg-gray-800 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => Alert.alert('Info', 'Fitur Print belum diimplementasikan')}>
                                    <Printer size={14} color="white" />
                                    <Text className="text-white text-xs font-bold ml-1">Print</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="bg-cyan-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => Alert.alert('Info', 'Fitur Print Q belum diimplementasikan')}>
                                    <Printer size={14} color="white" />
                                    <Text className="text-white text-xs font-bold ml-1">Print Q</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="bg-emerald-600 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => Alert.alert('Info', 'Fitur View Invoice belum diimplementasikan')}>
                                    <FileText size={14} color="white" />
                                    <Text className="text-white text-xs font-bold ml-1">View Invoice</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="bg-indigo-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => setIsGaransiModalVisible(true)}>
                                    <Shield size={14} color="white" />
                                    <Text className="text-white text-xs font-bold ml-1">Ext Garansi</Text>
                                </TouchableOpacity>
                            </ScrollView>

                            {/* SECTION: INFORMASI UMUM */}
                            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <Text className="text-xs font-bold text-gray-500 uppercase mb-4 border-b border-gray-100 pb-2">Informasi Umum</Text>
                                <DropdownStyled
                                    label="Sales Person"
                                    placeholder="Pilih Sales..."
                                    data={[{ label: 'Sales A', value: 'Sales A' }, { label: 'Sales B', value: 'Sales B' }, { label: 'Budi Santoso', value: 'Budi Santoso' }, { label: 'Siti Aminah', value: 'Siti Aminah' }]}
                                    value={formData.nm_karyawan}
                                    onChange={(v: string) => updateField('nm_karyawan', v)}
                                    disabled
                                />
                                <DropdownStyled
                                    label="Delivery To"
                                    placeholder="Pilih Customer..."
                                    data={[{ label: 'Customer A', value: 'Customer A' }, { label: 'PT. Maju Mundur', value: 'PT. Maju Mundur' }, { label: 'CV. Sentosa Abadi', value: 'CV. Sentosa Abadi' }]}
                                    value={formData.nm_customers}
                                    onChange={(v: string) => updateField('nm_customers', v)}
                                    disabled
                                />
                                <TextInputStyled label="Informasi Pembeli" placeholder="Informasi..." value={formData.customers_address} onChangeText={(v: string) => updateField('customers_address', v)} multiline readonly />
                                <TextInputStyled label="Estimasi Pengiriman" placeholder="DD-MM-YYYY" value={formData.date_estimasi} onChangeText={(v: string) => updateField('date_estimasi', v)} readonly />

                                <DropdownStyled
                                    label="Mata Uang"
                                    placeholder="Pilih Mata Uang"
                                    data={[{ label: 'IDR', value: 'IDR' }, { label: 'USD', value: 'USD' }]}
                                    value={formData.vcurrency}
                                    onChange={(v: string) => updateField('vcurrency', v)}
                                    disabled
                                />
                                <TextInputStyled label="Kurs" placeholder="0" value={formData.nkurs} onChangeText={(v: string) => updateField('nkurs', v)} keyboardType="numeric" readonly />
                                <DropdownStyled
                                    label="PPN"
                                    placeholder="Pilih PPN"
                                    data={[{ label: 'YA', value: '1' }, { label: 'TIDAK', value: '0' }]}
                                    value={formData.flag_ppn}
                                    onChange={(v: string) => updateField('flag_ppn', v)}
                                    disabled
                                />
                                <TextInputStyled label="Delivery Term" placeholder="Pilih Delivery Term..." value={formData.delivery_term} onChangeText={(v: string) => updateField('delivery_term', v)} readonly />

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
                                    disabled
                                />
                                {formData.freight === '3' && (
                                    <TextInputStyled label="Freight Charge (Rp)" placeholder="0" value={formData.freight_amount} onChangeText={(v: string) => updateField('freight_amount', v)} keyboardType="numeric" readonly />
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
                                    disabled
                                />
                                {formData.teknisi === '2' && (
                                    <DropdownStyled
                                        label="Opsi Customer"
                                        placeholder="Pilih..."
                                        data={[
                                            { label: 'Transportasi', value: '3' },
                                            { label: 'Akomodasi', value: '4' },
                                            { label: 'Transportasi & Akomodasi', value: '5' }
                                        ]}
                                        value={formData.teknisi_customer1_select}
                                        onChange={(v: string) => updateField('teknisi_customer1_select', v)}
                                        disabled
                                    />
                                )}
                                {formData.teknisi === '6' && (
                                    <TextInputStyled label="Teknisi Charge (Rp)" placeholder="0" value={formData.teknisi_amount} onChangeText={(v: string) => updateField('teknisi_amount', v)} keyboardType="numeric" readonly />
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
                                    disabled
                                />
                                {formData.forklift === '3' && (
                                    <TextInputStyled label="Forklift Charge (Rp)" placeholder="0" value={formData.forklift_amount} onChangeText={(v: string) => updateField('forklift_amount', v)} keyboardType="numeric" readonly />
                                )}

                                {/* SECTION: PEMBAYARAN */}
                                <Text className="text-xs font-bold text-gray-500 uppercase mb-4 mt-4 border-b border-gray-100 pb-2">Informasi Pembayaran</Text>
                                <TextInputStyled label="Tanggal SO" placeholder="DD-MM-YYYY" value={formData.date_so} onChangeText={(v: string) => updateField('date_so', v)} readonly />

                                <DropdownStyled
                                    label="Metode Payment"
                                    placeholder="Pilih Metode Payment"
                                    data={[{ label: 'Kredit', value: 'Kredit' }, { label: 'Tunai', value: 'Tunai' }]}
                                    value={formData.nm_type_pembayaran}
                                    onChange={(v: string) => updateField('nm_type_pembayaran', v)}
                                    disabled
                                />

                                {['Kredit'].includes(formData.nm_type_pembayaran || '') && (
                                    <View className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                                        <View className="flex-row gap-4">
                                            <View className="flex-1">
                                                <TextInputStyled label="DP (%)" placeholder="0" value={formData.ndp_persen} onChangeText={(v: string) => updateField('ndp_persen', v)} keyboardType="numeric" readonly />
                                            </View>
                                            <View className="flex-1">
                                                <TextInputStyled label="DP (Rp)" placeholder="0" value={formData.ndp_amount} onChangeText={(v: string) => updateField('ndp_amount', v)} keyboardType="numeric" readonly />
                                            </View>
                                        </View>
                                        <View className="flex-row gap-4 mb-[-16px]">
                                            <View className="flex-1">
                                                <TextInputStyled label="Tenor (Bulan)" placeholder="0" value={formData.ntenor} onChangeText={(v: string) => updateField('ntenor', v)} keyboardType="numeric" readonly />
                                            </View>
                                            <View className="flex-1">
                                                <TextInputStyled label="Cicilan (Rp)" placeholder="0" value={formData.ntenor_amount} onChangeText={(v: string) => updateField('ntenor_amount', v)} keyboardType="numeric" readonly />
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
                                    disabled
                                />
                                <DropdownStyled
                                    label="Waktu Bayar"
                                    placeholder="Pilih Waktu Bayar"
                                    data={[{ label: '30 Hari', value: '30 Hari' }, { label: 'COD', value: 'COD' }]}
                                    value={formData.nm_waktu_bayar}
                                    onChange={(v: string) => updateField('nm_waktu_bayar', v)}
                                    disabled
                                />
                                {/* SECTION: LAIN-LAIN */}
                                <Text className="text-xs font-bold text-gray-500 uppercase mb-4 mt-4 border-b border-gray-100 pb-2">Informasi Tambahan</Text>
                                <TextInputStyled label="Keterangan" placeholder="Keterangan tambahan..." value={formData.keterangan} onChangeText={(v: string) => updateField('keterangan', v)} multiline readonly />
                                <TextInputStyled label="Kode SO Excel" placeholder="Masukan Kode SO Excel..." value={formData.code_so_excel} onChangeText={(v: string) => updateField('code_so_excel', v)} readonly />
                                <TextInputStyled label="No PO Customer" placeholder="Masukan No PO..." value={formData.no_po_cust} onChangeText={(v: string) => updateField('no_po_cust', v)} readonly />
                                <TextInputStyled label="Success fee (Rp)" placeholder="0" value={formData.success_fee} onChangeText={(v: string) => updateField('success_fee', v)} keyboardType="numeric" readonly />
                                <TextInputStyled label="Internal Notes" placeholder="Catatan internal..." value={formData.internal_notes} onChangeText={(v: string) => updateField('internal_notes', v)} readonly />

                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 mt-4">
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
                                        </View>

                                        {(formData.items || []).length === 0 ? (
                                            <View className="p-4 items-center justify-center">
                                                <Text className="text-xs text-gray-400">Belum ada barang ditambahkan</Text>
                                            </View>
                                        ) : (
                                            (formData.items || []).map((item, index) => {
                                                const lineTotal = (parseInt(item.harga) || 0) * (parseInt(item.qty) || 0);
                                                return (
                                                    <TouchableOpacity
                                                        key={index}
                                                        className="flex-row p-2 border-b border-gray-100 items-center"
                                                        activeOpacity={0.7}
                                                        onPress={() => {
                                                            setEditingItemIndex(index);
                                                            setIsProductModalVisible(true);
                                                        }}
                                                    >
                                                        <Text className="w-10 text-xs text-gray-600 text-center">{index + 1}</Text>
                                                        <Text className="w-24 text-xs text-gray-800">{item.product_code}</Text>
                                                        <Text className="w-48 text-xs text-gray-800">{item.product_name}</Text>
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

                            {extGaransis.length > 0 && (
                                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
                                    <Text className="text-xs font-bold text-gray-500 uppercase mb-4 border-b border-gray-100 pb-2">Extend Garansi</Text>
                                    <View className="border border-gray-200 rounded-xl overflow-hidden">
                                        <View className="flex-row bg-gray-100 p-2 border-b border-gray-200">
                                            <Text className="flex-1 text-xs font-bold text-gray-600">Nama</Text>
                                            <Text className="w-24 text-xs font-bold text-gray-600 text-center">Status</Text>
                                            <Text className="w-32 text-xs font-bold text-gray-600 text-center">Aksi</Text>
                                        </View>
                                        {extGaransis.map((eg, idx) => (
                                            <View key={eg.id} className={`flex-row p-2 items-center ${idx < extGaransis.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                                <Text className="flex-1 text-xs text-gray-800">{eg.name}</Text>
                                                <View className="w-24 items-center justify-center">
                                                    <View className={`px-2 py-1 rounded-full ${eg.status === 'Disetujui' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                                        <Text className={`text-[10px] font-bold ${eg.status === 'Disetujui' ? 'text-emerald-700' : 'text-amber-700'}`}>{eg.status}</Text>
                                                    </View>
                                                </View>
                                                <View className="w-32 flex-row justify-center gap-3">
                                                    <TouchableOpacity onPress={() => {
                                                        setEditingGaransiId(eg.id);
                                                        setIsGaransiModalVisible(true);
                                                    }} className="p-1">
                                                        <Pencil size={16} color="#4F46E5" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => {
                                                        setExtGaransis(prev => prev.map(p => p.id === eg.id ? { ...p, status: 'Disetujui' } : p));
                                                    }} className="p-1">
                                                        <Check size={16} color="#10B981" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => {
                                                        setExtGaransis(prev => prev.filter(p => p.id !== eg.id));
                                                    }} className="p-1">
                                                        <Trash2 size={16} color="#EF4444" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                        </Animated.View>
                    </>
                )}
            </ScrollView>

            <ProductSOModal
                visible={isProductModalVisible}
                onClose={() => setIsProductModalVisible(false)}
                onSave={handleSaveItem}
                initialData={editingItemIndex !== undefined ? (formData.items || [])[editingItemIndex] : undefined}
                editIndex={editingItemIndex}
                readOnly
            />

            <ExtGaransiModal
                visible={isGaransiModalVisible}
                onClose={() => {
                    setIsGaransiModalVisible(false);
                    setEditingGaransiId(undefined);
                }}
                onSave={handleExtGaransi}
                initialDurasi={editingGaransiId ? extGaransis.find(e => e.id === editingGaransiId)?.durasi : undefined}
            />
        </KeyboardAvoidingView>
    );
}
