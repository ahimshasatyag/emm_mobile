import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { KasBankInDetail, Coa } from '../types/kasbankin.types';
import { theme } from '../../../theme/theme';
import { formatRp } from '../../../utils/helpers/money';

interface KasBankInDetailTableProps {
    details: Partial<KasBankInDetail>[];
    coas: Coa[];
    onRowClick: (detail: Partial<KasBankInDetail>, index: number) => void;
    onAddDetail: () => void;
}

export const KasBankInDetailTable: React.FC<KasBankInDetailTableProps> = ({
    details,
    coas,
    onRowClick,
    onAddDetail
}) => {

    const getCoaName = (id_coa?: string) => {
        if (!id_coa) return '-';
        const coa = coas.find(c => c.id_coa === id_coa);
        return coa ? `${coa.code_coa} - ${coa.coa_name}` : id_coa;
    };

    return (
        <View className="bg-white">
            <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-100">
                <Text className="font-bold text-gray-800">Detail COA</Text>
                <TouchableOpacity
                    onPress={onAddDetail}
                    className="flex-row items-center px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: theme.colors.primary }}
                >
                    <Plus size={16} color="#ffffff" />
                    <Text className="text-white font-bold ml-1 text-xs">Tambah</Text>
                </TouchableOpacity>
            </View>

            <View>
                {/* Table Header */}
                <View className="flex-row bg-gray-50 py-3 px-4 border-y border-gray-200">
                    <Text className="flex-1 text-xs font-bold text-gray-700 text-left px-1">COA</Text>
                    <Text className="w-[35%] text-xs font-bold text-gray-700 text-right px-1">Amount</Text>
                </View>

                {/* Table Body */}
                {details.length > 0 ? (
                    details.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => onRowClick(item, index)}
                            className={`flex-row py-3 px-4 items-center border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                        >
                            <Text className="flex-1 text-xs text-gray-700 text-left px-1" numberOfLines={2}>
                                {getCoaName(item.id_coa)}
                            </Text>
                            <Text className="w-[35%] text-xs text-gray-800 text-right px-1">
                                {formatRp(item.v_amount || 0)}
                            </Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View className="py-8 items-center justify-center bg-white min-w-full">
                        <Text className="text-gray-400 text-sm">Belum ada detail COA.</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
