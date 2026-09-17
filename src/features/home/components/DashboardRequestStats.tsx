import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay } from 'react-native-reanimated';
import { Layers, Clock, Settings } from 'lucide-react-native';
import { theme } from '../../../theme/theme';
import { useHomeData } from '../hooks/useHomeData';
import { fetchRequestCsrApi, fetchPendingCstApi, fetchOngoingCstApi } from '../api/home.api';
import { RequestCsrItem, PendingCstItem, OngoingCstItem } from '../types/home.types';

const RequestStatCard = ({ 
    title, value, valueColor, icon, badgeText, badgeColor, badgeBg, iconBg, delay, onAction 
}: any) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
        translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View 
            className="bg-white rounded-2xl p-4 mr-4 w-44 shadow-sm border border-gray-100 flex-col"
            style={[animatedStyle, { elevation: 2 }]}
        >
            <View className="flex-row justify-between items-start mb-3">
                <View className={`w-10 h-10 rounded-full ${iconBg} items-center justify-center`}>
                    {icon}
                </View>
                <TouchableOpacity onPress={onAction}>
                    <Text style={{ color: theme.colors.primary }} className="text-[10px] font-bold">Details &rarr;</Text>
                </TouchableOpacity>
            </View>
            <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</Text>
            <Text className={`text-2xl font-extrabold mb-3 ${valueColor}`}>{value}</Text>
            
            <View className={`${badgeBg} px-2 py-1 rounded self-start mt-auto`}>
                <Text className={`${badgeColor} text-[10px] font-semibold`}>{badgeText}</Text>
            </View>
        </Animated.View>
    );
};

