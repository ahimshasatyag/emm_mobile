import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Save, CheckSquare, Square, Edit2, Trash2, X } from 'lucide-react-native';
import { useApprovalSchemeForm } from '../hooks/useApprovalSchemeForm';
import { useApprovalScheme } from '../hooks/useApprovalScheme';
import { ApprovalSchemeFormSkeleton } from '../skeleton/ApprovalSchemeFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

type RootStackParamList = {
    ApprovalSchemeEdit: { id: string };
};

export function ApprovalSchemeEditScreen() {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'ApprovalSchemeEdit'>>();
    const { id } = route.params;

    const { formData, rulesOption, isLoading, isSaving, error, initialLoadDone, updateField, toggleRule, save, loadData } = useApprovalSchemeForm(id);
    const { handleDelete } = useApprovalScheme();

    const [isEditing, setIsEditing] = useState(false);

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            setIsEditing(false);
        }
    };

    const onDeletePress = () => {
        Alert.alert(
            "Hapus Skema",
            `Apakah Anda yakin ingin menghapus skema approval "${formData.scheme_name}"?`,
            [
                { text: "Batal", style: "cancel" },
                { 
                    text: "Hapus", 
                    style: "destructive",
                    onPress: () => {
                        handleDelete(id, formData.scheme_name);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadData(); // Revert changes
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title={(!initialLoadDone || isLoading) ? 'MEMUAT DATA...' : (isEditing ? 'EDIT SKEMA APPROVAL' : 'DETAIL SKEMA APPROVAL')} 
                showBackButton 
                onBackPress={() => navigation.goBack()} 
            />

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView 
                    className="flex-1"
                    contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    {(!initialLoadDone || isLoading) ? (
                        <Animated.View exiting={FadeOut}>
                            <ApprovalSchemeFormSkeleton />
                        </Animated.View>
                    ) : (
                        <Animated.View entering={FadeIn} className="flex-1">
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
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Nama Skema <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className={`h-12 px-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500' : 'bg-gray-100 border-transparent text-gray-500'}`}
                                        value={formData.scheme_name}
                                        onChangeText={(t) => updateField('scheme_name', t)}
                                        placeholder="Masukkan nama skema"
                                        editable={isEditing}
                                    />
                                </View>

                                <View className="mb-6">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Deskripsi <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className={`p-4 rounded-xl border h-24 ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500' : 'bg-gray-100 border-transparent text-gray-500'}`}
                                        value={formData.description}
                                        onChangeText={(t) => updateField('description', t)}
                                        placeholder="Masukkan deskripsi skema"
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        editable={isEditing}
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Approval Items (Rules) <Text className="text-red-500">*</Text></Text>
                                    <View className={`border rounded-xl overflow-hidden ${isEditing ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 opacity-80'}`}>
                                        <MultiSelect
                                            style={{ minHeight: 48, paddingHorizontal: 16 }}
                                            data={rulesOption.map(rule => ({ label: rule.approval_name, value: rule.id }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Pilih Approval Items"
                                            value={formData.rule_ids}
                                            onChange={(item) => updateField('rule_ids', item)}
                                            disable={!isEditing}
                                            selectedStyle={{ borderRadius: 8, backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primaryContainer }}
                                            selectedTextStyle={{ color: theme.colors.primary, fontSize: 13, fontWeight: 'bold' }}
                                        />
                                    </View>
                                </View>
                            </Animated.View>

                            <Animated.View entering={FadeInUp.delay(100)}>
                                {isEditing ? (
                                    <View className="flex-row gap-3">
                                        <Button
                                            onPress={handleCancel}
                                            variant="outline"
                                            disabled={isSaving}
                                            className="flex-1 h-14 rounded-2xl flex-row items-center justify-center border-gray-200 bg-white"
                                        >
                                            <X color="#6b7280" size={20} className="mr-2" />
                                            <Text className="text-gray-700 font-bold text-lg">Batal</Text>
                                        </Button>
                                        <Button
                                            onPress={onSavePress}
                                            disabled={isSaving}
                                            className="flex-1 h-14 rounded-2xl flex-row items-center justify-center"
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
                                    </View>
                                ) : (
                                        <Button
                                            onPress={() => setIsEditing(true)}
                                            className="w-full h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
                                            style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                        >
                                            <Edit2 color="white" size={20} className="mr-2" />
                                            <Text className="text-white font-bold text-lg">Edit Skema</Text>
                                        </Button>
                                )}
                            </Animated.View>

                        </Animated.View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
