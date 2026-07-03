import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from '../../../components/ui/button';
import { SurveyItem } from '../types/survey.types';

interface ProductSurveyModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (item: SurveyItem) => void;
    initialData?: SurveyItem | null;
}

const TextInputStyled = ({ label, placeholder, value, onChangeText, multiline, keyboardType, readonly }: any) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-600 font-medium mb-1.5">{label}</Text>
        <TextInput
            className={`border border-gray-200 rounded-lg px-3 py-2.5 text-sm ${readonly ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-800'} ${multiline ? 'h-24' : ''}`}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            keyboardType={keyboardType || 'default'}
            editable={!readonly}
        />
    </View>
);

const DropdownStyled = ({ label, placeholder, data, value, onChange, disabled }: any) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-600 font-medium mb-1.5">{label}</Text>
        <View className={`border border-gray-200 rounded-lg overflow-hidden ${disabled ? 'bg-gray-100 opacity-70' : 'bg-gray-50'}`}>
            <Dropdown
                style={{ height: 44, paddingHorizontal: 12 }}
                data={data}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                value={value}
                onChange={(item) => onChange(item.value)}
                disable={disabled}
                containerStyle={{ borderRadius: 8, marginTop: 4, overflow: 'hidden' }}
                placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                selectedTextStyle={{ color: '#1F2937', fontSize: 14 }}
            />
        </View>
    </View>
);

export function ProductSurveyModal({ visible, onClose, onSave, initialData }: ProductSurveyModalProps) {
    const [formData, setFormData] = React.useState<SurveyItem>({
        product_code: '',
        product_name: '',
        status_barang: 'READY',
        harga: '',
        qty: '1',
        satuan: 'PCS',
        delivery_term: 'FRANCO JKT'
    });

    React.useEffect(() => {
        if (visible) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    product_code: '',
                    product_name: '',
                    status_barang: 'READY',
                    harga: '',
                    qty: '1',
                    satuan: 'PCS',
                    delivery_term: 'FRANCO JKT'
                });
            }
        }
    }, [visible, initialData]);

    const handleSave = () => {
        if (!formData.product_name || !formData.harga || !formData.qty) {
            return;
        }
        onSave(formData);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-2xl p-4 h-[80%]">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-gray-800">
                            {initialData ? 'Edit Barang Survey' : 'Tambah Barang Survey'}
                        </Text>
                        <TouchableOpacity onPress={onClose} className="p-2">
                            <X size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="space-y-4 mb-8">
                            <TextInputStyled
                                label="Kode Barang"
                                placeholder="Pilih/Ketik Kode..."
                                value={formData.product_code}
                                onChangeText={(v: string) => setFormData(prev => ({ ...prev, product_code: v }))}
                            />

                            <TextInputStyled
                                label="Nama Barang"
                                placeholder="Pilih/Ketik Nama Barang..."
                                value={formData.product_name}
                                onChangeText={(v: string) => setFormData(prev => ({ ...prev, product_name: v }))}
                            />

                            <DropdownStyled
                                label="Status Barang"
                                placeholder="Pilih Status"
                                data={[
                                    { label: 'READY', value: 'READY' },
                                    { label: 'INDENT', value: 'INDENT' }
                                ]}
                                value={formData.status_barang}
                                onChange={(v: string) => setFormData(prev => ({ ...prev, status_barang: v }))}
                            />

                            <TextInputStyled
                                label="Harga (Rp)"
                                placeholder="0"
                                value={formData.harga}
                                onChangeText={(v: string) => setFormData(prev => ({ ...prev, harga: v }))}
                                keyboardType="numeric"
                            />

                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <TextInputStyled
                                        label="Qty"
                                        placeholder="1"
                                        value={formData.qty}
                                        onChangeText={(v: string) => setFormData(prev => ({ ...prev, qty: v }))}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View className="flex-1">
                                    <TextInputStyled
                                        label="Satuan"
                                        placeholder="PCS"
                                        value={formData.satuan}
                                        onChangeText={(v: string) => setFormData(prev => ({ ...prev, satuan: v }))}
                                    />
                                </View>
                            </View>

                            <TextInputStyled
                                label="Delivery Term"
                                placeholder="FRANCO JKT"
                                value={formData.delivery_term}
                                onChangeText={(v: string) => setFormData(prev => ({ ...prev, delivery_term: v }))}
                            />
                        </View>
                    </ScrollView>

                    <View className="pt-4 border-t border-gray-100 flex-row gap-2 mt-auto">
                        <View className="flex-1">
                            <Button variant="outline" onPress={onClose}>
                                <Text className="text-indigo-600 font-bold">Batal</Text>
                            </Button>
                        </View>
                        <View className="flex-1">
                            <Button onPress={handleSave}>
                                <Text className="text-white font-bold">Simpan</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
