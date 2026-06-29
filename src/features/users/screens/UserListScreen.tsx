import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useUsers } from '../hooks/useUsers';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData, setLoading, setError } from '../store/usersSlice';
import { fetchUsersApi } from '../api/users.api';
import { UserCard } from '../components/UserCard';
import { UserListSkeleton } from '../skeleton/UserListSkeleton';
import { ErrorState } from '../../../components/shared/ErrorState';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { theme } from '../../../theme/theme';
import { Search } from 'lucide-react-native';
import { UserData } from '../types/users.types';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export function UserListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { data, isLoading, error } = useUsers();

    const [isInitializing, setIsInitializing] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        handleRefresh(),
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
    const dispatch = useAppDispatch();

    const handleRefresh = async () => {
        dispatch(setLoading(true));
        try {
            const result = await fetchUsersApi();
            dispatch(setData(result));
        } catch (e: any) {
            dispatch(setError(e.message));
        }
    };

    const handleAddUser = () => {
        navigation.navigate('UserForm');
    };

    const handleUserPress = (user: UserData) => {
        navigation.navigate('UserEdit', { userId: user.id });
    };

    // Header dipindah ke atas agar selalu tampil walau sedang loading
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HeaderNavigator isLoading={isLoading} />

            <Animated.View entering={FadeInUp.duration(400)} className="px-6 pt-6 pb-2">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 mb-2">
                    <Search color="#9ca3af" size={20} />
                    <Text className="text-gray-400 ml-2">Cari berdasarkan nama atau username...</Text>
                </View>
            </Animated.View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : data} // Kosongkan data saat loading agar skeleton muncul
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <UserCard user={item} index={index} onPress={handleUserPress} />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
                    }
                    ListEmptyComponent={() => {
                        if (error) {
                            return (
                                <ErrorState
                                    title="Gagal Memuat Pengguna"
                                    message={error}
                                    onRetry={handleRefresh}
                                    fullScreen={true}
                                />
                            );
                        }
                        if (isLoading || isInitializing) {
                            return (
                                <View style={{ marginHorizontal: -24 }}>
                                    <UserListSkeleton />
                                </View>
                            );
                        }
                        return (
                            <EmptyState
                                title="Data Pengguna Kosong"
                                message="Belum ada pengguna yang terdaftar di sistem."
                                fullScreen={true}
                            />
                        );
                    }}
                />
            </View>

            {/* Floating Action Button */}
            {(!isLoading && !isInitializing) && !error && (
                <ButtonAdd onPress={handleAddUser} />
            )}
        </View>
    );
}
