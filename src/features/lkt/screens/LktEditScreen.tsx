import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Check, X, FileText, CornerDownRight, Printer, Truck, Plus, Trash2, UploadCloud, CornerDownLeft, Pencil, Save } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Dropdown } from "react-native-element-dropdown";
import { theme } from '../../../theme/theme';
import { useLkt } from '../hooks/useLkt';
import { LktEditSkeleton } from '../skeleton/LktEditSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { LktHeaderViewScreen } from './LktHeaderViewScreen';
import { RealisasiListView } from './RealisasiListScreen';
import { SparepartModal } from '../components/SparepartModal';

export function LktEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params || {};

    const { currentLkt, isLoading, loadLktDetail, handleCloseLkt, handleCancelLkt, resetCurrentLkt } = useLkt();

    const [activeTab, setActiveTab] = useState<'perbaikan' | 'realisasi'>('perbaikan');
    const [isEditing, setIsEditing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        if (id) {
            loadLktDetail(id);
        }
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    // Form State (Dummy/Local)
    const [tambahanCatatan, setTambahanCatatan] = useState('cek mesin');
    const [estimationDay, setEstimationDay] = useState('1');
    const [serviceAmount, setServiceAmount] = useState('0');
    const [typeTransport, setTypeTransport] = useState('Mobil');
    const [transportAmount, setTransportAmount] = useState('0');
    const [accommodationAmount, setAccommodationAmount] = useState('0');

    useEffect(() => {
        if (id) {
            loadLktDetail(id);
        }
        return () => {
            resetCurrentLkt();
        };
    }, [id, loadLktDetail, resetCurrentLkt]);

    const transportOptions = [
        { label: 'Mobil', value: 'Mobil' },
        { label: 'Motor', value: 'Motor' },
        { label: 'Lain - lain', value: 'Lain - lain' }
    ];

    const [parts, setParts] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const renderButtons = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4" contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity className="bg-blue-400 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => {
                if (isEditing) {
                    setIsEditing(false);
                } else {
                    navigation.goBack();
                }
            }}>
                <CornerDownLeft size={14} color="white" />
                <Text className="text-white text-xs font-bold ml-1">Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                className={`px-3 py-2 rounded flex-row items-center mr-2 ${isEditing ? 'bg-emerald-500' : 'bg-amber-500'}`}
                onPress={() => {
                    if (isEditing) {
                        // TODO: Implement Save Logic here
                        Alert.alert("Success", "Data berhasil disimpan");
                        setIsEditing(false);
                    } else {
                        setIsEditing(true);
                    }
                }}
            >
                {isEditing ? <Save size={14} color="white" /> : <Pencil size={14} color="white" />}
                <Text className="text-white text-xs font-bold ml-1">{isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>

            {!isEditing && (
                <>
                    <TouchableOpacity className="bg-emerald-500 px-3 py-2 rounded flex-row items-center mr-2">
                        <Check size={14} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-red-500 px-3 py-2 rounded flex-row items-center mr-2" onPress={() => Alert.alert('Cancel', 'Are you sure?')}>
                        <X size={14} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-800 px-3 py-2 rounded flex-row items-center mr-2">
                        <Printer size={14} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Print Label</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-cyan-500 px-3 py-2 rounded flex-row items-center mr-2">
                        <Truck size={14} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Perjalanan Dinas</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );

    if (activeTab === 'realisasi') {
        return <RealisasiListView setActiveTab={setActiveTab} />;
    }

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title={isLoading ? "MEMUAT DATA..." : (isEditing ? "EDIT LKT" : "DETAIL LKT")} 
                showBackButton={true}
                onBackPress={() => {
                    if (isEditing) {
                        setIsEditing(false);
                    } else {
                        navigation.goBack();
                    }
                }}
                disableAnimation={true}
            />

            {/* Main Content Container */}
            <View style={{ padding: 12, flex: 1, paddingBottom: 0 }}>
                <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1 mb-4">
                    
                    <LktHeaderViewScreen 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                    />

                    <ScrollView 
                        className="flex-1 pt-2" 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#0ea5e9']} />
                        }
                    >
                        {(isLoading || isRefreshing) ? (
                            <LktEditSkeleton />
                        ) : (
                            <View>
                                {renderButtons()}

                                <Text className="text-blue-600 font-bold mb-4 text-xs italic">Status : (DRAFT)</Text>
                                <Text className="text-base font-bold text-gray-900 mb-2">Laporan Kerusakan</Text>

                                {/* Laporan Kerusakan Container */}
                                <View className="bg-white p-4 rounded-xl border border-gray-300 mb-4">
                                    
                                    <View className="mb-5">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Catatan Kerusakan</Text>
                                        <View className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                                            <Text className="text-sm text-gray-800">cek mesin</Text>
                                        </View>
                                    </View>

                                    <View className="mb-5">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Tambahan Catatan Kerusakan</Text>
                                        <TextInput 
                                            className={`p-3 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                            style={{ minHeight: 80, textAlignVertical: 'top' }}
                                            multiline
                                            value={tambahanCatatan}
                                            onChangeText={setTambahanCatatan}
                                            editable={isEditing}
                                        />
                                    </View>

                                    <View className="mb-5">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Nama Teknisi</Text>
                                        <View className="bg-blue-50 p-3 border border-blue-200 rounded-lg">
                                            <Text className="text-sm text-blue-700 font-bold">Agung</Text>
                                        </View>
                                    </View>

                                    <View className="mb-5">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Images</Text>
                                        <View className="bg-gray-50 border border-gray-300 border-dashed rounded-lg h-12 items-center justify-center">
                                            <UploadCloud size={20} color="#9ca3af" />
                                        </View>
                                    </View>
                                    
                                    {/* Divider for Visual Separation */}
                                    <View className="h-px bg-gray-200 mb-5" />

                                    <View className="mb-5">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Serial Number</Text>
                                        <View className="bg-gray-100 px-3 py-2 border border-gray-200 rounded-lg">
                                            <Text className="text-sm text-gray-800" numberOfLines={1} adjustsFontSizeToFit>10.104.01756.28.04837</Text>
                                        </View>
                                    </View>

                                    <View className="flex-row space-x-3 mb-5">
                                        <View className="flex-1">
                                            <Text className="text-xs font-bold text-gray-700 mb-2">Estimation Day</Text>
                                            <TextInput 
                                                className={`px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                                                value={estimationDay}
                                                onChangeText={setEstimationDay}
                                                editable={isEditing}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xs font-bold text-gray-700 mb-2">Start Date</Text>
                                            <View className="bg-gray-100 px-3 justify-center border border-gray-200 rounded-lg h-[42px]">
                                                <Text className="text-sm text-gray-800">18/07/2025</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-row space-x-3 mb-5">
                                        <View className="flex-1">
                                            <Text className="text-xs font-bold text-gray-700 mb-2">Service Amount</Text>
                                            <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                                <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                                <TextInput 
                                                    className="flex-1 text-sm text-gray-800 p-0"
                                                    value={serviceAmount}
                                                    onChangeText={setServiceAmount}
                                                    editable={isEditing}
                                                />
                                            </View>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xs font-bold text-gray-700 mb-2">Transport</Text>
                                            <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                                <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                                <TextInput 
                                                    className="flex-1 text-sm text-gray-800 p-0"
                                                    value={transportAmount}
                                                    onChangeText={setTransportAmount}
                                                    editable={isEditing}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-row space-x-3 mb-5">
                                        <View className="flex-1">
                                            <Text className="text-xs font-bold text-gray-700 mb-2">Type Transport <Text className="text-red-500">*</Text></Text>
                                            <View className={`border border-gray-300 rounded-lg justify-center h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                                <Dropdown
                                                    style={{ paddingHorizontal: 12 }}
                                                    data={transportOptions}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Pilih"
                                                    value={typeTransport}
                                                    onChange={(item) => setTypeTransport(item.value)}
                                                    selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                                    disable={!isEditing}
                                                />
                                            </View>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xs font-bold text-gray-700 mb-2">Acomodation</Text>
                                            <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${isEditing ? 'bg-white' : 'bg-gray-100'}`}>
                                                <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                                <TextInput 
                                                    className="flex-1 text-sm text-gray-800 p-0"
                                                    value={accommodationAmount}
                                                    onChangeText={setAccommodationAmount}
                                                    editable={isEditing}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View className="mb-2">
                                        <Text className="text-xs font-bold text-gray-700 mb-2">Keterangan SO</Text>
                                        <View className="bg-yellow-50 p-3 border border-yellow-200 rounded-lg">
                                            <Text className="text-sm text-yellow-800 font-medium">DP INDEN 50%, PELUNASAN 50% SEBELUM PENGIRIMAN</Text>
                                        </View>
                                    </View>

                                </View>

                                {/* Parts Table */}
                                <View className="border border-gray-200 rounded mt-2 bg-white">
                                    {isEditing && (
                                        <View className="p-2 border-b border-gray-200 bg-gray-50/50">
                                            <TouchableOpacity 
                                                className="bg-emerald-500 px-3 py-1.5 rounded flex-row items-center self-start"
                                                onPress={() => setIsModalVisible(true)}
                                            >
                                                <Plus size={14} color="white" />
                                                <Text className="text-white text-xs font-bold ml-1">Add New</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    <ScrollView horizontal>
                                        <View>
                                            {/* Header */}
                                            <View className="flex-row border-b border-gray-200 bg-gray-50/50">
                                                <Text className="text-[10px] font-bold text-gray-700 w-8 p-2 text-center">No</Text>
                                                <Text className="text-[10px] font-bold text-gray-700 w-40 p-2 border-l border-gray-200">Nama Part</Text>
                                                <Text className="text-[10px] font-bold text-gray-700 w-32 p-2 border-l border-gray-200">Harga</Text>
                                                <Text className="text-[10px] font-bold text-gray-700 w-16 p-2 text-center border-l border-gray-200">Qty</Text>
                                                <Text className="text-[10px] font-bold text-gray-700 w-32 p-2 border-l border-gray-200">Sub Total</Text>
                                                <Text className="text-[10px] font-bold text-gray-700 w-20 p-2 text-center border-l border-gray-200">Action</Text>
                                            </View>
                                            {/* Empty Body for now */}
                                            {parts.length === 0 && (
                                                <View className="border-b border-gray-200 py-4 items-center">
                                                    <Text className="text-gray-400 text-xs italic">Belum ada part</Text>
                                                </View>
                                            )}
                                            {/* Footer */}
                                            <View className="flex-row">
                                                <Text className="text-[10px] font-bold text-gray-700 w-96 p-2 text-right">Total Harga</Text>
                                                <Text className="text-xs font-bold text-gray-800 w-32 p-2 border-l border-gray-200">Rp 0</Text>
                                                <View className="w-20 p-2 border-l border-gray-200" />
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
            <SparepartModal 
                visible={isModalVisible} 
                onClose={() => setIsModalVisible(false)} 
                onSave={(data) => {
                    // TODO: Implement actual save logic
                    Alert.alert("Success", `Part ${data.nama_part} ditambahkan.`);
                    setIsModalVisible(false);
                }} 
            />
        </View>
    );
}
