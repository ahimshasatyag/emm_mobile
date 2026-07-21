import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Download, Plus } from 'lucide-react-native';
import { theme } from '../../../theme/theme';

interface TableItem {
    id?: string;
    keterangan?: string;
    nama?: string;
    file?: string;
}

interface TandaTerimaCustTableProps {
    data: TableItem[];
    onRowClick?: (item: TableItem, index: number) => void;
    onAddClick?: () => void;
    readOnly?: boolean;
}

export const TandaTerimaCustTable: React.FC<TandaTerimaCustTableProps> = ({ 
    data, 
    onRowClick,
    onAddClick,
    readOnly = false
}) => {
    return (
        <View className="bg-white">
            <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-100">
                <Text className="font-bold text-gray-800">Daftar File</Text>
                {!readOnly && onAddClick && (
                    <TouchableOpacity
                        onPress={onAddClick}
                        className="flex-row items-center px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        <Plus size={16} color="#ffffff" />
                        <Text className="text-white font-bold ml-1 text-xs">Tambah</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View>
                {/* Header Tabel */}
                <View className="flex-row bg-gray-50 py-3 px-4 border-y border-gray-200">
                    <Text className="w-10 text-xs font-bold text-gray-700 text-center px-1">No</Text>
                    <Text className="flex-1 text-xs font-bold text-gray-700 text-left px-2">Keterangan</Text>
                    <Text className="w-16 text-xs font-bold text-gray-700 text-center px-1">File</Text>
                </View>
                
                {/* Isi Tabel */}
                {data && data.length > 0 ? (
                    data.map((item, index) => (
                        <TouchableOpacity 
                            key={item.id || index} 
                            onPress={() => onRowClick && onRowClick(item, index)}
                            className={`flex-row py-3 px-4 items-center border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                        >
                            <Text className="w-10 text-xs text-gray-700 text-center px-1">{index + 1}</Text>
                            
                            <Text className="flex-1 text-xs text-gray-700 text-left px-2">
                                {item.keterangan || item.nama || '-'}
                            </Text>
                            
                            <View className="w-16 items-center">
                                {(item.file) ? (
                                    <TouchableOpacity 
                                        style={{ backgroundColor: theme.colors.primary }}
                                        className="p-1.5 rounded-md items-center"
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            // Handle Download
                                        }}
                                    >
                                        <Download color="white" size={14} />
                                    </TouchableOpacity>
                                ) : (
                                    <Text className="text-gray-400 text-xs">-</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View className="py-8 items-center justify-center bg-white min-w-full border-b border-gray-100">
                        <Text className="text-gray-400 text-sm">Belum ada file ditambahkan.</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
