import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { Save } from 'lucide-react-native';
import { useCustomerContactForm } from '../hooks/useCustomerContactForm';
import { CustomerContactFormSkeleton } from '../skeleton/CustomerContactFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export function CustomerContactFormScreen() {
    const navigation = useNavigation<any>();
    const { formData, customers, isLoading, isSaving, error, updateField, loadInitialData, save, validateForm } = useCustomerContactForm();

    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [toastConfig, setToastConfig] = useState({ visible: false, type: 'success' as ToastType, message: '', title: '' });

    useEffect(() => {
        loadInitialData();
    }, []);

    const onSavePress = () => {
        const errorMsg = validateForm();
        if (!errorMsg) {
            setIsConfirmVisible(true);
        } else {
            setToastConfig({ visible: true, type: 'error', message: errorMsg, title: 'Validasi' });
        }
    };

    const handleConfirmSave = async () => {
        setIsConfirmVisible(false);
        const newId = await save();
        if (newId) {
            navigation.replace('CustomerContactEdit', { id: newId, showSuccessToast: true });
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title="TAMBAH CONTACT"
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
                            <CustomerContactFormSkeleton />
                        </Animated.View>
                    ) : (
                        <Animated.View entering={FadeIn} className="flex-1">
                            <Animated.View
                                entering={FadeInUp.delay(50)}
                                layout={LinearTransition.springify()}
                                className="bg-white p-5 rounded-3xl border border-gray-100 mb-6"
                                style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                            >
                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Contact Name <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                        value={formData.nm_customers_contact}
                                        onChangeText={(t) => updateField('nm_customers_contact', t)}
                                        placeholder="Enter Contact Name"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Company Name <Text className="text-red-500">*</Text></Text>
                                    <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            data={customers.map(c => ({ label: c.nm_customers, value: c.id_customers }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Company"
                                            search
                                            searchPlaceholder="Search Company..."
                                            value={formData.id_customers}
                                            onChange={(item) => updateField('id_customers', item.value)}
                                        />
                                    </View>
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Position</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                        value={formData.customers_contact_posisi}
                                        onChangeText={(t) => updateField('customers_contact_posisi', t)}
                                        placeholder="Enter Position"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Phone Number</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                        value={formData.customers_contact_phone}
                                        onChangeText={(t) => updateField('customers_contact_phone', t.replace(/[^0-9]/g, ''))}
                                        placeholder="Enter Phone Number"
                                        keyboardType="number-pad"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Mobile Number</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                        value={formData.customers_contact_mobile}
                                        onChangeText={(t) => updateField('customers_contact_mobile', t.replace(/[^0-9]/g, ''))}
                                        placeholder="Enter Mobile Number"
                                        keyboardType="number-pad"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Email Address</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900"
                                        value={formData.customers_contact_email}
                                        onChangeText={(t) => updateField('customers_contact_email', t)}
                                        placeholder="Enter Email Address"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View className="mb-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Address</Text>
                                    <TextInput
                                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-[#9e0b0f] text-gray-900 h-24"
                                        value={formData.customers_contact_address}
                                        onChangeText={(t) => updateField('customers_contact_address', t)}
                                        placeholder="Enter Address"
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
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
                                            <Text className="text-white font-bold text-lg">Save</Text>
                                        </>
                                    )}
                                </Button>
                            </Animated.View>

                        </Animated.View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>

            <ModalConfirm
                visible={isConfirmVisible}
                title="Simpan Kontak"
                message="Apakah Anda yakin ingin menyimpan data kontak ini?"
                onConfirm={handleConfirmSave}
                onCancel={() => setIsConfirmVisible(false)}
                confirmText="Simpan"
                cancelText="Batal"
            />

            <ToastMessages
                visible={toastConfig.visible}
                type={toastConfig.type}
                message={toastConfig.message}
                title={toastConfig.title}
                onClose={() => setToastConfig(prev => ({ ...prev, visible: false }))}
            />
        </View>
    );
}
