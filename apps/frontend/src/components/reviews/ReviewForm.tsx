import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, Send, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { CreateReviewSchema, UpdateReviewSchema } from '@/types/review';
import type { CreateReview, UpdateReview, ReviewWithUser } from '@/types/review';

interface ReviewFormProps {
    readonly productId: string;
    readonly existingReview?: ReviewWithUser | null;
    readonly onCancel?: () => void; // Chỉ cần onCancel để đóng modal
    readonly className?: string;
}

export function ReviewForm({
    productId,
    existingReview,
    onCancel,
    className
}: ReviewFormProps) {
    const [selectedRating, setSelectedRating] = useState(existingReview?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { createReview, updateReview, deleteReview, isSubmitting, error, clearError } = useReviewStore();

    const isEditing = !!existingReview;
    const schema = isEditing ? UpdateReviewSchema : CreateReviewSchema;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<CreateReview | UpdateReview>({
        resolver: zodResolver(schema),
        defaultValues: {
            rating: existingReview?.rating || 0,
            comment: existingReview?.comment || '',
        },
    });

    // Update form when existingReview changes
    useEffect(() => {
        if (existingReview) {
            setValue('rating', existingReview.rating);
            setValue('comment', existingReview.comment || '');
            setSelectedRating(existingReview.rating);
        } else {
            reset();
            setSelectedRating(0);
        }
    }, [existingReview, setValue, reset]);

    const handleRatingSelect = (rating: number) => {
        setSelectedRating(rating);
        setValue('rating', rating);
        clearError();
    };

    const onSubmit = async (data: CreateReview | UpdateReview) => {
        try {
            if (isEditing && existingReview) {
                await updateReview(existingReview.id, data as UpdateReview);
            } else {
                await createReview(productId, data as CreateReview);
            }

            // Reset form và đóng modal
            reset();
            setSelectedRating(0);
            onCancel?.(); // Store tự động reload rồi, chỉ cần đóng modal
        } catch (error) {
            // Lỗi đã handle ở store rồi
            console.error('Review submission failed:', error);
        }
    };

    const handleDeleteReview = async () => {
        if (!existingReview) return;

        try {
            await deleteReview(existingReview.id);

            // Đóng dialog và reset form
            setShowDeleteDialog(false);
            reset();
            setSelectedRating(0);
            onCancel?.(); // Đóng modal thôi, store tự reload
        } catch (error) {
            // Lỗi đã handle ở store rồi
            console.error('Delete review failed:', error);
        }
    };

    const renderStars = () => {
        return (
            <div className="flex items-center space-x-1 mb-4">
                <span className="text-sm font-medium mr-2">Đánh giá:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingSelect(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-colors hover:scale-110 transform"
                    >
                        <Star
                            className={`h-6 w-6 ${star <= (hoverRating || selectedRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                                }`}
                        />
                    </button>
                ))}
                {selectedRating > 0 && (
                    <span className="ml-2 text-sm text-gray-600">
                        ({selectedRating}/5)
                    </span>
                )}
            </div>
        );
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    {isEditing ? (
                        <>
                            <Edit className="h-5 w-5" />
                            <span>Chỉnh sửa đánh giá</span>
                        </>
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            <span>Viết đánh giá</span>
                        </>
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Rating Stars */}
                    <div>
                        {renderStars()}
                        {errors.rating && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.rating.message}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Nhận xét (tùy chọn)
                        </label>
                        <Textarea
                            {...register('comment')}
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            rows={4}
                            className="resize-none"
                            disabled={isSubmitting}
                        />
                        {errors.comment && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.comment.message}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <Button
                            type="submit"
                            disabled={isSubmitting || selectedRating === 0}
                            className="flex-1"
                        >
                            {isSubmitting ? (
                                'Đang xử lý...'
                            ) : isEditing ? (
                                'Cập nhật đánh giá'
                            ) : (
                                'Gửi đánh giá'
                            )}
                        </Button>

                        {/* Delete button - chỉ hiển thị khi đang edit */}
                        {isEditing && existingReview && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={isSubmitting}
                                className="flex items-center space-x-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Xóa</span>
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa đánh giá</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteReview}
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isSubmitting ? 'Đang xóa...' : 'Xóa đánh giá'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
} 