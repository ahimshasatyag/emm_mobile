import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, RefreshControl, TouchableOpacity } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { useRoute, useNavigation } from '@react-navigation/native';
import { Save, X, Edit2 } from 'lucide-react-native';
import { useEmployeeForm } from '../hooks/useEmployeeForm';
import { EmployeeFormSkeleton } from '../skeleton/EmployeeFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function EmployeeEditScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = (route.params as { id: string }) || { id: '' };

    const [isEditing, setIsEditing] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const {
        formData,
        divisions,
        positions,
        isLoading: isFetching,
        isSaving,
        error,
        updateField,
        save,
        loadData,
    } = useEmployeeForm(id);

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            Alert.alert(
                'Sukses',
                'Data karyawan berhasil diperbarui.',
                [{ text: 'OK', onPress: () => setIsEditing(false) }]
            );
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadData();
    };

    const inputClass = isEditing 
        ? "h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 font-bold text-gray-900" 
        : "h-12 bg-gray-100 px-4 rounded-xl border border-gray-200 font-bold text-gray-500";

    const textAreaClass = isEditing
        ? "bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 font-bold text-gray-900 h-24"
        : "bg-gray-100 p-4 rounded-xl border border-gray-200 font-bold text-gray-500 h-24";

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator 
                title={isFetching ? 'MEMUAT DATA...' : (isEditing ? 'EDIT KARYAWAN' : 'DETAIL KARYAWAN')} 
                showBackButton 
                onBackPress={() => navigation.goBack()} 
            />

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={loadData} colors={[theme.colors.primary]} />
                }
            >
                {isFetching ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <EmployeeFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        {error && (
                            <Animated.View entering={FadeInUp} className="bg-red-50 p-4 rounded-xl mb-6 border border-red-100">
                                <Text className="text-red-600 font-medium">{error}</Text>
                            </Animated.View>
                        )}

                        <Animated.View 
                            key={`form-container-${isEditing}`}
                            entering={FadeInUp.delay(50)} 
                            layout={LinearTransition.springify()}
                            className="bg-white p-5 rounded-3xl border border-gray-100 mb-6" 
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Karyawan <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={inputClass}
                                    value={formData.nm_karyawan}
                                    onChangeText={(t) => updateField('nm_karyawan', t)}
                                    editable={isEditing}
                                    placeholder="Masukkan nama karyawan"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Tempat Lahir <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={inputClass}
                                    value={formData.tempat_lahir}
                                    onChangeText={(t) => updateField('tempat_lahir', t)}
                                    editable={isEditing}
                                    placeholder="Tempat kelahiran"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Tanggal Lahir <Text className="text-red-500">*</Text></Text>
                                <TouchableOpacity 
                                    className={`${inputClass} justify-center`}
                                    onPress={() => { if (isEditing) setShowDatePicker(true); }}
                                    disabled={!isEditing}
                                >
                                    <Text className={`font-bold ${isEditing ? "text-gray-900" : "text-gray-500"}`}>
                                        {formData.date_lahir || "Pilih Tanggal Lahir"}
                                    </Text>
                                </TouchableOpacity>
                                
                                {showDatePicker && isEditing && (
                                    <DateTimePicker
                                        value={formData.date_lahir ? new Date(formData.date_lahir.split('-').reverse().join('-')) : new Date()}
                                        mode="date"
                                        display="default"
                                        onValueChange={(date) => {
                                            setShowDatePicker(false);
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
                                <View className={`border rounded-xl overflow-hidden ${isEditing ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 opacity-80'}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={divisions.map(d => ({ label: d.nm_karyawan_divisi, value: d.id_karyawan_divisi }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Divisi"
                                        value={formData.id_karyawan_divisi}
                                        onChange={(item) => updateField('id_karyawan_divisi', item.value)}
                                        disable={!isEditing}
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Posisi <Text className="text-red-500">*</Text></Text>
                                <View className={`border rounded-xl overflow-hidden ${isEditing ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 opacity-80'}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={positions.map(p => ({ label: p.nm_karyawan_posisi, value: p.id_karyawan_posisi }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Posisi"
                                        value={formData.id_karyawan_posisi}
                                        onChange={(item) => updateField('id_karyawan_posisi', item.value)}
                                        disable={!isEditing}
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">No. HP</Text>
                                <TextInput
                                    className={inputClass}
                                    value={formData.no_hp}
                                    onChangeText={(t) => updateField('no_hp', t.replace(/[^0-9]/g, ''))}
                                    editable={isEditing}
                                    placeholder="Contoh: 08123456789"
                                    keyboardType="number-pad"
                                    maxLength={15}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Jenis Kelamin <Text className="text-red-500">*</Text></Text>
                                <View className={`border rounded-xl overflow-hidden ${isEditing ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 opacity-80'}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={[{ label: 'Laki-laki', value: 'L' }, { label: 'Perempuan', value: 'P' }]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Jenis Kelamin"
                                        value={formData.jenis_kelamin}
                                        onChange={(item) => updateField('jenis_kelamin', item.value)}
                                        disable={!isEditing}
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                                <TextInput
                                    className={inputClass}
                                    value={formData.karyawan_email}
                                    onChangeText={(t) => updateField('karyawan_email', t)}
                                    editable={isEditing}
                                    placeholder="Masukkan email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Alamat <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={textAreaClass}
                                    value={formData.karyawan_address}
                                    onChangeText={(t) => updateField('karyawan_address', t)}
                                    editable={isEditing}
                                    placeholder="Masukkan alamat lengkap"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status Agen</Text>
                                <View className={`border rounded-xl overflow-hidden ${isEditing ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 opacity-80'}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={[{ label: 'Tidak', value: '0' }, { label: 'Ya', value: '1' }]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Status Agen"
                                        value={formData.flag_agent}
                                        onChange={(item) => updateField('flag_agent', item.value)}
                                        disable={!isEditing}
                                    />
                                </View>
                            </View>

                            <View className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status Karyawan</Text>
                                <View className={`border rounded-xl overflow-hidden ${isEditing ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 opacity-80'}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={[{ label: 'Aktif', value: '1' }, { label: 'Tidak Aktif', value: '0' }]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Status"
                                        value={formData.flag_status}
                                        onChange={(item) => updateField('flag_status', item.value)}
                                        disable={!isEditing}
                                    />
                                </View>
                            </View>

                        </Animated.View>

                        {/* Bottom Actions */}
                        <Animated.View 
                            key={`actions-${isEditing}`} 
                            entering={FadeInUp.delay(150)} 
                            layout={LinearTransition.springify()}
                            className="mt-2 flex-row gap-3"
                        >
                            {!isEditing ? (
                                <Button
                                    onPress={() => setIsEditing(true)}
                                    className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                >
                                    <Edit2 color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Edit</Text>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onPress={handleCancel}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    >
                                        <X color={theme.colors.primary} size={20} className="mr-2" />
                                        <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                                    </Button>
                                    
                                    <Button
                                        onPress={onSavePress}
                                        disabled={isSaving}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                        style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                    >
                                        {isSaving ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <>
                                                <Save color="white" size={20} className="mr-2" />
                                                <Text className="text-white font-bold text-lg">Update</Text>
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}
                        </Animated.View>

                    </Animated.View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
