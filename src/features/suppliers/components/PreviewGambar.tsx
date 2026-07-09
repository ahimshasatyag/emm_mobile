import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { X, UploadCloud, Trash2 } from 'lucide-react-native';

interface PreviewGambarProps {
    visible: boolean;
    imageUrl: string | null;
    onClose: () => void;
    onChange?: () => void;
    onRemove?: () => void;
}

export function PreviewGambar({ visible, imageUrl, onClose, onChange, onRemove }: PreviewGambarProps) {
    if (!visible || !imageUrl) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/90 justify-center items-center">
                <TouchableOpacity 
                    className="absolute top-12 right-6 p-2 bg-white/20 rounded-full z-50"
                    onPress={onClose}
                >
                    <X color="white" size={24} />
                </TouchableOpacity>

                <View className="w-full h-2/3 justify-center items-center">
                    <Image 
                        source={{ uri: imageUrl }} 
                        style={{ width: '90%', height: '100%' }} 
                        resizeMode="contain" 
                    />
                </View>

                {(onChange || onRemove) && (
                    <View className="absolute bottom-12 flex-row gap-4">
                        {onChange && (
                            <TouchableOpacity 
                                className="bg-white/20 px-6 py-3 rounded-xl flex-row items-center"
                                onPress={() => {
                                    onChange();
                                }}
                            >
                                <UploadCloud color="white" size={20} className="mr-2" />
                                <Text className="text-white font-bold">Ganti</Text>
                            </TouchableOpacity>
                        )}
                        {onRemove && (
                            <TouchableOpacity 
                                className="bg-red-500/80 px-6 py-3 rounded-xl flex-row items-center"
                                onPress={() => {
                                    onClose();
                                    onRemove();
                                }}
                            >
                                <Trash2 color="white" size={20} className="mr-2" />
                                <Text className="text-white font-bold">Hapus</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </Modal>
    );
}
