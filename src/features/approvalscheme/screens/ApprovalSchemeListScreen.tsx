import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, RefreshControl, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';
import Animated, { FadeInUp, FadeIn, FadeOut } from 'react-native-reanimated';

import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { ApprovalSchemeCard } from '../components/ApprovalSchemeCard';
import { ApprovalSchemeListSkeleton } from '../skeleton/ApprovalSchemeListSkeleton';
import { useApprovalScheme } from '../hooks/useApprovalScheme';
import { theme } from '../../../theme/theme';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';

type RootStackParamList = {
    ApprovalSchemeForm: undefined;
    ApprovalSchemeEdit: { id: string };
};

export function ApprovalSchemeListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { 
        data, 
        isLoading, 
        error, 
        searchQuery, 
        setSearchQuery, 
        loadData 
    } = useApprovalScheme();

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

    const handleAdd = () => {
        navigation.navigate('ApprovalSchemeForm');
    };

    const handleItemPress = (item: any) => {
        navigation.navigate('ApprovalSchemeEdit', { id: item.id });
    };

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="SKEMA APPROVAL" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-900"
                        placeholder="Cari nama skema..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <ApprovalSchemeCard item={item} index={index} onPress={handleItemPress} />
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
                                    title="Gagal Memuat Skema"
                                    message={error}
                                    onRetry={loadData}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -24 }}>
                                    <ApprovalSchemeListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Skema Kosong"
                                message="Tidak ada data skema approval yang ditemukan."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={handleAdd} />
            )}
        </View>
    );
}
