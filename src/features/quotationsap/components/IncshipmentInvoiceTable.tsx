import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Package, Calendar, ChevronDown } from 'lucide-react-native';

interface IncshipmentInvoiceTableProps {
    details?: any[];
}

const DUMMY_DESTINATIONS = [
    { label: 'Destinasi 1', value: 'D001' },
    { label: 'Destinasi 2', value: 'D002' },
];

export function IncshipmentInvoiceTable({ details = [] }: IncshipmentInvoiceTableProps) {
    const [destination, setDestination] = useState<string | null>(null);
    const [expectedDate, setExpectedDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <View className="mb-4 px-4 pt-4">
            {/* Form Input Area */}
            <View className="mb-6">
                <View>
                    <Text className="text-sm font-bold text-gray-700 mb-2">Expected Date <Text className="text-red-500">*</Text></Text>
                    <TouchableOpacity 
                        onPress={() => setShowDatePicker(true)}
                        className="border border-gray-200 rounded-xl bg-gray-50 mb-4 flex-row justify-between items-center"
                        style={{ height: 48, paddingHorizontal: 16 }}
                    >
                        <Text className="text-gray-700">{expectedDate.toISOString().split('T')[0]}</Text>
                        <Calendar size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={expectedDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    setExpectedDate(selectedDate);
                                }
                            }}
                        />
                    )}
                </View>

                <View>
                    <Text className="text-sm font-bold text-gray-700 mb-2">Destination <Text className="text-red-500">*</Text></Text>
                    <View className="border border-gray-200 rounded-xl bg-gray-50 mb-4">
                        <Dropdown
                            style={{ height: 48, paddingHorizontal: 16 }}
                            data={DUMMY_DESTINATIONS}
                            labelField="label"
                            valueField="value"
                            search
                            searchPlaceholder="Cari destination..."
                            placeholder="Pilih Destination"
                            value={destination}
                            dropdownPosition="top"
                            onChange={item => setDestination(item.value)}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}
