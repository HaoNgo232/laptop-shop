import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ReviewForm } from './ReviewForm';
import { Edit, Send } from 'lucide-react';
import type { ReviewWithUser } from '@/types/review';

interface ReviewModalProps {
    readonly productId: string;
    readonly existingReview?: ReviewWithUser | null;
    readonly isOpen: boolean;
    readonly onClose: () => void;
}

export function ReviewModal({
    productId,
    existingReview,
    isOpen,
    onClose
}: ReviewModalProps) {
    const isEditing = !!existingReview;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
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
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    <ReviewForm
                        productId={productId}
                        existingReview={existingReview}
                        onCancel={onClose}
                        className="border-0 shadow-none p-0"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
} 