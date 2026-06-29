import React, { useEffect } from 'react';
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

export function CustomerContactFormScreen() {
    const navigation = useNavigation();
    const { formData, customers, isLoading, isSaving, error, updateField, loadInitialData, save } = useCustomerContactForm();

    useEffect(() => {
        loadInitialData();
    }, []);

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            navigation.goBack();
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title="TAMBAH KONTAK PELANGGAN" 
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
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Nama Kontak <Text className="text-red-500">*</Text></Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                        value={formData.nm_customers_contact}
                                        onChangeText={(t) => updateField('nm_customers_contact', t)}
                                        placeholder="Masukkan nama kontak"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Pelanggan (Perusahaan) <Text className="text-red-500">*</Text></Text>
                                    <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                        <Dropdown
                                            style={{ height: 48, paddingHorizontal: 16 }}
                                            data={customers.map(c => ({ label: c.nm_customers, value: c.id_customers }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Pilih Pelanggan"
                                            search
                                            searchPlaceholder="Cari pelanggan..."
                                            value={formData.id_customers}
                                            onChange={(item) => updateField('id_customers', item.value)}
                                        />
                                    </View>
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Posisi / Jabatan</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                        value={formData.customers_contact_posisi}
                                        onChangeText={(t) => updateField('customers_contact_posisi', t)}
                                        placeholder="Contoh: Manager, Admin"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">No Telepon</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                        value={formData.customers_contact_phone}
                                        onChangeText={(t) => updateField('customers_contact_phone', t.replace(/[^0-9]/g, ''))}
                                        placeholder="Contoh: 0211234567"
                                        keyboardType="number-pad"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">No Handphone</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                        value={formData.customers_contact_mobile}
                                        onChangeText={(t) => updateField('customers_contact_mobile', t.replace(/[^0-9]/g, ''))}
                                        placeholder="Contoh: 081234567890"
                                        keyboardType="number-pad"
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                                    <TextInput
                                        className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                        value={formData.customers_contact_email}
                                        onChangeText={(t) => updateField('customers_contact_email', t)}
                                        placeholder="Masukkan email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View className="mb-2">
                                    <Text className="text-sm font-bold text-gray-700 mb-2">Alamat</Text>
                                    <TextInput
                                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900 h-24"
                                        value={formData.customers_contact_address}
                                        onChangeText={(t) => updateField('customers_contact_address', t)}
                                        placeholder="Masukkan alamat kontak"
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
