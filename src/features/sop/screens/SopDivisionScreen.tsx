import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
    SopListScreen: { divisi: string };
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

    useEffect(() => {
        loadData();
    }, [dispatch]);

    const totalSop = divisions.reduce((acc, curr) => acc + curr.total, 0);

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
                    <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1">
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 items-center justify-center">
                            <Text className="text-gray-500 font-bold mb-1">Total Dokumen SOP</Text>
                            <Text className="text-3xl font-extrabold" style={{ color: theme.colors.primary }}>
                                {totalSop}
                            </Text>
                        </View>

                        {divisions.map((item) => (
                            <SopDivisionCard
                                key={item.divisi}
                                data={item}
                                onPress={() => navigation.navigate('SopListScreen', { divisi: item.divisi })}
                            />
                        ))}
                        <View className="h-20" />
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
};
