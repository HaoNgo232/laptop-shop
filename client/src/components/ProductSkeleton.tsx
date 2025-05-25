import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ProductSkeleton() {
    return (
        <Card className="w-full max-w-sm mx-auto animate-pulse">
            {/* Skeleton cho hình ảnh */}
            <div className="aspect-square bg-gray-300 rounded-t-xl"></div>

            <CardHeader className="pb-2">
                {/* Skeleton cho tên sản phẩm */}
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                {/* Skeleton cho category */}
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Skeleton cho mô tả */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                </div>

                {/* Skeleton cho giá và stock */}
                <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>

                {/* Skeleton cho buttons */}
                <div className="flex space-x-2">
                    <div className="h-9 bg-gray-200 rounded flex-1"></div>
                    <div className="h-9 bg-gray-300 rounded flex-1"></div>
                </div>
            </CardContent>
        </Card>
    );
} 