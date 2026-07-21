import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput } from 'react-native';
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
import { useNavigation, useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

type RootStackParamList = {
    UserList: { toastMessage?: string; toastType?: ToastType };
};

export function UserListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<RouteProp<RootStackParamList, 'UserList'>>();
    const { data, isLoading, error } = useUsers();

    const [isInitializing, setIsInitializing] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastMsg, setToastMsg] = useState('');

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

    useEffect(() => {
        if (route.params?.toastMessage) {
            setToastMsg(route.params.toastMessage);
            setToastType(route.params.toastType || 'success');
            setToastVisible(true);
            navigation.setParams({ toastMessage: undefined, toastType: undefined });
        }
    }, [route.params?.toastMessage]);

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

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.username.toLowerCase().includes(query)
        );
    }, [data, searchQuery]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <HeaderNavigator isLoading={isLoading} />

            <View className="px-4 pt-3 pb-1">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm mb-2">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari nama atau username..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-sm text-gray-800 p-0"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View className="flex-1">
                <FlatList
                    data={(isLoading || isInitializing) ? [] : filteredData}
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

            <ToastMessages
                visible={toastVisible}
                type={toastType}
                message={toastMsg}
                onClose={() => setToastVisible(false)}
            />
        </View>
    );
}
