import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, RefreshControl, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEmployee } from '../hooks/useEmployee';
import { EmployeeCard } from '../components/EmployeeCard';
import { EmployeeListSkeleton } from '../skeleton/EmployeeListSkeleton';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { Search } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInUp } from 'react-native-reanimated';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

type RootStackParamList = {
    EmployeeForm: undefined;
    EmployeeEdit: { id: string };
};

export function EmployeeListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { data, isLoading, error, searchQuery, setSearchQuery, loadData } = useEmployee();

    const [isInitializing, setIsInitializing] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadData(),
                        new Promise(resolve => setTimeout(resolve, 800))
                    ]);
                } catch (error) {
                    // console.error("Failed to load:", error);
                } finally {
                    if (isActive) {
                        setIsInitializing(false);
                    }
                }
            };

            initialize();

            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [])
    );

    const onAdd = () => {
        navigation.navigate('EmployeeForm');
    };

    const onItemPress = (item: any) => {
        navigation.navigate('EmployeeEdit', { id: item.id_karyawan });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="DATA KARYAWAN" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-900"
                        placeholder="Cari karyawan, divisi, atau HP..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : data}
                    keyExtractor={(item) => item.id_karyawan}
                    renderItem={({ item, index }) => (
                        <EmployeeCard item={item} index={index} onPress={onItemPress} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={loadData} colors={[theme.colors.primary]} />
                    }
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat Karyawan"
                                    message={error}
                                    onRetry={loadData}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -24 }}>
                                    <EmployeeListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Karyawan Kosong"
                                message="Tidak ada data karyawan yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={onAdd} />
            )}
        </View>
    );
}
