import React, { useEffect } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Switch } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { Save, Trash2, Plus, CheckSquare, Square } from 'lucide-react-native';
import { useCustomerForm } from '../hooks/useCustomerForm';
import { CustomerFormSkeleton } from '../skeleton/CustomerFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function CustomerFormScreen() {
    const navigation = useNavigation();

    const {
        formData,
        provinces,
        regencies,
        isSaving,
        error,
        initialLoadDone,
        updateField,
        handleProvinceChange,
        addContact,
        removeContact,
        updateContact,
        save,
        loadInitialData,
    } = useCustomerForm();

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            Alert.alert('Sukses', 'Data pelanggan berhasil ditambahkan', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <HeaderNavigator 
                title="TAMBAH PELANGGAN" 
                showBackButton 
                onBackPress={() => navigation.goBack()} 
            />

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {!initialLoadDone ? (
                    <Animated.View exiting={FadeOut.duration(300)}>
                        <CustomerFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeIn.duration(600)}>
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
                            {/* 1. Company Name */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Company Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.nm_customers}
                                    onChangeText={(t) => updateField('nm_customers', t)}
                                    placeholder="Enter company name"
                                />
                            </View>

                            {/* 2. Address */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Address <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900 min-h-[96px]"
                                    value={formData.customers_address}
                                    onChangeText={(t) => updateField('customers_address', t)}
                                    placeholder="Enter address"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* 3. Address Invoice */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Address Invoice <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900 min-h-[96px]"
                                    value={formData.customers_address_invoice}
                                    onChangeText={(t) => updateField('customers_address_invoice', t)}
                                    placeholder="Enter address invoice"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* 4 & 5. Blacklist and External Sales checkboxes */}
                            <View className="flex-row justify-between items-center mb-4">
                                <TouchableOpacity 
                                    className="flex-row items-center" 
                                    onPress={() => updateField('is_blacklist', !formData.is_blacklist)}
                                >
                                    {formData.is_blacklist ? <CheckSquare size={20} color="#3b82f6" /> : <Square size={20} color="#d1d5db" />}
                                    <Text className="text-sm font-bold text-gray-700 ml-2">Blacklist</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    className="flex-row items-center" 
                                    onPress={() => updateField('is_external_sales', !formData.is_external_sales)}
                                >
                                    {formData.is_external_sales ? <CheckSquare size={20} color="#3b82f6" /> : <Square size={20} color="#d1d5db" />}
                                    <Text className="text-sm font-bold text-gray-700 ml-2">External Sales</Text>
                                </TouchableOpacity>
                            </View>

                            {/* 6. Company toggle */}
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-sm font-bold text-gray-700">Company</Text>
                                <Switch
                                    value={formData.f_company}
                                    onValueChange={(val) => updateField('f_company', val)}
                                    trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                                    thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
                                />
                            </View>

                            {/* If Company: Nama PIC, NIB, NPWP */}
                            {formData.f_company && (
                                <>
                                    <View className="mb-4">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">Nama PIC</Text>
                                        <TextInput
                                            className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                            value={formData.nama_lengkap}
                                            onChangeText={(t) => updateField('nama_lengkap', t)}
                                            placeholder="Enter Nama PIC"
                                        />
                                    </View>
                                    <View className="mb-4">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">NIB</Text>
                                        <TextInput
                                            className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                            value={formData.nib}
                                            onChangeText={(t) => updateField('nib', t.replace(/[^0-9]/g, ''))}
                                            placeholder="Enter NIB"
                                            keyboardType="number-pad"
                                        />
                                    </View>
                                    <View className="mb-4">
                                        <Text className="text-sm font-bold text-gray-700 mb-2">NPWP</Text>
                                        <TextInput
                                            className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                            value={formData.npwp}
                                            onChangeText={(t) => updateField('npwp', t)}
                                            placeholder="Enter NPWP"
                                        />
                                    </View>
                                </>
                            )}

                            {/* 7. NIK PIC */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">NIK PIC</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.nik}
                                    onChangeText={(t) => updateField('nik', t.replace(/[^0-9]/g, ''))}
                                    placeholder="Enter NIK PIC"
                                    keyboardType="number-pad"
                                    maxLength={16}
                                />
                            </View>

                            {/* 8. Mobile */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Mobile <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.customers_mobile}
                                    onChangeText={(t) => updateField('customers_mobile', t.replace(/[^0-9]/g, ''))}
                                    placeholder="Enter mobile"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* 9. Email */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.customers_email}
                                    onChangeText={(t) => updateField('customers_email', t)}
                                    placeholder="Enter email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* 10. Fax */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Fax</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.customers_fax}
                                    onChangeText={(t) => updateField('customers_fax', t.replace(/[^0-9]/g, ''))}
                                    placeholder="Enter fax"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* 11. Phone */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Phone</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900"
                                    value={formData.customers_phone}
                                    onChangeText={(t) => updateField('customers_phone', t.replace(/[^0-9]/g, ''))}
                                    placeholder="Enter phone number"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* 12. Alamat PIC */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Alamat PIC</Text>
                                <TextInput
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 text-gray-900 min-h-[96px]"
                                    value={formData.alamat}
                                    onChangeText={(t) => updateField('alamat', t)}
                                    placeholder="Enter Alamat PIC"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* 13. Provinsi dropdown */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Provinsi <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={provinces.map(d => ({ label: d.nama, value: d.id }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Provinsi"
                                        value={formData.provinsi}
                                        onChange={(item) => handleProvinceChange(item.value)}
                                        search
                                        searchPlaceholder="Cari provinsi..."
                                    />
                                </View>
                            </View>

                            {/* 14. Kabupaten/Kota dropdown */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Kabupaten/Kota <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    <Dropdown
                                        style={{ height: 48, paddingHorizontal: 16 }}
                                        data={regencies.map(p => ({ label: p.nama_kabupaten, value: p.id }))}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Pilih Kabupaten/Kota"
                                        value={formData.kabupaten}
                                        onChange={(item) => updateField('kabupaten', item.value)}
                                        search
                                        searchPlaceholder="Cari kabupaten..."
                                    />
                                </View>
                            </View>
                        </Animated.View>

                        {/* SECTION: CONTACT PERSONS (Bonus, since user might still need it) */}
                        <Animated.View 
                            entering={FadeInUp.delay(100)} 
                            layout={LinearTransition.springify()}
                            className="bg-white p-5 rounded-3xl border border-gray-100 mb-6" 
                            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                        >
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-sm font-bold text-gray-700">Daftar Kontak</Text>
                                <TouchableOpacity 
                                    onPress={addContact}
                                    className="bg-indigo-50 flex-row items-center px-3 py-1.5 rounded-lg"
                                >
                                    <Plus size={14} color="#4f46e5" />
                                    <Text className="text-indigo-600 text-xs font-bold ml-1">Tambah</Text>
                                </TouchableOpacity>
                            </View>

                            {formData.contacts.map((contact, index) => (
                                <View key={contact.id_contact || index} className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text className="text-xs font-bold text-gray-500">Kontak #{index + 1}</Text>
                                        <TouchableOpacity onPress={() => removeContact(index)} className="p-1">
                                            <Trash2 size={16} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <View className="mb-3">
                                        <TextInput
                                            className="h-10 bg-white px-3 rounded-lg border border-gray-200 focus:border-indigo-500 text-gray-900 text-sm"
                                            value={contact.nm_customers_contact}
                                            onChangeText={(t) => updateContact(index, 'nm_customers_contact', t)}
                                            placeholder="Nama Kontak"
                                        />
                                    </View>
                                    <View className="mb-3">
                                        <TextInput
                                            className="h-10 bg-white px-3 rounded-lg border border-gray-200 focus:border-indigo-500 text-gray-900 text-sm"
                                            value={contact.customers_contact_posisi}
                                            onChangeText={(t) => updateContact(index, 'customers_contact_posisi', t)}
                                            placeholder="Posisi (mis: Manager)"
                                        />
                                    </View>
                                    <View className="mb-3">
                                        <TextInput
                                            className="h-10 bg-white px-3 rounded-lg border border-gray-200 focus:border-indigo-500 text-gray-900 text-sm"
                                            value={contact.customers_contact_phone}
                                            onChangeText={(t) => updateContact(index, 'customers_contact_phone', t.replace(/[^0-9]/g, ''))}
                                            placeholder="No HP"
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                    <View>
                                        <TextInput
                                            className="h-10 bg-white px-3 rounded-lg border border-gray-200 focus:border-indigo-500 text-gray-900 text-sm"
                                            value={contact.customers_contact_email}
                                            onChangeText={(t) => updateContact(index, 'customers_contact_email', t)}
                                            placeholder="Email"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>
                            ))}
                            {formData.contacts.length === 0 && (
                                <Text className="text-gray-400 text-center text-sm py-4">Belum ada kontak yang ditambahkan.</Text>
                            )}
                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(150)}>
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
                                        <Text className="text-white font-bold text-lg">Simpan Customer</Text>
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