export function DashboardRequestStats() {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any[]>([]);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!activeModal) {
            setModalData([]);
            setPage(1);
            return;
        }

        const fetchData = async () => {
            setIsLoadingModal(true);
            setPage(1);
            try {
                if (activeModal === 'request') {
                    const data = await fetchRequestCsrApi();
                    setModalData(data);
                } else if (activeModal === 'pending') {
                    const data = await fetchPendingCstApi();
                    setModalData(data);
                } else if (activeModal === 'progress') {
                    const data = await fetchOngoingCstApi();
                    setModalData(data);
                }
            } catch (error) {
                console.error("Failed to fetch modal data", error);
            } finally {
                setIsLoadingModal(false);
            }
        };

        fetchData();
    }, [activeModal]);

    const renderPagination = (totalItems: number, totalPages: number) => {
        if (totalItems <= 10) return null;
        return (
            <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100 pb-2">
                <TouchableOpacity 
                    disabled={page === 1}
                    onPress={() => setPage(p => p - 1)}
                    className={`px-3 py-1 bg-gray-100 rounded ${page === 1 ? 'opacity-50' : ''}`}
                >
                    <Text className="text-[10px] font-semibold text-gray-700">Prev</Text>
                </TouchableOpacity>
                <Text className="text-[10px] text-gray-500">Page <Text className="font-bold text-gray-700">{page}</Text> of {totalPages}</Text>
                <TouchableOpacity 
                    disabled={page >= totalPages}
                    onPress={() => setPage(p => p + 1)}
                    className={`px-3 py-1 bg-gray-100 rounded ${page >= totalPages ? 'opacity-50' : ''}`}
                >
                    <Text className="text-[10px] font-semibold text-gray-700">Next</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderTableContent = () => {
        if (modalData.length === 0) {
            return <Text className="text-center py-4 text-gray-500">Tidak ada data</Text>;
        }

        const itemsPerPage = 10;
        const totalPages = Math.ceil(modalData.length / itemsPerPage) || 1;
        const paginatedList = modalData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        if (activeModal === 'request') {
            return (
                <View>
                    <View className="flex-row border-b-2 border-gray-200 pb-2 mb-2">
                        <Text className="w-10 font-bold text-gray-700 text-[11px]">No</Text>
                        <Text className="w-24 font-bold text-gray-700 text-[11px]">Date</Text>
                        <Text className="w-16 font-bold text-gray-700 text-[11px]">Aging</Text>
                        <Text className="w-40 font-bold text-gray-700 text-[11px]">Ticket</Text>
                        <Text className="w-48 font-bold text-gray-700 text-[11px]">Customers</Text>
                        <Text className="w-32 font-bold text-gray-700 text-[11px]">Product Code</Text>
                        <Text className="w-48 font-bold text-gray-700 text-[11px]">Request</Text>
                        <Text className="w-32 font-bold text-gray-700 text-[11px]">User</Text>
                        <Text className="w-24 font-bold text-gray-700 text-[11px]">Status</Text>
                    </View>
                    {paginatedList.map((row: RequestCsrItem, index) => {
                        let aging = '';
                        if (row.csr_date) {
                            const start = new Date(row.csr_date).getTime();
                            let end = new Date().getTime();
                            if (['DONE', 'CANCEL'].includes(row.csr_status || '') || row.f_cancel === 1) {
                                if (row.csr_cancel_date) {
                                    end = new Date(row.csr_cancel_date).getTime();
                                } else if (row.csr_approve_date) {
                                    end = new Date(row.csr_approve_date).getTime();
                                }
                            }
                            aging = Math.floor((end - start) / (1000 * 60 * 60 * 24)).toString();
                        }

                        let statusBadge = null;
                        if (row.csr_status === 'DRAFT') {
                            statusBadge = <View className="bg-gray-800 px-2 py-1 rounded self-start"><Text className="text-white text-[10px]">Draft CSR</Text></View>;
                        } else if (row.csr_status === 'OUTSTANDING') {
                            statusBadge = <View className="bg-amber-500 px-2 py-1 rounded self-start"><Text className="text-white text-[10px]">Outstanding</Text></View>;
                        } else if (row.csr_status === 'CANCEL') {
                            statusBadge = <View className="bg-red-500 px-2 py-1 rounded self-start"><Text className="text-white text-[10px]">CANCELED</Text></View>;
                        } else {
                            statusBadge = <Text className="text-[11px] text-gray-600">{row.csr_status}</Text>;
                        }

                        return (
                            <View key={index} className="flex-row border-b border-gray-100 py-2">
                                <Text className="w-10 text-[11px] text-gray-600">{(page - 1) * itemsPerPage + index + 1}</Text>
                                <Text className="w-24 text-[11px] text-gray-600">{row.csr_date?.substring(0, 10)}</Text>
                                <Text className="w-16 text-[11px] font-bold text-gray-800">{aging}</Text>
                                <Text className="w-40 text-[11px] font-bold text-gray-800">{row.csr_code?.substring(16)}</Text>
                                <Text className="w-48 text-[11px] text-gray-600">{row.nm_customers?.substring(0, 35)}</Text>
                                <Text className="w-32 text-[11px] text-gray-600">{row.code_product?.substring(0, 30)}</Text>
                                <Text className="w-48 text-[11px] text-gray-600">{row.nm_karyawan}</Text>
                                <Text className="w-32 text-[11px] text-gray-600">{row.csr_by}</Text>
                                <View className="w-24">
                                    {statusBadge}
                                </View>
                            </View>
                        );
                    })}
                    {renderPagination(modalData.length, totalPages)}
                </View>
            );
        }

        if (activeModal === 'pending') {
            return (
                <View>
                    <View className="flex-row border-b-2 border-gray-200 pb-2 mb-2">
                        <Text className="w-10 font-bold text-gray-700 text-[11px]">No</Text>
                        <Text className="w-24 font-bold text-gray-700 text-[11px]">Date</Text>
                        <Text className="w-40 font-bold text-gray-700 text-[11px]">CST Code</Text>
                        <Text className="w-48 font-bold text-gray-700 text-[11px]">Customers</Text>
                        <Text className="w-32 font-bold text-gray-700 text-[11px]">Product Code</Text>
                        <Text className="w-24 font-bold text-gray-700 text-[11px]">Status</Text>
                    </View>
                    {paginatedList.map((row: PendingCstItem, index) => (
                        <View key={index} className="flex-row border-b border-gray-100 py-2">
                            <Text className="w-10 text-[11px] text-gray-600">{(page - 1) * itemsPerPage + index + 1}</Text>
                            <Text className="w-24 text-[11px] text-gray-600">{row.cst_date?.substring(0, 10)}</Text>
                            <Text className="w-40 text-[11px] font-bold text-gray-800">{row.cst_code?.substring(16)}</Text>
                            <Text className="w-48 text-[11px] text-gray-600">{row.nm_customers?.substring(0, 35)}</Text>
                            <Text className="w-32 text-[11px] text-gray-600">{row.code_product?.substring(0, 30)}</Text>
                            <View className="w-24">
                                <View className="bg-gray-800 px-2 py-1 rounded self-start">
                                    <Text className="text-white text-[10px]">Pending</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                    {renderPagination(modalData.length, totalPages)}
                </View>
            );
        }

        if (activeModal === 'progress') {
            return (
                <View>
                    <View className="flex-row border-b-2 border-gray-200 pb-2 mb-2">
                        <Text className="w-10 font-bold text-gray-700 text-[11px]">No</Text>
                        <Text className="w-24 font-bold text-gray-700 text-[11px]">Date</Text>
                        <Text className="w-16 font-bold text-gray-700 text-[11px]">Aging</Text>
                        <Text className="w-40 font-bold text-gray-700 text-[11px]">Ticket</Text>
                        <Text className="w-48 font-bold text-gray-700 text-[11px]">Customers</Text>
                        <Text className="w-32 font-bold text-gray-700 text-[11px]">Product Code</Text>
                        <Text className="w-24 font-bold text-gray-700 text-[11px]">Realisasi</Text>
                        <Text className="w-24 font-bold text-gray-700 text-[11px]">Status</Text>
                    </View>
                    {paginatedList.map((row: OngoingCstItem, index) => {
                        let aging = '';
                        if (row.starting_date) {
                            const start = new Date(row.starting_date).getTime();
                            let end = new Date().getTime();
                            if (row.flag_done === 'DONE' || (row.flag_done === 'Draft' && row.lkt_f_cancel === 1) || row.lkt_f_cancel === 1) {
                                if (row.lkt_f_cancel === 1 && row.lkt_cancel_date) {
                                    end = new Date(row.lkt_cancel_date).getTime();
                                } else if (row.lkt_done_date) {
                                    end = new Date(row.lkt_done_date).getTime();
                                }
                            }
                            aging = Math.floor((end - start) / (1000 * 60 * 60 * 24)).toString();
                        }

                        return (
                            <View key={index} className="flex-row border-b border-gray-100 py-2">
                                <Text className="w-10 text-[11px] text-gray-600">{(page - 1) * itemsPerPage + index + 1}</Text>
                                <Text className="w-24 text-[11px] text-gray-600">{row.cst_date?.substring(0, 10)}</Text>
                                <Text className="w-16 text-[11px] font-bold text-gray-800">{aging}</Text>
                                <Text className="w-40 text-[11px] font-bold text-gray-800">{row.cst_code?.substring(16)}</Text>
                                <Text className="w-48 text-[11px] text-gray-600">{row.nm_customers?.substring(0, 35)}</Text>
                                <Text className="w-32 text-[11px] text-gray-600">{row.code_product?.substring(0, 30)}</Text>
                                <Text className="w-24 text-[11px] text-gray-600">{row.max_actual_starting_date?.substring(0, 10) || '-'}</Text>
                                <View className="w-24">
                                    <View className="bg-amber-100 border border-amber-300 px-2 py-1 rounded self-start">
                                        <Text className="text-amber-700 font-bold text-[10px]">In Progress</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                    {renderPagination(modalData.length, totalPages)}
                </View>
            );
        }

        return null;
    };

    const renderModal = () => {
        if (!activeModal) return null;

        let title = '';
        if (activeModal === 'request') title = 'Status CSR Masih Baru (Request)';
        if (activeModal === 'pending') title = 'CST Belum Di Proses (Pending)';
        if (activeModal === 'progress') title = 'LKT Sedang Di Proses (In Progress)';

        return (
            <Modal transparent visible animationType="fade" onRequestClose={() => setActiveModal(null)}>
                <View className="flex-1 bg-black/50 justify-center items-center p-4">
                    <View className="bg-white rounded-xl w-full max-w-[95%] max-h-[80%] overflow-hidden shadow-xl">
                        <View className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex-row justify-between items-center">
                            <Text className="font-bold text-gray-800 text-sm">{title}</Text>
                            <TouchableOpacity onPress={() => setActiveModal(null)}>
                                <Text className="text-gray-400 font-bold text-lg leading-none">X</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal>
                            <ScrollView className="p-4" style={{ minWidth: 600 }}>
                                {isLoadingModal ? (
                                    <View className="py-10 justify-center items-center" style={{ width: 600 }}>
                                        <ActivityIndicator size="large" color={theme.colors.primary} />
                                    </View>
                                ) : (
                                    renderTableContent()
                                )}
                            </ScrollView>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    const { data } = useHomeData();

    const requests = [
        {
            id: 'request',
            title: 'Request',
            value: data?.requestStats?.total_request?.toString() || '0',
            valueColor: 'text-gray-800',
            icon: <Layers color={theme.colors.primary} size={20} />,
            badgeText: 'New CSR Status',
            badgeColor: 'text-gray-600',
            badgeBg: 'bg-gray-100',
            iconBg: 'bg-red-50'
        },
        {
            id: 'pending',
            title: 'Pending',
            value: data?.requestStats?.total_pending?.toString() || '0',
            valueColor: 'text-red-600',
            icon: <Clock color="#ea580c" size={20} />,
            badgeText: 'CST Unapproved',
            badgeColor: 'text-red-600',
            badgeBg: 'bg-red-50',
            iconBg: 'bg-orange-50'
        },
        {
            id: 'progress',
            title: 'In Progress',
            value: data?.requestStats?.total_progres?.toString() || '0',
            valueColor: 'text-amber-500',
            icon: <Settings color="#2563eb" size={20} />,
            badgeText: 'LKT Processing',
            badgeColor: 'text-amber-600',
            badgeBg: 'bg-amber-50',
            iconBg: 'bg-blue-50'
        }
    ];

    return (
        <View className="py-2 mb-6">
            {renderModal()}
            <Text className="px-6 text-lg font-extrabold text-gray-800 mb-4">Status Permintaan</Text>
            
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
            >
                {requests.map((req, index) => (
                    <RequestStatCard 
                        key={req.id}
                        {...req}
                        delay={index * 100}
                        onAction={() => setActiveModal(req.id)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}
