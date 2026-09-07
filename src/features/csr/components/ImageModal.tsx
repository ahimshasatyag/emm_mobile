import React from 'react';
import { View, Modal, TouchableOpacity, Image, Text } from 'react-native';
import { X } from 'lucide-react-native';

interface ImageModalProps {
    visible: boolean;
    onClose: () => void;
    imageUrl: string | null;
    onPickImage?: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ visible, onClose, imageUrl, onPickImage }) => {
    return (
        <Modal visible={visible} transparent={true} onRequestClose={onClose} animationType="fade">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity 
                    style={{ position: 'absolute', top: 60, right: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 24 }} 
                    onPress={onClose}
                >
                    <X color="white" size={24} />
                </TouchableOpacity>
                
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '70%' }} resizeMode="contain" />
                ) : null}
                
                {onPickImage && imageUrl ? (
                    <TouchableOpacity 
                        style={{ position: 'absolute', bottom: 60, backgroundColor: 'white', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30 }}
                        onPress={onPickImage}
                    >
                        <Text style={{ color: '#374151', fontWeight: 'bold' }}>Ubah Gambar</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </Modal>
    );
};
