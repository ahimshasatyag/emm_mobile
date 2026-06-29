import React from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save } from 'lucide-react-native';
import { useInventoryTypeForm } from '../hooks/useInventoryTypeForm';
import { InventoryTypeFormSkeleton } from '../skeleton/InventoryTypeFormSkeleton';
import { theme } from '../../../theme/theme';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../components/ui/button';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';

export function InventoryTypeFormScreen() {
    const navigation = useNavigation();

    const {
        formData,
        isSaving,
        error,
        initialLoadDone,
        updateField,
        save,
    } = useInventoryTypeForm();

    const onSavePress = async () => {
        const success = await save();
        if (success) {
            Alert.alert('Sukses', 'Tipe inventori berhasil ditambahkan', [
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
                title="TAMBAH TIPE" 
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
                        <InventoryTypeFormSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeIn.duration(600)}>
                        {error && (
                            <Animated.View entering={FadeInUp} className="bg-red-50 p-4 rounded-xl mb-6 border border-red-100">
                                <Text className="text-red-600 font-medium">{error}</Text>
                            </Animated.View>
                        )}

                        <Animated.View entering={FadeInUp.delay(50)} className="bg-white p-5 rounded-3xl border border-gray-100 mb-6" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}>
                            
                            <Animated.View entering={FadeInUp.delay(100)} className="mb-2">
                                <Text className="text-sm font-bold text-gray-700 mb-2">Type Name</Text>
                                <TextInput
                                    className="h-12 bg-gray-50 px-4 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500"
                                    value={formData.name}
                                    onChangeText={(text) => updateField('name', text)}
                                    placeholder="Contoh: Bahan Baku"
                                />
                            </Animated.View>

                        </Animated.View>

                        <Animated.View entering={FadeInUp.delay(200)}>
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
                                        <Text className="text-white font-bold text-lg">Simpan Tipe</Text>
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
