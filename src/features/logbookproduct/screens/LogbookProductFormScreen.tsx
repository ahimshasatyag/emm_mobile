import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save, X } from 'lucide-react-native';
import { Dropdown } from "react-native-element-dropdown";
import Animated, { FadeInUp } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Button } from '../../../components/ui/button';
import { theme } from '../../../theme/theme';

export function LogbookProductFormScreen() {
    const navigation = useNavigation<any>();
    
    // Form State
    const [idProduct, setIdProduct] = useState('');
    const [idTypeKerusakan, setIdTypeKerusakan] = useState('');
    const [masalah, setMasalah] = useState('');
    const [solusi, setSolusi] = useState('');
    const [catatan, setCatatan] = useState('');
    const [dateLogBook, setDateLogBook] = useState(new Date().toISOString().split('T')[0]);

    // Dummy Dropdown Data
    const products = [
        { label: 'PRD-001 - Mesin Kopi Espresso', value: '1' },
        { label: 'PRD-002 - Mesin Grinder', value: '2' },
    ];
    
    const typeKerusakan = [
        { label: 'Mekanik', value: '1' },
        { label: 'Elektrik', value: '2' },
        { label: 'Lainnya', value: '3' },
    ];

    const handleSave = () => {
        if (!idProduct || !idTypeKerusakan || !masalah || !solusi) {
            Alert.alert("Perhatian", "Data belum lengkap!");
            return;
        }
        Alert.alert(
            "Konfirmasi",
            "Simpan Logbook Product?",
            [
                { text: "Batal", style: "cancel" },
                { 
                    text: "Simpan", 
                    onPress: () => {
                        Alert.alert("Sukses", "Data berhasil disimpan!");
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title="TAMBAH LOGBOOK PRODUCT"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
                disableAnimation={true}
            />

            <View style={{ padding: 12, flex: 1, paddingBottom: 0 }}>
                <ScrollView 
                    className="flex-1" 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                        
                        <View className="mb-5">
                            <Text className="text-xs font-bold text-gray-700 mb-2">Product Name <Text className="text-red-500">*</Text></Text>
                            <View className="border border-gray-300 rounded-lg justify-center h-[42px] bg-white">
                                <Dropdown
                                    style={{ paddingHorizontal: 12 }}
                                    data={products}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Product"
                                    value={idProduct}
                                    onChange={(item) => setIdProduct(item.value)}
                                    selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                />
                            </View>
                        </View>

                        <View className="mb-5">
                            <Text className="text-xs font-bold text-gray-700 mb-2">Type Kerusakan <Text className="text-red-500">*</Text></Text>
                            <View className="border border-gray-300 rounded-lg justify-center h-[42px] bg-white">
                                <Dropdown
                                    style={{ paddingHorizontal: 12 }}
                                    data={typeKerusakan}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Type Kerusakan"
                                    value={idTypeKerusakan}
                                    onChange={(item) => setIdTypeKerusakan(item.value)}
                                    selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
                                />
                            </View>
                        </View>

                        <View className="mb-5">
                            <Text className="text-xs font-bold text-gray-700 mb-2">Date</Text>
                            <View className="bg-gray-100 px-3 justify-center border border-gray-200 rounded-lg h-[42px]">
                                <Text className="text-sm text-gray-800">{dateLogBook}</Text>
                            </View>
                        </View>

                        <View className="h-px bg-gray-200 mb-5" />

                        <View className="mb-5">
                            <Text className="text-xs font-bold text-gray-700 mb-2">Problem <Text className="text-red-500">*</Text></Text>
                            <TextInput 
                                className="bg-white p-3 border border-gray-300 rounded-lg text-sm text-gray-800"
                                style={{ minHeight: 80, textAlignVertical: 'top' }}
                                multiline
                                value={masalah}
                                onChangeText={setMasalah}
                                placeholder="Jelaskan masalah..."
                            />
                        </View>

                        <View className="mb-5">
                            <Text className="text-xs font-bold text-gray-700 mb-2">Solution <Text className="text-red-500">*</Text></Text>
                            <TextInput 
                                className="bg-white p-3 border border-gray-300 rounded-lg text-sm text-gray-800"
                                style={{ minHeight: 80, textAlignVertical: 'top' }}
                                multiline
                                value={solusi}
                                onChangeText={setSolusi}
                                placeholder="Jelaskan solusi..."
                            />
                        </View>

                        <View className="mb-5">
                            <Text className="text-xs font-bold text-gray-700 mb-2">Note</Text>
                            <TextInput 
                                className="bg-white p-3 border border-gray-300 rounded-lg text-sm text-gray-800"
                                style={{ minHeight: 80, textAlignVertical: 'top' }}
                                multiline
                                value={catatan}
                                onChangeText={setCatatan}
                                placeholder="Tambahan catatan..."
                            />
                        </View>
                        
                        {/* Actions */}
                        <Animated.View entering={FadeInUp.delay(100)} className="mt-4 flex-row gap-4">
                            <Button
                                variant="outline"
                                onPress={() => navigation.goBack()}
                                className="flex-1 h-14 rounded-xl flex-row items-center justify-center"
                            >
                                <X color={theme.colors.primary} size={20} className="mr-2" />
                                <Text className="font-bold text-lg" style={{ color: theme.colors.primary }}>Batal</Text>
                            </Button>
                            <Button 
                                onPress={handleSave}
                                className="flex-1 h-14 rounded-2xl flex-row items-center justify-center bg-green-600"
                                style={{ elevation: 4, shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                            >
                                <Save color="white" size={20} className="mr-2" />
                                <Text className="text-white font-bold text-lg">Simpan</Text>
                            </Button>
                        </Animated.View>

                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
