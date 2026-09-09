import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, Plus, CornerDownLeft, Pencil, Mail, Printer, X, FileText, Check, Edit3, Calendar } from 'lucide-react-native';
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
import { formatDate } from '../../../utils/helpers/date';
import Animated, { FadeIn, FadeInUp, FadeOut } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';
import { ProductQuotationModal } from '../components/ProductQuotationModal';
import { QuotationEditSkeleton } from '../skeleton/QuotationEditSkeleton';
import { ToastMessages } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ModalCancel } from '../../../components/ui/ModalCancel';
import { RefreshControl } from 'react-native';
import { formatInputNumber, parseInputNumber, formatRp } from '../../../utils/helpers/money';
import { ApprovalList, ApprovalItem } from '../components/Approval_List';
import { useCustomers } from '../../customers/hooks/useCustomers';
import { useEmployee } from '../../employee/hooks/useEmployee';
import { useQuotationProducts } from '../hooks/useQuotationProducts';
import { confirmQuotationToSO } from '../api/quotationApi';

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

const TextInputStyled = ({ label, placeholder, value, onChangeText, multiline, keyboardType, readonly, icon: Icon }: any) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-600 font-medium mb-1.5">{label}</Text>
        <View className={`border border-gray-200 rounded-lg flex-row items-center overflow-hidden ${readonly ? 'bg-gray-100' : 'bg-gray-50'}`}>
            {Icon && (
                <View className="pl-3">
                    <Icon size={16} color={readonly ? "#9ca3af" : "#6b7280"} />
                </View>
            )}
            <TextInput
                className={`flex-1 px-3 py-2.5 text-sm ${readonly ? 'text-gray-500' : 'text-gray-800'} ${multiline ? 'h-24' : ''}`}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'center'}
                keyboardType={keyboardType || 'default'}
                editable={!readonly}
            />
        </View>
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
    const { id, showSuccessToast, successMessage } = route.params as { id: string, showSuccessToast?: boolean, successMessage?: string };
    const { quotations, currentQuotation, fetchById, updateQuotation, addQuotation, validateForm, validateAddItem, validateConfirmSO } = useQuotations();
    const { allCustomers, fetchCustomers } = useCustomers();
    const { data: employees, loadData: loadEmployees } = useEmployee();
    const { kursUsd } = useQuotationProducts();

    const getStatusColor = (status?: string) => {
        if (!status) return 'bg-gray-100 text-gray-700';
        switch (status.toUpperCase()) {
            case 'DRAFT QUOTATION': return 'bg-gray-100 text-gray-700';
            case 'CANCEL QUOTATION': return 'bg-red-100 text-red-700';
            case 'APPROVED': return 'bg-green-100 text-green-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('error');
    type ModalType = 'SAVE' | 'SURVEY' | 'CONFIRM_SO' | null;
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [isModalCancelVisible, setIsModalCancelVisible] = useState(false);
    const [isCanceled, setIsCanceled] = useState(false);
    const [isSOConfirmed, setIsSOConfirmed] = useState(false);


    // Comprehensive Form State mapping
    const [formData, setFormData] = useState({
        sales_person_name: '',
        customer_name: '',
        informasi_pembeli: '',
        date_estimasi: '',
        mata_uang: '',
        kurs: '',
        ppn: '',
        delivery_term: '',

        freight: '1', // 1: EMM, 2: Customer bayar ditempat, 3: Customer Charge
        freight_charge: '0',

        teknisi: '1', // 1: EMM, 2: Customer, 6: Customer Charge
        teknisi_charge: '0',

        forklift: '1', // 1: EMM, 2: Customer sediakan sendiri, 3: Customer Charge
        forklift_charge: '0',

        date_so: new Date().toLocaleDateString('id-ID'),
        payment_method: '',
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
    const [isModalEmailVisible, setIsModalEmailVisible] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [isModalRevisionVisible, setIsModalRevisionVisible] = useState(false);
    const [isRevisionMode, setIsRevisionMode] = useState(false);

    // STATE: Approval List
    const [approvalData, setApprovalData] = useState<ApprovalItem[]>([]);

    const handleApprovalAction = (action: string, id: number) => {
        Alert.alert('Konfirmasi', `Apakah Anda yakin ingin melakukan ${action} pada approval ini?`, [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Ya',
                onPress: () => {
                    setToastType('success');
                    setToastMessage(`Berhasil melakukan ${action}`);
                    setToastVisible(true);
                }
            }
        ]);
    };

    const ensureOption = (val: string, opts: { label: string, value: string }[]) => {
        if (!val) return opts;
        if (opts.find(o => String(o.value) === String(val))) return opts;
        return [{ label: val, value: val }, ...opts];
    };

    const loadInitialData = async () => {
        setIsFetching(true);
        try {
            await fetchById(id);
        } catch (error) {
            setToastType('error');
            setToastMessage('Gagal memuat detail data');
            setToastVisible(true);
        }
    };

    useEffect(() => {
        fetchCustomers();
        loadEmployees();
    }, []);

    useEffect(() => {
        if (currentQuotation && currentQuotation.id_quotation === id) {
            setFormData(prev => ({
                ...prev,
                customer_name: currentQuotation.customer_id || '',
                sales_person_name: currentQuotation.sales_person_id || '',
                mata_uang: currentQuotation.mata_uang || 'IDR',
                total: currentQuotation.total?.toString() || '0',
                keterangan: currentQuotation.keterangan || '',
                items: currentQuotation.items || [],
                date_so: currentQuotation.date_so || prev.date_so,

                // Set other fields matching currentQuotation values
                delivery_to: currentQuotation.delivery_to || '',
                informasi_pembeli: currentQuotation.informasi_pembeli || '',
                date_estimasi: currentQuotation.estimasi_pengiriman || '',
                kurs: currentQuotation.kurs?.toString() || '1',
                ppn: currentQuotation.flag_ppn === 'Y' ? '1' : '0',
                delivery_term: currentQuotation.delivery_term_header || '',

                freight: currentQuotation.freight_type || '1',
                freight_charge: currentQuotation.freight_charge?.toString() || '0',
                teknisi: currentQuotation.teknisi_type || '1',
                teknisi_charge: currentQuotation.teknisi_charge?.toString() || '0',
                forklift: currentQuotation.forklift_type || '1',
                forklift_charge: currentQuotation.forklift_charge?.toString() || '0',

                payment_method: currentQuotation.metode_payment || '1',
                dp_persen: currentQuotation.dp_persen?.toString() || '0',
                dp_rp: currentQuotation.dp_amount?.toString() || '0',
                tenor: currentQuotation.tenor?.toString() || '0',
                cicilan_rp: currentQuotation.tenor_amount?.toString() || '0',
                payment_type: currentQuotation.tipe_pembayaran || '',
                payment_time: currentQuotation.waktu_bayar || '',

                code_so_excel: currentQuotation.code_so_excel || '',
                no_po_cust: currentQuotation.no_po_cust || '',
                success_fee: currentQuotation.success_fee?.toString() || '0',
                internal_notes: currentQuotation.internal_notes || '',
            }));

            if (currentQuotation.approvals) {
                setApprovalData(currentQuotation.approvals);
            }

            setIsFetching(false);
        }
    }, [currentQuotation]);

    const handleRefresh = () => {
        loadInitialData();
    };

    useEffect(() => {
        loadInitialData();

        if (showSuccessToast) {
            setToastType('success');
            setToastMessage('Data quotation berhasil disimpan');
            setToastVisible(true);

            navigation.setParams({ showSuccessToast: undefined } as never);
        }

        if (successMessage) {
            setToastType('success');
            setToastMessage(successMessage);
            setToastVisible(true);

            navigation.setParams({ successMessage: undefined } as never);
        }
    }, [id, quotations, showSuccessToast, successMessage, navigation]);

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
                date_so: formData.date_so,

                delivery_to: formData.customer_name,
                informasi_pembeli: formData.informasi_pembeli,
                estimasi_pengiriman: formData.date_estimasi,
                kurs: parseFloat(formData.kurs || '1'),
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

            if (isRevisionMode) {
                // Quotation Revision: buat quotation BARU berdasarkan data yang diedit
                const res = await addQuotation({
                    ...updatedQuotation,
                    is_revision: true,
                    id_so_reference: id
                });

                const msg = res.requires_approval ? 'Revisi dibuat (Menunggu Approval)' : 'Revisi Quotation baru berhasil dibuat!';

                // Menuju ke mode detail (tidak edit) pada penawaran baru
                navigation.replace('QuotationEdit', {
                    id: res.id_quotation,
                    successMessage: msg
                });
            } else {
                // Edit biasa: UPDATE data yang sudah ada
                const res = await updateQuotation(id, updatedQuotation);
                setIsEditing(false);
                setToastType(res.requires_approval ? 'warning' : 'success');
                setToastMessage(res.requires_approval ? 'Perubahan disimpan (Menunggu Approval)' : 'Perubahan penawaran berhasil disimpan!');
                setToastVisible(true);
            }
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
                    title: isRevisionMode ? "Buat Revisi Quotation" : "Simpan Perubahan",
                    message: isRevisionMode
                        ? "Anda akan membuat Quotation BARU sebagai revisi. Data ini tidak akan mengubah quotation yang sudah ada."
                        : "Apakah Anda yakin ingin menyimpan perubahan pada penawaran ini?",
                    onConfirm: handleConfirmSave,
                    confirmText: isRevisionMode ? "Ya, Buat Revisi!" : "Ya, Simpan"
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
                    onConfirm: async () => {
                        setActiveModal(null);
                        try {
                            const result = await confirmQuotationToSO(id);
                            if (result.status) {
                                setToastType('success');
                                setToastMessage('Berhasil Confirm SO. ' + result.new_code_so);
                                setToastVisible(true);

                                // Navigate to SO Edit Screen and reset stack to go back to SOList
                                (navigation as any).reset({
                                    index: 1,
                                    routes: [
                                        {
                                            name: 'Drawer',
                                            state: { routes: [{ name: 'SOList' }] }
                                        },
                                        {
                                            name: 'SOEdit',
                                            params: {
                                                id: id,
                                                successMessage: 'Berhasil Confirm SO. ' + result.new_code_so
                                            }
                                        }
                                    ]
                                });
                            } else {
                                setToastType('danger');
                                setToastMessage(result.message || 'Gagal Confirm SO');
                                setToastVisible(true);
                            }
                        } catch (e: any) {
                            setToastType('danger');
                            setToastMessage('Terjadi kesalahan koneksi');
                            setToastVisible(true);
                        }
                    },
                    confirmText: "Ya, Confirm"
                };
            default:
                return null;
        }
    };

    const modalProps = getModalProps();

    useEffect(() => {
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

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

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
                title="Ajukan Cancel Quotation ?"
                message="Cancel ini membutuhkan Approval director !"
                confirmText="Ya, Kirim!"
                cancelText="Tidak, batalkan!"
                onConfirm={async () => {
                    setIsModalCancelVisible(false);
                    setIsCanceled(true);
                    setIsEditing(false);
                    await sendNotification(
                        'Cancel Quotation Diajukan',
                        `Pengajuan cancel untuk quotation ${currentQuotation?.quotation_number || id} telah dikirimkan.`,
                        'Delete',
                        currentQuotation?.quotation_number || String(id)
                    );
                    setToastType('success');
                    setToastMessage('Pengajuan Cancel Quotation Berhasil');
                    setToastVisible(true);
                }}
                onCancel={() => setIsModalCancelVisible(false)}
            />

            <ModalConfirm
                visible={isModalRevisionVisible}
                title="Revisi Quotation ?"
                message="Anda akan membuat Quotation BARU sebagai revisi berdasarkan data ini. Quotation asli tidak akan diubah."
                confirmText="Ya, Lanjutkan Revisi!"
                cancelText="Tidak, batalkan!"
                onConfirm={() => {
                    setIsModalRevisionVisible(false);
                    setIsRevisionMode(true);
                    setIsEditing(true);
                }}
                onCancel={() => setIsModalRevisionVisible(false)}
            />

            <ModalConfirm
                visible={isModalEmailVisible}
                title="Kirim Email Quotation ?"
                message={`Tindakan ini akan mengirim email quotation ke: ${currentQuotation?.customers_email || '-'}`}
                confirmText="Ya, Kirim!"
                cancelText="Tidak, batalkan!"
                onConfirm={() => {
                    if (!currentQuotation?.customers_email) {
                        setToastType('error');
                        setToastMessage('Data customer tidak memiliki email!');
                        setToastVisible(true);
                    } else {
                        setIsModalEmailVisible(false);
                        setToastType('success');
                        setToastMessage(`Quotation berhasil dikirim ke ${currentQuotation.customers_email}`);
                        setToastVisible(true);
                    }
                }}
                onCancel={() => setIsModalEmailVisible(false)}
            />

            <HeaderNavigator
                title={isFetching ? "MEMUAT DATA..." : (isEditing ? "EDIT QUOTATION" : "DETAIL QUOTATION")}
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

                                    {/* MODE EDIT */}
                                    {isEditing && (
                                        <>
                                            <TouchableOpacity className="bg-emerald-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={handleSavePress}>
                                                <Save size={14} color="white" />
                                                <Text className="text-white text-xs font-bold ml-1">{isRevisionMode ? 'Simpan Revisi' : 'Simpan'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="bg-blue-400 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => {
                                                setIsEditing(false);
                                                setIsRevisionMode(false);
                                                loadInitialData();
                                            }}>
                                                <CornerDownLeft size={14} color="white" />
                                                <Text className="text-white text-xs font-bold ml-1">Batal</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

                                    {/* MODE VIEW DRAFT QUOTATION */}
                                    {!isEditing && !isSOConfirmed && currentQuotation?.status === 'DRAFT QUOTATION' && (
                                        <>
                                            <TouchableOpacity className="bg-amber-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => setIsEditing(true)}>
                                                <Pencil size={14} color="white" />
                                                <Text className="text-white text-xs font-bold ml-1">Edit</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="bg-emerald-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => Alert.alert('Confirm', 'Fitur Confirm Quotation belum diimplementasikan')}>
                                                <Check size={14} color="white" />
                                                <Text className="text-white text-xs font-bold ml-1">Confirm</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="bg-red-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => Alert.alert('Cancel', 'Fitur cancel belum diimplementasikan')}>
                                                <X size={14} color="white" />
                                                <Text className="text-white text-xs font-bold ml-1">Cancel</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

                                    {/* MODE VIEW QUOTATION (APPROVED) */}
                                    {!isEditing && !isSOConfirmed && currentQuotation?.status === 'QUOTATION' && (
                                        <>
                                            <TouchableOpacity className="bg-indigo-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => {
                                                setEmailInput(currentQuotation?.customers_email || '');
                                                setIsModalEmailVisible(true);
                                            }}>
                                                <Mail size={14} color="white" />
                                                <Text className="text-white text-xs font-bold ml-1">Kirim Email</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity className="bg-gray-800 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => navigation.navigate('QuotationEditPdf', { id })}>
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

                                            <TouchableOpacity className="bg-emerald-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => {
                                                const errorMessage = validateConfirmSO(approvalData);
                                                if (errorMessage) {
                                                    setToastType('warning');
                                                    setToastMessage(errorMessage);
                                                    setToastVisible(true);
                                                    Alert.alert('Warning', errorMessage); // Fallback if Toast fails to render
                                                } else {
                                                    setActiveModal('CONFIRM_SO');
                                                }
                                            }}>
                                                <Check size={14} color="white" />
                                                <Text className="text-white text-xs font-bold ml-1">Confirm to SO</Text>
                                            </TouchableOpacity>


                                            <TouchableOpacity className="bg-orange-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => setIsModalRevisionVisible(true)}>
                                                <Edit3 size={14} color="white" />
                                                <Text className="text-white text-xs font-bold ml-1">Quotation Revision</Text>
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
                                <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-2">
                                    <View>
                                        <Text className="text-xs font-bold text-gray-500 uppercase">Informasi Umum</Text>
                                        <Text className="text-sm font-bold text-gray-800 mt-1">{currentQuotation?.quotation_number}</Text>
                                    </View>
                                    <View className={`px-2.5 py-1 rounded-md ${getStatusColor(currentQuotation?.status).split(' ')[0]}`}>
                                        <Text className={`text-[10px] font-bold uppercase ${getStatusColor(currentQuotation?.status).split(' ')[1]}`}>{currentQuotation?.status}</Text>
                                    </View>
                                </View>
                                <View className="mb-4">
                                    <Text className="text-xs text-gray-600 font-medium mb-1.5">Sales Person</Text>
                                    <View className={`border border-gray-200 rounded-lg overflow-hidden`}>
                                        <Dropdown
                                            style={{ height: 44, paddingHorizontal: 12, backgroundColor: isEditing ? '#f9fafb' : '#f3f4f6' }}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Pilih Sales..."
                                            data={employees?.map((emp: any) => ({ label: emp.nm_karyawan, value: emp.id_karyawan?.toString() })) || []}
                                            value={formData.sales_person_name}
                                            onChange={(v: any) => updateField('sales_person_name', v.value)}
                                            disable={!isEditing}
                                        />
                                    </View>
                                </View>
                                <DropdownStyled
                                    label="Delivery To"
                                    placeholder="Pilih Customer..."
                                    data={allCustomers?.map((c: any) => ({ label: c.nm_customers, value: c.id_customers.toString() })) || []}
                                    value={formData.customer_name}
                                    onChange={(v: any) => {
                                        updateField('customer_name', v);
                                        const customer = allCustomers?.find((c: any) => c.id_customers.toString() === v);
                                        if (customer) {
                                            updateField('informasi_pembeli', customer.customers_address);
                                        }
                                    }}
                                    disabled={!isEditing}
                                />
                                <TextInputStyled label="Informasi Pembeli" placeholder="Informasi..." value={formData.informasi_pembeli} onChangeText={(v: string) => updateField('informasi_pembeli', v)} multiline readonly />
                                <TextInputStyled label="Estimasi Pengiriman" placeholder="DD-MM-YYYY" icon={Calendar} value={(!isEditing && formData.date_estimasi) ? (() => {
                                    try {
                                        const d = new Date(formData.date_estimasi);
                                        return isNaN(d.getTime()) ? formData.date_estimasi : formatDate(d);
                                    } catch {
                                        return formData.date_estimasi;
                                    }
                                })() : formData.date_estimasi} onChangeText={(v: string) => updateField('date_estimasi', v)} readonly={!isEditing} />

                                <DropdownStyled
                                    label="Mata Uang"
                                    placeholder="Pilih Mata Uang..."
                                    data={MATA_UANG_OPTIONS}
                                    value={formData.mata_uang}
                                    onChange={(v: string) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            mata_uang: v as any,
                                            kurs: v === 'IDR' ? kursUsd.toString() : '1'
                                        }));
                                    }}
                                    disabled={!isEditing}
                                />
                                <TextInputStyled label="Kurs" placeholder="0" value={formatInputNumber(formData.kurs)} onChangeText={(v: string) => updateField('kurs', parseInputNumber(v))} keyboardType="numeric" readonly={!isEditing} />

                                <DropdownStyled
                                    label="PPN"
                                    placeholder="Pilih PPN"
                                    data={PPN_OPTIONS}
                                    value={formData.ppn}
                                    onChange={(v: string) => updateField('ppn', v)}
                                    disabled={!isEditing}
                                />
                                <DropdownStyled
                                    label="Delivery Term"
                                    placeholder="Pilih Delivery Term..."
                                    data={DELIVERY_TERM_OPTIONS}
                                    value={formData.delivery_term}
                                    onChange={(v: string) => updateField('delivery_term', v)}
                                    disabled={!isEditing}
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
                                <TextInputStyled label="Tanggal SO" placeholder="DD-MM-YYYY" icon={Calendar} value={formData.date_so ? (() => {
                                    try {
                                        const d = new Date(formData.date_so);
                                        return isNaN(d.getTime()) ? formData.date_so : formatDate(d);
                                    } catch {
                                        return formData.date_so;
                                    }
                                })() : formData.date_so} onChangeText={(v: string) => updateField('date_so', v)} readonly />

                                <DropdownStyled
                                    label="Metode Payment"
                                    placeholder="Pilih Metode Payment"
                                    data={METODE_PAYMENT_OPTIONS}
                                    value={formData.payment_method}
                                    onChange={(v: string) => updateField('payment_method', v)}
                                    disabled={!isEditing}
                                />

                                <View className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100 mt-2">
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

                                <DropdownStyled
                                    label="Tipe Pembayaran"
                                    placeholder="Pilih Tipe Pembayaran"
                                    data={CARA_PEMBAYARAN_OPTIONS_MAP[formData.payment_method] || []}
                                    value={formData.payment_type}
                                    onChange={(v: string) => updateField('payment_type', v)}
                                    disabled={!isEditing}
                                />
                                <DropdownStyled
                                    label="Waktu Bayar"
                                    placeholder="Pilih Waktu Bayar"
                                    data={WAKTU_BAYAR_OPTIONS}
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

                            {/* SECTION: APPROVAL LIST */}
                            {!isEditing && (
                                <ApprovalList
                                    data={approvalData}
                                    onApprove={(id) => handleApprovalAction('Approve', id)}
                                    onReject={(id) => handleApprovalAction('Reject', id)}
                                    onIgnore={(id) => handleApprovalAction('Ignore', id)}
                                    onRequestApproval={(id) => handleApprovalAction('Request Approval', id)}
                                />
                            )}

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
                kurs={parseFloat(formData.kurs?.toString() || '1') || 1}
                flag_agent={
                    (() => {
                        const sales = employees?.find((emp: any) => emp.id_karyawan === formData.sales_person_name);
                        return (sales?.flag_sales == 1 && sales?.flag_agent == 1) ? '1' : '0';
                    })()
                }
                readOnly={!isEditing}
            />

            <ToastMessages
                visible={toastVisible}
                message={toastMessage}
                type={toastType}
                onClose={() => setToastVisible(false)}
            />
        </KeyboardAvoidingView>
    );
}
