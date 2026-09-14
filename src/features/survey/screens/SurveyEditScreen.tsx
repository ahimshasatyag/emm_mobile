import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CornerDownLeft, CheckCircle, XCircle, Edit, Save, Plus, Trash2, Calendar } from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSurvey } from '../hooks/useSurvey';
import { useSO } from '../../so/hooks/useSO';
import { SurveyEditSkeleton } from '../skeleton/SurveyEditSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { Button } from '../../../components/ui/button';
import { ProductSurveyModal } from '../components/ProductSurveyModal';
import { formatDate } from '../../../utils/helpers/date';

const TextInputStyled = ({ label, value, onChangeText, multiline, editable }: any) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-600 font-medium mb-1.5">{label}</Text>
        <TextInput
            className={`border border-gray-200 rounded-lg px-3 py-2.5 text-sm ${editable ? 'bg-gray-50 text-gray-800' : 'bg-gray-100 text-gray-800'} ${multiline ? 'h-24' : ''}`}
            value={value || ''}
            onChangeText={onChangeText}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            editable={editable}
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

const MultiSelectStyled = ({ label, placeholder, data, value, onChange, disabled }: any) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-600 font-medium mb-1.5">{label}</Text>
        <View className={`border border-gray-200 rounded-lg overflow-hidden ${disabled ? 'bg-gray-100 opacity-70' : 'bg-gray-50'}`}>
            <MultiSelect
                style={{ minHeight: 44, paddingHorizontal: 12, paddingVertical: 8 }}
                data={data}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disable={disabled}
                containerStyle={{ borderRadius: 8, marginTop: 4, overflow: 'hidden' }}
                placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
            />
        </View>
    </View>
);

