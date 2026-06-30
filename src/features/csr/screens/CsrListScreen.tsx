import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, TextInput, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search, Plus, Calendar, CheckSquare, Square } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOut, Layout } from 'react-native-reanimated';
import { theme } from '../../../theme/theme';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { useCsr } from '../hooks/useCsr';
import { CsrCard } from '../components/CsrCard';
import { CsrListSkeleton } from '../skeleton/CsrListSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';

export function CsrListScreen() {
    const navigation = useNavigation<any>();
    const { requests, isLoading, loadRequests } = useCsr();
    
    const [isInitializing, setIsInitializing] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isAll, setIsAll] = useState(false);

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const [activeFilter, setActiveFilter] = useState({
        startDate: '',
        endDate: '',
        statusFilter: '',
        isAll: false
    });

    const handleApplyFilter = () => {
        setActiveFilter({
            startDate,
            endDate,
            statusFilter,
            isAll
        });
    };

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadRequests(),
                        new Promise(resolve => setTimeout(resolve, 600))
                    ]);
                } finally {
                    if (isActive) setIsInitializing(false);
                }
            };

            initialize();

            return () => {
                isActive = false;
                setIsInitializing(true);
            };
        }, [loadRequests])
    );

    const handleRefresh = async () => {
        setIsInitializing(true);
        try {
            await Promise.all([
                loadRequests(),
                new Promise(resolve => setTimeout(resolve, 600))
            ]);
        } finally {
            setIsInitializing(false);
        }
    };

    const filteredRequests = requests.filter(r => {
        const matchesSearch = r.nm_customers.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              r.csr_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              r.nm_product.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (activeFilter.isAll) return matchesSearch;

        const matchesStatus = activeFilter.statusFilter === '' || r.status === activeFilter.statusFilter;
        
        let matchesDate = true;
        if (activeFilter.startDate && r.csr_date < activeFilter.startDate) matchesDate = false;
        if (activeFilter.endDate && r.csr_date > activeFilter.endDate) matchesDate = false;

        return matchesSearch && matchesStatus && matchesDate;
    });

    return (
        <View className="flex-1 bg-gray-50">
            <HeaderNavigator 
                title="CUSTOMER REQUEST (CSR)" 
                rightIcon={<Plus color={theme.colors.primary} size={24} />}
                onRightIconPress={() => navigation.navigate('CsrFormScreen')}
            />

            <View className="px-6 pt-5 pb-4">
                <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-gray-200 shadow-sm mb-4">
                    <Search color="#9CA3AF" size={18} />
                    <TextInput
                        className="flex-1 ml-2 text-sm text-gray-800"
                        placeholder="Cari No CSR, Customer, atau Produk..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Date Filter */}
                <View className="flex-row justify-between mb-3">
                    <View className="flex-1 mr-2">
                        <Text className="text-xs text-gray-500 mb-1">Dari Tanggal</Text>
                        <TouchableOpacity 
                            className="bg-white flex-row items-center px-3 h-10 rounded-lg border border-gray-200 shadow-sm"
                            onPress={() => setShowStartDatePicker(true)}
                        >
                            <Calendar color="#9CA3AF" size={14} />
                            <Text className={`flex-1 ml-2 text-xs ${startDate ? 'text-gray-800' : 'text-gray-400'}`}>
                                {startDate || 'YYYY-MM-DD'}
                            </Text>
                        </TouchableOpacity>
                        {showStartDatePicker && (
                            <DateTimePicker
                                value={startDate ? new Date(startDate) : new Date()}
                                mode="date"
                                display="default"
                                onValueChange={(event, date) => {
                                    setShowStartDatePicker(false);
                                    if (date) {
                                        const y = date.getFullYear();
                                        const m = String(date.getMonth() + 1).padStart(2, '0');
                                        const d = String(date.getDate()).padStart(2, '0');
                                        setStartDate(`${y}-${m}-${d}`);
                                    }
                                }}
                            />
                        )}
                    </View>
                    <View className="flex-1 ml-2">
                        <Text className="text-xs text-gray-500 mb-1">Sampai Tanggal</Text>
                        <TouchableOpacity 
                            className="bg-white flex-row items-center px-3 h-10 rounded-lg border border-gray-200 shadow-sm"
                            onPress={() => setShowEndDatePicker(true)}
                        >
                            <Calendar color="#9CA3AF" size={14} />
                            <Text className={`flex-1 ml-2 text-xs ${endDate ? 'text-gray-800' : 'text-gray-400'}`}>
                                {endDate || 'YYYY-MM-DD'}
                            </Text>
                        </TouchableOpacity>
                        {showEndDatePicker && (
                            <DateTimePicker
                                value={endDate ? new Date(endDate) : new Date()}
                                mode="date"
                                display="default"
                                onValueChange={(event, date) => {
                                    setShowEndDatePicker(false);
                                    if (date) {
                                        const y = date.getFullYear();
                                        const m = String(date.getMonth() + 1).padStart(2, '0');
                                        const d = String(date.getDate()).padStart(2, '0');
                                        setEndDate(`${y}-${m}-${d}`);
                                    }
                                }}
                            />
                        )}
                    </View>
                </View>
                
                {/* Status, All Checkbox, and Filter Button */}
                <View className="flex-row items-center justify-between z-10">
                    <View className="flex-1 mr-3 border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <Dropdown
                            style={{ height: 40, paddingHorizontal: 12 }}
                            data={[
                                { label: 'All Status', value: '' },
                                { label: 'Draft CSR', value: 'DRAFT' },
                                { label: 'Outstanding', value: 'OUTSTANDING' },
                                { label: 'CANCELED', value: 'CANCEL' },
                                { label: 'DONE', value: 'DONE' }
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Pilih Status"
                            value={statusFilter}
                            onChange={(item) => setStatusFilter(item.value)}
                            selectedTextStyle={{ fontSize: 12, color: '#1f2937' }}
                            placeholderStyle={{ fontSize: 12, color: '#9CA3AF' }}
                            itemTextStyle={{ fontSize: 12 }}
                        />
                    </View>

                    <TouchableOpacity 
                        className="flex-row items-center mr-3"
                        onPress={() => setIsAll(!isAll)}
                    >
                        {isAll ? <CheckSquare color={theme.colors.primary} size={20} /> : <Square color="#9CA3AF" size={20} />}
                        <Text className="text-sm font-medium text-gray-700 ml-1.5">All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="px-4 py-2.5 rounded-lg items-center justify-center"
                        style={{ backgroundColor: theme.colors.primary }}
                        onPress={handleApplyFilter}
                    >
                        <Text className="text-white text-xs font-bold">Filter</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingTop: 8, paddingBottom: 100, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading && !isInitializing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                    />
                }
            >
                {isInitializing ? (
                    <Animated.View exiting={FadeOut.duration(300)}>
                        <CsrListSkeleton />
                    </Animated.View>
                ) : filteredRequests.length === 0 ? (
                    <EmptyState 
                        title="Data Kosong"
                        message="Tidak ada data CSR yang ditemukan."
                        fullScreen={false}
                    />
                ) : (
                    filteredRequests.map((request, index) => (
                        <Animated.View 
                            key={request.id} 
                            entering={FadeInDown.delay(index * 100).springify()}
                            layout={Layout.springify()}
                        >
                            <TouchableOpacity 
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('CsrEditScreen', { id: request.id })}
                            >
                                <CsrCard request={request} />
                            </TouchableOpacity>
                        </Animated.View>
                    ))
                )}
            </ScrollView>

            <ButtonAdd onPress={() => navigation.navigate('CsrFormScreen')} />
        </View>
    );
}
