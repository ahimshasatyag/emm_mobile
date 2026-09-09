import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save, Plus, Calendar } from 'lucide-react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import {
    useQuotations,
    MATA_UANG_OPTIONS,
    PPN_OPTIONS,
    METODE_PAYMENT_OPTIONS,
    WAKTU_BAYAR_OPTIONS,
    DELIVERY_TERM_OPTIONS,
    CARA_PEMBAYARAN_OPTIONS_MAP
} from '../hooks/useQuotations';
import { Quotation } from '../types/quotation.types';
import Animated, { FadeIn, FadeInUp, FadeOut } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { ProductQuotationModal } from '../components/ProductQuotationModal';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { QuotationFormSkeleton } from '../skeleton/QuotationFormSkeleton';
import { RefreshControl } from 'react-native';
import { formatInputNumber, parseInputNumber, formatRp } from '../../../utils/helpers/money';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEmployee } from '../../employee/hooks/useEmployee';
import { useCustomers } from '../../customers/hooks/useCustomers';
import { useQuotationProducts } from '../hooks/useQuotationProducts';

const { width } = Dimensions.get('window');

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
    const { addQuotation, validateForm, validateAddItem } = useQuotations();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateEstimasiObj, setDateEstimasiObj] = useState(new Date());



    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDateEstimasiObj(selectedDate);
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            updateField('date_estimasi', `${day}-${month}-${year}`);
        }
    };

    const [showDateSO, setShowDateSO] = useState(false);
    const [dateSOObj, setDateSOObj] = useState(new Date());

    const onChangeDateSO = (event: any, selectedDate?: Date) => {
        setShowDateSO(Platform.OS === 'ios');
        if (selectedDate) {
            setDateSOObj(selectedDate);
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            updateField('date_so', `${day}-${month}-${year}`);
        }
    };

    const handleRefresh = () => {
        setIsFetching(true);
        setTimeout(() => setIsFetching(false), 1000);
    };

    const { data: employees, loadData: loadEmployees } = useEmployee();
    const { allCustomers, fetchCustomers } = useCustomers();
    const user = useAppSelector((state: any) => state.auth?.user);
    const { kursUsd } = useQuotationProducts();

    React.useEffect(() => {
        loadEmployees();
        fetchCustomers();
    }, []);

    React.useEffect(() => {
        if (formData.mata_uang === 'IDR' && kursUsd) {
            setFormData(prev => ({ ...prev, kurs: kursUsd.toString() }));
        }
    }, [kursUsd]);

    const salesOptions = employees?.map((emp: any) => ({
        label: emp.nm_karyawan,
        value: emp.id_karyawan
    })) || [];

    const customerOptions = allCustomers?.map((cust: any) => ({
        label: cust.nm_customers,
        value: cust.id_customers
    })) || [];


    // Comprehensive Form State mapping vformadd.php
    const today = new Date();
    const initialDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

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

        date_so: initialDate,
        payment_method: '1',
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

    React.useEffect(() => {
        let sum = 0;
        formData.items.forEach(item => {
            const itemTotal = (parseInt(item.harga) || 0) * (parseInt(item.qty) || 0);
            let optionsTotal = 0;
            if (item.options && Array.isArray(item.options)) {
                item.options.forEach((opt: any) => {
                    optionsTotal += (parseInt(opt.amount) || 0) * (parseInt(opt.qty) || 0);
                });
            }
            sum += itemTotal + optionsTotal;
        });
        if (formData.total !== sum.toString()) {
            setFormData(prev => ({ ...prev, total: sum.toString() }));
        }
    }, [formData.items]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState<number | undefined>(undefined);

    const handleSaveItem = (itemData: any, index?: number) => {
        if (index !== undefined) {
            const newItems = [...formData.items];
            newItems[index] = itemData;
            setFormData(prev => ({ ...prev, items: newItems }));
            setToastMessage('Data barang berhasil diperbarui');
        } else {
            setFormData(prev => ({ ...prev, items: [...prev.items, itemData] }));
            setToastMessage('Barang baru berhasil ditambahkan');
        }
        setIsModalVisible(false);
        setToastType('success');
        setToastVisible(true);
    };

    const handleDeleteItem = (index: number) => {
        const newItems = [...formData.items];
        newItems.splice(index, 1);
        setFormData(prev => ({ ...prev, items: newItems }));
        setIsModalVisible(false);
        setToastType('success');
        setToastMessage('Barang berhasil dihapus');
        setToastVisible(true);
    };

    const updateField = (key: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSavePress = () => {
        const errorMsg = validateForm(formData);
        if (errorMsg) {
            setToastType('error');
            setToastMessage(errorMsg);
            setToastVisible(true);
            return;
        }
        setIsModalConfirmVisible(true);
    };

    const handleConfirmSave = async () => {
        setIsModalConfirmVisible(false);
        setIsLoading(true);

        try {
            const newQuotation: Quotation = {
                id_quotation: '', // Akan di-generate dari backend
                quotation_number: '',
                date_so: formData.date_so,
                customer_id: formData.customer_name, // TODO: harusnya ngirim ID, sementara kirim nama
                customer_name: formData.customer_name,
                sales_person_id: formData.sales_person_name,
                sales_person_name: formData.sales_person_name,
                total: parseInt(formData.total) || 0,
                mata_uang: formData.mata_uang as any,
                created_by_name: user?.username,
                keterangan: formData.keterangan,
                items: formData.items,
                status: 'DRAFT QUOTATION',
                date_create: new Date().toISOString(),
                history: [],

                delivery_to: formData.customer_name,
                informasi_pembeli: formData.informasi_pembeli,
                estimasi_pengiriman: formData.date_estimasi,
                kurs: parseFloat(formData.kurs),
                flag_ppn: formData.ppn === '1' ? 'Y' : 'N',
                delivery_term_header: formData.delivery_term,

                freight_type: formData.freight,
                freight_charge: parseFloat(formData.freight_charge || '0'),
                teknisi_type: formData.teknisi,
                teknisi_charge: parseFloat(formData.teknisi_charge || '0'),
                forklift_type: formData.forklift,
                forklift_charge: parseFloat(formData.forklift_charge || '0'),

                metode_payment: formData.payment_method,
                dp_persen: parseFloat(formData.dp_persen || '0'),
                dp_amount: parseFloat(formData.dp_rp || '0'),
                tenor: parseInt(formData.tenor || '0'),
                tenor_amount: parseFloat(formData.cicilan_rp || '0'),
                tipe_pembayaran: formData.payment_type,
                waktu_bayar: formData.payment_time,

                code_so_excel: formData.code_so_excel,
                no_po_cust: formData.no_po_cust,
                success_fee: parseFloat(formData.success_fee || '0'),
                internal_notes: formData.internal_notes,
            };

            const created = await addQuotation(newQuotation);
            navigation.replace('QuotationEdit' as never, {
                id: created.id_quotation,
                showSuccessToast: true
            } as never);
        } catch (err: any) {
            setToastType('error');
            setToastMessage(err.message || 'Terjadi kesalahan');
            setToastVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ToastMessages
                visible={toastVisible}
                title='Validasi'
                message={toastMessage}
                type={toastType}
                onClose={() => setToastVisible(false)}
            />

            <ModalConfirm
                visible={isModalConfirmVisible}
                title="Simpan Penawaran"
                message="Apakah Anda yakin ingin menyimpan data penawaran ini?"
                onConfirm={handleConfirmSave}
                onCancel={() => setIsModalConfirmVisible(false)}
                confirmText="Ya, Simpan"
                cancelText="Batal"
                isLoading={isLoading}
            />

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
                                    data={salesOptions}
                                    value={formData.sales_person_name}
                                    onChange={(v: string) => updateField('sales_person_name', v)}
                                />
                                <DropdownStyled
                                    label="Delivery To"
                                    placeholder="Pilih Customer..."
                                    data={customerOptions}
                                    value={formData.customer_name}
                                    onChange={(v: string) => {
                                        const selectedCustomer = allCustomers?.find((c: any) => c.id_customers === v);
                                        setFormData(prev => ({
                                            ...prev,
                                            customer_name: v,
                                            informasi_pembeli: selectedCustomer?.customers_address || ''
                                        }));
                                    }}
                                />
                                <TextInputStyled label="Informasi Pembeli" placeholder="Informasi..." value={formData.informasi_pembeli} onChangeText={(v: string) => updateField('informasi_pembeli', v)} multiline readonly />

                                <View className="mb-4">
                                    <Text className="text-xs text-gray-600 font-medium mb-1.5">Estimasi Pengiriman</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowDatePicker(true)}
                                        className="border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 flex-row items-center"
                                    >
                                        <Calendar size={16} color="#6b7280" />
                                        <Text className={`text-sm ml-2 ${formData.date_estimasi ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {formData.date_estimasi || "DD-MM-YYYY"}
                                        </Text>
                                    </TouchableOpacity>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={dateEstimasiObj}
                                            mode="date"
                                            display="default"
                                            onChange={onChangeDate}
                                        />
                                    )}
                                </View>

                                <DropdownStyled
                                    label="Mata Uang"
                                    placeholder="Pilih Mata Uang"
                                    data={MATA_UANG_OPTIONS}
                                    value={formData.mata_uang}
                                    onChange={(v: string) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            mata_uang: v,
                                            kurs: v === 'IDR' ? kursUsd.toString() : '1'
                                        }));
                                    }}
                                />
                                <TextInputStyled label="Kurs" placeholder="0" value={formatInputNumber(formData.kurs)} onChangeText={(v: string) => updateField('kurs', parseInputNumber(v))} keyboardType="numeric" readonly />

                                <DropdownStyled
                                    label="PPN"
                                    placeholder="Pilih PPN"
                                    data={PPN_OPTIONS}
                                    value={formData.ppn}
                                    onChange={(v: string) => updateField('ppn', v)}
                                />
                                <DropdownStyled
                                    label="Delivery Term"
                                    placeholder="Pilih Delivery Term..."
                                    data={DELIVERY_TERM_OPTIONS}
                                    value={formData.delivery_term}
                                    onChange={(v: string) => updateField('delivery_term', v)}
                                />

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
                                    <TextInputStyled label="Freight Charge (Rp)" placeholder="0" value={formatInputNumber(formData.freight_charge)} onChangeText={(v: string) => updateField('freight_charge', parseInputNumber(v))} keyboardType="numeric" />
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
                                    <TextInputStyled label="Teknisi Charge (Rp)" placeholder="0" value={formatInputNumber(formData.teknisi_charge)} onChangeText={(v: string) => updateField('teknisi_charge', parseInputNumber(v))} keyboardType="numeric" />
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
                                    <TextInputStyled label="Forklift Charge (Rp)" placeholder="0" value={formatInputNumber(formData.forklift_charge)} onChangeText={(v: string) => updateField('forklift_charge', parseInputNumber(v))} keyboardType="numeric" />
                                )}

                                {/* SECTION: PEMBAYARAN */}
                                <Text className="text-xs font-bold text-gray-500 uppercase mb-4 mt-4 border-b border-gray-100 pb-2">Informasi Pembayaran</Text>

                                <View className="mb-4">
                                    <Text className="text-xs text-gray-600 font-medium mb-1.5">Tanggal SO</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowDateSO(true)}
                                        className="border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 flex-row items-center"
                                    >
                                        <Calendar size={16} color="#6b7280" />
                                        <Text className={`text-sm ml-2 ${formData.date_so ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {formData.date_so || "DD-MM-YYYY"}
                                        </Text>
                                    </TouchableOpacity>
                                    {showDateSO && (
                                        <DateTimePicker
                                            value={dateSOObj}
                                            mode="date"
                                            display="default"
                                            onChange={onChangeDateSO}
                                        />
                                    )}
                                </View>

                                <DropdownStyled
                                    label="Metode Payment"
                                    placeholder="Pilih Metode Payment"
                                    data={METODE_PAYMENT_OPTIONS}
                                    value={formData.payment_method}
                                    onChange={(v: string) => updateField('payment_method', v)}
                                />

                                {['1', '2', '3'].includes(formData.payment_method) && (
                                    <View className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                                        <View className="flex-row gap-4">
                                            <View className="flex-1">
                                                <TextInputStyled label="DP (%)" placeholder="0" value={formData.dp_persen} onChangeText={(v: string) => updateField('dp_persen', v)} keyboardType="numeric" />
                                            </View>
                                            <View className="flex-1">
                                                <TextInputStyled label="DP (Rp)" placeholder="0" value={formatInputNumber(formData.dp_rp)} onChangeText={(v: string) => updateField('dp_rp', parseInputNumber(v))} keyboardType="numeric" />
                                            </View>
                                        </View>
                                        <View className="flex-row gap-4 mb-[-16px]">
                                            <View className="flex-1">
                                                <TextInputStyled label="Tenor (Bulan)" placeholder="0" value={formData.tenor} onChangeText={(v: string) => updateField('tenor', v)} keyboardType="numeric" />
                                            </View>
                                            <View className="flex-1">
                                                <TextInputStyled label="Cicilan (Rp)" placeholder="0" value={formatInputNumber(formData.cicilan_rp)} onChangeText={(v: string) => updateField('cicilan_rp', parseInputNumber(v))} keyboardType="numeric" />
                                            </View>
                                        </View>
                                    </View>
                                )}

                                <DropdownStyled
                                    label="Tipe Pembayaran"
                                    placeholder="Pilih Tipe Pembayaran"
                                    data={CARA_PEMBAYARAN_OPTIONS_MAP[formData.payment_method] || []}
                                    value={formData.payment_type}
                                    onChange={(v: string) => updateField('payment_type', v)}
                                />
                                <DropdownStyled
                                    label="Waktu Bayar"
                                    placeholder="Pilih Waktu Bayar"
                                    data={WAKTU_BAYAR_OPTIONS}
                                    value={formData.payment_time}
                                    onChange={(v: string) => updateField('payment_time', v)}
                                />
                                {/* SECTION: LAIN-LAIN */}
                                <Text className="text-xs font-bold text-gray-500 uppercase mb-4 mt-4 border-b border-gray-100 pb-2">Informasi Tambahan</Text>
                                <TextInputStyled label="Keterangan" placeholder="Keterangan tambahan..." value={formData.keterangan} onChangeText={(v: string) => updateField('keterangan', v)} multiline />
                                <TextInputStyled label="Kode SO Excel" placeholder="Masukan Kode SO Excel..." value={formData.code_so_excel} onChangeText={(v: string) => updateField('code_so_excel', v)} />
                                <TextInputStyled label="No PO Customer" placeholder="Masukan No PO..." value={formData.no_po_cust} onChangeText={(v: string) => updateField('no_po_cust', v)} />
                                <TextInputStyled label="Success fee (Rp)" placeholder="0" value={formatInputNumber(formData.success_fee)} onChangeText={(v: string) => updateField('success_fee', parseInputNumber(v))} keyboardType="numeric" />
                                <TextInputStyled label="Internal Notes" placeholder="Catatan internal..." value={formData.internal_notes} onChangeText={(v: string) => updateField('internal_notes', v)} />

                                <View className="flex-row items-center justify-end mb-2 mt-2">
                                    <Button
                                        onPress={() => {
                                            const errorMsg = validateAddItem(formData);
                                            if (errorMsg) {
                                                setToastType('error');
                                                setToastMessage(errorMsg);
                                                setToastVisible(true);
                                                return;
                                            }
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
                                        <View className="flex-row gap-2 bg-gray-100 p-2 border-b border-gray-200">
                                            <Text className="w-10 text-xs font-bold text-gray-600 text-center">No</Text>
                                            <Text className="w-24 text-xs font-bold text-gray-600">Kode Barang</Text>
                                            <Text className="w-56 text-xs font-bold text-gray-600">Nama Barang</Text>
                                            <Text className="w-16 text-xs font-bold text-gray-600">Status</Text>
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
                                                let optionsTotal = 0;
                                                if (item.options && Array.isArray(item.options)) {
                                                    item.options.forEach((opt: any) => {
                                                        optionsTotal += (parseInt(opt.amount) || 0) * (parseInt(opt.qty) || 0);
                                                    });
                                                }
                                                const lineTotal = ((parseInt(item.harga) || 0) * (parseInt(item.qty) || 0)) + optionsTotal;
                                                return (
                                                    <TouchableOpacity
                                                        key={index}
                                                        className="flex-row gap-2 p-2 border-b border-gray-100 items-center"
                                                        activeOpacity={0.7}
                                                        onPress={() => {
                                                            setEditingItemIndex(index);
                                                            setIsModalVisible(true);
                                                        }}
                                                    >
                                                        <Text className="w-10 text-xs text-gray-600 text-center">{index + 1}</Text>
                                                        <Text className="w-24 text-xs text-gray-800">{item.product_code}</Text>
                                                        <Text className="w-56 text-xs text-gray-800">{item.product_name}</Text>
                                                        <Text className="w-16 text-xs text-gray-800">{item.status_barang}</Text>
                                                        <Text className="w-24 text-xs text-gray-800 text-right">{formatRp(item.harga)}</Text>
                                                        <Text className="w-16 text-xs text-gray-800 text-center">{item.qty}</Text>
                                                        <Text className="w-20 text-xs text-gray-800 text-center">{item.satuan}</Text>
                                                        <Text className="w-24 text-xs text-gray-800">{item.delivery_term}</Text>
                                                        <Text className="w-32 text-xs text-gray-800 text-right font-bold">{formatRp(lineTotal)}</Text>
                                                    </TouchableOpacity>
                                                );
                                            })
                                        )}
                                    </View>
                                </ScrollView>



                            </View>

                            <Animated.View entering={FadeInUp.delay(100)} className="mt-10 mb-8">
                                <Button
                                    onPress={handleSavePress}
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
                onDelete={handleDeleteItem}
                initialData={editingItemIndex !== undefined ? formData.items[editingItemIndex] : undefined}
                editIndex={editingItemIndex}
                mata_uang={formData.mata_uang}
                kurs={parseFloat(formData.kurs.toString()) || 1}
                flag_agent={
                    (() => {
                        const sales = employees?.find((emp: any) => emp.id_karyawan === formData.sales_person_name);
                        return (sales?.flag_sales == 1 && sales?.flag_agent == 1) ? '1' : '0';
                    })()
                }
            />
        </KeyboardAvoidingView>
    );
}
