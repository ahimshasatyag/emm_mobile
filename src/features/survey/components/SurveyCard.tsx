import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, Calendar, User, FileText } from 'lucide-react-native';
import { Survey } from '../types/survey.types';

interface SurveyCardProps {
    survey: Survey;
    onPress: () => void;
}

export function SurveyCard({ survey, onPress }: SurveyCardProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'bg-emerald-100 text-emerald-700';
            case 'waiting approval': return 'bg-amber-100 text-amber-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <TouchableOpacity
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View className="flex-row justify-between items-start mb-3">
                <View>
                    <Text className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wider">
                        SURVEY CODE
                    </Text>
                    <Text className="text-sm font-bold text-gray-800">
                        {survey.code_survey}
                    </Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${getStatusColor(survey.survey_status).split(' ')[0]}`}>
                    <Text className={`text-[10px] font-bold ${getStatusColor(survey.survey_status).split(' ')[1]}`}>
                        {survey.survey_status}
                    </Text>
                </View>
            </View>

            <View className="space-y-2 mb-3">
                <View className="flex-row items-center">
                    <Calendar size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-600 ml-2">{survey.date_request}</Text>
                </View>
                
                <View className="flex-row items-center">
                    <User size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-600 ml-2 flex-1" numberOfLines={1}>
                        {survey.nm_customers}
                    </Text>
                </View>
                
                <View className="flex-row items-center">
                    <FileText size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-600 ml-2">
                        {survey.items?.length || 0} Items
                    </Text>
                </View>
            </View>

            <View className="pt-3 border-t border-gray-50 flex-row justify-between items-center">
                <Text className="text-xs text-gray-400">Ket: {survey.keterangan || '-'}</Text>
                <View className="w-6 h-6 rounded-full bg-blue-50 items-center justify-center">
                    <ChevronRight size={14} color="#3B82F6" />
                </View>
            </View>
        </TouchableOpacity>
    );
}
