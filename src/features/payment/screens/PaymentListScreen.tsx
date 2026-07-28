import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Search, Plus, Calendar, Check, X } from 'lucide-react-native';
import Animated, { FadeInUp, FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from 'react-native-element-dropdown';
import { usePayment } from '../hooks/usePayment';
import { PaymentCard } from '../components/PaymentCard';
import { PaymentListSkeleton } from '../skeleton/PaymentListSkeleton';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ButtonAdd } from '../../../components/ui/buttonAdd';
import { NotifModalList, NotifModalType } from '../components/NotifModalList';
import { theme } from '../../../theme/theme';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export const PaymentListScreen = () => {
    const navigation = useNavigation<any>();
    const { payments, isLoading, loadPayments } = usePayment();

    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({ visible: false, message: '', type: 'error' });
    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL STATUS');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const [customerFilter, setCustomerFilter] = useState('ALL CUSTOMER');
    const [soFilter, setSoFilter] = useState('ALL SO');

    const [isNotifModalVisible, setIsNotifModalVisible] = useState(false);
    const [notifModalType, setNotifModalType] = useState<NotifModalType>('terima');

    const statusOptions = [
        { label: 'Semua Status', value: 'ALL STATUS' },
        { label: 'DRAFT', value: 'DRAFT' },
        { label: 'CAIR', value: 'CAIR' },
    ];

    const customerOptions = [
        { label: 'Semua Customer', value: 'ALL CUSTOMER' },
        ...Array.from(new Set(payments.map(p => p.nm_customers).filter(Boolean))).map(c => ({ label: c, value: c }))
    ];

    const soOptions = [
        { label: 'Semua SO', value: 'ALL SO' },
        ...Array.from(new Set(payments.map(p => p.code_so).filter(Boolean))).map(so => ({ label: so, value: so }))
    ];

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        loadPayments(),
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
        }, [])
    );

    const handleApplyFilter = () => {
        loadPayments();
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                loadPayments(),
                new Promise(resolve => setTimeout(resolve, 600))
            ]);
        } finally {
            setIsRefreshing(false);
        }
    };

    const filteredPayments = payments.filter(item => {
        const matchSearch = item.nm_customers?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.code_invoice?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'ALL STATUS' || item.status_payment?.toUpperCase() === statusFilter;
        const matchCustomer = customerFilter === 'ALL CUSTOMER' || item.nm_customers === customerFilter;
        const matchSo = soFilter === 'ALL SO' || item.code_so === soFilter;
        return matchSearch && matchStatus && matchCustomer && matchSo;
    });

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                title={toast.type === 'success' ? 'Success' : 'Pemberitahuan'}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <HeaderNavigator title="DAFTAR PAYMENT" />

            <Animated.View entering={FadeInUp.duration(400)} className="px-4 py-3 z-30">
                <Animated.View layout={LinearTransition.springify()} className="flex-row items-center mb-3 space-x-3">
                    <Animated.View layout={LinearTransition.springify()} className="flex-1 bg-white flex-row items-center px-4 py-3.5 rounded-xl border border-gray-200 shadow-sm">
                        <Search color="#9CA3AF" size={20} />
                        <TextInput
                            className="flex-1 ml-3 text-sm text-gray-800 p-0"
                            placeholder="Cari Customer / Payment..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                    </Animated.View>

                    {selectedIds.length > 0 && (
                        <Animated.View entering={FadeIn} exiting={FadeOut} layout={LinearTransition.springify()} className="flex-row ml-3">
                            <TouchableOpacity
                                className="h-12 px-3 rounded-xl items-center justify-center bg-red-500 shadow-sm flex-row mr-2"
                                onPress={() => {
                                    setNotifModalType('batal');
                                    setIsNotifModalVisible(true);
                                }}
                            >
                                <X color="white" size={16} />
                                {!isSearchFocused && (
                                    <Animated.Text entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} className="text-white font-bold text-xs ml-1" numberOfLines={1}>
                                        Batal
                                    </Animated.Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="h-12 px-3 rounded-xl items-center justify-center bg-green-500 shadow-sm flex-row"
                                onPress={() => {
                                    setNotifModalType('terima');
                                    setIsNotifModalVisible(true);
                                }}
                            >
                                <Check color="white" size={16} />
                                {!isSearchFocused && (
                                    <Animated.Text entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} className="text-white font-bold text-xs ml-1" numberOfLines={1}>
                                        Terima
                                    </Animated.Text>
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </Animated.View>

                {/* Dropdowns Filters Row */}
                <View className="flex-row items-center justify-between space-x-2 mb-3 z-20">
                    <View className="flex-1 h-10 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden justify-center">
                        <Dropdown
                            style={{ height: 40, paddingHorizontal: 8 }}
                            placeholderStyle={{ fontSize: 12, color: '#6b7280' }}
                            selectedTextStyle={{ fontSize: 12, color: '#111827', fontWeight: '500' }}
                            data={statusOptions}
                            labelField="label"
                            valueField="value"
                            placeholder="Status"
                            value={statusFilter}
                            onChange={(item) => setStatusFilter(item.value)}
                        />
                    </View>
                    <View className="flex-1 h-10 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden justify-center">
                        <Dropdown
                            style={{ height: 40, paddingHorizontal: 8 }}
                            placeholderStyle={{ fontSize: 12, color: '#6b7280' }}
                            selectedTextStyle={{ fontSize: 12, color: '#111827', fontWeight: '500' }}
                            data={customerOptions}
                            labelField="label"
                            valueField="value"
                            placeholder="Customer"
                            value={customerFilter}
                            onChange={(item) => setCustomerFilter(item.value)}
                        />
                    </View>
                    <View className="flex-1 h-10 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden justify-center">
                        <Dropdown
                            style={{ height: 40, paddingHorizontal: 8 }}
                            placeholderStyle={{ fontSize: 12, color: '#6b7280' }}
                            selectedTextStyle={{ fontSize: 12, color: '#111827', fontWeight: '500' }}
                            data={soOptions}
                            labelField="label"
                            valueField="value"
                            placeholder="Sales Order"
                            value={soFilter}
                            onChange={(item) => setSoFilter(item.value)}
                        />
                    </View>
                </View>

                {/* Date Filter & Filter Button */}
                <View className="flex-row items-end justify-between mb-3 z-10">
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
                                onChange={(event, date) => {
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
                    <View className="flex-1 mr-2">
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
                                onChange={(event, date) => {
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

                    <TouchableOpacity
                        className="px-4 h-10 rounded-lg items-center justify-center shadow-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                        onPress={handleApplyFilter}
                    >
                        <Text className="text-white text-xs font-bold">Filter</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <View className="flex-1">
                <Animated.FlatList
                    entering={FadeInDown}
                    data={isLoading || isInitializing || isRefreshing ? [] : filteredPayments}
                    keyExtractor={(item) => item.id_payment_schdl}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, paddingHorizontal: 16 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={[theme.colors.primary]}
                        />
                    }
                    renderItem={({ item }) => (
                        <PaymentCard
                            payment={item}
                            isSelected={selectedIds.includes(item.id_payment_schdl)}
                            onPress={() => {
                                if (selectedIds.length > 0) {
                                    setSelectedIds(prev =>
                                        prev.includes(item.id_payment_schdl)
                                            ? prev.filter(id => id !== item.id_payment_schdl)
                                            : [...prev, item.id_payment_schdl]
                                    );
                                } else {
                                    navigation.navigate('PaymentEdit', { id: item.id_payment_schdl });
                                }
                            }}
                            onLongPress={() => {
                                if (!selectedIds.includes(item.id_payment_schdl)) {
                                    setSelectedIds(prev => [...prev, item.id_payment_schdl]);
                                }
                            }}
                        />
                    )}
                    ListEmptyComponent={() => {
                        if (isLoading || isInitializing || isRefreshing) {
                            return <PaymentListSkeleton />;
                        }
                        return (
                            <EmptyState
                                title="Tidak ada Data Payment"
                                description="Data Payment yang Anda cari tidak ditemukan."
                            />
                        );
                    }}
                />
            </View>

            {/* Floating Action Button */}
            <ButtonAdd onPress={() => navigation.navigate('PaymentForm', { id: null })} />

            <NotifModalList
                visible={isNotifModalVisible}
                type={notifModalType}
                onDismiss={() => setIsNotifModalVisible(false)}
                onConfirm={(data) => {
                    // console.log('Confirmed:', notifModalType, data, selectedIds);
                    setIsNotifModalVisible(false);
                    setSelectedIds([]);
                    setToast({ visible: true, message: 'Status payment berhasil diperbarui', type: 'success' });
                    // Reload payments if necessary after API call
                }}
            />
        </View>
    );
};
