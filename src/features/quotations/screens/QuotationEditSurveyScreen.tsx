import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { ToastMessages } from '../../../components/ui/ToastMessages';

export const QuotationEditSurveyScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const params = route.params as any;
        if (params?.showSurveyToast) {
            setToastType('success');
            setToastMessage('Berhasil dialihkan ke halaman survey');
            setToastVisible(true);
            navigation.setParams({ showSurveyToast: undefined } as never);
        }
    }, [route.params]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ToastMessages
                visible={toastVisible}
                message={toastMessage}
                type={toastType}
                onClose={() => setToastVisible(false)}
            />
            <HeaderNavigator 
                title="SURVEY PENAWARAN" 
                showBackButton 
                onBackPress={() => navigation.goBack()} 
            />
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-gray-600 font-medium mb-4">Halaman Survey Penawaran Belum Diimplementasikan</Text>
            </View>
        </SafeAreaView>
    );
};