export function SurveyEditScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { loadSurveyDetail, confirmSurvey, cancelSurvey, currentSurvey, isLoading, modifySurvey, loadSupportData, supportData } = useSurvey();
    const { items: soList, loadList: loadSOList } = useSO();

    const [isFetching, setIsFetching] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [tujuanInput, setTujuanInput] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [formData, setFormData] = useState({
        id_so: '',
        date_request: '',
        date_pelaksana: '',
        id_karyawan: '',
        id_customers: '',
        id_customers_contact: '',
        pelaksana_survey: '0',
        id_survey_jenis: [] as string[],
        tujuan_survey: [] as string[],
        items: [] as any[],
        note_survey: ''
    });

    const fetchData = async () => {
        setIsFetching(true);
        try {
            await loadSOList();
            if (route.params?.id) {
                const detail = await loadSurveyDetail(route.params.id);
                const surveyData = detail.data_header || detail;

                await loadSupportData(surveyData.id_so);

                setFormData({
                    id_so: surveyData.id_so || '',
                    date_request: surveyData.date_request || new Date().toISOString().split('T')[0],
                    date_pelaksana: surveyData.date_pelaksana || '',
                    id_karyawan: surveyData.id_karyawan?.toString() || '',
                    id_customers: surveyData.id_customers?.toString() || '',
                    id_customers_contact: surveyData.id_customers_contact?.toString() || '',
                    pelaksana_survey: surveyData.pelaksana_afs == 1 || surveyData.pelaksana_afs == true ? '1' : '0',
                    id_survey_jenis: (detail.data_detail_jenis || []).map((j: any) => j.id_survey_jenis?.toString()),
                    tujuan_survey: (detail.data_detail_tujuan || []).map((t: any) => t.tujuan_survey),
                    items: (detail.data_detail_product || []).map((p: any) => ({
                        id_product: p.id_product,
                        code_product: p.code_product,
                        nm_product: p.nm_product,
                        product_berat: p.product_berat
                    })),
                    note_survey: surveyData.note_survey || ''
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Data Survey tidak ditemukan', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [route.params?.id]);

    const handleEditStart = () => {
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        if (currentSurvey) {
            const surveyData = currentSurvey.data_header || currentSurvey;
            setFormData({
                id_so: surveyData.id_so || '',
                date_request: surveyData.date_request || new Date().toISOString().split('T')[0],
                date_pelaksana: surveyData.date_pelaksana || '',
                id_karyawan: surveyData.id_karyawan?.toString() || '',
                id_customers: surveyData.id_customers?.toString() || '',
                id_customers_contact: surveyData.id_customers_contact?.toString() || '',
                pelaksana_survey: surveyData.pelaksana_afs == 1 || surveyData.pelaksana_afs == true ? '1' : '0',
                id_survey_jenis: (currentSurvey.data_detail_jenis || []).map((j: any) => j.id_survey_jenis?.toString()),
                tujuan_survey: (currentSurvey.data_detail_tujuan || []).map((t: any) => t.tujuan_survey),
                items: (currentSurvey.data_detail_product || []).map((p: any) => ({
                    id_product: p.id_product,
                    code_product: p.code_product,
                    nm_product: p.nm_product,
                    product_berat: p.product_berat
                })),
                note_survey: surveyData.note_survey || ''
            });
        }
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!formData.id_karyawan) return Alert.alert('Error', 'Sales / Karyawan harus dipilih');
        if (!formData.id_customers) return Alert.alert('Error', 'Customer harus dipilih');

        const payload: any = {
            id_so: formData.id_so,
            id_karyawan: formData.id_karyawan,
            id_customers: formData.id_customers,
            id_customers_contact: formData.id_customers_contact,
            pelaksana_survey: formData.pelaksana_survey === '1' ? '1' : null,
            date_request: formData.date_request,
            id_survey_jenis: formData.id_survey_jenis,
            jml_tujuan_survey: formData.tujuan_survey.length - 1,
            jml_barang: formData.items.length - 1,
        };

        formData.tujuan_survey.forEach((tujuan, index) => {
            payload[`tujuan_survey${index}`] = tujuan;
        });

        formData.items.forEach((item, index) => {
            payload[`id_product${index}`] = item.id_product;
            payload[`product_berat${index}`] = item.product_berat || 0;
        });

        try {
            await modifySurvey(route.params.id, payload);
            Alert.alert('Sukses', 'Survey berhasil diperbarui');
            setIsEditing(false);
            fetchData();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Gagal memperbarui Survey');
        }
    };

    const handleConfirm = async () => {
        Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin mengkonfirmasi survey ini?', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Ya, Confirm',
                onPress: async () => {
                    try {
                        await confirmSurvey(route.params.id);
                        Alert.alert('Sukses', 'Survey berhasil dikonfirmasi');
                        fetchData();
                    } catch (e: any) {
                        Alert.alert('Error', e.message || 'Gagal konfirmasi');
                    }
                }
            }
        ]);
    };

    const handleCancel = async () => {
        Alert.alert('Batal', 'Apakah Anda yakin ingin membatalkan survey ini?', [
            { text: 'Tutup', style: 'cancel' },
            {
                text: 'Ya, Batal',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await cancelSurvey(route.params.id);
                        Alert.alert('Sukses', 'Survey berhasil dibatalkan');
                        fetchData();
                    } catch (e: any) {
                        Alert.alert('Error', e.message || 'Gagal membatalkan');
                    }
                }
            }
        ]);
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSOChange = async (val: string) => {
        updateField('id_so', val);
        if (val) {
            setIsFetching(true);
            try {
                const data = await loadSupportData(val);
                if (data && data.data_header_so) {
                    setFormData(prev => ({
                        ...prev,
                        id_customers: data.data_header_so.id_customers?.toString(),
                        id_customers_contact: '',
                    }));
                }
            } finally {
                setIsFetching(false);
            }
        }
    };

    const handleAddTujuan = () => {
        if (tujuanInput.trim()) {
            setFormData(prev => ({ ...prev, tujuan_survey: [...prev.tujuan_survey, tujuanInput.trim()] }));
            setTujuanInput('');
        }
    };

    const handleRemoveTujuan = (index: number) => {
        setFormData(prev => ({ ...prev, tujuan_survey: prev.tujuan_survey.filter((_, i) => i !== index) }));
    };

    const handleAddItem = (item: any) => {
        setFormData(prev => ({ ...prev, items: [...prev.items, item] }));
        setIsProductModalVisible(false);
    };

    const handleRemoveItem = (index: number) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };

    if (isFetching || !currentSurvey) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator title="MEMUAT DATA..." showBackButton onBackPress={() => navigation.goBack()} />
                <SurveyEditSkeleton />
            </View>
        );
    }

    const survey = currentSurvey.data_header || currentSurvey;
    const detail_pelaksana = currentSurvey.data_detail_pelaksana || [];
    const detail_biaya = currentSurvey.data_detail_biaya || [];
    // Prepare dropdown options
    const soOptions = soList?.map(so => ({ label: `${so.code_so} - ${so.nm_customers}`, value: so.id_so })) || [];
    const karyawanOptions = supportData?.data_karyawan?.map((k: any) => ({ label: k.nm_karyawan, value: k.id_karyawan.toString() })) || [];
    const surveyJenisOptions = supportData?.data_survey_jenis?.map((j: any) => ({ label: j.nm_survey_jenis, value: j.id_survey_jenis.toString() })) || [];
    const contactOptions = supportData?.data_customers_contact?.map((c: any) => ({ label: c.nm_customers_contact, value: c.id_customers_contact.toString() })) || [];
    const customerName = supportData?.data_header_so?.nm_customers || currentSurvey?.data_header?.nm_customers || 'Pilih SO terlebih dahulu';

    // Auto-computed fields
    const selectedKaryawan = supportData?.data_karyawan?.find((k: any) => k.id_karyawan.toString() === formData.id_karyawan);
    const divisi = selectedKaryawan?.nm_karyawan_divisi || currentSurvey?.data_header?.nm_karyawan_divisi || '';

    const selectedContact = supportData?.data_customers_contact?.find((c: any) => c.id_customers_contact.toString() === formData.id_customers_contact);
    const telp = selectedContact?.customers_contact_mobile || currentSurvey?.data_header?.customers_contact_mobile || '';

    const selectedCustomer = soList?.find((so: any) => so.id_customers?.toString() === formData.id_customers) || supportData?.data_header_so || currentSurvey?.data_header;
    const alamat = selectedCustomer?.customers_address || '';

    return (
        <KeyboardAvoidingView className="flex-1 bg-gray-50" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <HeaderNavigator title={isEditing ? "EDIT SURVEY" : "DETAIL SURVEY"} showBackButton onBackPress={() => navigation.goBack()} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isFetching} onRefresh={fetchData} colors={[theme.colors.primary]} />}
            >
                <Animated.View key="content" entering={FadeIn.duration(400)} className="space-y-4">

                    {/* SECTION: ACTION BUTTONS (TOP) */}
                    {!isEditing && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4" contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}>

                            {survey.survey_status?.toLowerCase() === 'draft' && (
                                <>
                                    <TouchableOpacity className="bg-yellow-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={handleEditStart}>
                                        <Edit size={14} color="white" />
                                        <Text className="text-white text-xs font-bold ml-1">Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="bg-emerald-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={handleConfirm}>
                                        <CheckCircle size={14} color="white" />
                                        <Text className="text-white text-xs font-bold ml-1">Confirm</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="bg-red-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={handleCancel}>
                                        <XCircle size={14} color="white" />
                                        <Text className="text-white text-xs font-bold ml-1">Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    )}

                    {/* SECTION: INFORMASI UTAMA */}
                    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                        <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-2">
                            <View>
                                <Text className="text-xs font-bold text-gray-500 uppercase">Informasi Utama</Text>
                                <Text className="text-[16px] text-gray-800 font-bold mt-1">{survey.code_survey}</Text>
                            </View>
                            <View className="bg-gray-100 px-2 py-1 rounded">
                                <Text className="text-xs font-bold text-gray-700">{survey.survey_status}</Text>
                            </View>
                        </View>

                        {isEditing ? (
                            <DropdownStyled
                                label="Yang Mengajukan"
                                placeholder="Pilih Karyawan..."
                                data={karyawanOptions}
                                value={formData.id_karyawan}
                                onChange={(v: string) => updateField('id_karyawan', v)}
                            />
                        ) : (
                            <TextInputStyled label="Yang Mengajukan" value={survey.nm_karyawan} editable={false} />
                        )}

                        <TextInputStyled label="Divisi" value={divisi} editable={false} />

                        <TextInputStyled label="Nama Customer" value={customerName} editable={false} />

                        {isEditing ? (
                            <DropdownStyled
                                label="Contact Person"
                                placeholder="Pilih PIC..."
                                data={contactOptions}
                                value={formData.id_customers_contact}
                                onChange={(v: string) => updateField('id_customers_contact', v)}
                            />
                        ) : (
                            <TextInputStyled label="Contact Person" value={survey.nm_customers_contact} editable={false} />
                        )}

                        <View className="mb-4">
                            <Text className="text-xs text-gray-600 font-medium mb-1.5">Pelaksana Survey</Text>
                            <View className="flex-row items-center mt-1">
                                <View className="flex-row items-center mr-4 opacity-70">
                                    <View className="w-5 h-5 rounded border border-blue-500 bg-blue-500 items-center justify-center mr-2">
                                        <Text className="text-white text-xs">✓</Text>
                                    </View>
                                    <Text className="text-sm text-gray-700">Gudang</Text>
                                </View>
                                {isEditing ? (
                                    <TouchableOpacity
                                        className="flex-row items-center"
                                        onPress={() => updateField('pelaksana_survey', formData.pelaksana_survey === '1' ? '0' : '1')}
                                    >
                                        <View className={`w-5 h-5 rounded border mr-2 items-center justify-center ${formData.pelaksana_survey === '1' ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'}`}>
                                            {formData.pelaksana_survey === '1' && <Text className="text-white text-xs">✓</Text>}
                                        </View>
                                        <Text className="text-sm text-gray-700">AFS</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View className="flex-row items-center opacity-70">
                                        <View className={`w-5 h-5 rounded border mr-2 items-center justify-center ${survey.pelaksana_afs == 1 || survey.pelaksana_afs == true ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'}`}>
                                            {(survey.pelaksana_afs == 1 || survey.pelaksana_afs == true) && <Text className="text-white text-xs">✓</Text>}
                                        </View>
                                        <Text className="text-sm text-gray-700">AFS</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {isEditing ? (
                            <View className="mb-4">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Tanggal Pelaksana</Text>
                                <View className="bg-gray-100 border border-gray-200 rounded-lg h-[42px] flex-row items-center px-3">
                                    <Calendar color="#9CA3AF" size={18} />
                                    <Text className="ml-2 text-sm text-gray-800 flex-1">
                                        {formData.date_pelaksana ? formatDate(new Date(formData.date_pelaksana)) : '-'}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View className="mb-4">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Tanggal Pelaksana</Text>
                                <View className="bg-gray-100 border border-gray-200 rounded-lg h-[42px] flex-row items-center px-3">
                                    <Calendar color="#9CA3AF" size={18} />
                                    <Text className="ml-2 text-sm text-gray-800 flex-1">
                                        {survey.date_pelaksana ? formatDate(new Date(survey.date_pelaksana)) : '-'}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {isEditing ? (
                            <View className="mb-4">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Tanggal Request</Text>
                                <TouchableOpacity
                                    className="bg-gray-50 border border-gray-200 rounded-lg h-[42px] flex-row items-center px-3"
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Calendar color="#9CA3AF" size={18} />
                                    <Text className="ml-2 text-sm text-gray-800 flex-1">
                                        {formData.date_request ? formatDate(new Date(formData.date_request)) : '-'}
                                    </Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={formData.date_request ? new Date(formData.date_request) : new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={(event, date) => {
                                            setShowDatePicker(Platform.OS === 'ios');
                                            if (date) updateField('date_request', date.toISOString().split('T')[0]);
                                        }}
                                    />
                                )}
                            </View>
                        ) : (
                            <View className="mb-4">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Tanggal Request</Text>
                                <View className="bg-gray-100 border border-gray-200 rounded-lg h-[42px] flex-row items-center px-3">
                                    <Calendar color="#9CA3AF" size={18} />
                                    <Text className="ml-2 text-sm text-gray-800 flex-1">
                                        {survey.date_request ? formatDate(new Date(survey.date_request)) : '-'}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {isEditing ? (
                            <MultiSelectStyled
                                label="Jenis Survey"
                                placeholder="Pilih Jenis Survey..."
                                data={surveyJenisOptions}
                                value={formData.id_survey_jenis}
                                onChange={(val: string[]) => updateField('id_survey_jenis', val)}
                            />
                        ) : (
                            <View className="mb-4">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Jenis Survey</Text>
                                <View className="flex-row flex-wrap">
                                    {formData.id_survey_jenis.length > 0 ? (
                                        formData.id_survey_jenis.map((id: string, i: number) => {
                                            const jenisLabel = surveyJenisOptions.find(opt => opt.value === id)?.label || `Unknown (${id})`;
                                            return (
                                                <View key={i} className="bg-blue-100 px-2 py-1 rounded mr-2 mb-2">
                                                    <Text className="text-[10px] text-blue-700 font-bold">{jenisLabel}</Text>
                                                </View>
                                            );
                                        })
                                    ) : (
                                        <Text className="text-sm text-gray-800">-</Text>
                                    )}
                                </View>
                            </View>
                        )}

                        <TextInputStyled label="Alamat" value={alamat} editable={false} />

                        <TextInputStyled label="Telp" value={telp} editable={false} />

                        <View className="mb-4">
                            <Text className="text-xs text-gray-600 font-medium mb-1.5">Catatan</Text>
                            {isEditing ? (
                                <TextInput
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-800"
                                    value={formData.note_survey}
                                    onChangeText={(v: string) => updateField('note_survey', v)}
                                    placeholder="Masukkan catatan..."
                                    multiline
                                    numberOfLines={3}
                                    style={{ textAlignVertical: 'top' }}
                                />
                            ) : (
                                <Text className="text-sm text-gray-800">{survey.note_survey || '-'}</Text>
                            )}
                        </View>
                    {/* SECTION: PRODUK */}
                    <View className="mt-6 pt-6 border-t border-gray-100">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-xs font-bold text-gray-500 uppercase">Barang</Text>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                            <View className="border border-gray-200 overflow-hidden rounded-lg" style={{ width: 460 }}>
                                {/* Table Header */}
                                <View className="flex-row bg-gray-50 border-b border-gray-200">
                                    <View style={{ width: 40 }} className="p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600 text-center">No</Text></View>
                                    <View style={{ width: 120 }} className="p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600 text-center">Kode Barang</Text></View>
                                    <View style={{ width: 200 }} className="p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600 text-center">Nama Barang</Text></View>
                                    <View style={{ width: 100 }} className="p-2 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600 text-center">Berat(kg)</Text></View>
                                </View>

                                {/* Table Body */}
                                {formData.items.map((item: any, index: number) => (
                                    <View key={index} className="flex-row border-b border-gray-200 bg-white items-center">
                                        <View style={{ width: 40 }} className="p-2 border-r border-gray-200 items-center justify-center">
                                            <Text className="text-[10px] text-gray-700">{index + 1}</Text>
                                        </View>
                                        <View style={{ width: 120 }} className="p-2 border-r border-gray-200 justify-center">
                                            <Text className="text-[10px] text-gray-800 px-1">{item.code_product}</Text>
                                        </View>
                                        <View style={{ width: 200 }} className="p-2 border-r border-gray-200 justify-center">
                                            <Text className="text-[10px] text-gray-800 px-1">{item.nm_product}</Text>
                                        </View>
                                        <View style={{ width: 100 }} className="p-2 justify-center">
                                            {isEditing ? (
                                                <TextInput
                                                    className="border border-gray-200 rounded px-2 py-1 text-[10px] bg-white text-gray-800 m-1"
                                                    value={item.product_berat?.toString()}
                                                    keyboardType="numeric"
                                                    onChangeText={(val) => {
                                                        const newItems = [...formData.items];
                                                        newItems[index].product_berat = val;
                                                        setFormData(prev => ({ ...prev, items: newItems }));
                                                    }}
                                                />
                                            ) : (
                                                <Text className="text-[10px] text-gray-800 text-center">{item.product_berat || 0}</Text>
                                            )}
                                        </View>
                                    </View>
                                ))}
                                {(formData.items.length === 0) && (
                                    <View className="p-4 items-center">
                                        <Text className="text-xs text-gray-400 italic">Tidak ada barang</Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </View>

                    {/* SECTION: TUJUAN SURVEY */}
                    <View className="mt-6 pt-6 border-t border-gray-100">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-xs font-bold text-gray-500 uppercase">Tujuan Survey</Text>

                            {isEditing && (
                                <TouchableOpacity
                                    className="py-1.5 px-3 rounded"
                                    style={{ backgroundColor: theme.colors.primary }}
                                    onPress={() => setFormData(prev => ({ ...prev, tujuan_survey: [...prev.tujuan_survey, ''] }))}
                                >
                                    <Text className="text-white text-xs font-medium">Tambah Tujuan Survey</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View className="border border-gray-200 overflow-hidden rounded-t-lg">
                            {/* Table Header */}
                            <View className="flex-row bg-gray-50 border-b border-gray-200">
                                <View className="w-10 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600">No</Text></View>
                                <View className="flex-1 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600">Keterangan</Text></View>
                                {isEditing && <View className="w-12 p-2 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600">Aksi</Text></View>}
                            </View>

                            {/* Table Body */}
                            {formData.tujuan_survey.map((tj, index) => (
                                <View key={index} className="flex-row border-b border-gray-200 bg-white items-center">
                                    <View className="w-10 p-2 border-r border-gray-200 items-center justify-center">
                                        <Text className="text-[10px] text-gray-700">{index + 1}</Text>
                                    </View>
                                    <View className="flex-1 p-2 border-r border-gray-200 justify-center">
                                        {isEditing ? (
                                            <TextInput
                                                className="border border-gray-200 rounded px-2 py-1.5 text-xs bg-white text-gray-800 m-1"
                                                value={tj}
                                                onChangeText={(val) => {
                                                    const newTujuan = [...formData.tujuan_survey];
                                                    newTujuan[index] = val;
                                                    setFormData(prev => ({ ...prev, tujuan_survey: newTujuan }));
                                                }}
                                                placeholder="Keterangan..."
                                            />
                                        ) : (
                                            <Text className="text-[10px] text-gray-800 px-2 py-1.5">{tj}</Text>
                                        )}
                                    </View>
                                    {isEditing && (
                                        <View className="w-12 p-2 items-center justify-center">
                                            <TouchableOpacity onPress={() => handleRemoveTujuan(index)} className="bg-red-500 p-1.5 rounded">
                                                <Trash2 size={12} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            ))}
                            {(formData.tujuan_survey.length === 0) && (
                                <View className="p-4 items-center">
                                    <Text className="text-xs text-gray-400 italic">Tidak ada tujuan</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* SECTION: PELAKSANA SURVEY */}
                    <View className="mt-6 pt-6 border-t border-gray-100">
                        <Text className="text-xs font-bold text-gray-500 uppercase mb-4">Pelaksana Survey</Text>

                        <View className="flex-row bg-gray-50 border border-gray-200">
                            <View className="w-10 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600 text-center">No</Text></View>
                            <View className="flex-1 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600 text-center">Karyawan</Text></View>
                            <View className="flex-1 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600 text-center">Divisi</Text></View>
                            <View className="w-16 p-2 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600 text-center">Aksi</Text></View>
                        </View>

                        {detail_pelaksana.map((pelaksana: any, index: number) => (
                            <View key={index} className="flex-row border-b border-l border-r border-gray-200">
                                <View className="w-10 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] text-gray-700">{index + 1}</Text></View>
                                <View className="flex-1 p-2 border-r border-gray-200 justify-center"><Text className="text-[10px] text-gray-700 text-center">{pelaksana.nm_karyawan}</Text></View>
                                <View className="flex-1 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] text-gray-700 text-center">{pelaksana.divisi}</Text></View>
                                <View className="w-16 p-2 items-center justify-center"><Text className="text-[10px] text-gray-400">-</Text></View>
                            </View>
                        ))}
                        {(detail_pelaksana.length === 0) && (
                            <View className="border-b border-l border-r border-gray-200 p-4 items-center">
                                <Text className="text-xs text-gray-400 italic">Tidak ada pelaksana survey</Text>
                            </View>
                        )}
                    </View>

                    {/* SECTION: RINCIAN BIAYA SURVEY */}
                    <View className="mt-6 pt-6 border-t border-gray-100">
                        <Text className="text-xs font-bold text-gray-500 uppercase mb-4">Rincian Biaya Survey</Text>

                        <View className="flex-row bg-gray-50 border border-gray-200">
                            <View className="w-10 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600 text-center">No</Text></View>
                            <View className="flex-1 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600 text-center">Nominal</Text></View>
                            <View className="flex-1 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600 text-center">Keterangan</Text></View>
                            <View className="w-16 p-2 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600 text-center">Aksi</Text></View>
                        </View>

                        {detail_biaya.map((biaya: any, index: number) => (
                            <View key={index} className="flex-row border-b border-l border-r border-gray-200">
                                <View className="w-10 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] text-gray-700">{index + 1}</Text></View>
                                <View className="flex-1 p-2 border-r border-gray-200 justify-center"><Text className="text-[10px] text-gray-700 text-center">Rp {Number(biaya.nominal_biaya).toLocaleString('id-ID')}</Text></View>
                                <View className="flex-1 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] text-gray-700 text-center">{biaya.rincian_biaya}</Text></View>
                                <View className="w-16 p-2 items-center justify-center"><Text className="text-[10px] text-gray-400">-</Text></View>
                            </View>
                        ))}
                        {(detail_biaya.length === 0) && (
                            <View className="border-b border-l border-r border-gray-200 p-4 items-center">
                                <Text className="text-xs text-gray-400 italic">Tidak ada rincian biaya</Text>
                            </View>
                        )}
                    </View>
                </View>



                    {isEditing && (
                        <Animated.View entering={FadeInUp.delay(100)} className="mt-6 mb-8 flex-row">
                            <TouchableOpacity
                                onPress={handleEditCancel}
                                className="flex-1 h-14 bg-red-500 rounded-2xl flex-row items-center justify-center mr-2"
                                style={{ elevation: 4, shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                <XCircle color="white" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">Batal</Text>
                            </TouchableOpacity>

                            <Button
                                onPress={handleSave}
                                disabled={isLoading}
                                className="flex-1 h-14 rounded-2xl flex-row items-center justify-center ml-2"
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
                    )}

                </Animated.View>
            </ScrollView>

            <ProductSurveyModal
                visible={isProductModalVisible}
                onClose={() => setIsProductModalVisible(false)}
                onSave={handleAddItem}
                sourceData={supportData?.data_detail_so}
            />
        </KeyboardAvoidingView>
    );
}
