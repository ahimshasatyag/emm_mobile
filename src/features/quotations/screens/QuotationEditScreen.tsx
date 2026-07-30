import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, ArrowLeft, ChevronDown, Plus, CornerDownLeft, Pencil, Mail, Printer, X, FileText, Check } from 'lucide-react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useQuotations } from '../hooks/useQuotations';
import { Quotation } from '../types/quotation.types';
import Animated, { FadeIn, FadeInUp, FadeOut } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { ProductQuotationModal } from '../components/ProductQuotationModal';
import { QuotationEditSkeleton } from '../skeleton/QuotationEditSkeleton';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ModalCancel } from '../../../components/ui/ModalCancel';
import { ModalCreateInvoice } from '../components/ModalCreateInvoice';
import { RefreshControl } from 'react-native';
import { formatInputNumber, parseInputNumber, formatRp } from '../../../utils/helpers/money';

const { width } = Dimensions.get('window');

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

export function QuotationEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { id, showSuccessToast } = route.params as { id: string, showSuccessToast?: boolean };
    const { quotations, updateQuotation, validateForm, validateAddItem } = useQuotations();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');
    type ModalType = 'SAVE' | 'SURVEY' | 'CONFIRM_SO' | null;
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [isModalCancelVisible, setIsModalCancelVisible] = useState(false);
    const [isModalInvoiceVisible, setIsModalInvoiceVisible] = useState(false);
    const [isCanceled, setIsCanceled] = useState(false);
    const [isSOConfirmed, setIsSOConfirmed] = useState(false);

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
    const [isEditing, setIsEditing] = useState(false);

    const loadInitialData = () => {
        const quotation = quotations.find(q => q.id_quotation === id);
        if (quotation) {
            setFormData(prev => ({
                ...prev,
                customer_name: quotation.customer_name || '',
                sales_person_name: quotation.sales_person_name || '',
                mata_uang: quotation.mata_uang || 'IDR',
                total: quotation.total?.toString() || '0',
                keterangan: quotation.keterangan || '',
                items: quotation.items || [],
                date_so: quotation.date_so || prev.date_so,
            }));
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

        if (showSuccessToast) {
            setToastType('success');
            setToastMessage('Data quotation berhasil disimpan');
            setToastVisible(true);

            navigation.setParams({ showSuccessToast: undefined } as never);
        }
    }, [id, quotations, showSuccessToast]);

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
        setActiveModal('SAVE');
    };

    const handleConfirmSave = async () => {
        setActiveModal(null);
        const currentQuotation = quotations.find(q => q.id_quotation === id);
        if (!currentQuotation) return;

        setIsLoading(true);
        try {
            const updatedQuotation: Quotation = {
                ...currentQuotation,
                customer_name: formData.customer_name,
                sales_person_name: formData.sales_person_name,
                total: parseInt(formData.total) || 0,
                mata_uang: formData.mata_uang as any,
                keterangan: formData.keterangan,
                items: formData.items,
                date_so: formData.date_so
            };

            await updateQuotation(id, updatedQuotation);
            setIsEditing(false);
            setToastType('success');
            setToastMessage('Perubahan penawaran berhasil disimpan!');
            setToastVisible(true);
        } catch (err: any) {
            setToastType('error');
            setToastMessage(err.message || 'Terjadi kesalahan saat menyimpan');
            setToastVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    const getModalProps = () => {
        switch (activeModal) {
            case 'SAVE':
                return {
                    title: "Simpan Perubahan",
                    message: "Apakah Anda yakin ingin menyimpan perubahan pada penawaran ini?",
                    onConfirm: handleConfirmSave,
                    confirmText: "Ya, Simpan"
                };
            case 'SURVEY':
                return {
                    title: "Ajukan Survey",
                    message: "Apakah Anda yakin ingin menuju ke halaman pengajuan survey?",
                    onConfirm: () => {
                        setActiveModal(null);
                        navigation.navigate('QuotationEditSurvey', { showSurveyToast: true });
                    },
                    confirmText: "Ya, Lanjutkan"
                };
            case 'CONFIRM_SO':
                return {
                    title: "Confirm to SO",
                    message: "Apakah Anda yakin ingin melakukan Confirm to SO pada penawaran ini?",
                    onConfirm: () => {
                        setActiveModal(null);
                        setIsSOConfirmed(true);
                        setIsEditing(false);
                        setToastType('success');
                        setToastMessage('Berhasil Confirm SO');
                        setToastVisible(true);
                    },
                    confirmText: "Ya, Confirm"
                };
            default:
                return null;
        }
    };

    const modalProps = getModalProps();

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ToastMessages
                visible={toastVisible}
                message={toastMessage}
                type={toastType}
                onClose={() => setToastVisible(false)}
            />

            {modalProps && (
                <ModalConfirm
                    visible={!!activeModal}
                    title={modalProps.title}
                    message={modalProps.message}
                    onConfirm={modalProps.onConfirm}
                    onCancel={() => setActiveModal(null)}
                    confirmText={modalProps.confirmText}
                    cancelText="Batal"
                    isLoading={activeModal === 'SAVE' ? isLoading : false}
                />
            )}

            <ModalCancel
                visible={isModalCancelVisible}
                title="Batalkan Penawaran"
                message="Apakah Anda yakin ingin membatalkan penawaran ini?"
                onConfirm={() => {
                    setIsModalCancelVisible(false);
                    setIsCanceled(true);
                    setIsEditing(false);
                    setToastType('success');
                    setToastMessage('Quotation berhasil dibatalkan');
                    setToastVisible(true);
                }}
                onCancel={() => setIsModalCancelVisible(false)}
                confirmText="Ya, Batalkan"
                cancelText="Kembali"
            />

            <ModalCreateInvoice
                visible={isModalInvoiceVisible}
                onConfirm={(date) => {
                    setIsModalInvoiceVisible(false);
                    navigation.navigate('CustomerInvoiceEditScreen', { 
                        id: id, 
                        showInvoiceToast: true, 
                        fromCreateInvoice: true,
                        invoiceDate: date 
                    });
                }}
                onCancel={() => setIsModalInvoiceVisible(false)}
            />

            <HeaderNavigator
                title={isFetching ? "MEMUAT DATA..." : (isEditing ? "EDIT PENAWARAN" : "DETAIL PENAWARAN")}
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
                        <QuotationEditSkeleton />
                    </Animated.View>
                ) : (
                    <>
                        <Animated.View key="content" entering={FadeIn.duration(400)} className="space-y-4">

                            {/* SECTION: ACTION BUTTONS (TOP) */}
                            {!isCanceled && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4" contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}>
                                {isEditing && (
                                    <TouchableOpacity className="bg-blue-400 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => {
                                        setIsEditing(false);
                                        loadInitialData();
                                    }}>
                                        <CornerDownLeft size={14} color="white" />
                                        <Text className="text-white text-xs font-bold ml-1">Batal</Text>
                                    </TouchableOpacity>
                                )}
                                {!isSOConfirmed && (
                                    <TouchableOpacity
                                        className={`px-3 py-2 rounded flex-row items-center mr-2 ${isEditing ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                        onPress={() => {
                                            if (isEditing) {
                                                handleSavePress();
                                            } else {
                                                setIsEditing(true);
                                            }
                                        }}
                                    >
                                        {isEditing ? <Save size={14} color="white" /> : <Pencil size={14} color="white" />}
                                        <Text className="text-white text-xs font-bold ml-1">{isEditing ? 'Simpan' : 'Quotation Revision'}</Text>
                                    </TouchableOpacity>
                                )}

                                {!isEditing && !isSOConfirmed && (
                                    <>
                                        <TouchableOpacity className="bg-indigo-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => Alert.alert('Info', 'Fitur Kirim Email belum diimplementasikan')}>
                                            <Mail size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1">Kirim Email</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="bg-gray-800 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => Alert.alert('Info', 'Fitur Save PDF belum diimplementasikan')}>
                                            <Printer size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1">Save PDF</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="bg-red-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => setIsModalCancelVisible(true)}>
                                            <X size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1">Ajukan Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="bg-cyan-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => setActiveModal('SURVEY')}>
                                            <FileText size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1">Survey</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="bg-emerald-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => setActiveModal('CONFIRM_SO')}>
                                            <Check size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1">Confirm to SO</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                
                                {/* Jika mode SO Confirmed (override mode edit biasa) */}
                                {isSOConfirmed && !isEditing && (
                                    <>
                                        <TouchableOpacity className="bg-indigo-600 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => setIsModalInvoiceVisible(true)}>
                                            <FileText size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1">Create Invoice</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="bg-gray-800 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => Alert.alert('Info', 'Fitur Print belum diimplementasikan')}>
                                            <Printer size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1">Print</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="bg-blue-600 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => Alert.alert('Info', 'Fitur Print Q belum diimplementasikan')}>
                                            <Printer size={14} color="white" />
                                            <Text className="text-white text-xs font-bold ml-1">Print Q</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </ScrollView>
                            )}

                            {isCanceled && (
                                <View className="bg-red-100 p-3 rounded-lg mb-4 border border-red-200">
                                    <Text className="text-red-600 text-center font-bold text-xs">Penawaran ini telah dibatalkan</Text>
                                </View>
                            )}

                            {/* SECTION: INFORMASI UMUM */}
                            <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <Text className="text-xs font-bold text-gray-500 uppercase mb-4 border-b border-gray-100 pb-2">Informasi Umum</Text>
                                <DropdownStyled
                                    label="Sales Person"
                                    placeholder="Pilih Sales..."
                                    data={[{ label: 'Sales A', value: 'Sales A' }, { label: 'Sales B', value: 'Sales B' }]}
                                    value={formData.sales_person_name}
                                    onChange={(v: string) => updateField('sales_person_name', v)}
                                    disabled={!isEditing}
                                />
                                <DropdownStyled
                                    label="Delivery To"
                                    placeholder="Pilih Customer..."
                                    data={[{ label: 'Customer A', value: 'Customer A' }, { label: 'Customer B', value: 'Customer B' }]}
                                    value={formData.customer_name}
                                    onChange={(v: string) => updateField('customer_name', v)}
                                    disabled={!isEditing}
                                />
                                <TextInputStyled label="Informasi Pembeli" placeholder="Informasi..." value={formData.informasi_pembeli} onChangeText={(v: string) => updateField('informasi_pembeli', v)} multiline readonly />
                                <TextInputStyled label="Estimasi Pengiriman" placeholder="DD-MM-YYYY" value={formData.date_estimasi} onChangeText={(v: string) => updateField('date_estimasi', v)} readonly={!isEditing} />

                                <DropdownStyled
                                    label="Mata Uang"
                                    placeholder="Pilih Mata Uang"
                                    data={[{ label: 'IDR', value: 'IDR' }, { label: 'USD', value: 'USD' }]}
                                    value={formData.mata_uang}
                                    onChange={(v: string) => updateField('mata_uang', v)}
                                    disabled={!isEditing}
                                />
                                {formData.mata_uang === 'USD' && (
                                    <TextInputStyled label="Kurs" placeholder="0" value={formData.kurs} onChangeText={(v: string) => updateField('kurs', v)} keyboardType="numeric" readonly={!isEditing} />
                                )}

                                <DropdownStyled
                                    label="PPN"
                                    placeholder="Pilih PPN"
                                    data={[{ label: 'YA', value: '1' }, { label: 'TIDAK', value: '0' }]}
                                    value={formData.ppn}
                                    onChange={(v: string) => updateField('ppn', v)}
                                    disabled={!isEditing}
                                />
                                <TextInputStyled label="Delivery Term" placeholder="Pilih Delivery Term..." value={formData.delivery_term} onChangeText={(v: string) => updateField('delivery_term', v)} readonly={!isEditing} />

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
                                    disabled={!isEditing}
                                />
                                {formData.freight === '3' && (
                                    <TextInputStyled label="Freight Charge (Rp)" placeholder="0" value={formatInputNumber(formData.freight_charge)} onChangeText={(v: string) => updateField('freight_charge', parseInputNumber(v))} keyboardType="numeric" readonly={!isEditing} />
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
                                    disabled={!isEditing}
                                />
                                {formData.teknisi === '6' && (
                                    <TextInputStyled label="Teknisi Charge (Rp)" placeholder="0" value={formatInputNumber(formData.teknisi_charge)} onChangeText={(v: string) => updateField('teknisi_charge', parseInputNumber(v))} keyboardType="numeric" readonly={!isEditing} />
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
                                    disabled={!isEditing}
                                />
                                {formData.forklift === '3' && (
                                    <TextInputStyled label="Forklift Charge (Rp)" placeholder="0" value={formatInputNumber(formData.forklift_charge)} onChangeText={(v: string) => updateField('forklift_charge', parseInputNumber(v))} keyboardType="numeric" readonly={!isEditing} />
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
                                    disabled={!isEditing}
                                />

                                {['TOP', 'Leasing'].includes(formData.payment_method) && (
                                    <View className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                                        <View className="flex-row gap-4">
                                            <View className="flex-1">
                                                <TextInputStyled label="DP (%)" placeholder="0" value={formData.dp_persen} onChangeText={(v: string) => updateField('dp_persen', v)} keyboardType="numeric" readonly={!isEditing} />
                                            </View>
                                            <View className="flex-1">
                                                <TextInputStyled label="DP (Rp)" placeholder="0" value={formatInputNumber(formData.dp_rp)} onChangeText={(v: string) => updateField('dp_rp', parseInputNumber(v))} keyboardType="numeric" readonly={!isEditing} />
                                            </View>
                                        </View>
                                        <View className="flex-row gap-4 mb-[-16px]">
                                            <View className="flex-1">
                                                <TextInputStyled label="Tenor (Bulan)" placeholder="0" value={formData.tenor} onChangeText={(v: string) => updateField('tenor', v)} keyboardType="numeric" readonly={!isEditing} />
                                            </View>
                                            <View className="flex-1">
                                                <TextInputStyled label="Cicilan (Rp)" placeholder="0" value={formatInputNumber(formData.cicilan_rp)} onChangeText={(v: string) => updateField('cicilan_rp', parseInputNumber(v))} keyboardType="numeric" readonly={!isEditing} />
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
                                    disabled={!isEditing}
                                />
                                <DropdownStyled
                                    label="Waktu Bayar"
                                    placeholder="Pilih Waktu Bayar"
                                    data={[{ label: 'Sebelum Kirim', value: 'Sebelum Kirim' }, { label: 'Sesudah Kirim', value: 'Sesudah Kirim' }, { label: '14 Hari', value: '14 Hari' }]}
                                    value={formData.payment_time}
                                    onChange={(v: string) => updateField('payment_time', v)}
                                    disabled={!isEditing}
                                />
                                {/* SECTION: LAIN-LAIN */}
                                <Text className="text-xs font-bold text-gray-500 uppercase mb-4 mt-4 border-b border-gray-100 pb-2">Informasi Tambahan</Text>
                                <TextInputStyled label="Keterangan" placeholder="Keterangan tambahan..." value={formData.keterangan} onChangeText={(v: string) => updateField('keterangan', v)} multiline readonly={!isEditing} />
                                <TextInputStyled label="Kode SO Excel" placeholder="Masukan Kode SO Excel..." value={formData.code_so_excel} onChangeText={(v: string) => updateField('code_so_excel', v)} readonly={!isEditing} />
                                <TextInputStyled label="No PO Customer" placeholder="Masukan No PO..." value={formData.no_po_cust} onChangeText={(v: string) => updateField('no_po_cust', v)} readonly={!isEditing} />
                                <TextInputStyled label="Success fee (Rp)" placeholder="0" value={formatInputNumber(formData.success_fee)} onChangeText={(v: string) => updateField('success_fee', parseInputNumber(v))} keyboardType="numeric" readonly={!isEditing} />
                                <TextInputStyled label="Internal Notes" placeholder="Catatan internal..." value={formData.internal_notes} onChangeText={(v: string) => updateField('internal_notes', v)} readonly={!isEditing} />

                                {isEditing && (
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
                                )}
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className={`mb-4 ${!isEditing ? 'mt-4' : ''}`}>
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

                            {/* removed bottom buttons since they are moved to the top */}
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
                readOnly={!isEditing}
            />
        </KeyboardAvoidingView>
    );
}
