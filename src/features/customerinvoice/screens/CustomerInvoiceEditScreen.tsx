import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Printer, ChevronLeft, MapPin, Phone, Building2, Calendar, FileText, Download } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useCustomerInvoice } from '../hooks/useCustomerInvoice';
import { CustomerInvoiceEditSkeleton } from '../skeleton/CustomerInvoiceEditSkeleton';
import { ProductTable } from '../components/ProductTable';
import { PaymentTable } from '../components/PaymentTable';
import { PaymentModal } from '../components/PaymentModal';
import { NotifModal, NotifModalType } from '../components/NotifModal';
import { ErrorState } from '../../../components/shared/ErrorState';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';

export const CustomerInvoiceEditScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params;

    const { detail, loading, error, getDetail, clearInvoiceDetail } = useCustomerInvoice();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

    // Notif Modal State
    const [isNotifModalVisible, setIsNotifModalVisible] = useState(false);
    const [notifModalType, setNotifModalType] = useState<NotifModalType>('cair');
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({ visible: false, message: '', type: 'error' });

    useEffect(() => {
        getDetail(id);
        return () => {
            clearInvoiceDetail();
        };
    }, [id]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await getDetail(id);
        setIsRefreshing(false);
    };

    if (error && !detail) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator
                    title="DETAIL"
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                />
                <ErrorState error={error} onRetry={() => getDetail(id)} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <ToastMessages
                visible={toast.visible}
                title={toast.type === 'success' ? 'Sukses' : 'Gagal'}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <HeaderNavigator
                title={loading || !detail ? "MEMUAT DATA..." : `DETAIL ${detail.code_invoice}`}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#2563eb']} />}
            >
                {loading || !detail ? (
                    <Animated.View key="skeleton">
                        <CustomerInvoiceEditSkeleton />
                    </Animated.View>
                ) : (
                    <Animated.View key="content">
                        {/* Actions */}
                        <Animated.View entering={FadeInUp.duration(400)}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="px-4 py-3 bg-white border-b border-gray-100 flex-row"
                            >
                                {detail.status_invoice === 'OPEN' && detail.ntot_balance > 0 && (
                                    <TouchableOpacity
                                        onPress={() => setIsPaymentModalVisible(true)}
                                        className="bg-blue-500 flex-row items-center px-3 py-2 rounded mr-2"
                                    >
                                        <Text className="text-white font-bold text-xs">Tambah Payment</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity className="bg-gray-800 flex-row items-center px-3 py-2 rounded mr-2">
                                    <Printer size={14} color="white" />
                                    <Text className="text-white font-bold ml-1 text-xs">Print Tanda Terima 1</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="bg-gray-800 flex-row items-center px-3 py-2 rounded mr-2">
                                    <Printer size={14} color="white" />
                                    <Text className="text-white font-bold ml-1 text-xs">Print Tanda Terima 2</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="bg-green-600 flex-row items-center px-3 py-2 rounded mr-2">
                                    <Printer size={14} color="white" />
                                    <Text className="text-white font-bold ml-1 text-xs">Print Invoice V1</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="bg-green-600 flex-row items-center px-3 py-2 rounded mr-4">
                                    <Printer size={14} color="white" />
                                    <Text className="text-white font-bold ml-1 text-xs">Print Invoice V2</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </Animated.View>

                        <View className="p-4">
                            <Animated.View
                                layout={LinearTransition}
                                entering={FadeInDown.delay(100)}
                                className="bg-white rounded-2xl mb-8"
                                style={{ elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 }}
                            >
                                <View className="rounded-2xl overflow-hidden border border-gray-100 bg-white">

                                    {/* Header Info */}
                                    <View className="p-4 border-b border-gray-100">
                                        <Text className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Informasi Tagihan</Text>

                                        <View className="space-y-3">
                                            <View>
                                                <Text className="text-xs text-gray-500 mb-1">Customer</Text>
                                                <View className="flex-row items-center">
                                                    <Building2 size={16} color="#4B5563" />
                                                    <Text className="text-sm font-bold text-gray-800 ml-2">{detail.nm_customers}</Text>
                                                </View>
                                                <View className="flex-row mt-1 ml-6">
                                                    <MapPin size={12} color="#6B7280" className="mt-0.5" />
                                                    <Text className="text-xs text-gray-600 ml-1 flex-1">{detail.customers_address}</Text>
                                                </View>
                                            </View>

                                            <View className="flex-row pt-2 border-t border-gray-50">
                                                <View className="flex-1">
                                                    <Text className="text-xs text-gray-500 mb-1">Source Document</Text>
                                                    <View className="flex-row items-center">
                                                        <FileText size={14} color="#4B5563" />
                                                        <Text className="text-sm font-semibold text-gray-800 ml-2">{detail.code_so}</Text>
                                                    </View>
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="text-xs text-gray-500 mb-1">Invoice Date</Text>
                                                    <View className="flex-row items-center">
                                                        <Calendar size={14} color="#4B5563" />
                                                        <Text className="text-sm font-semibold text-gray-800 ml-2">{detail.date_invoice}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View className="flex-row pt-2 border-t border-gray-50">
                                                <View className="flex-1">
                                                    <Text className="text-xs text-gray-500 mb-1">Currency</Text>
                                                    <Text className="text-sm font-semibold text-gray-800">{detail.vcurrency}</Text>
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="text-xs text-gray-500 mb-1">PPN</Text>
                                                    <View className="bg-gray-100 self-start px-2 py-0.5 rounded">
                                                        <Text className="text-xs font-semibold text-gray-700">
                                                            {String(detail.flag_ppn) === '1' ? `YA (${detail.nppn_amount}%)` : 'TIDAK'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Items Table */}
                                    <ProductTable detail={detail} />

                                    {/* Payments Table */}
                                    <PaymentTable
                                        detail={detail}
                                        onEditPayment={(payment) => {
                                            setSelectedPayment(payment);
                                            setIsPaymentModalVisible(true);
                                        }}
                                        onCairPayment={(payment) => {
                                            setSelectedPayment(payment);
                                            setNotifModalType('cair');
                                            setIsNotifModalVisible(true);
                                        }}
                                        onBatalPayment={(payment) => {
                                            setSelectedPayment(payment);
                                            setNotifModalType('batal');
                                            setIsNotifModalVisible(true);
                                        }}
                                    />
                                </View>
                            </Animated.View>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>

            {/* Modals */}
            <PaymentModal
                visible={isPaymentModalVisible}
                onDismiss={() => setIsPaymentModalVisible(false)}
                onSave={(data) => {
                    setIsPaymentModalVisible(false);
                    setToast({ visible: true, message: 'Payment berhasil disimpan!', type: 'success' });
                }}
            />

            <NotifModal
                visible={isNotifModalVisible}
                type={notifModalType}
                onDismiss={() => setIsNotifModalVisible(false)}
                onConfirm={(data) => {
                    setIsNotifModalVisible(false);
                }}
            />
        </View>
    );
};
