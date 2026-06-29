import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { MultiSelect, Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { Save, X } from 'lucide-react-native';
import { useApprovalItemsForm } from '../hooks/useApprovalItemsForm';
import { ApprovalItemFormSkeleton } from '../skeleton/ApprovalItemFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function ApprovalItemsFormScreen() {
    const navigation = useNavigation();

    const {
        formData,
        levelsOption,
        isSaving,
        error,
        initialLoadDone,
        updateField,
        toggleLevel,
        save,
    } = useApprovalItemsForm();

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            Alert.alert('Sukses', 'Approval rule berhasil ditambahkan', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    };

    const renderSelectedItem = (item: any, unSelect?: (item: any) => void) => (
        <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View className="flex-row items-center bg-blue-400 rounded-md px-3 py-1.5 m-1 mt-2 mb-2">
                <X size={14} color="white" />
                <Text className="text-white ml-1.5 text-xs font-bold">{item.label}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator
                title="TAMBAH APPROVAL"
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
                        <ApprovalItemFormSkeleton />
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
                            {/* Kiri (Berdasarkan col-xl-6 pertama di PHP) */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Approval <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.approval_name}
                                    onChangeText={(t) => updateField('approval_name', t)}
                                    placeholder="Masukkan nama approval"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Deskripsi</Text>
                                <TextInput
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.description}
                                    onChangeText={(t) => updateField('description', t)}
                                    placeholder="Masukkan deskripsi"
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Tipe Approval <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={[{ label: 'Standard', value: 'standard' }, { label: 'Auto', value: 'auto' }]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Tipe Approval"
                                        value={formData.approval_type}
                                        onChange={(item) => updateField('approval_type', item.value)}
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Modul <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.module_name}
                                    onChangeText={(t) => updateField('module_name', t)}
                                    placeholder="Masukkan nama modul"
                                />
                            </View>

                            {/* Kanan (Berdasarkan col-xl-6 kedua di PHP) */}
                            <View className="mb-4 mt-2">
                                <View className="h-[1px] bg-gray-100 w-full mb-4" />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Tabel <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.table_name}
                                    onChangeText={(t) => updateField('table_name', t)}
                                    placeholder="Masukkan nama tabel"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Kolom Status</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.status_column_name}
                                    onChangeText={(t) => updateField('status_column_name', t)}
                                    placeholder="Masukkan nama kolom status"
                                />
                            </View>

                            <View className="flex-row gap-3 mb-4">
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Status (Approve)</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                        value={formData.new_status_approve}
                                        onChangeText={(t) => updateField('new_status_approve', t)}
                                        placeholder="Approve"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Status (Reject)</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                        value={formData.new_status_reject}
                                        onChangeText={(t) => updateField('new_status_reject', t)}
                                        placeholder="Reject"
                                    />
                                </View>
                            </View>

                            {/* Bawah (Rule PHP) */}
                            <View className="mb-4 mt-2">
                                <View className="h-[1px] bg-gray-100 w-full mb-4" />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Rule <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="p-4 rounded-xl border border-gray-200 focus:border-indigo-500 bg-gray-50 text-gray-900 font-mono text-sm leading-6"
                                    value={formData.rule}
                                    onChangeText={(t) => updateField('rule', t)}
                                    placeholder="Masukkan kode untuk validasi"
                                    multiline
                                    numberOfLines={5}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* Bawah (Level Approver) */}
                            {formData.approval_type !== 'auto' && (
                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Level Approver</Text>
                                    <View className="border border-gray-200 rounded-xl bg-gray-50">
                                        <MultiSelect
                                            style={{ minHeight: 48, paddingHorizontal: 16 }}
                                            data={levelsOption.map(lvl => ({ label: lvl.nm_users_level, value: lvl.id_users_level }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Pilih Level Approver"
                                            value={formData.level_ids}
                                            onChange={(item) => updateField('level_ids', item)}
                                            selectedStyle={{ borderRadius: 8, backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primaryContainer }}
                                            selectedTextStyle={{ color: theme.colors.primary, fontSize: 13, fontWeight: 'bold' }}
                                            renderSelectedItem={renderSelectedItem}
                                            dropdownPosition="top"
                                        />
                                    </View>
                                </View>
                            )}
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
