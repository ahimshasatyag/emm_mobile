import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Save, X, Edit2 } from 'lucide-react-native';
import { MultiSelect, Dropdown } from 'react-native-element-dropdown';
import { useApprovalItemsForm } from '../hooks/useApprovalItemsForm';
import { ApprovalItemFormSkeleton } from '../skeleton/ApprovalItemFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function ApprovalItemsEditScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = (route.params as { id: string }) || { id: '' };

    const [isEditing, setIsEditing] = useState(false);

    const {
        formData,
        levelsOption,
        isLoading: isFetching,
        isSaving,
        error,
        updateField,
        toggleLevel,
        save,
        loadData,
    } = useApprovalItemsForm(id);

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            Alert.alert(
                'Sukses',
                'Data aturan persetujuan berhasil diperbarui.',
                [{ text: 'OK', onPress: () => setIsEditing(false) }]
            );
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadData();
    };

    const renderSelectedItem = (item: any, unSelect?: (item: any) => void) => (
        <TouchableOpacity disabled={!isEditing} onPress={() => isEditing && unSelect && unSelect(item)}>
            <View className={`flex-row items-center rounded-md px-3 py-1.5 m-1 mt-2 mb-2 ${isEditing ? 'bg-blue-400' : 'bg-gray-400'}`}>
                <X size={14} color="white" />
                <Text className="text-white ml-1.5 text-xs font-bold">{item.label}</Text>
            </View>
        </TouchableOpacity>
    );

    const inputClass = isEditing
        ? "h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 font-bold text-gray-900"
        : "h-12 bg-gray-100 px-4 rounded-xl border border-gray-200 font-bold text-gray-500";

    const textAreaClass = isEditing
        ? "bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 font-bold text-gray-900"
        : "bg-gray-100 p-4 rounded-xl border border-gray-200 font-bold text-gray-500";

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator
                title={isFetching ? 'MEMUAT DATA...' : (isEditing ? 'EDIT APPROVAL' : 'DETAIL APPROVAL')}
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
                        <ApprovalItemFormSkeleton />
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
                            {/* Kiri (Berdasarkan col-xl-6 pertama di PHP) */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Approval <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={inputClass}
                                    value={formData.approval_name}
                                    onChangeText={(t) => updateField('approval_name', t)}
                                    editable={isEditing}
                                    placeholder="Masukkan nama approval"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Deskripsi</Text>
                                <TextInput
                                    className={textAreaClass}
                                    value={formData.description}
                                    onChangeText={(t) => updateField('description', t)}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                    editable={isEditing}
                                    placeholder="Masukkan deskripsi"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Tipe Approval <Text className="text-red-500">*</Text></Text>
                                <View className={`border rounded-xl ${isEditing ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 opacity-80'}`}>
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={[{ label: 'Standard', value: 'standard' }, { label: 'Auto', value: 'auto' }]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Tipe Approval"
                                        value={formData.approval_type}
                                        onChange={(item) => updateField('approval_type', item.value)}
                                        disable={!isEditing}
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Modul <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={inputClass}
                                    value={formData.module_name}
                                    onChangeText={(t) => updateField('module_name', t)}
                                    editable={isEditing}
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
                                    className={inputClass}
                                    value={formData.table_name}
                                    onChangeText={(t) => updateField('table_name', t)}
                                    editable={isEditing}
                                    placeholder="Masukkan nama tabel"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Kolom Status</Text>
                                <TextInput
                                    className={inputClass}
                                    value={formData.status_column_name}
                                    onChangeText={(t) => updateField('status_column_name', t)}
                                    editable={isEditing}
                                    placeholder="Masukkan nama kolom status"
                                />
                            </View>

                            <View className="flex-row gap-3 mb-4">
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Status (Approve)</Text>
                                    <TextInput
                                        className={inputClass}
                                        value={formData.new_status_approve}
                                        onChangeText={(t) => updateField('new_status_approve', t)}
                                        editable={isEditing}
                                        placeholder="Approve"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Status (Reject)</Text>
                                    <TextInput
                                        className={inputClass}
                                        value={formData.new_status_reject}
                                        onChangeText={(t) => updateField('new_status_reject', t)}
                                        editable={isEditing}
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
                                    className={`${textAreaClass} font-mono text-sm leading-6`}
                                    value={formData.rule}
                                    onChangeText={(t) => updateField('rule', t)}
                                    multiline
                                    numberOfLines={5}
                                    textAlignVertical="top"
                                    editable={isEditing}
                                    placeholder="Masukkan kode untuk validasi"
                                />
                            </View>

                            {/* Bawah (Level Approver) */}
                            {formData.approval_type !== 'auto' && (
                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Level Approver</Text>
                                    <View className={`border rounded-xl ${isEditing ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 opacity-80'}`}>
                                        <MultiSelect
                                            style={{ minHeight: 48, paddingHorizontal: 16 }}
                                            data={levelsOption.map(lvl => ({ label: lvl.nm_users_level, value: lvl.id_users_level }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Pilih Level Approver"
                                            value={formData.level_ids}
                                            onChange={(item) => updateField('level_ids', item)}
                                            disable={!isEditing}
                                            selectedStyle={{ borderRadius: 8, backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primaryContainer }}
                                            selectedTextStyle={{ color: theme.colors.primary, fontSize: 13, fontWeight: 'bold' }}
                                            renderSelectedItem={renderSelectedItem}
                                            dropdownPosition="top"
                                        />
                                    </View>
                                </View>
                            )}
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
