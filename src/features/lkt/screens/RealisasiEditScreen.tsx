import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, Alert, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CornerDownLeft, Save, UploadCloud, Check, X, Pencil, Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Dropdown } from "react-native-element-dropdown";
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { RealisasiEditSkeleton } from '../skeleton/RealisasiEditSkeleton';
import { SparepartModal } from '../components/SparepartModal';

export function RealisasiEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    
    // Status can be 'Draft', 'ON PROGRESS', 'CLOSE', 'CANCEL'
    const [status, setStatus] = useState('Draft'); 
    const [isEditing, setIsEditing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate data refresh
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    // State
    const [actualDescription, setActualDescription] = useState('Mesin sudah diperiksa');
    const [lapPenyelesaian, setLapPenyelesaian] = useState('');
    const [nmTeknisi, setNmTeknisi] = useState([{ label: 'Agung', value: 'Agung' }]);
    const [actualDay, setActualDay] = useState('1');
    const [isDaring, setIsDaring] = useState(false);
    
    const [transportAmount, setTransportAmount] = useState('150000');
    const [trainingAmount, setTrainingAmount] = useState('0');
    const [startingDate, setStartingDate] = useState('2025-07-18');
    const [serviceAmount, setServiceAmount] = useState('500000');
    const [accommodationAmount, setAccommodationAmount] = useState('0');
    const [bongkarAmount, setBongkarAmount] = useState('0');

    // Parts data for table
    const [parts, setParts] = useState([]);

    // Dummy Dropdown Options
    const teknisiOptions = [
        { label: 'Agung', value: 'Agung' },
        { label: 'Budi', value: 'Budi' },
        { label: 'Candra', value: 'Candra' },
    ];

    const handleDaringChange = (val: boolean) => {
        setIsDaring(val);
        if (val) {
            setTransportAmount('0');
            setServiceAmount('0');
            setTrainingAmount('0');
            setBongkarAmount('0');
            setAccommodationAmount('0');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'ON PROGRESS': return 'text-amber-600';
            case 'CLOSE': return 'text-emerald-600';
            case 'DRAFT': return 'text-blue-600';
            case 'CANCEL': return 'text-rose-600';
            default: return 'text-gray-800';
        }
    };

    const renderActionButtons = () => {
        if (status === 'Draft') {
            if (!isEditing) {
                return (
                    <View className="flex-row mb-6">
                        <TouchableOpacity className="bg-blue-500 px-3 py-2 rounded-lg flex-row items-center mr-2" onPress={() => navigation.goBack()}>
                            <CornerDownLeft size={16} color="white" />
                            <Text className="text-white text-xs font-bold ml-1">Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-amber-500 px-3 py-2 rounded-lg flex-row items-center mr-2" onPress={() => setIsEditing(true)}>
                            <Pencil size={16} color="white" />
                            <Text className="text-white text-xs font-bold ml-1">Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-emerald-500 px-3 py-2 rounded-lg flex-row items-center mr-2">
                            <Check size={16} color="white" />
                            <Text className="text-white text-xs font-bold ml-1">Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-rose-500 px-3 py-2 rounded-lg flex-row items-center mr-2">
                            <X size={16} color="white" />
                            <Text className="text-white text-xs font-bold ml-1">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                );
            } else {
                return (
                    <View className="flex-row mb-6">
                        <TouchableOpacity className="bg-blue-500 px-3 py-2 rounded-lg flex-row items-center mr-2" onPress={() => setIsEditing(false)}>
                            <CornerDownLeft size={16} color="white" />
                            <Text className="text-white text-xs font-bold ml-1">Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-emerald-500 px-3 py-2 rounded-lg flex-row items-center mr-2">
                            <Save size={16} color="white" />
                            <Text className="text-white text-xs font-bold ml-1">Save</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        } else if (status === 'CLOSE') {
            return (
                <View className="flex-row mb-6">
                    <TouchableOpacity className="bg-blue-500 px-3 py-2 rounded-lg flex-row items-center mr-2" onPress={() => navigation.goBack()}>
                        <CornerDownLeft size={16} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Back</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            // ON PROGRESS or others
            return (
                <View className="flex-row mb-6">
                    <TouchableOpacity className="bg-emerald-500 px-3 py-2 rounded-lg flex-row items-center mr-2">
                        <Check size={16} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-rose-500 px-3 py-2 rounded-lg flex-row items-center mr-2">
                        <X size={16} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-blue-500 px-3 py-2 rounded-lg flex-row items-center mr-2" onPress={() => navigation.goBack()}>
                        <CornerDownLeft size={16} color="white" />
                        <Text className="text-white text-xs font-bold ml-1">Back</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title={isRefreshing ? "MEMUAT DATA..." : (isEditing ? "EDIT LAPORAN VISIT" : "DETAIL LAPORAN VISIT")} 
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#0ea5e9']} />
                }
            >
                {(isLoading || isRefreshing) ? (
                    <RealisasiEditSkeleton />
                ) : (
                    <Animated.View entering={FadeInDown.springify()} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    
                    {/* Header Info */}
                    <View className="mb-4">
                        <Text className="text-xl font-extrabold text-slate-800">CST-EMM/2025/07/03624</Text>
                        <Text className="text-base font-bold text-slate-600 mt-1">LKT-EMM/2025/07/03646</Text>
                    </View>

                    {renderActionButtons()}

                    <Text className={`text-xs font-bold mb-4 italic ${getStatusColor(status)}`}>status : ({status})</Text>
                    <Text className="text-lg font-bold text-gray-800 mb-4">Laporan Kerusakan</Text>

                    {/* Form Fields */}
                    <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                        <View className="mb-4">
                            <Text className="text-xs font-bold text-gray-700 mb-1">Catatan Kerusakan</Text>
                            <Text className="text-sm text-gray-800 bg-gray-100 p-3 rounded-lg border border-gray-200">
                                Pengecekan mesin X-Ray tidak menyala
                            </Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-xs font-bold text-gray-700 mb-1">Tambahan Catatan Kerusakan</Text>
                            <Text className="text-sm text-gray-800 bg-gray-100 p-3 rounded-lg border border-gray-200">
                                Segera ditangani
                            </Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-xs font-bold text-gray-700 mb-1">Actual Catatan Kerusakan <Text className="text-red-500">*</Text></Text>
                            <TextInput 
                                className={`p-3 border border-gray-300 rounded-lg text-sm text-gray-800 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
                                style={{ minHeight: 80, textAlignVertical: 'top' }}
                                multiline
                                value={actualDescription}
                                onChangeText={setActualDescription}
                                placeholder="Masukkan actual catatan..."
                                editable={isEditing}
                            />
                        </View>
                        
                        {status === 'CLOSE' && (
                            <View className="mb-4">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Laporan Penyelesaian</Text>
                                <TextInput 
                                    className="p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-800"
                                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                                    multiline
                                    value={lapPenyelesaian}
                                    editable={false}
                                />
                            </View>
                        )}
                    </View>

                    <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                        <View className="mb-4">
                            <Text className="text-xs font-bold text-gray-700 mb-1">Images</Text>
                            <TouchableOpacity className={`border border-gray-300 border-dashed rounded-lg h-24 items-center justify-center ${!isEditing ? 'bg-gray-100' : 'bg-white'}`} disabled={!isEditing}>
                                <UploadCloud size={24} color="#9ca3af" />
                                <Text className="text-xs text-gray-500 mt-2">Tap to upload image</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                        <View className="mb-4">
                            <Text className="text-xs font-bold text-gray-700 mb-1">Nama Teknisi <Text className="text-red-500">*</Text></Text>
                            <View className={`border border-gray-300 rounded-lg justify-center h-[42px] ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}>
                                <Dropdown
                                    style={{ paddingHorizontal: 12 }}
                                    data={teknisiOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih Teknisi"
                                    value={nmTeknisi.length > 0 ? nmTeknisi[0].value : null}
                                    onChange={(item) => setNmTeknisi([{ label: item.label, value: item.value } as never])}
                                    selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                    disable={!isEditing}
                                />
                            </View>
                        </View>

                        <View className="flex-row mb-4">
                            <View className="flex-1 mr-3">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Actual Day <Text className="text-red-500">*</Text></Text>
                                <TextInput 
                                    className={`px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
                                    value={actualDay}
                                    onChangeText={setActualDay}
                                    keyboardType="numeric"
                                    editable={isEditing}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Daring</Text>
                                <View className="h-[42px] justify-center items-start">
                                    <Switch 
                                        value={isDaring} 
                                        onValueChange={handleDaringChange} 
                                        trackColor={{ false: "#d1d5db", true: "#059669" }}
                                        disabled={!isEditing}
                                    />
                                </View>
                            </View>
                        </View>

                        <View className="flex-row mb-4">
                            <View className="flex-1 mr-3">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Transport</Text>
                                <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${(!isEditing || isDaring) ? 'bg-gray-100' : 'bg-white'}`}>
                                    <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                    <TextInput 
                                        className="flex-1 text-sm text-gray-800 p-0"
                                        value={transportAmount}
                                        onChangeText={setTransportAmount}
                                        keyboardType="numeric"
                                        editable={isEditing && !isDaring}
                                    />
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Training</Text>
                                <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${(!isEditing || isDaring) ? 'bg-gray-100' : 'bg-white'}`}>
                                    <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                    <TextInput 
                                        className="flex-1 text-sm text-gray-800 p-0"
                                        value={trainingAmount}
                                        onChangeText={setTrainingAmount}
                                        keyboardType="numeric"
                                        editable={isEditing && !isDaring}
                                    />
                                </View>
                            </View>
                        </View>

                        <View className="flex-row mb-4">
                            <View className="flex-1 mr-3">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Start Date</Text>
                                <TextInput 
                                    className={`px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 ${!isEditing ? 'bg-gray-100' : 'bg-white'}`}
                                    value={startingDate}
                                    onChangeText={setStartingDate}
                                    editable={isEditing}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Service Amount</Text>
                                <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${(!isEditing || isDaring) ? 'bg-gray-100' : 'bg-white'}`}>
                                    <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                    <TextInput 
                                        className="flex-1 text-sm text-gray-800 p-0"
                                        value={serviceAmount}
                                        onChangeText={setServiceAmount}
                                        keyboardType="numeric"
                                        editable={isEditing && !isDaring}
                                    />
                                </View>
                            </View>
                        </View>

                        <View className="flex-row">
                            <View className="flex-1 mr-3">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Acomodation</Text>
                                <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${(!isEditing || isDaring) ? 'bg-gray-100' : 'bg-white'}`}>
                                    <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                    <TextInput 
                                        className="flex-1 text-sm text-gray-800 p-0"
                                        value={accommodationAmount}
                                        onChangeText={setAccommodationAmount}
                                        keyboardType="numeric"
                                        editable={isEditing && !isDaring}
                                    />
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs font-bold text-gray-700 mb-1">Bongkar</Text>
                                <View className={`flex-row items-center px-3 border border-gray-300 rounded-lg h-[42px] ${(!isEditing || isDaring) ? 'bg-gray-100' : 'bg-white'}`}>
                                    <Text className="text-sm text-gray-500 mr-2">Rp</Text>
                                    <TextInput 
                                        className="flex-1 text-sm text-gray-800 p-0"
                                        value={bongkarAmount}
                                        onChangeText={setBongkarAmount}
                                        keyboardType="numeric"
                                        editable={isEditing && !isDaring}
                                    />
                                </View>
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
                                    <Text className="text-white text-xs font-bold ml-1">Add New Part</Text>
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

                    </Animated.View>
                )}
            </ScrollView>
            <SparepartModal 
                visible={isModalVisible} 
                onClose={() => setIsModalVisible(false)} 
                onSave={(data) => {
                    Alert.alert("Success", `Part ${data.nama_part} ditambahkan.`);
                    setIsModalVisible(false);
                }} 
            />
        </View>
    );
}
