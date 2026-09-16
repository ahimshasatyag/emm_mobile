import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchDivisions } from '../stores/sopSlice';
import { SopDivisionCard } from '../components/SopDivisionCard';
import { SopDivisionSkeleton } from '../skeleton/SopDivisionSkeleton';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';

type RootStackParamList = {
    SopListScreen: { divisiId: string, divisiName: string };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SopDivisionScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useAppDispatch();
    const { divisions, loading } = useAppSelector(state => state.sop);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true);
        await dispatch(fetchDivisions());
        if (showRefresh) setIsRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [dispatch])
    );

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title="DATA DAFTAR INDUK DOCUMENT" showBackButton={false} />
            <ScrollView
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => loadData(true)} colors={[theme.colors.primary]} />
                }
            >
                {(loading || isRefreshing) ? (
                    <SopDivisionSkeleton />
                ) : (
                    <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 pt-2">
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 flex-row items-center justify-between">
                            <Text className="text-gray-600 font-medium">Total Keseluruhan SOP</Text>
                            <View className="bg-blue-50 px-3 py-1 rounded-full">
                                <Text className="text-blue-600 font-bold">
                                    {divisions.reduce((sum, div) => sum + (div.total || 0), 0)} Dokumen
                                </Text>
                            </View>
                        </View>
                        {divisions.map((item) => (
                            <SopDivisionCard
                                key={item.id_karyawan_divisi}
                                data={item}
                                onPress={() => navigation.navigate('SopListScreen', { 
                                    divisiId: item.id_karyawan_divisi.toString(),
                                    divisiName: item.nm_karyawan_divisi 
                                })}
                            />
                        ))}
                        <View className="h-20" />
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
};
