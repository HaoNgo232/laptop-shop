import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Category, CreateCategory, UpdateCategory } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const CategoryFormSchema = z.object({
    name: z.string().min(3, 'Tên danh mục phải có ít nhất 3 ký tự'),
    description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
});

type CategoryFormData = z.infer<typeof CategoryFormSchema>;

interface CategoryFormProps {
    readonly category?: Category | null;
    readonly onSubmit: (data: CreateCategory | UpdateCategory) => Promise<void>;
    readonly onCancel: () => void;
    readonly isLoading: boolean;
}

const CategoryForm = ({ category, onSubmit, onCancel, isLoading }: CategoryFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<CategoryFormData>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    useEffect(() => {
        if (category) {
            reset(category);
        }
    }, [category, reset]);

    const handleFormSubmit = async (data: CategoryFormData) => {
        try {
            await onSubmit(data);
        } catch (error) {
            console.error('Error submitting category form:', error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Tên danh mục</Label>
                            <Input
                                id="name"
                                {...register('name')}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                className={errors.description ? 'border-red-500' : ''}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">{errors.description.message}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={onCancel}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isSubmitting || isLoading}>
                                {isSubmitting || isLoading ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CategoryForm;