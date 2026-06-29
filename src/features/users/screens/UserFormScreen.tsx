import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useUserForm } from '../hooks/useUserForm';
import { UserFormSkeleton } from '../skeleton/UserFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInDown, FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function UserFormScreen() {
    const navigation = useNavigation();

    const {
        formData,
        isFetching,
        isSaving,
        error,
        updateField,
        handleSave,
    } = useUserForm();

    const onSavePress = async () => {
        const success = await handleSave();
        if (success) {
            Alert.alert(
                'Sukses',
                'Pengguna baru berhasil ditambahkan.',
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
                title={isFetching ? "MEMUAT DATA..." : "TAMBAH PENGGUNA"} 
                showBackButton 
                onBackPress={() => navigation.goBack()} 
            />

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={() => {}} colors={[theme.colors.primary]} />
                }
            >
                {isFetching ? (
                    <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
                        <UserFormSkeleton />
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
                            className="bg-white p-5 rounded-3xl border border-gray-100"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <Animated.View entering={FadeInUp.delay(100)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Username</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-blue-500"
                                    value={formData.username}
                                    onChangeText={(text) => updateField('username', text)}
                                    placeholder="Contoh: andi_admin"
                                    autoCapitalize="none"
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(200)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Password</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-blue-500"
                                    value={formData.password}
                                    onChangeText={(text) => updateField('password', text)}
                                    placeholder="Min. 8 kar (Huruf, angka, simbol)"
                                    secureTextEntry
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(300)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Lengkap</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-blue-500"
                                    value={formData.name}
                                    onChangeText={(text) => updateField('name', text)}
                                    placeholder="Contoh: Andi Wijaya"
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(400)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Level Akses</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {['Super Admin', 'Admin', 'HRD', 'Teknisi', 'Sales', 'Finance'].map((level) => (
                                        <TouchableOpacity
                                            key={level}
                                            onPress={() => updateField('level', level)}
                                            className={`px-4 py-2 rounded-full border ${formData.level === level ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
                                        >
                                            <Text className={formData.level === level ? 'text-white font-bold text-xs' : 'text-gray-600 text-xs'}>
                                                {level}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(500)} className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status</Text>
                                <View className="flex-row gap-4">
                                    <TouchableOpacity
                                        onPress={() => updateField('status', 'Active')}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.status === 'Active' ? 'bg-green-50 border-green-500' : 'bg-white border-gray-300'}`}
                                    >
                                        <Text className={`font-bold ${formData.status === 'Active' ? 'text-green-700' : 'text-gray-500'}`}>Aktif</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => updateField('status', 'Inactive')}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.status === 'Inactive' ? 'bg-gray-100 border-gray-400' : 'bg-white border-gray-300'}`}
                                    >
                                        <Text className={`font-bold ${formData.status === 'Inactive' ? 'text-gray-700' : 'text-gray-500'}`}>Tidak Aktif</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </Animated.View>

                        {/* Save Button */}
                        <Animated.View entering={FadeInUp.delay(600)} className="mt-4">
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
                                            Simpan Pengguna
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
