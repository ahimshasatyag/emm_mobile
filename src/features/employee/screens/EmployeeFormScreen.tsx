import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from '@react-navigation/native';
import { Save } from 'lucide-react-native';
import { useEmployeeForm } from '../hooks/useEmployeeForm';
import { EmployeeFormSkeleton } from '../skeleton/EmployeeFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function EmployeeFormScreen() {
    const navigation = useNavigation();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const {
        formData,
        divisions,
        positions,
        isSaving,
        error,
        initialLoadDone,
        updateField,
        save,
    } = useEmployeeForm();

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            Alert.alert('Sukses', 'Data karyawan berhasil ditambahkan', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator 
                title="TAMBAH KARYAWAN" 
                showBackButton 
                onBackPress={() => navigation.goBack()} 
            />

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {!initialLoadDone ? (
                    <Animated.View exiting={FadeOut.duration(300)}>
                        <EmployeeFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeIn.duration(600)}>
                        {error && (
                            <Animated.View entering={FadeInUp} className="bg-red-50 p-4 rounded-xl mb-6 border border-red-100">
                                <Text className="text-red-600 font-medium">{error}</Text>
                            </Animated.View>
                        )}

                        <Animated.View 
                            entering={FadeInUp.delay(50)} 
                            layout={LinearTransition.springify()}
                            className="bg-white p-5 rounded-3xl border border-gray-100 mb-6" 
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Karyawan <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.nm_karyawan}
                                    onChangeText={(t) => updateField('nm_karyawan', t)}
                                    placeholder="Masukkan nama karyawan"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Tempat Lahir <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.tempat_lahir}
                                    onChangeText={(t) => updateField('tempat_lahir', t)}
                                    placeholder="Tempat kelahiran"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Tanggal Lahir <Text className="text-red-500">*</Text></Text>
                                <TouchableOpacity 
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 justify-center"
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text className={formData.date_lahir ? "text-gray-900" : "text-gray-400"}>
                                        {formData.date_lahir || "Pilih Tanggal Lahir"}
                                    </Text>
                                </TouchableOpacity>
                                
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={formData.date_lahir ? new Date(formData.date_lahir.split('-').reverse().join('-')) : new Date()}
                                        mode="date"
                                        display="default"
                                        onValueChange={(date) => {
                                            setShowDatePicker(false);
                                            // onValueChange passes the date directly as first argument usually or event then date?
                                            // The safest way is to check if it's a date object
                                            const selectedDate = (date instanceof Date) ? date : (date && typeof date === 'object' && 'nativeEvent' in date) ? undefined : new Date();
                                            // Actually let's just do:
                                            const validDate = date instanceof Date ? date : null;
                                            if (validDate) {
                                                const formattedDate = `${validDate.getDate().toString().padStart(2, '0')}-${(validDate.getMonth() + 1).toString().padStart(2, '0')}-${validDate.getFullYear()}`;
                                                updateField('date_lahir', formattedDate);
                                            }
                                        }}
                                        onDismiss={() => setShowDatePicker(false)}
                                    />
                                )}
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Divisi <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={divisions.map(d => ({ label: d.nm_karyawan_divisi, value: d.id_karyawan_divisi }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Divisi"
                                        value={formData.id_karyawan_divisi}
                                        onChange={(item) => updateField('id_karyawan_divisi', item.value)}
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Posisi <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={positions.map(p => ({ label: p.nm_karyawan_posisi, value: p.id_karyawan_posisi }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Posisi"
                                        value={formData.id_karyawan_posisi}
                                        onChange={(item) => updateField('id_karyawan_posisi', item.value)}
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">No. HP</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.no_hp}
                                    onChangeText={(t) => updateField('no_hp', t.replace(/[^0-9]/g, ''))}
                                    placeholder="Contoh: 08123456789"
                                    keyboardType="number-pad"
                                    maxLength={15}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Jenis Kelamin <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={[{ label: 'Laki-laki', value: 'L' }, { label: 'Perempuan', value: 'P' }]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Jenis Kelamin"
                                        value={formData.jenis_kelamin}
                                        onChange={(item) => updateField('jenis_kelamin', item.value)}
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.karyawan_email}
                                    onChangeText={(t) => updateField('karyawan_email', t)}
                                    placeholder="Masukkan email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Alamat <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900 h-24"
                                    value={formData.karyawan_address}
                                    onChangeText={(t) => updateField('karyawan_address', t)}
                                    placeholder="Masukkan alamat lengkap"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status Agen</Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={[{ label: 'Tidak', value: '0' }, { label: 'Ya', value: '1' }]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Status Agen"
                                        value={formData.flag_agent}
                                        onChange={(item) => updateField('flag_agent', item.value)}
                                    />
                                </View>
                            </View>

                            <View className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status Karyawan</Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={[{ label: 'Aktif', value: '1' }, { label: 'Tidak Aktif', value: '0' }]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Status"
                                        value={formData.flag_status}
                                        onChange={(item) => updateField('flag_status', item.value)}
                                    />
                                </View>
                            </View>

                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(100)}>
                            <Button
                                onPress={onSavePress}
                                disabled={isSaving}
                                className="w-full h-14 rounded-2xl flex-row items-center justify-center"
                                style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                {isSaving ? (
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
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
