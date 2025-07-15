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
    productId: string;
    existingReview?: ReviewWithUser | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ReviewModal({
    productId,
    existingReview,
    isOpen,
    onClose,
    onSuccess
}: ReviewModalProps) {
    const isEditing = !!existingReview;

    const handleSuccess = () => {
        onClose();
        onSuccess?.();
    };

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
                        onSuccess={handleSuccess}
                        onCancel={onClose}
                        className="border-0 shadow-none p-0"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
} 