import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { formatInputNumber, parseInputNumber } from '../../../utils/helpers/money';

interface OptionItem {
    id_product_price_opt: string;
    nm_product_opt: string;
    amount: string | number;
    qty: string | number;
}

interface Props {
    options: OptionItem[];
    onChange: (index: number, field: keyof OptionItem, value: any) => void;
    onDelete: (index: number) => void;
    readOnly?: boolean;
}

export const ProductQuotationModalTable = ({ options, onChange, onDelete, readOnly = false }: Props) => {
    if (!options || options.length === 0) return null;

    return (
        <View>
            <Text className="text-sm font-bold text-gray-700 mt-2 mb-2">Options / Varian</Text>
            <View className="border border-gray-200 rounded-xl overflow-hidden mb-8">
                <View className="flex-row bg-gray-100 p-2 border-b border-gray-200">
                    <Text className="flex-[0.5] text-xs font-bold text-gray-600 text-center">No</Text>
                    <Text className="flex-[1.5] text-xs font-bold text-gray-600">ID & Nama</Text>
                    <Text className="flex-[1.5] text-xs font-bold text-gray-600 text-center">Harga</Text>
                    <Text className="flex-[1] text-xs font-bold text-gray-600 text-center">Qty</Text>
                    <Text className="flex-[0.5] text-xs font-bold text-gray-600 text-center">Aksi</Text>
                </View>

                {options.map((opt, index) => (
                    <View key={index} className="flex-row p-2 border-b border-gray-100 items-center">
                        <Text className="flex-[0.5] text-xs text-gray-600 text-center">{index + 1}</Text>
                        <View className="flex-[1.5]">
                            <Text className="text-xs text-gray-800 font-medium">{opt.id_product_price_opt}</Text>
                            <Text className="text-[10px] text-gray-500">{opt.nm_product_opt}</Text>
                        </View>
                        <View className="flex-[1.5] px-1">
                            <TextInput 
                                className={`border border-gray-200 rounded px-2 py-1 text-xs text-center ${readOnly ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-800'}`} 
                                placeholder="0" 
                                value={formatInputNumber(opt.amount?.toString() || '0')} 
                                onChangeText={(val) => onChange(index, 'amount', parseInputNumber(val))}
                                keyboardType="numeric" 
                                editable={!readOnly}
                            />
                        </View>
                        <View className="flex-[1] px-1">
                            <TextInput 
                                className={`border border-gray-200 rounded px-2 py-1 text-xs text-center ${readOnly ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-800'}`} 
                                placeholder="1" 
                                value={opt.qty?.toString()}
                                onChangeText={(val) => onChange(index, 'qty', val)}
                                keyboardType="numeric" 
                                editable={!readOnly}
                            />
                        </View>
                        <View className="flex-[0.5] items-center">
                            {!readOnly && (
                                <TouchableOpacity onPress={() => onDelete(index)}>
                                    <Trash2 size={16} color="#ef4444" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};
