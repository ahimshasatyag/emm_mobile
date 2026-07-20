import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save, CheckSquare, Square } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { useInventoryScheduleForm } from '../hooks/useInventoryScheduleForm';
import { InventoryScheduleFormSkeleton } from '../skeleton/InventoryScheduleFormSkeleton';

export function InventoryScheduleFormScreen() {
    const navigation = useNavigation<any>();
    const {
        formData,
        assets,
        users,
        isSaving,
        handleChange,
        handleReminderChange,
        handlePicChange,
        handleSave
    } = useInventoryScheduleForm();

    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Simulate initial loading to show skeleton
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    }, []);

    const onSavePress = () => {
        if (!formData.asset_id || !formData.name || !formData.due_date || (!formData.pic || formData.pic.length === 0)) {
            alert('Silakan lengkapi data wajib (Asset, Name, Due Date, PIC)');
            return;
        }
        handleSave(() => {
            navigation.goBack();
        });
    };

    if (isInitialLoading) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator title="MEMUAT DATA..." showBackButton={true} />
                <InventoryScheduleFormSkeleton />
            </View>
        );
    }

    const assetOptions = assets.map(a => ({ label: `${a.id}. ${a.name}`, value: a.id }));

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : "TAMBAH ASSET SCHEDULE"} showBackButton={true} />

            <ScrollView
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {isRefreshing ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)} className="-mx-4 -mt-4">
                        <InventoryScheduleFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">

                            {/* Asset ID (Dropdown) */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Assets ID <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 12 }}
                                        data={assetOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Asset..."
                                        value={formData.asset_id}
                                        onChange={(item) => handleChange('asset_id', item.value)}
                                    />
                                </View>
                            </View>

                            {/* Name */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Payment Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg p-3 text-gray-800"
                                    value={formData.name}
                                    onChangeText={(val) => handleChange('name', val)}
                                    placeholder="Masukkan nama pembayaran"
                                />
                            </View>

                            {/* Deskripsi */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Payment Deskripsi</Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg p-3 text-gray-800"
                                    value={formData.deskripsi}
                                    onChangeText={(val) => handleChange('deskripsi', val)}
                                    placeholder="Masukkan deskripsi"
                                    multiline
                                    numberOfLines={4}
                                    style={{ textAlignVertical: 'top', minHeight: 100 }}
                                />
                            </View>

                            {/* Periode */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Payment Periode</Text>
                                <View className="flex-row">
                                    {['Monthly', 'Yearly'].map((p) => (
                                        <TouchableOpacity
                                            key={p}
                                            onPress={() => handleChange('periode', p)}
                                            className={`flex-1 py-3 items-center border ${p === 'Monthly' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
                                            style={formData.periode === p ? { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primaryContainer } : { backgroundColor: 'white', borderColor: '#e5e7eb' }}
                                        >
                                            <Text style={formData.periode === p ? { color: theme.colors.primary, fontWeight: 'bold' } : { color: '#4b5563' }}>{p}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Due Date */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Payment DueDate</Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg p-3 text-gray-800"
                                    value={formData.due_date}
                                    onChangeText={(val) => handleChange('due_date', val)}
                                    placeholder="YYYY-MM-DD"
                                />
                            </View>

                            {/* Reminder */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">Reminder</Text>
                                <View className="flex-row gap-4 mt-2">
                                    {['3', '7', '14'].map((days) => {
                                        const isChecked = formData.reminder?.split(',').includes(days);
                                        return (
                                            <TouchableOpacity
                                                key={days}
                                                onPress={() => handleReminderChange(days)}
                                                className="flex-row items-center"
                                            >
                                                {isChecked ? (
                                                    <CheckSquare color={theme.colors.primary} size={20} />
                                                ) : (
                                                    <Square color="#9ca3af" size={20} />
                                                )}
                                                <Text className="ml-2 text-gray-700">{days} days</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* PIC */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm mb-1">PIC <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-lg bg-white overflow-hidden mt-1">
                                    <MultiSelect
                                        style={{ minHeight: 48, paddingHorizontal: 12 }}
                                        data={users.map(u => ({ label: u.nm_users, value: u.username }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih PIC..."
                                        value={formData.pic?.map(p => p.username) || []}
                                        onChange={(selectedUsernames) => {
                                            const newPics = selectedUsernames
                                                .map(username => users.find(u => u.username === username))
                                                .filter(Boolean) as typeof formData.pic;
                                            handleChange('pic', newPics);
                                        }}
                                        selectedStyle={{ borderRadius: 8, backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primaryContainer }}
                                        selectedTextStyle={{ color: theme.colors.primary, fontSize: 13, fontWeight: 'bold' }}
                                        dropdownPosition="top"
                                    />
                                </View>
                            </View>
                        </View>

                        <View className="flex-row gap-4 mt-2 mb-8">
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                className="flex-1 py-4 rounded-xl items-center justify-center bg-gray-100"
                            >
                                <Text className="text-gray-700 font-bold text-lg">Batal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onSavePress}
                                className="flex-1 py-4 rounded-xl flex-row items-center justify-center"
                                style={{ backgroundColor: theme.colors.primary }}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Simpan</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}
