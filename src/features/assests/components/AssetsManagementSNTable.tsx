import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PlusCircle, Hash, Star } from 'lucide-react-native';
import { AssetSerialNumber } from '../types/assests.types';
import { AssetsManagementSNModal } from './AssetsManagementSNModal';
import { theme } from '../../../theme/theme';

interface AssetsManagementSNTableProps {
    serialNumbers: AssetSerialNumber[];
    onAdd: (name: string, sn: string, isMain: boolean) => void;
    onUpdate: (id: string, name: string, sn: string, isMain: boolean) => void;
    onRemove: (id: string) => void;
    onSetMain: (id: string) => void;
    isEditMode?: boolean;
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

export function AssetsManagementSNTable({ serialNumbers, onAdd, onUpdate, onRemove, onSetMain, isEditMode = true, onShowToast }: AssetsManagementSNTableProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleAddClick = () => {
        setEditingIndex(null);
        setModalVisible(true);
    };

    const handleEditClick = (index: number) => {
        setEditingIndex(index);
        setModalVisible(true);
    };

    const handleSaveModal = (name: string, sn: string, isMain: boolean) => {
        if (editingIndex !== null) {
            const item = serialNumbers[editingIndex];
            onUpdate(item.id, name, sn, isMain);
        } else {
            onAdd(name, sn, isMain);
        }
    };

    return (
        <View className="-mx-4">
            <View className="flex-row items-center justify-between mb-4 px-4">
                <Text className="text-sm font-bold text-gray-700">Multi Serial Number</Text>
                {isEditMode && (
                    <TouchableOpacity 
                        onPress={handleAddClick}
                        className="flex-row items-center justify-center py-2 px-4 rounded-xl"
                        style={{ backgroundColor: theme.colors.primaryContainer }}
                    >
                        <PlusCircle size={16} color={theme.colors.primary} />
                        <Text className="text-xs font-bold ml-2" style={{ color: theme.colors.primary }}>Tambah SN</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View className="bg-white">
                <View className="flex-row bg-gray-50 p-3 border-y border-gray-100">
                    <Text className="flex-1 text-xs font-bold text-gray-500 ml-4">Name</Text>
                    <Text className="flex-1 text-xs font-bold text-gray-500 ml-2">Number</Text>
                </View>

                {serialNumbers.map((sn, index) => (
                    <TouchableOpacity 
                        key={sn.id} 
                        className="flex-row p-3 items-center border-b border-gray-50"
                        onPress={() => handleEditClick(index)}
                    >
                        <View className="flex-1 ml-4 flex-row items-center">
                            <Text className="text-xs text-gray-800 font-medium mr-2" numberOfLines={1}>{sn.name_sn}</Text>
                            {sn.f_print === '1' && (
                                <View className="bg-blue-100 px-2 py-0.5 rounded-full flex-row items-center">
                                    <Star size={10} color={theme.colors.primary} />
                                    <Text className="text-[10px] text-blue-600 font-bold ml-1">Utama</Text>
                                </View>
                            )}
                        </View>
                        <View className="flex-1 ml-2">
                            <Text className="text-xs text-gray-600" numberOfLines={1}>{sn.serial_number}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {serialNumbers.length === 0 && (
                    <View className="py-8 items-center border-b border-gray-50 bg-white">
                        <Hash color="#9ca3af" size={32} className="mb-2" />
                        <Text className="text-gray-400 text-xs font-medium">Belum ada serial number</Text>
                    </View>
                )}
            </View>

            <AssetsManagementSNModal 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveModal}
                initialData={editingIndex !== null ? serialNumbers[editingIndex] : null}
                onDelete={editingIndex !== null ? () => {
                    onRemove(serialNumbers[editingIndex].id);
                    if (onShowToast) onShowToast('Serial Number berhasil dihapus', 'success');
                    setModalVisible(false);
                } : undefined}
                isReadOnly={!isEditMode}
                onShowToast={onShowToast}
            />
        </View>
    );
}
