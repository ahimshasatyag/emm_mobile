import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Plus, Trash2, Save, XCircle, Calendar } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInUp } from 'react-native-reanimated';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from '../../../components/ui/button';
import { useSurvey } from '../hooks/useSurvey';
import { useSO } from '../../so/hooks/useSO';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { theme } from '../../../theme/theme';
import { SurveyFormSkeleton } from '../skeleton/SurveyFormSkeleton';
import { ProductSurveyModal } from '../components/ProductSurveyModal';
import { formatDate } from '../../../utils/helpers/date';

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

export function SurveyFormScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { createNewSurvey, loadSupportData, supportData } = useSurvey();
    const { items: soList, loadList: loadSOList } = useSO();

    const [isFetching, setIsFetching] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);

    const [formData, setFormData] = useState({
        id_so: '',
        date_request: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        date_pelaksana: '',
        id_karyawan: '',
        id_customers: '',
        id_customers_contact: '',
        pelaksana_survey: '0', // 1 or 0
        id_survey_jenis: [] as string[],
        tujuan_survey: [] as string[],
        items: [] as any[],
        note_survey: ''
    });

    const [tujuanInput, setTujuanInput] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        // Since this is strictly Add mode, we only load support data
        const loadInitialData = async () => {
            setIsFetching(true);
            try {
                await loadSOList();
                await loadSupportData('');
            } finally {
                setIsFetching(false);
            }
        };
        loadInitialData();
    }, [loadSOList, loadSupportData]);

    const handleRefresh = async () => {
        setIsFetching(true);
        await loadSupportData(formData.id_so);
        setIsFetching(false);
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
                        id_customers_contact: '', // reset contact
                    }));
                }
            } finally {
                setIsFetching(false);
            }
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddTujuan = () => {
        if (tujuanInput.trim()) {
            setFormData(prev => ({ ...prev, tujuan_survey: [...prev.tujuan_survey, tujuanInput.trim()] }));
            setTujuanInput('');
        }
    };

    const handleRemoveTujuan = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tujuan_survey: prev.tujuan_survey.filter((_, i) => i !== index)
        }));
    };

    const handleAddItem = (item: any) => {
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
        if (!formData.id_karyawan) return Alert.alert('Error', 'Sales / Karyawan harus dipilih');
        if (!formData.id_customers) return Alert.alert('Error', 'Customer harus dipilih');
        if (!formData.id_customers_contact) return Alert.alert('Error', 'Contact Person harus dipilih');
        if (formData.id_survey_jenis.length === 0) return Alert.alert('Error', 'Pilih minimal 1 Jenis Survey');

        // Prepare backend payload mapping
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

        // map tujuan
        formData.tujuan_survey.forEach((tujuan, index) => {
            payload[`tujuan_survey${index}`] = tujuan;
        });

        // map items
        formData.items.forEach((item, index) => {
            payload[`id_product${index}`] = item.id_product;
            payload[`product_berat${index}`] = item.product_berat || 0;
        });

        try {
            await createNewSurvey(payload);
            Alert.alert('Sukses', 'Survey berhasil disimpan', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Gagal menyimpan Survey');
        }
    };

    // Prepare dropdown options
    const soOptions = soList?.map(so => ({ label: `${so.code_so} - ${so.nm_customers}`, value: so.id_so })) || [];
    const karyawanOptions = supportData?.data_karyawan?.map((k: any) => ({ label: k.nm_karyawan, value: k.id_karyawan.toString() })) || [];
    const surveyJenisOptions = supportData?.data_survey_jenis?.map((j: any) => ({ label: j.nm_survey_jenis, value: j.id_survey_jenis.toString() })) || [];
    const contactOptions = supportData?.data_customers_contact?.map((c: any) => ({ label: c.nm_customers_contact, value: c.id_customers_contact.toString() })) || [];
    const customerName = supportData?.data_header_so?.nm_customers || 'Pilih SO terlebih dahulu untuk melihat customer';

    // Auto-computed fields based on selections
    const selectedKaryawan = supportData?.data_karyawan?.find((k: any) => k.id_karyawan.toString() === formData.id_karyawan);
    const divisi = selectedKaryawan?.nm_karyawan_divisi || '';

    const selectedContact = supportData?.data_customers_contact?.find((c: any) => c.id_customers_contact.toString() === formData.id_customers_contact);
    const telp = selectedContact?.customers_contact_mobile || '';

    const selectedCustomer = soList?.find((so: any) => so.id_customers?.toString() === formData.id_customers) || supportData?.data_header_so;
    const alamat = selectedCustomer?.customers_address || '';

    return (
        <KeyboardAvoidingView className="flex-1 bg-gray-50" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <HeaderNavigator title="TAMBAH SURVEY" showBackButton onBackPress={() => navigation.goBack()} />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isFetching} onRefresh={handleRefresh} colors={[theme.colors.primary]} />}
            >
                {isFetching ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <SurveyFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(400)} className="space-y-4">

                        {/* SECTION: INFORMASI UTAMA */}
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                            <Text className="text-xs font-bold text-gray-500 uppercase mb-4 border-b border-gray-100 pb-2">Informasi Utama</Text>

                            <DropdownStyled
                                label="Yang Mengajukan"
                                placeholder="Pilih Karyawan..."
                                data={karyawanOptions}
                                value={formData.id_karyawan}
                                onChange={(v: string) => updateField('id_karyawan', v)}
                            />

                            <TextInputStyled label="Divisi" value={divisi} editable={false} />

                            <TextInputStyled label="Nama Customer" value={customerName} editable={false} />

                            <DropdownStyled
                                label="Contact Person"
                                placeholder="Pilih PIC..."
                                data={contactOptions}
                                value={formData.id_customers_contact}
                                onChange={(v: string) => updateField('id_customers_contact', v)}
                            />

                            <View className="mb-4">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Pelaksana Survey</Text>
                                <View className="flex-row items-center mt-1">
                                    <View className="flex-row items-center mr-4 opacity-70">
                                        <View className="w-5 h-5 rounded border border-blue-500 bg-blue-500 items-center justify-center mr-2">
                                            <Text className="text-white text-xs">✓</Text>
                                        </View>
                                        <Text className="text-sm text-gray-700">Gudang</Text>
                                    </View>
                                    <TouchableOpacity
                                        className="flex-row items-center"
                                        onPress={() => updateField('pelaksana_survey', formData.pelaksana_survey === '1' ? '0' : '1')}
                                    >
                                        <View className={`w-5 h-5 rounded border mr-2 items-center justify-center ${formData.pelaksana_survey === '1' ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'}`}>
                                            {formData.pelaksana_survey === '1' && <Text className="text-white text-xs">✓</Text>}
                                        </View>
                                        <Text className="text-sm text-gray-700">AFS</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Tanggal Pelaksana</Text>
                                <View className="bg-gray-100 border border-gray-200 rounded-lg h-[42px] flex-row items-center px-3">
                                    <Calendar color="#9CA3AF" size={18} />
                                    <Text className="ml-2 text-sm text-gray-500 flex-1">
                                        {formData.date_pelaksana ? formatDate(new Date(formData.date_pelaksana)) : '-'}
                                    </Text>
                                </View>
                            </View>

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

                            <MultiSelectStyled
                                label="Jenis Survey"
                                placeholder="Pilih Jenis Survey..."
                                data={surveyJenisOptions}
                                value={formData.id_survey_jenis}
                                onChange={(val: string[]) => updateField('id_survey_jenis', val)}
                            />

                            <TextInputStyled label="Alamat" value={alamat} editable={false} />

                            <TextInputStyled label="Telp" value={telp} editable={false} />

                            <View className="mb-4">
                                <Text className="text-xs text-gray-600 font-medium mb-1.5">Catatan</Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-800"
                                    value={formData.note_survey}
                                    onChangeText={(v: string) => updateField('note_survey', v)}
                                    placeholder="Masukkan catatan..."
                                    multiline
                                    numberOfLines={3}
                                    style={{ textAlignVertical: 'top' }}
                                />
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
                                    {formData.items.map((item, index) => (
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
                                            </View>
                                        </View>
                                    ))}
                                    {formData.items.length === 0 && (
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

                                <TouchableOpacity
                                    className="py-1.5 px-3 rounded"
                                    style={{ backgroundColor: theme.colors.primary }}
                                    onPress={() => setFormData(prev => ({ ...prev, tujuan_survey: [...prev.tujuan_survey, ''] }))}
                                >
                                    <Text className="text-white text-xs font-medium">Tambah Tujuan Survey</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="border border-gray-200 overflow-hidden rounded-t-lg">
                                {/* Table Header */}
                                <View className="flex-row bg-gray-50 border-b border-gray-200">
                                    <View className="w-10 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600">No</Text></View>
                                    <View className="flex-1 p-2 border-r border-gray-200 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600">Keterangan</Text></View>
                                    <View className="w-12 p-2 items-center justify-center"><Text className="text-[10px] font-bold text-gray-600">Aksi</Text></View>
                                </View>

                                {/* Table Body */}
                                {formData.tujuan_survey.map((tj, index) => (
                                    <View key={index} className="flex-row border-b border-gray-200 bg-white items-center">
                                        <View className="w-10 p-2 border-r border-gray-200 items-center justify-center">
                                            <Text className="text-[10px] text-gray-700">{index + 1}</Text>
                                        </View>
                                        <View className="flex-1 p-2 border-r border-gray-200 justify-center">
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
                                        </View>
                                        <View className="w-12 p-2 items-center justify-center">
                                            <TouchableOpacity onPress={() => handleRemoveTujuan(index)} className="bg-red-500 p-1.5 rounded">
                                                <Trash2 size={12} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                                {formData.tujuan_survey.length === 0 && (
                                    <View className="p-4 items-center">
                                        <Text className="text-xs text-gray-400 italic">Tidak ada tujuan</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>



                        <Animated.View entering={FadeInUp.delay(100)} className="mt-6 mb-8">
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
                )}
            </ScrollView>

            <ProductSurveyModal
                visible={isProductModalVisible}
                onClose={() => setIsProductModalVisible(false)}
                onSave={handleAddItem}
                sourceData={supportData?.data_detail_so} // pass SO items if any
            />
        </KeyboardAvoidingView>
    );
}
