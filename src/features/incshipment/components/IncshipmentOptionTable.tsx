import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Package, Check } from 'lucide-react-native';
import { formatRp } from '../../../utils/helpers/money';

interface IncshipmentOptionItem {
    id_opt_dtl?: string;
    nm_product_opt: string;
    harga: number;
    selected?: boolean;
}

interface IncshipmentOptionTableProps {
    options: IncshipmentOptionItem[];
    onToggleOption?: (index: number) => void;
    onPriceChange?: (index: number, price: number) => void;
    isReadOnly?: boolean;
}

export function IncshipmentOptionTable({ options, onToggleOption, onPriceChange, isReadOnly = false }: IncshipmentOptionTableProps) {
    const [localSelections, setLocalSelections] = useState<Record<number, boolean>>({});

    const handleToggle = (index: number) => {
        if (onToggleOption) {
            onToggleOption(index);
        } else {
            setLocalSelections(prev => {
                const isItemChecked = options[index].selected === true || options[index].selected === 1 || options[index].selected === '1';
                const currentValue = prev[index] !== undefined ? prev[index] : isItemChecked;
                return { ...prev, [index]: !currentValue };
            });
        }
    };
    return (
        <View className="mb-4 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <View className="flex-row bg-gray-50 p-3 border-b border-gray-100">
                <Text className="flex-1 text-xs font-bold text-gray-500">Nama Option</Text>
                <Text className="w-24 text-xs font-bold text-gray-500 text-right pr-4">Harga</Text>
                <Text className="w-16 text-xs font-bold text-gray-500 text-center">Pilih</Text>
            </View>

            {options.map((item, index) => (
                <View
                    key={index}
                    className="flex-row p-3 items-center border-b border-gray-50"
                >
                    <View className="flex-1 pr-2">
                        <Text className="text-xs font-bold text-gray-800" numberOfLines={2}>
                            {item.nm_product_opt || 'Option'}
                        </Text>
                    </View>
                    <View className="w-24 items-end justify-center pr-2">
                        {!isReadOnly && onPriceChange ? (
                            <TextInput
                                className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-900 w-full text-right"
                                value={item.harga?.toString() || '0'}
                                onChangeText={(t) => {
                                    const val = parseInt(t.replace(/[^0-9]/g, '')) || 0;
                                    onPriceChange(index, val);
                                }}
                                keyboardType="numeric"
                            />
                        ) : (
                            <Text className="text-xs text-gray-900 font-medium">
                                {formatRp(item.harga || 0)}
                            </Text>
                        )}
                    </View>
                    <View className="w-16 items-center justify-center py-2">
                        {(() => {
                            const isItemChecked = item.selected === true || item.selected === 1 || item.selected === '1';
                            const isChecked = localSelections[index] !== undefined ? localSelections[index] : isItemChecked;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => handleToggle(index)}
                                    disabled={isReadOnly}
                                    className={`w-6 h-6 rounded-md border items-center justify-center ${isChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'} ${isReadOnly ? 'opacity-70' : ''}`}
                                >
                                    {isChecked && <Check size={14} color="#FFF" />}
                                </TouchableOpacity>
                            );
                        })()}
                    </View>
                </View>
            ))}

            {options.length === 0 && (
                <View className="py-8 items-center border-b border-gray-50 bg-white">
                    <Package color="#9ca3af" size={32} className="mb-2" />
                    <Text className="text-gray-400 text-xs font-medium">Belum ada option</Text>
                </View>
            )}
        </View>
    );
}
