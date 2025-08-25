import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Category, CreateCategory, UpdateCategory } from "@/types";
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ImageUploader } from '@/components/common/ImageUploader';
import { uploadService } from '@/services/uploadService';

const CategoryFormSchema = z.object({
    name: z.string().min(3, 'Tên danh mục phải có ít nhất 3 ký tự'),
    description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
    imageUrl: z.string().url().or(z.literal('')).optional(),
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
        reset,
        watch,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            name: '',
            description: '',
            imageUrl: '',
        },
    });

    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (category) {
            reset({
                name: category.name,
                description: category.description || '',
                imageUrl: category.imageUrl || '',
            });
            setImageFile(null);
        }
    }, [category, reset]);

    const handleFormSubmit = async (data: CategoryFormData) => {
        try {
            let imageUrl = data.imageUrl?.trim();
            if (imageFile) {
                const res = await uploadService.uploadImage(imageFile);
                imageUrl = res.url;
            }
            if (!imageUrl) {
                throw new Error('Vui lòng cung cấp hình ảnh');
            }
            const submitData = {
                name: data.name.trim(),
                description: data.description.trim(),
                imageUrl,
            };
            await onSubmit(submitData);
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
                        <div className="grid gap-2">
                            <Label htmlFor="imageUrl">URL hình ảnh</Label>
                            <Input
                                id="imageUrl"
                                {...register('imageUrl')}
                                className={errors.imageUrl ? 'border-red-500' : ''}
                            />
                            {errors.imageUrl && (
                                <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
                            )}
                        </div>
                        <ImageUploader onFileSelect={setImageFile} initialUrl={watch('imageUrl') || category?.imageUrl} />

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