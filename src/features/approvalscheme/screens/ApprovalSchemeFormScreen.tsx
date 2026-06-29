import React from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { Save, CheckSquare, Square } from 'lucide-react-native';
import { useApprovalSchemeForm } from '../hooks/useApprovalSchemeForm';
import { ApprovalSchemeFormSkeleton } from '../skeleton/ApprovalSchemeFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function ApprovalSchemeFormScreen() {
    const navigation = useNavigation();
    const { formData, rulesOption, isLoading, isSaving, error, updateField, toggleRule, save } = useApprovalSchemeForm();

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            navigation.goBack();
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title="TAMBAH SKEMA APPROVAL" 
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
                    {isLoading ? (
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
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                        value={formData.scheme_name}
                                        onChangeText={(t) => updateField('scheme_name', t)}
                                        placeholder="Masukkan nama skema"
                                    />
                                </View>

                                <View className="mb-6">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Deskripsi <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900 h-24"
                                        value={formData.description}
                                        onChangeText={(t) => updateField('description', t)}
                                        placeholder="Masukkan deskripsi skema"
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Approval Items (Rules) <Text className="text-red-500">*</Text></Text>
                                    <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                        <MultiSelect
                                            style={{ minHeight: 48, paddingHorizontal: 16 }}
                                            data={rulesOption.map(rule => ({ label: rule.approval_name, value: rule.id }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Pilih Approval Items"
                                            value={formData.rule_ids}
                                            onChange={(item) => updateField('rule_ids', item)}
                                            selectedStyle={{ borderRadius: 8, backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primaryContainer }}
                                            selectedTextStyle={{ color: theme.colors.primary, fontSize: 13, fontWeight: 'bold' }}
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
        </View>
    );
}
