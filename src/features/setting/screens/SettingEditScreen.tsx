import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Save, X, Edit2 } from 'lucide-react-native';
import { useSettingForm } from '../hooks/useSettingForm';
import { SettingFormSkeleton } from '../skeleton/SettingFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function SettingEditScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = (route.params as { id: string }) || { id: '' };

    const [isEditing, setIsEditing] = useState(false);

    const {
        formData,
        isLoading: isFetching,
        isSaving,
        error,
        updateField,
        save,
        loadData,
    } = useSettingForm(id);

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            Alert.alert(
                'Sukses',
                'Data setting berhasil diperbarui.',
                [{ text: 'OK', onPress: () => setIsEditing(false) }]
            );
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadData();
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator 
                title={isFetching ? 'MEMUAT DATA...' : (isEditing ? 'EDIT SETTING' : 'DETAIL SETTING')} 
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
                        <SettingFormSkeleton />
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
                            <Animated.View entering={FadeInUp.delay(100)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Label</Text>
                                <TextInput
                                    className={`h-12 px-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500' : 'bg-gray-100 border-gray-200 text-gray-500'} font-bold`}
                                    value={formData.setting_label}
                                    onChangeText={(text) => updateField('setting_label', text)}
                                    editable={isEditing}
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(200)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Key</Text>
                                <TextInput
                                    className={`h-12 px-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500' : 'bg-gray-100 border-gray-200 text-gray-500'} font-bold`}
                                    value={formData.setting_key}
                                    onChangeText={(text) => updateField('setting_key', text)}
                                    autoCapitalize="characters"
                                    editable={isEditing}
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(300)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Note (Catatan)</Text>
                                <TextInput
                                    className={`min-h-[80px] p-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500' : 'bg-gray-100 border-gray-200 text-gray-500'} font-bold`}
                                    value={formData.setting_note}
                                    onChangeText={(text) => updateField('setting_note', text)}
                                    multiline
                                    textAlignVertical="top"
                                    editable={isEditing}
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(400)} className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Value</Text>
                                <TextInput
                                    className={`min-h-[100px] p-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500' : 'bg-gray-100 border-gray-200 text-gray-500'} font-bold`}
                                    value={formData.setting_value}
                                    onChangeText={(text) => updateField('setting_value', text)}
                                    multiline
                                    textAlignVertical="top"
                                    editable={isEditing}
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(500)} className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status</Text>
                                <View className="flex-row gap-4">
                                    <TouchableOpacity
                                        onPress={() => isEditing && updateField('setting_flag', '1')}
                                        activeOpacity={isEditing ? 0.7 : 1}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.setting_flag === '1' ? (isEditing ? 'bg-green-50 border-green-500' : 'bg-gray-100 border-gray-400') : 'bg-white border-gray-300'} ${!isEditing && formData.setting_flag !== '1' && 'opacity-50'}`}
                                    >
                                        <Text className={`font-bold ${formData.setting_flag === '1' ? (isEditing ? 'text-green-700' : 'text-gray-600') : 'text-gray-500'}`}>Aktif</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => isEditing && updateField('setting_flag', '0')}
                                        activeOpacity={isEditing ? 0.7 : 1}
                                        className={`flex-1 h-12 rounded-xl border items-center justify-center ${formData.setting_flag === '0' ? (isEditing ? 'bg-gray-100 border-gray-400' : 'bg-gray-200 border-gray-400') : 'bg-white border-gray-300'} ${!isEditing && formData.setting_flag !== '0' && 'opacity-50'}`}
                                    >
                                        <Text className={`font-bold ${formData.setting_flag === '0' ? 'text-gray-700' : 'text-gray-500'}`}>Tidak Aktif</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>

                        </Animated.View>

                        {/* Bottom Actions */}
                        <Animated.View 
                            key={`actions-${isEditing}`} 
                            entering={FadeInUp.delay(600)} 
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
                                    <Text className="text-white font-bold text-lg">Edit Setting</Text>
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
