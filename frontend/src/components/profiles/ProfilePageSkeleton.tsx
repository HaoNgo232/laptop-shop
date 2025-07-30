import { Header } from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const ProfilePageSkeleton = () => {
    return (
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="space-y-8">
                    {/* Skeleton cho header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <Skeleton className="h-8 w-20" />
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                    <div className="flex space-x-2">
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Skeleton className="h-9 w-24" />
                    </div>

                    {/* Skeleton cho các thẻ thống kê */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-8 w-16" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Skeleton cho tab và content */}
                    <div className="space-y-6">
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-9 w-32 rounded-md" />
                            ))}
                        </div>
                        <Skeleton className="h-96 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </main>
    );
}; 