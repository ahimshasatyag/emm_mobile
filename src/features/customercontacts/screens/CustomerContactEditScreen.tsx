import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Save, Edit2, X } from 'lucide-react-native';
import { useCustomerContactForm } from '../hooks/useCustomerContactForm';
import { useCustomerContacts } from '../hooks/useCustomerContacts';
import { CustomerContactFormSkeleton } from '../skeleton/CustomerContactFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ModalConfirm } from '../../../components/ui/ModalConfirm';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

type RootStackParamList = {
    CustomerContactEdit: { id: string; showSuccessToast?: boolean };
};

export function CustomerContactEditScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<RootStackParamList, 'CustomerContactEdit'>>();
    const { id, showSuccessToast } = route.params;

    const { formData, customers, isLoading, isSaving, error, updateField, loadInitialData, save, validateForm } = useCustomerContactForm();
    const { deleteCustomerContact } = useCustomerContacts();

    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [toastConfig, setToastConfig] = useState({ visible: false, type: 'success' as ToastType, message: '', title: '' });

    useEffect(() => {
        loadInitialData(id);
        if (showSuccessToast) {
            setToastConfig({ visible: true, type: 'success', message: 'Contact has been saved successfully!', title: 'Success' });
            navigation.setParams({ showSuccessToast: undefined });
        }
    }, [id, showSuccessToast]);

    const onSavePress = () => {
        const errorMsg = validateForm();
        if (errorMsg) {
            setToastConfig({ visible: true, type: 'error', message: errorMsg, title: 'Validasi' });
            return;
        }
        setIsConfirmVisible(true);
    };

    const handleConfirmSave = async () => {
        setIsConfirmVisible(false);
        const newId = await save();
        if (newId) {
            setToastConfig({ visible: true, type: 'success', message: 'Contact has been updated successfully!', title: 'Success' });
            setIsEditing(false);
            loadInitialData(id);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadInitialData(id); // discard changes
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={isLoading ? 'MEMUAT DATA...' : (isEditing ? 'EDIT CONTACT' : 'DETAIL CONTACT')}
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
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={() => loadInitialData(id)} colors={[theme.colors.primary]} />
                    }
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
                                        className={`h-12 px-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#9e0b0f]' : 'bg-gray-100 border-transparent text-gray-500'}`}
                                        value={formData.nm_customers_contact}
                                        onChangeText={(t) => updateField('nm_customers_contact', t)}
                                        placeholder="Enter Contact Name"
                                        editable={isEditing}
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Company Name <Text className="text-red-500">*</Text></Text>
                                    <View className={`border rounded-xl overflow-hidden ${isEditing ? 'border-gray-200 bg-gray-50' : 'border-transparent bg-gray-100'}`}>
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            data={customers.map(c => ({ label: c.nm_customers, value: c.id_customers }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Company Name"
                                            search
                                            searchPlaceholder="Search company..."
                                            value={formData.id_customers}
                                            onChange={(item) => updateField('id_customers', item.value)}
                                            disable={!isEditing}
                                        />
                                    </View>
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Position</Text>
                                    <TextInput
                                        className={`h-12 px-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#9e0b0f]' : 'bg-gray-100 border-transparent text-gray-500'}`}
                                        value={formData.customers_contact_posisi}
                                        onChangeText={(t) => updateField('customers_contact_posisi', t)}
                                        placeholder="Enter Position"
                                        editable={isEditing}
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Phone Number</Text>
                                    <TextInput
                                        className={`h-12 px-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#9e0b0f]' : 'bg-gray-100 border-transparent text-gray-500'}`}
                                        value={formData.customers_contact_phone}
                                        onChangeText={(t) => updateField('customers_contact_phone', t.replace(/[^0-9]/g, ''))}
                                        placeholder="Enter Phone Number"
                                        keyboardType="number-pad"
                                        editable={isEditing}
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Mobile Number</Text>
                                    <TextInput
                                        className={`h-12 px-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#9e0b0f]' : 'bg-gray-100 border-transparent text-gray-500'}`}
                                        value={formData.customers_contact_mobile}
                                        onChangeText={(t) => updateField('customers_contact_mobile', t.replace(/[^0-9]/g, ''))}
                                        placeholder="Enter Mobile Number"
                                        keyboardType="number-pad"
                                        editable={isEditing}
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Email Address</Text>
                                    <TextInput
                                        className={`h-12 px-4 rounded-xl border ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#9e0b0f]' : 'bg-gray-100 border-transparent text-gray-500'}`}
                                        value={formData.customers_contact_email}
                                        onChangeText={(t) => updateField('customers_contact_email', t)}
                                        placeholder="Enter Email Address"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        editable={isEditing}
                                    />
                                </View>

                                <View className="mb-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Address</Text>
                                    <TextInput
                                        className={`p-4 rounded-xl border h-24 ${isEditing ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#9e0b0f]' : 'bg-gray-100 border-transparent text-gray-500'}`}
                                        value={formData.customers_contact_address}
                                        onChangeText={(t) => updateField('customers_contact_address', t)}
                                        placeholder="Enter Address"
                                        multiline={true}
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        editable={isEditing}
                                    />
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
                                                    <Text className="text-white font-bold text-lg">Save</Text>
                                                </>
                                            )}
                                        </Button>
                                    </View>
                                ) : (
                                    <Button
                                        onPress={() => setIsEditing(true)}
                                        className="w-full h-14 rounded-2xl flex-row items-center justify-center bg-[#9e0b0f]"
                                        style={{ elevation: 4, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                    >
                                        <Edit2 color="white" size={20} className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Edit Contact</Text>
                                    </Button>
                                )}
                            </Animated.View>

                        </Animated.View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>

            <ModalConfirm
                visible={isConfirmVisible}
                title="Save Contact"
                message="Are you sure you want to save the changes to this contact?"
                onConfirm={handleConfirmSave}
                onCancel={() => setIsConfirmVisible(false)}
                confirmText="Save"
                cancelText="Cancel"
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
