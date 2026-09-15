import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { formatDate } from '../../../utils/helpers/date';

interface IncshipmentTabProps {
    expectedDate: Date;
    setExpectedDate: (date: Date) => void;
    destination: string | null;
    setDestination: (dest: string | null) => void;
    destinations: { label: string; value: string }[];
    isEditMode: boolean;
}

export function IncshipmentTab({ 
    expectedDate, 
    setExpectedDate, 
    destination, 
    setDestination, 
    destinations,
    isEditMode 
}: IncshipmentTabProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <View className="mb-4 px-4 pt-4">
            {/* Form Input Area */}
            <View className="mb-6">
                <View>
                    <Text className="text-sm font-bold text-gray-700 mb-2">Expected Date</Text>
                    <TouchableOpacity 
                        onPress={() => isEditMode && setShowDatePicker(true)}
                        className={`border rounded-xl mb-4 flex-row justify-between items-center ${isEditMode ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200'}`}
                        style={{ height: 48, paddingHorizontal: 16 }}
                        disabled={!isEditMode}
                    >
                        <Text className="text-gray-700">{formatDate(expectedDate)}</Text>
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
                    <Text className="text-sm font-bold text-gray-700 mb-2">Destination Warehouse</Text>
                    <View className={`border rounded-xl mb-4 ${isEditMode ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200'}`}>
                        <Dropdown
                            style={{ height: 48, paddingHorizontal: 16 }}
                            data={destinations}
                            labelField="label"
                            valueField="value"
                            search
                            searchPlaceholder="Cari warehouse..."
                            placeholder="Pilih Destination Warehouse"
                            value={destination}
                            dropdownPosition="top"
                            onChange={item => setDestination(item.value)}
                            disable={!isEditMode}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}
