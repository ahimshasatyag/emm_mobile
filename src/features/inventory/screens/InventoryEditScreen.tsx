import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Save, ChevronLeft, Plus, Trash2, CheckCircle2, Circle, Printer, Edit3, X } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOut, FadeIn, LinearTransition } from 'react-native-reanimated';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useInventory } from '../hooks/useInventory';
import { InventoryStatus } from '../types/inventory.types';
import { InventoryFormSkeleton } from '../skeleton/InventoryFormSkeleton';
import { Button } from '../../../components/ui/button';

export function InventoryEditScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const assetId = route.params?.id;

    const { assets, types, categories, editAsset, fetchInitialData, getAssetSerials } = useInventory();

    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState('');
    const [typeId, setTypeId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [procuredDate, setProcuredDate] = useState('');
    const [purchasedDate, setPurchasedDate] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [serial, setSerial] = useState('');
    const [status, setStatus] = useState<InventoryStatus>('active');

    const [serialNumbers, setSerialNumbers] = useState([{ name_sn: '', serial_number: '' }]);
    const [fPrint, setFPrint] = useState('');

    const loadData = async () => {
        setIsInitializing(true);
        if (types.length === 0 || categories.length === 0) {
            await fetchInitialData();
        }

        const asset = assets.find(a => a.id === assetId);
        if (asset) {
            setName(asset.name);
            setTypeId(asset.inventory_type_id);
            setCategoryId(asset.inventory_category_id);
            setProcuredDate(asset.procured_date);
            setPurchasedDate(asset.purchased_date);
            setDeskripsi(asset.deskripsi);
            setSerial(asset.serial);
            setStatus(asset.status);
            setFPrint(asset.f_print);

            const serials = await getAssetSerials(assetId);
            if (serials && serials.length > 0) {
                setSerialNumbers(serials.map(s => ({ name_sn: s.name_sn, serial_number: s.serial_number })));
            } else {
                setSerialNumbers([]);
            }
        }
        setIsInitializing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadData();
    };

    useEffect(() => {
        loadData();
    }, [assetId]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const selectedCategoryName = categories.find(c => c.id === categoryId)?.name || '';
    const isVehicle = selectedCategoryName === 'Mobil' || selectedCategoryName === 'Motor';
    const labelProcured = isVehicle ? 'BPKB Date' : 'Procured Date';
    const labelPurchased = isVehicle ? 'STNK Date' : 'Purchase Date';

    const handleAddSerialNumber = () => {
        setSerialNumbers([...serialNumbers, { name_sn: '', serial_number: '' }]);
    };

    const handleRemoveSerialNumber = (index: number) => {
        const newSerials = [...serialNumbers];
        if (fPrint === newSerials[index].serial_number) setFPrint('');
        newSerials.splice(index, 1);
        setSerialNumbers(newSerials);
    };

    const handleSerialNumberChange = (index: number, field: 'name_sn' | 'serial_number', value: string) => {
        const newSerials = [...serialNumbers];
        newSerials[index][field] = value;
        setSerialNumbers(newSerials);
    };

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Error', 'Harap isi nama aset.');
            return;
        }

        setIsSaving(true);
        try {
            await editAsset(assetId, {
                name,
                inventory_type_id: typeId,
                inventory_category_id: categoryId,
                procured_date: procuredDate,
                purchased_date: purchasedDate,
                deskripsi,
                serial,
                status,
                f_print: fPrint,
                serialNumbers: serialNumbers.filter(sn => sn.name_sn && sn.serial_number)
            });
            Alert.alert('Sukses', 'Data inventaris berhasil diupdate', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Gagal menyimpan data');
        } finally {
            setIsSaving(false);
            setIsEditing(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-gray-50">
            <HeaderNavigator
                title={isInitializing || isRefreshing ? "MEMUAT DATA..." : (isEditing ? "EDIT SERIAL NUMBER" : "DETAIL SERIAL NUMBER")}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
            >
                {(isInitializing) ? (
                    <Animated.View exiting={FadeOut.duration(300)}>
                        <InventoryFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeIn.duration(600)}>
                        <Animated.View
                            key={`form-container-${isEditing}`}
                            entering={FadeInUp.delay(50)}
                            layout={LinearTransition.springify()}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6"
                        >
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Assets Name <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className={`bg-gray-50 border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Masukkan nama aset"
                                    editable={isEditing}
                                />
                            </View>

                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Serial Number</Text>
                                <TextInput
                                    className={`bg-gray-50 border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}
                                    value={serial}
                                    onChangeText={setSerial}
                                    placeholder="Induk Serial Number"
                                    editable={isEditing}
                                />
                            </View>
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Status <Text className="text-red-500">*</Text></Text>
                                <View className={`border border-gray-200 rounded-xl bg-gray-50 ${!isEditing ? 'opacity-70 bg-gray-100' : ''}`}>
                                    <Dropdown
                                        style={{ height: 56, paddingHorizontal: 16 }}
                                        data={[
                                            { label: 'Active', value: 'active' },
                                            { label: 'Normal', value: 'normal' },
                                            { label: 'Not Assigned', value: 'not_assigned' },
                                            { label: 'Sold', value: 'sold' },
                                            { label: 'Rusak', value: 'rusak' }
                                        ]}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Status"
                                        value={status}
                                        onChange={item => setStatus(item.value as InventoryStatus)}
                                        placeholderStyle={{ color: '#9CA3AF' }}
                                        disable={!isEditing}
                                    />
                                </View>
                            </View>
                        </Animated.View>



                        <Animated.View
                            key={`actions-${isEditing}`}
                            entering={FadeInUp.delay(100)}
                            layout={LinearTransition.springify()}
                            className="flex-row space-x-3"
                        >
                            {!isEditing ? (
                                <Button
                                    onPress={() => setIsEditing(true)}
                                    className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-indigo-600"
                                    style={{ elevation: 2, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                >
                                    <Edit3 color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-lg">Edit</Text>
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
                                        onPress={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 h-14 rounded-xl flex-row items-center justify-center bg-indigo-600"
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
