import React from 'react';
import { View } from 'react-native';

export function ListSOSkeleton() {
    return (
        <View>
            {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                <View key={item} className={`flex-row border-b border-gray-200 border-x ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <View className="w-12 py-3 px-2 justify-center items-center"><View className="h-3 w-4 bg-gray-200 rounded" /></View>
                    <View className="w-24 py-3 px-2 justify-center items-center"><View className="h-4 w-12 bg-gray-200 rounded" /></View>
                    <View className="w-24 py-3 px-2 justify-center"><View className="h-3 w-16 bg-gray-200 rounded" /></View>
                    <View className="w-32 py-3 px-2 justify-center"><View className="h-3 w-24 bg-gray-300 rounded" /></View>
                    <View className="w-40 py-3 px-2 justify-center"><View className="h-3 w-32 bg-gray-200 rounded" /></View>
                    <View className="w-24 py-3 px-2 justify-center items-center"><View className="h-3 w-8 bg-gray-200 rounded" /></View>
                    <View className="w-24 py-3 px-2 justify-center items-end"><View className="h-3 w-16 bg-gray-200 rounded" /></View>
                    <View className="w-16 py-3 px-2 justify-center items-end"><View className="h-3 w-6 bg-gray-200 rounded" /></View>
                    <View className="w-24 py-3 px-2 justify-center items-end"><View className="h-3 w-10 bg-gray-200 rounded" /></View>
                    <View className="w-28 py-3 px-2 justify-center items-end"><View className="h-3 w-16 bg-gray-200 rounded" /></View>
                    <View className="w-32 py-3 px-2 justify-center"><View className="h-3 w-20 bg-gray-200 rounded" /></View>
                    <View className="w-32 py-3 px-2 justify-center"><View className="h-3 w-16 bg-gray-200 rounded" /></View>
                    <View className="w-32 py-3 px-2 justify-center"><View className="h-3 w-24 bg-gray-200 rounded" /></View>
                    <View className="w-32 py-3 px-2 justify-center"><View className="h-3 w-16 bg-gray-200 rounded" /></View>
                    <View className="w-40 py-3 px-2 justify-center"><View className="h-3 w-24 bg-gray-200 rounded" /></View>
                    <View className="w-24 py-3 px-2 justify-center"><View className="h-3 w-16 bg-gray-200 rounded" /></View>
                    <View className="w-32 py-3 px-2 justify-center"><View className="h-3 w-20 bg-gray-200 rounded" /></View>
                    <View className="w-24 py-3 px-2 justify-center"><View className="h-3 w-16 bg-gray-200 rounded" /></View>
                </View>
            ))}
        </View>
    );
}

export function ListSOSummaryTableRowSkeleton({ section }: { section: 'bln' | 'ytd' }) {
    return (
        <>
            {[1, 2, 3, 4].map((i) => (
                <View key={`${section}-${i}`} className={`flex-row border-b border-gray-200 ${i === 4 ? 'bg-gray-100' : 'bg-white'}`}>
                    <View style={{ flex: 2 }} className="p-2 border-r border-gray-200 justify-center"><View className="h-3 w-2/3 bg-gray-200 rounded" /></View>
                    <View style={{ flex: 0.5 }} className="p-2 border-r border-gray-200 items-end justify-center"><View className="h-3 w-4 bg-gray-200 rounded" /></View>
                    <View style={{ flex: 1.5 }} className="p-2 border-r border-gray-200 items-end justify-center"><View className="h-3 w-10 bg-gray-200 rounded" /></View>
                    <View style={{ flex: 1.5 }} className="p-2 items-end justify-center"><View className="h-3 w-8 bg-gray-200 rounded" /></View>
                </View>
            ))}
        </>
    );
}
