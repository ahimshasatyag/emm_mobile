import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchSopsByDivisi } from '../stores/sopSlice';
import { SopCard } from '../components/SopCard';
import { SopListSkeleton } from '../skeleton/SopListSkeleton';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { ButtonAdd } from '../../../components/ui/buttonAdd';

type RootStackParamList = {
    SopListScreen: { divisi: string };
    SopFormScreen: { divisi: string };
    SopEditScreen: { id_sop: string };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SopListRouteProp = RouteProp<RootStackParamList, 'SopListScreen'>;

export const SopListScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<SopListRouteProp>();
    const { divisi } = route.params;

    const dispatch = useAppDispatch();
    const { sops, loading } = useAppSelector(state => state.sop);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true);
        await dispatch(fetchSopsByDivisi(divisi));
        if (showRefresh) setIsRefreshing(false);
    };

    useEffect(() => {
        loadData();
    }, [dispatch, divisi]);

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator title={isRefreshing ? "MEMUAT DATA..." : `DAFTAR INDUK DOCUMENT ${divisi}`} showBackButton={true} />
            <ScrollView
                className="flex-1 px-4 pt-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => loadData(true)} colors={[theme.colors.primary]} />
                }
            >
                {(loading || isRefreshing) ? (
                    <SopListSkeleton />
                ) : (
                    <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1">
                        {sops.length === 0 ? (
                            <View className="items-center justify-center py-10">
                                <Text className="text-gray-500">Belum ada dokumen SOP</Text>
                            </View>
                        ) : (
                            sops.map((item) => (
                                <SopCard
                                    key={item.id_sop}
                                    data={item}
                                    onPress={() => navigation.navigate('SopEditScreen', { id_sop: item.id_sop })}
                                />
                            ))
                        )}
                        <View className="h-32" />
                    </Animated.View>
                )}
            </ScrollView>

            <ButtonAdd onPress={() => navigation.navigate('SopFormScreen', { divisi })} />
        </View>
    );
};
