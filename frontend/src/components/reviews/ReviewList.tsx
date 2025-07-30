import { useEffect, useState } from 'react';
import { Star, User, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useReviewStore } from '@/stores/reviewStore';
import { useAuthStore } from '@/stores/authStore';
import type { ReviewWithUser } from "@/types";
import { ReviewForm } from '@/components/reviews/ReviewForm';

interface ReviewListProps {
    readonly productId: string;
    readonly className?: string;
    readonly openReviewModal?: (review: ReviewWithUser) => void;
}

export function ReviewList({ productId, className, openReviewModal }: ReviewListProps) {
    const [reviewToDelete, setReviewToDelete] = useState<ReviewWithUser | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        reviews,
        isLoading,
        error,
        pagination,
        fetchProductReviews,
        deleteReview,
        clearReviews
    } = useReviewStore();

    const { user } = useAuthStore();

    useEffect(() => {
        if (productId) {
            fetchProductReviews(productId, { page: 1, limit: 10 });
        }

        return () => {
            clearReviews();
        };
    }, [productId, fetchProductReviews, clearReviews]);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const handleDeleteReview = async () => {
        if (!reviewToDelete) return;

        try {
            setIsDeleting(true);
            await deleteReview(reviewToDelete.id);
            setReviewToDelete(null);
        } catch (error) {
            console.error('Error deleting review:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const ReviewItem = ({ review }: { review: ReviewWithUser }) => {
        const isCurrentUser = user?.id === review.user.id;

        if (review.comment?.includes("test debug")) {
            console.log('🔍 ReviewList Debug:', {
                currentUserId: user?.id,
                reviewUserId: review.user.id,
                areEqual: isCurrentUser
            });
        }

        return (
            <Card className="mb-4">
                <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {review.user.avatar ? (
                                <img
                                    src={review.user.avatar}
                                    alt={review.user.username}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-500" />
                                </div>
                            )}
                        </div>

                        {/* Review Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        {review.user.username}
                                        {isCurrentUser && (
                                            <Badge variant="secondary" className="ml-2 text-xs">
                                                Của bạn
                                            </Badge>
                                        )}
                                    </h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                        {renderStars(review.rating)}
                                        <Badge variant="outline">{review.rating}/5</Badge>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                        {formatDate(review.createdAt)}
                                    </span>

                                    {/* Actions for current user */}
                                    {isCurrentUser && (
                                        <div className="flex items-center space-x-1">
                                            {/* Simple buttons test */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openReviewModal?.(review)}
                                                className="h-8 px-2 text-xs"
                                            >
                                                <Edit2 className="mr-1 h-3 w-3" />
                                                Sửa
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setReviewToDelete(review)}
                                                className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="mr-1 h-3 w-3" />
                                                Xóa
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {review.comment && (
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (isLoading) {
        return (
            <div className={`space-y-4 ${className}`}>
                <h3 className="text-lg font-semibold">Đánh giá sản phẩm</h3>
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                            <div className="flex space-x-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className={`text-center py-8 ${className}`}>
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => fetchProductReviews(productId)}
                    className="text-primary hover:underline"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                    Đánh giá sản phẩm ({pagination?.totalItems || 0})
                </h3>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>Chưa có đánh giá nào cho sản phẩm này</p>
                    <p className="text-sm mt-2">Hãy là người đầu tiên đánh giá!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} />
                    ))}

                    {/* TODO: Thêm pagination nếu cần */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="text-center py-4">
                            <p className="text-sm text-gray-500">
                                Hiển thị {reviews.length} trong {pagination.totalItems} đánh giá
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!reviewToDelete} onOpenChange={() => setReviewToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa đánh giá</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteReview}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Đang xóa...' : 'Xóa'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
} 