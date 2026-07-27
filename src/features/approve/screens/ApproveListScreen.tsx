import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { Search } from 'lucide-react-native';
import { useApprove } from '../hooks/useApprove';
import { QuotationsTab } from '../components/QuotationsTab';
import { AccountingTab } from '../components/AccountingTab';
import { HistoryTab } from '../components/HistoryTab';
import { ApproveModal } from '../components/ApproveModal';
import { ErrorState } from '../../../components/shared/ErrorState';
import { theme } from '../../../theme/theme';

type TabType = 'quotations' | 'accounting' | 'history';

export const ApproveListScreen = () => {
    const {
        quotations,
        accounting,
        history,
        loading,
        error,
        getQuotations,
        getAccounting,
        getHistory,
        submitApproval
    } = useApprove();

    const [activeTab, setActiveTab] = useState<TabType>('quotations');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isInitializing, setIsInitializing] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);
    const [selectedKeyTable, setSelectedKeyTable] = useState<string | undefined>(undefined);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initialize = async () => {
                setIsInitializing(true);
                try {
                    await Promise.all([
                        fetchData(),
                        new Promise(resolve => setTimeout(resolve, 800))
                    ]);
                } catch (error) {
                    // console.error(error);
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
        }, [activeTab, searchQuery])
    );

    const fetchData = () => {
        if (activeTab === 'quotations') {
            getQuotations(searchQuery);
        } else if (activeTab === 'accounting') {
            getAccounting(searchQuery);
        } else {
            getHistory(searchQuery);
        }
    };

    const handleSearch = () => {
        setIsInitializing(true);
        fetchData();
    };

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await fetchData();
        } finally {
            setIsRefreshing(false);
        }
    }, [activeTab, searchQuery]);

    const handleApproveReject = async (id: string, action: string, type: 'approve' | 'reject') => {
        setIsSubmitting(true);
        const status = type === 'approve' ? '1' : '0';
        await submitApproval(id, action, status);
        setIsSubmitting(false);
        fetchData();
    };

    const handleOpenModal = (id_approval: string, nm_folder: string, id_key_table: string) => {
        setSelectedId(id_approval);
        setSelectedFolder(nm_folder);
        setSelectedKeyTable(id_key_table);
        setModalVisible(true);
    };

    const renderTabs = () => (
        <View className="flex-row px-4 mt-2">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                <TouchableOpacity
                    onPress={() => setActiveTab('quotations')}
                    className={`pb-3 px-4 border-b-2 mr-2 ${activeTab === 'quotations' ? '' : 'border-transparent'}`}
                    style={activeTab === 'quotations' ? { borderBottomColor: theme.colors.primary } : {}}
                >
                    <Text className="font-bold" style={activeTab === 'quotations' ? { color: theme.colors.primary } : { color: '#6b7280' }}>Quotations</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('accounting')}
                    className={`pb-3 px-4 border-b-2 mr-2 ${activeTab === 'accounting' ? '' : 'border-transparent'}`}
                    style={activeTab === 'accounting' ? { borderBottomColor: theme.colors.primary } : {}}
                >
                    <Text className="font-bold" style={activeTab === 'accounting' ? { color: theme.colors.primary } : { color: '#6b7280' }}>Accounting</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('history')}
                    className={`pb-3 px-4 border-b-2 ${activeTab === 'history' ? '' : 'border-transparent'}`}
                    style={activeTab === 'history' ? { borderBottomColor: theme.colors.primary } : {}}
                >
                    <Text className="font-bold" style={activeTab === 'history' ? { color: theme.colors.primary } : { color: '#6b7280' }}>History Approval</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );

    const renderContent = () => {
        if (error && !isInitializing) {
            return (
                <ScrollView 
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                >
                    <ErrorState 
                        title="Gagal Memuat Data"
                        message={error}
                        onRetry={fetchData}
                        fullScreen={true}
                    />
                </ScrollView>
            );
        }

        const isLoading = isInitializing || isSubmitting || loading;

        switch (activeTab) {
            case 'quotations':
                return (
                    <QuotationsTab
                        data={quotations}
                        onApprove={(id, action) => handleApproveReject(id, action, 'approve')}
                        onReject={(id, action) => handleApproveReject(id, action, 'reject')}
                        onRowPress={(id, code) => handleOpenModal(id, 'quotations', code)}
                        isRefreshing={isRefreshing}
                        onRefresh={onRefresh}
                        loading={isLoading}
                    />
                );
            case 'accounting':
                return (
                    <AccountingTab
                        data={accounting}
                        onApprove={(id, action) => handleApproveReject(id, action, 'approve')}
                        onReject={(id, action) => handleApproveReject(id, action, 'reject')}
                        onRowPress={(id, folder, code) => handleOpenModal(id, folder, code)}
                        isRefreshing={isRefreshing}
                        onRefresh={onRefresh}
                        loading={isLoading}
                    />
                );
            case 'history':
                return (
                    <HistoryTab
                        data={history}
                        onRowPress={(id, folder, code) => handleOpenModal(id, folder, code)}
                        isRefreshing={isRefreshing}
                        onRefresh={onRefresh}
                        loading={isLoading}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <View className="flex-1 bg-[#f9fafb]">
            <HeaderNavigator title="APPROVAL LIST" isBack={false} noBottomRadius noShadow />

            <View className="bg-white rounded-b-3xl pt-2 shadow-sm z-10" style={{ elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 15 }}>
                {/* Search Bar */}
                <View className="px-4 mb-2">
                    <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
                        <Search color="#9ca3af" size={18} />
                        <TextInput
                            className="flex-1 ml-2 text-sm text-gray-700 py-1"
                            placeholder="Search..."
                            placeholderTextColor="#9ca3af"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                    </View>
                </View>

                {/* Tabs */}
                {renderTabs()}
            </View>

            {/* Content Area */}
            {renderContent()}

            <ApproveModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                idApproval={selectedId}
                nmFolder={selectedFolder}
                idKeyTable={selectedKeyTable}
            />
        </View>
    );
};
