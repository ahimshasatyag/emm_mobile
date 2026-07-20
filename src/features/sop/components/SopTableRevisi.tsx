import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Download } from 'lucide-react-native';
import { formatDateTime } from '../../../utils/helpers/date';
import { SopHistory } from '../types/sop.types';
import { theme } from '../../../theme/theme';

interface SopTableRevisiProps {
    history: SopHistory[];
}

export const SopTableRevisi: React.FC<SopTableRevisiProps> = ({ history }) => {
    if (!history || history.length === 0) return null;

    return (
        <View className="mt-6 border-t border-gray-100 pt-6">
            <Text className="text-gray-800 font-bold text-lg mb-3">History Revisi</Text>
            <View className="-mx-4 -mb-4 bg-white border-t border-gray-200 rounded-b-xl overflow-hidden">
                <View className="flex-row bg-gray-100 p-3 px-4 border-b border-gray-200">
                    <Text className="text-gray-600 font-bold flex-1 text-center">File</Text>
                    <Text className="text-gray-600 font-bold flex-1 text-center">Tanggal</Text>
                </View>
                {history.map((hist) => (
                    <View key={hist.id} className="flex-row p-3 px-4 border-b border-gray-100 items-center">
                        <View className="flex-1 items-center">
                            {hist.file_pdf ? (
                                <TouchableOpacity 
                                    style={{ backgroundColor: theme.colors.primary }}
                                    className="px-3 py-1.5 rounded-lg flex-row items-center"
                                >
                                    <Download color="white" size={14} className="mr-1" />
                                    <Text className="text-white text-xs font-bold">Download</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text className="text-gray-400 text-xs">-</Text>
                            )}
                        </View>
                        <Text className="text-gray-800 flex-1 text-center text-xs">
                            {formatDateTime(new Date(hist.date_update))}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};
