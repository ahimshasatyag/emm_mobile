import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useHomeData } from '../hooks/useHomeData';

export function DashboardAvailability() {
    const { data } = useHomeData();
    const [page, setPage] = useState(1);
    const [kategoriFilter, setKategoriFilter] = useState('Semua');

    const teknisiPP = (data?.teknisiPP || []).map(t => ({ ...t, kategori: 'Print Pack' }));
    const teknisiPL = (data?.teknisiPL || []).map(t => ({ ...t, kategori: 'Plastic' }));

    const combinedList = [...teknisiPP, ...teknisiPL];

    if (combinedList.length === 0) return null;

    const filteredList = combinedList.filter(tech => kategoriFilter === 'Semua' || tech.kategori === kategoriFilter);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
    const paginatedList = filteredList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleFilterChange = (filter: string) => {
        setKategoriFilter(filter);
        setPage(1);
    };

    const filterOptions = [
        { label: 'Semua', value: 'Semua' },
        { label: 'Print Pack', value: 'Print Pack' },
        { label: 'Plastic', value: 'Plastic' },
    ];

    return (
        <View className="px-6 mb-6">
            <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <View className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                    <Text className="text-sm font-bold text-gray-800">Teknisi Yang Tidak Ada Jadwal Kerja (tidak assign LKT)</Text>
                </View>
                <View className="p-4 flex-col">
                    <View className="mb-4">
                        <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                            <Dropdown
                                style={{ height: 48, paddingHorizontal: 16 }}
                                placeholderStyle={{ fontSize: 13, color: '#6b7280' }}
                                selectedTextStyle={{ fontSize: 13, color: '#374151', fontWeight: '600' }}
                                data={filterOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Pilih Kategori"
                                value={kategoriFilter}
                                onChange={(item) => handleFilterChange(item.value)}
                            />
                        </View>
                    </View>
                    <View className="flex-row border-b border-gray-200 pb-2 mb-2">
                        <Text className="w-10 text-center text-[11px] font-bold text-gray-500">No</Text>
                        <Text className="w-24 text-center text-[11px] font-bold text-gray-500 ml-2">Date</Text>
                        <Text className="flex-1 text-left text-[11px] font-bold text-gray-500 ml-2">Nama Teknisi</Text>
                        <Text className="w-24 text-center text-[11px] font-bold text-gray-500">Kategori</Text>
                    </View>
                    {paginatedList.map((tech, index) => (
                        <View key={index} className="flex-row py-2 border-b border-gray-100 items-center">
                            <Text className="w-10 text-center text-[11px] font-bold text-gray-400">
                                {(page - 1) * itemsPerPage + index + 1}
                            </Text>
                            <Text className="w-24 text-center text-[11px] text-gray-700 ml-2">{tech.tgl}</Text>
                            <Text className="flex-1 text-left text-[11px] font-semibold text-gray-800 ml-2">{tech.nm_karyawan}</Text>
                            <View className="w-24 items-center justify-center">
                                <View className={`px-2 py-0.5 rounded ${tech.kategori === 'Print Pack' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                                    <Text className={`text-[10px] font-bold ${tech.kategori === 'Print Pack' ? 'text-blue-600' : 'text-emerald-600'}`}>
                                        {tech.kategori}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                    {combinedList.length > itemsPerPage && (
                        <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100">
                            <TouchableOpacity
                                disabled={page === 1}
                                onPress={() => setPage(p => p - 1)}
                                className={`px-3 py-1 bg-gray-100 rounded ${page === 1 ? 'opacity-50' : ''}`}
                            >
                                <Text className="text-[10px] font-semibold text-gray-700">Prev</Text>
                            </TouchableOpacity>
                            <Text className="text-[10px] text-gray-500">Page <Text className="font-bold text-gray-700">{page}</Text> of {totalPages}</Text>
                            <TouchableOpacity
                                disabled={page >= totalPages}
                                onPress={() => setPage(p => p + 1)}
                                className={`px-3 py-1 bg-gray-100 rounded ${page >= totalPages ? 'opacity-50' : ''}`}
                            >
                                <Text className="text-[10px] font-semibold text-gray-700">Next</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
