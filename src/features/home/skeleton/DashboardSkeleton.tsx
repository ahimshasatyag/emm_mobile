import React from 'react';
import { View } from 'react-native';

export const DashboardSkeleton = () => (
    <View className="px-6 py-6">
        {/* Header Text Skeleton */}
        <View className="w-40 h-6 bg-gray-200 rounded-full animate-pulse mb-4" />
        
        {/* Horizontal Stats Skeleton */}
        <View className="flex-row mb-8">
            <View className="w-44 h-28 bg-gray-200 rounded-3xl animate-pulse mr-4" />
            <View className="w-44 h-28 bg-gray-200 rounded-3xl animate-pulse mr-4" />
            <View className="w-44 h-28 bg-gray-200 rounded-3xl animate-pulse" />
        </View>
        
        {/* Availability Card Skeleton */}
        <View className="w-32 h-6 bg-gray-200 rounded-full animate-pulse mb-4" />
        <View className="h-48 bg-gray-200 rounded-3xl animate-pulse mb-8" />
        
        {/* Workload Card Skeleton */}
        <View className="w-40 h-6 bg-gray-200 rounded-full animate-pulse mb-4" />
        <View className="h-64 bg-gray-200 rounded-3xl animate-pulse mb-8" />

        {/* LKT Table Skeleton */}
        <View className="w-48 h-6 bg-gray-200 rounded-full animate-pulse mb-4" />
        <View className="h-56 bg-gray-200 rounded-3xl animate-pulse" />
    </View>
);
