import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Check } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { api } from '../../../services/api/api';

export interface DoProduct {
  id_do_dtl: string | number;
  code_product: string;
  nm_product: string;
  nqty: string | number;
  nm_product_satuan: string;
  nbarcode?: string;
  leasing_tahun?: string;
  leasing_plat?: string;
}

interface DoProductTableProps {
  items: DoProduct[];
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onToggleSelect?: (id: string | number) => void;
  isEditMode?: boolean;
  onUpdatePlat?: (id_do_dtl: string | number, newPlat: string) => void;
  onUpdateSN?: (id_do_dtl: string | number, newSN: string) => void;
  onUpdateTahun?: (id_do_dtl: string | number, newTahun: string) => void;
  onFocusPlat?: () => void;
}

export const DoProductTable: React.FC<DoProductTableProps> = ({
  items,
  selectable = false,
  selectedIds = [],
  onToggleSelect = () => { },
  isEditMode = false,
  onUpdatePlat = () => { },
  onUpdateSN = () => { },
  onUpdateTahun = () => { },
  onFocusPlat
}) => {
  const [snOptions, setSnOptions] = useState<Record<string, { label: string, value: string }[]>>({});

  useEffect(() => {
    if (isEditMode && items && items.length > 0) {
      items.forEach(item => {
        if (item.id_product && !snOptions[item.id_product]) {
          api.get(`/do/sn/${item.id_product}`).then(res => {
            if (res.data?.status && res.data?.data) {
              setSnOptions(prev => ({
                ...prev,
                [item.id_product]: res.data.data.map((snItem: any) => ({
                  label: snItem.sn,
                  value: snItem.sn
                }))
              }));
            }
          }).catch(err => console.log('Error fetching SN for product', item.id_product, err));
        }
      });
    }
  }, [isEditMode, items]);
  if (!items || items.length === 0) {
    return (
      <View className="p-4 items-center justify-center">
        <Text className="text-gray-500">Tidak ada data barang.</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex-1">
      <View>
        {/* Table Header */}
        <View className="flex-row bg-gray-100 border-b border-gray-200">
          {selectable && (
            <View className="w-16 p-3 border-r border-gray-200 justify-center items-center">
              <Text className="text-xs font-bold text-gray-700">Aksi</Text>
            </View>
          )}
          <View className="w-32 p-3 border-r border-gray-200 justify-center">
            <Text className="text-xs font-bold text-gray-700">Kode Barang</Text>
          </View>
          <View className="w-48 p-3 border-r border-gray-200 justify-center">
            <Text className="text-xs font-bold text-gray-700">Nama Barang</Text>
          </View>
          <View className="w-20 p-3 border-r border-gray-200 justify-center items-center">
            <Text className="text-xs font-bold text-gray-700">Qty</Text>
          </View>
          <View className="w-24 p-3 border-r border-gray-200 justify-center items-center">
            <Text className="text-xs font-bold text-gray-700">Satuan</Text>
          </View>
          <View className="w-40 p-3 border-r border-gray-200 justify-center">
            <Text className="text-xs font-bold text-gray-700">Serial Number</Text>
          </View>
          <View className="w-24 p-3 border-r border-gray-200 justify-center items-center">
            <Text className="text-xs font-bold text-gray-700">Tahun</Text>
          </View>
          <View className="w-40 p-3 justify-center">
            <Text className="text-xs font-bold text-gray-700">Serial Number Plat</Text>
          </View>
        </View>

        {/* Table Body */}
        {items.map((item, index) => {
          const isSelected = selectedIds.includes(item.id_do_dtl);
          return (
            <View
              key={item.id_do_dtl || index}
              className={`flex-row border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              {selectable && (
                <View className="w-16 p-3 border-r border-gray-100 justify-center items-center">
                  <TouchableOpacity onPress={() => onToggleSelect(item.id_do_dtl)}>
                    {isSelected ? (
                      <View className="w-6 h-6 bg-blue-500 rounded justify-center items-center">
                        <Check size={16} color="white" />
                      </View>
                    ) : (
                      <View className="w-6 h-6 border-2 border-gray-300 rounded justify-center items-center bg-white" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
              <View className="w-32 p-3 border-r border-gray-100 justify-center">
                <Text className="text-sm text-gray-800">{item.code_product || '-'}</Text>
              </View>
              <View className="w-48 p-3 border-r border-gray-100 justify-center">
                <Text className="text-sm text-gray-800">{item.nm_product || '-'}</Text>
              </View>
              <View className="w-20 p-3 border-r border-gray-100 justify-center items-center">
                <Text className="text-sm text-gray-800 font-medium">{item.nqty || '0'}</Text>
              </View>
              <View className="w-24 p-3 border-r border-gray-100 justify-center items-center">
                <Text className="text-sm text-gray-800">{item.nm_product_satuan || '-'}</Text>
              </View>
              <View className="w-40 p-3 border-r border-gray-100 justify-center">
                {isEditMode ? (
                  <View className="bg-gray-100 border border-gray-200 rounded">
                    <Dropdown
                      style={{ height: 32, paddingHorizontal: 8 }}
                      data={item.id_product && snOptions[item.id_product] ? snOptions[item.id_product] : []}
                      labelField="label"
                      valueField="value"
                      placeholder="Pilih SN"
                      value={item.nbarcode}
                      onChange={(selected) => onUpdateSN(item.id_do_dtl, selected.value)}
                      selectedTextStyle={{ fontSize: 12, color: '#1f2937' }}
                      placeholderStyle={{ fontSize: 12, color: '#9ca3af' }}
                      itemTextStyle={{ fontSize: 12 }}
                    />
                  </View>
                ) : (
                  <Text className="text-sm text-gray-800">{item.nbarcode || '-'}</Text>
                )}
              </View>
              <View className="w-24 p-3 border-r border-gray-100 justify-center items-center">
                {isEditMode ? (
                  <TextInput
                    className="bg-gray-100 border border-gray-200 rounded px-2 py-1 text-sm text-gray-800 w-full text-center"
                    value={item.leasing_tahun || ''}
                    onChangeText={(text) => onUpdateTahun(item.id_do_dtl, text)}
                    placeholder="Tahun"
                    keyboardType="numeric"
                    maxLength={4}
                  />
                ) : (
                  <Text className="text-sm text-gray-800">{item.leasing_tahun || '-'}</Text>
                )}
              </View>
              <View className="w-40 p-3 justify-center">
                {isEditMode ? (
                  <TextInput
                    className="bg-gray-100 border border-gray-200 rounded px-2 py-1 text-sm text-gray-800"
                    value={item.leasing_plat || ''}
                    onChangeText={(text) => onUpdatePlat(item.id_do_dtl, text)}
                    placeholder="Masukkan SN Plat"
                    onFocus={onFocusPlat}
                  />
                ) : (
                  <Text className="text-sm text-gray-800">{item.leasing_plat || '-'}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};
