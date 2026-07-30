import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Pencil, Check, Trash2 } from 'lucide-react-native';

export interface ExtGaransi {
    id: string;
    name: string;
    status: string;
    durasi: string;
}

interface ExtGaransiTableProps {
    data: ExtGaransi[];
    onEdit: (id: string) => void;
    onApprove: (id: string) => void;
    onDelete: (id: string) => void;
}

export const ExtGaransiTable = ({ data, onEdit, onApprove, onDelete }: ExtGaransiTableProps) => {
    if (!data || data.length === 0) return null;

    return (
        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
            <Text className="text-xs font-bold text-gray-500 uppercase mb-4 border-b border-gray-100 pb-2">Extend Garansi</Text>
            <View className="border border-gray-200 rounded-xl overflow-hidden">
                <View className="flex-row bg-gray-100 p-2 border-b border-gray-200">
                    <Text className="flex-1 text-xs font-bold text-gray-600">Nama</Text>
                    <Text className="w-24 text-xs font-bold text-gray-600 text-center">Status</Text>
                    <Text className="w-32 text-xs font-bold text-gray-600 text-center">Aksi</Text>
                </View>
                {data.map((eg, idx) => (
                    <View key={eg.id} className={`flex-row p-2 items-center ${idx < data.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <Text className="flex-1 text-xs text-gray-800">{eg.name}</Text>
                        <View className="w-24 items-center justify-center">
                            <View className={`px-2 py-1 rounded-full ${eg.status === 'Disetujui' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                <Text className={`text-[10px] font-bold ${eg.status === 'Disetujui' ? 'text-emerald-700' : 'text-amber-700'}`}>{eg.status}</Text>
                            </View>
                        </View>
                        <View className="w-32 flex-row justify-center gap-3">
                            <TouchableOpacity onPress={() => onEdit(eg.id)} className="p-1">
                                <Pencil size={16} color="#4F46E5" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onApprove(eg.id)} className="p-1">
                                <Check size={16} color="#10B981" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onDelete(eg.id)} className="p-1">
                                <Trash2 size={16} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};
