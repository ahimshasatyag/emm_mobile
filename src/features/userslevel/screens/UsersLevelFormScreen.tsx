import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save, CheckCircle2, Circle } from 'lucide-react-native';
import { useUsersLevelForm } from '../hooks/useUsersLevelForm';
import { UsersLevelFormSkeleton } from '../skeleton/UsersLevelFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function UsersLevelFormScreen() {
    const navigation = useNavigation();

    const {
        formData,
        setFormData,
        dashboards,
        menus,
        powers,
        isLoading,
        isSaving,
        error,
        handleRoleToggle,
        handleRoleSelectAllInMenu,
        save,
        loadData,
    } = useUsersLevelForm();

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            Alert.alert(
                'Sukses',
                'Level pengguna baru berhasil ditambahkan.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator
                title={isLoading ? "MEMUAT DATA..." : "TAMBAH LEVEL"}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={loadData} colors={[theme.colors.primary]} />
                }
            >
                {isLoading ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <UsersLevelFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content" entering={FadeIn.duration(600)}>
                        {error && (
                            <Animated.View entering={FadeInUp} className="bg-red-50 p-4 rounded-xl mb-6 border border-red-100">
                                <Text className="text-red-600 font-medium">{error}</Text>
                            </Animated.View>
                        )}

                        <Animated.View
                            entering={FadeInUp.delay(50)}
                            className="bg-white p-5 rounded-3xl border border-gray-100 mb-6"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <Animated.View entering={FadeInUp.delay(100)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Level</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500"
                                    placeholder="Contoh: Admin Gudang"
                                    value={formData.nm_users_level}
                                    onChangeText={t => setFormData({ ...formData, nm_users_level: t })}
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(200)}>
                                <Text className="text-sm font-bold text-gray-700 mb-2">Dashboard Default</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {dashboards.map((dash) => {
                                        const isSelected = formData.id_dashboard === dash.id_dashboard;
                                        return (
                                            <TouchableOpacity
                                                key={dash.id_dashboard}
                                                onPress={() => setFormData({ ...formData, id_dashboard: dash.id_dashboard })}
                                                className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
                                            >
                                                <Text className={isSelected ? 'text-white font-bold text-xs' : 'text-gray-600 text-xs'}>
                                                    {dash.nm_dashboard}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </Animated.View>
                        </Animated.View>

                        <Animated.View
                            entering={FadeInUp.delay(300)}
                            className="bg-white p-5 rounded-3xl border border-gray-100 mb-6"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <Text className="text-sm font-bold text-gray-700 mb-4">Wewenang</Text>

                            <ScrollView
                                style={{ maxHeight: 350 }}
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                className="mr-[-10] pr-3" // Compensate for padding to let scrollbar show neatly
                            >
                                {menus.map((menu, idx) => {
                                    const menuRoles = powers.map(p => `${menu.id_menu}${p.id_users_power}`);
                                    const allSelected = menuRoles.every(r => formData.roles.includes(r));

                                    return (
                                        <View key={menu.id_menu} className={`py-4 ${idx !== menus.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                            <View className="flex-row justify-between items-center mb-3">
                                                <Text className="font-bold text-gray-700 text-[15px]">{menu.nm_menu}</Text>
                                                <TouchableOpacity
                                                    onPress={() => handleRoleSelectAllInMenu(menu.id_menu, !allSelected)}
                                                    className="flex-row items-center"
                                                >
                                                    <Text className="text-xs text-indigo-600 font-medium mr-1">{allSelected ? 'Hapus Semua' : 'Pilih Semua'}</Text>
                                                    {allSelected ? <CheckCircle2 color="#4f46e5" size={16} /> : <Circle color="#9ca3af" size={16} />}
                                                </TouchableOpacity>
                                            </View>
                                            <View className="flex-row flex-wrap gap-2">
                                                {powers.map(power => {
                                                    const roleId = `${menu.id_menu}${power.id_users_power}`;
                                                    const isSelected = formData.roles.includes(roleId);
                                                    return (
                                                        <TouchableOpacity
                                                            key={power.id_users_power}
                                                            onPress={() => handleRoleToggle(roleId)}
                                                            className={`flex-row items-center px-3 py-1.5 rounded-lg border ${isSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}`}
                                                        >
                                                            {isSelected ? <CheckCircle2 color="#4f46e5" size={14} /> : <Circle color="#9ca3af" size={14} />}
                                                            <Text className={`ml-1.5 text-sm font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-500'}`}>
                                                                {power.nm_users_power}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </Animated.View>

                        {/* Save Button */}
                        <Animated.View entering={FadeInUp.delay(400)}>
                            <Button
                                onPress={onSavePress}
                                disabled={isSaving}
                                className="h-14 rounded-xl flex-row items-center justify-center"
                                style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Save color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">
                                            Simpan Level
                                        </Text>
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
