import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from '../../../components/ui/button';

interface ProductSurveyModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (item: any) => void;
    initialData?: any | null;
    sourceData?: any[] | null;
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

export function ProductSurveyModal({ visible, onClose, onSave, initialData, sourceData }: ProductSurveyModalProps) {
    const [formData, setFormData] = React.useState<any>({
        id_product: '',
        code_product: '',
        nm_product: '',
        product_berat: '0',
    });

    React.useEffect(() => {
        if (visible) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    id_product: '',
                    code_product: '',
                    nm_product: '',
                    product_berat: '0',
                });
            }
        }
    }, [visible, initialData]);

    const handleSave = () => {
        if (!formData.id_product) {
            return;
        }
        onSave(formData);
    };

    const handleProductSelect = (val: string) => {
        const selected = sourceData?.find(p => p.id_product.toString() === val);
        if (selected) {
            setFormData((prev: any) => ({
                ...prev,
                id_product: selected.id_product.toString(),
                code_product: selected.code_product,
                nm_product: selected.nm_product,
            }));
        } else {
            // It might be a custom id_product if there's no SO, but let's assume we need an SO product
            setFormData((prev: any) => ({ ...prev, id_product: val }));
        }
    };

    const productOptions = sourceData?.map(p => ({
        label: `${p.code_product} - ${p.nm_product}`,
        value: p.id_product.toString()
    })) || [];

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
                            <DropdownStyled
                                label="Pilih Produk dari SO"
                                placeholder="Pilih Produk..."
                                data={productOptions}
                                value={formData.id_product}
                                onChange={handleProductSelect}
                            />

                            <TextInputStyled
                                label="Nama Barang"
                                value={formData.nm_product}
                                readonly
                            />

                            <TextInputStyled
                                label="Estimasi Berat Barang (Optional)"
                                placeholder="0"
                                value={formData.product_berat}
                                onChangeText={(v: string) => setFormData((prev: any) => ({ ...prev, product_berat: v }))}
                                keyboardType="numeric"
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
