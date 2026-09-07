import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Check, CornerDownLeft, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { useLkt } from '../hooks/useLkt';
import { formatDate } from '../../../utils/helpers/date';
import { LktViewBastSkeleton } from '../skeleton/LktViewBastSkeleton';

export function LktViewBast() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lktCode, cstCode } = route.params || {};

    const { currentLkt, loadLktDetail, isLoading, handleUpdateLkt } = useLkt();

    const [noBast, setNoBast] = useState('');
    const [tglBast, setTglBast] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({ visible: false, type: 'success', message: '' });

    useEffect(() => {
        if (lktCode) {
            loadLktDetail(lktCode);
        }
    }, [lktCode]);

    useEffect(() => {
        if (currentLkt) {
            setNoBast(currentLkt.no_bast || '');
            setTglBast(currentLkt.tgl_bast || currentLkt.tlg_bast || '');
        }
    }, [currentLkt]);

    const handleSave = () => {
        setIsConfirmModalVisible(true);
    };

    const confirmSave = async () => {
        setIsConfirmModalVisible(false);
        
        if (!lktCode) {
            setToast({ visible: true, type: 'error', message: 'LKT Code tidak valid' });
            return;
        }

        const result = await handleUpdateLkt(lktCode, {
            no_bast: noBast,
            tgl_bast: tglBast
        });

        if (result.success) {
            setToast({ visible: true, type: 'success', message: 'Konfirmasi BAST Berhasil Disimpan' });
            setTimeout(() => {
                navigation.goBack();
            }, 1000);
        } else {
            setToast({ visible: true, type: 'error', message: result.message || 'Gagal menyimpan data BAST' });
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ModalConfirm
                visible={isConfirmModalVisible}
                title="Konfirmasi?"
                message="Apakah Anda yakin akan Simpan?"
                confirmText="Ya, Simpan!"
                cancelText="Tidak, batalkan!"
                onConfirm={confirmSave}
                onCancel={() => setIsConfirmModalVisible(false)}
            />

            <ToastMessages
                visible={toast.visible}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <HeaderNavigator
                title="DETAIL BAST"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            {isLoading ? (
                <LktViewBastSkeleton />
            ) : (
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 12, paddingBottom: 100 }}>
                <Animated.View entering={FadeInDown.springify()} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

                    <View className="mb-6 flex-row gap-2">
                        <TouchableOpacity
                            className="bg-emerald-600 px-4 py-2 rounded-lg flex-row items-center justify-center"
                            onPress={handleSave}
                        >
                            <Check size={16} color="white" />
                            <Text className="text-white text-xs font-bold ml-1.5">Save</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-col md:flex-row gap-4">
                        <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                            {/* No BAST */}
                            <View className="mb-4 flex-row items-center">
                                <Text className="text-xs font-bold text-gray-700 w-[100px]">No Bast</Text>
                                <Text className="text-xs font-bold text-gray-700 mx-2">:</Text>
                                <View className="flex-1">
                                    <TextInput
                                        className="p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800"
                                        placeholder="Masukkan No BAST"
                                        value={noBast}
                                        onChangeText={setNoBast}
                                    />
                                </View>
                            </View>

                            {/* Tanggal BAST */}
                            <View className="flex-row items-center">
                                <Text className="text-xs font-bold text-gray-700 w-[100px]">Tanggal BAST</Text>
                                <Text className="text-xs font-bold text-gray-700 mx-2">:</Text>
                                <View className="flex-1">
                                    <TouchableOpacity
                                        className="bg-white border border-gray-300 rounded-lg h-[42px] flex-row items-center px-3"
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <Text className="flex-1 text-sm text-gray-800">
                                            {tglBast ? formatDate(new Date(tglBast)) : 'Pilih Tanggal'}
                                        </Text>
                                        <Calendar color="#9ca3af" size={18} />
                                    </TouchableOpacity>

                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={tglBast ? new Date(tglBast) : new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(event, date) => {
                                                setShowDatePicker(false);
                                                if (date) {
                                                    const year = date.getFullYear();
                                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                                    const day = String(date.getDate()).padStart(2, '0');
                                                    setTglBast(`${year}-${month}-${day}`);
                                                }
                                            }}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>

                        <View className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4 md:mt-0">
                            {/* Nama Perusahaan */}
                            <View className="mb-4 flex-row">
                                <Text className="text-xs font-bold text-gray-700 w-[120px]">Nama Perusahaan</Text>
                                <Text className="text-xs font-bold text-gray-700 mx-2">:</Text>
                                <View className="flex-1">
                                    <Text className="text-sm text-gray-800 font-bold">{currentLkt?.nm_customers || '-'}</Text>
                                    <Text className="text-xs text-gray-500 italic mt-1">{currentLkt?.customers_address || '-'}</Text>
                                </View>
                            </View>

                            {/* Produk */}
                            <View className="flex-row">
                                <Text className="text-xs font-bold text-gray-700 w-[120px]">Produk</Text>
                                <Text className="text-xs font-bold text-gray-700 mx-2">:</Text>
                                <View className="flex-1">
                                    <Text className="text-sm text-gray-800">
                                        {currentLkt?.code_product ? `${currentLkt.code_product} : ${currentLkt.nm_product}` : '-'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
            )}
        </View>
    );
}
