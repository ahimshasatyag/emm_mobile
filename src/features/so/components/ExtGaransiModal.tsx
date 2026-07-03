import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { X } from 'lucide-react-native';
import { Button } from '../../../components/ui/button';

interface ExtGaransiModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (durasi: string) => void;
    initialDurasi?: string;
}

export function ExtGaransiModal({ visible, onClose, onSave, initialDurasi }: ExtGaransiModalProps) {
    const [durasi, setDurasi] = useState(initialDurasi || '30');

    React.useEffect(() => {
        if (visible) {
            setDurasi(initialDurasi || '30');
        }
    }, [visible, initialDurasi]);

    const data = [
        { label: '30 Hari', value: '30' },
        { label: '90 Hari', value: '90' },
        { label: '180 Hari', value: '180' },
        { label: '360 Hari', value: '360' },
    ];

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
                <View className="bg-white rounded-2xl w-full p-4">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-3">
                        <Text className="text-lg font-bold text-gray-800">Extend Garansi Barang</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-50 rounded-full">
                            <X size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View className="mb-6">
                        <Text className="text-xs text-gray-600 font-medium mb-1.5">Durasi Garansi</Text>
                        <View className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                            <Dropdown
                                style={{ height: 44, paddingHorizontal: 12 }}
                                data={data}
                                labelField="label"
                                valueField="value"
                                placeholder="Pilih Durasi..."
                                value={durasi}
                                onChange={(item) => setDurasi(item.value)}
                                selectedTextStyle={{ color: '#1f2937', fontSize: 14 }}
                            />
                        </View>
                    </View>

                    {/* Actions */}
                    <View className="flex-row gap-3">
                        <Button 
                            variant="outline"
                            className="flex-1 h-12 rounded-xl"
                            onPress={onClose}
                        >
                            <Text className="font-bold text-gray-700">Cancel</Text>
                        </Button>
                        <Button 
                            variant="default"
                            className="flex-1 h-12 rounded-xl bg-green-600"
                            onPress={() => {
                                onSave(durasi);
                                onClose();
                            }}
                        >
                            <Text className="font-bold text-white">Save</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
