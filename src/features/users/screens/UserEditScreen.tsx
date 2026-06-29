import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Save, X, Edit2 } from 'lucide-react-native';
import { useUserForm } from '../hooks/useUserForm';
import { UserFormSkeleton } from '../skeleton/UserFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function UserEditScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { userId } = (route.params as { userId?: string }) || {};

    const [isEditing, setIsEditing] = useState(false);

    const {
        formData,
        isFetching,
        isSaving,
        error,
        updateField,
        handleSave,
        loadUser,
    } = useUserForm(userId);

    const onSavePress = async () => {
        const success = await handleSave();
        if (success) {
            Alert.alert(
                'Sukses',
                'Data pengguna berhasil diperbarui.',
                [{ text: 'OK', onPress: () => setIsEditing(false) }] // Switch back to view mode on success
            );
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadUser(); // Re-fetch to discard changes
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator 
                title={isFetching ? 'MEMUAT DATA...' : (isEditing ? 'EDIT PENGGUNA' : 'DETAIL PENGGUNA')} 
                showBackButton 
                onBackPress={() => navigation.goBack()} 
            />

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={loadUser} colors={[theme.colors.primary]} />
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
                            key={`form-container-${isEditing}`}
                            entering={FadeInUp.delay(50)} 
                            layout={LinearTransition.springify()}
                            className="bg-white p-5 rounded-3xl border border-gray-100"
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <Animated.View entering={FadeInUp.delay(100)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Username</Text>
                                <TextInput
                                    className="h-12 bg-gray-100 px-4 rounded-xl border border-gray-200 text-gray-500"
                                    value={formData.username}
                                    placeholder="Contoh: andi_admin"
                                    autoCapitalize="none"
                                    editable={false} // Username is always readonly in edit
                                />
                            </Animated.View>

                            {isEditing && (
                                <Animated.View entering={FadeInUp.delay(200)} className="mb-5">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Password Baru</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-blue-500"
                                        value={formData.password}
                                        onChangeText={(text) => updateField('password', text)}
                                        placeholder="Kosongkan jika tidak diubah"
                                        secureTextEntry
                                        editable={isEditing}
                                    />
                                </Animated.View>
                            )}

                            <Animated.View entering={FadeInUp.delay(300)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Nama Lengkap</Text>
                                <TextInput
                                    className={`h-12 px-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500' : 'bg-gray-100 border-gray-200 text-gray-500'}`}
                                    value={formData.name}
                                    onChangeText={(text) => updateField('name', text)}
                                    placeholder="Contoh: Andi Wijaya"
                                    editable={isEditing}
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(400)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Level Akses</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {['Super Admin', 'Admin', 'HRD', 'Teknisi', 'Sales', 'Finance'].map((level) => {
                                        const isSelected = formData.level === level;
                                        return (
                                            <TouchableOpacity
                                                key={level}
                                                onPress={() => isEditing && updateField('level', level)}
                                                activeOpacity={isEditing ? 0.7 : 1}
                                                className={`px-4 py-2 rounded-full border ${isSelected ? (isEditing ? 'bg-blue-600 border-blue-600' : 'bg-gray-400 border-gray-400') : 'bg-white border-gray-300'} ${!isEditing && !isSelected && 'opacity-50'}`}
                                            >
                                                <Text className={isSelected ? 'text-white font-bold text-xs' : 'text-gray-600 text-xs'}>
                                                    {level}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(500)} className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status</Text>
                                <View className="flex-row gap-4">
                                    <TouchableOpacity
                                        onPress={() => isEditing && updateField('status', 'Active')}
                                        activeOpacity={isEditing ? 0.7 : 1}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.status === 'Active' ? (isEditing ? 'bg-green-50 border-green-500' : 'bg-gray-100 border-gray-400') : 'bg-white border-gray-300'} ${!isEditing && formData.status !== 'Active' && 'opacity-50'}`}
                                    >
                                        <Text className={`font-bold ${formData.status === 'Active' ? (isEditing ? 'text-green-700' : 'text-gray-600') : 'text-gray-500'}`}>Aktif</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => isEditing && updateField('status', 'Inactive')}
                                        activeOpacity={isEditing ? 0.7 : 1}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.status === 'Inactive' ? (isEditing ? 'bg-gray-100 border-gray-400' : 'bg-gray-200 border-gray-400') : 'bg-white border-gray-300'} ${!isEditing && formData.status !== 'Inactive' && 'opacity-50'}`}
                                    >
                                        <Text className={`font-bold ${formData.status === 'Inactive' ? 'text-gray-700' : 'text-gray-500'}`}>Tidak Aktif</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </Animated.View>

                        {/* Bottom Actions */}
                        <Animated.View 
                            key={`actions-${isEditing}`} 
                            entering={FadeInUp.delay(300)} 
                            layout={LinearTransition.springify()}
                            className="mt-4 flex-row gap-3"
                        >
                            {!isEditing ? (
                                <Button
                                    onPress={() => setIsEditing(true)}
                                    className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                                    style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                >
                                    <Edit2 color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Edit Pengguna</Text>
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
                                                <Text className="text-white font-bold text-lg">Simpan</Text>
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
