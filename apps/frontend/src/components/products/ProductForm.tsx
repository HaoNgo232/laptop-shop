import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CreateProduct, UpdateProduct, Category, Product } from '@/types/product';
import { z } from 'zod';

//  Schema validation riêng cho form
const ProductFormSchema = z.object({
    name: z.string().min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự'),
    description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
    price: z.number().min(1000, 'Giá phải ít nhất 1,000 VND'),
    stockQuantity: z.number().min(0, 'Số lượng không thể âm'),
    imageUrl: z.string().url('URL hình ảnh không hợp lệ'),
    categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
});

type ProductFormData = z.infer<typeof ProductFormSchema>;

interface ProductFormProps {
    product?: Product | null;
    categories: Category[];
    onSubmit: (data: CreateProduct | UpdateProduct) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

const ProductForm = ({
    product,
    categories,
    onSubmit,
    onCancel,
    isLoading = false,
}: ProductFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ProductFormData>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            stockQuantity: 0,
            imageUrl: '',
            categoryId: '',
        },
    });

    //  Handle initial data load
    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                description: product.description,
                price: product.price,
                stockQuantity: product.stockQuantity,
                imageUrl: product.imageUrl,
                categoryId: product.category?.id,
            });
        } else {
            // Reset form khi không có product (create mode)
            reset({
                name: '',
                description: '',
                price: 0,
                stockQuantity: 0,
                imageUrl: '',
                categoryId: '',
            });
        }
    }, [product, reset]);

    //  Handle form submission với error handling tốt hơn
    const handleFormSubmit = async (data: ProductFormData) => {
        try {
            //  Validate categoryId
            if (!data.categoryId) {
                throw new Error('Vui lòng chọn danh mục');
            }

            const submitData = {
                name: data.name.trim(),
                description: data.description.trim(),
                price: Number(data.price),
                stockQuantity: Number(data.stockQuantity),
                imageUrl: data.imageUrl.trim(),
                categoryId: data.categoryId,
            };

            console.log('Final submit data:', submitData);
            await onSubmit(submitData);

            if (!product) {
                reset();
            }
        } catch (error) {
            console.error("Lỗi khi submit form:", error);
        }
    };

    const selectedCategoryId = watch('categoryId');
    const watchedImageUrl = watch('imageUrl');
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>
                    {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    {/* Tên sản phẩm */}
                    <div className="space-y-2">
                        <Label htmlFor='name'>Tên sản phẩm *</Label>
                        <Input
                            id='name'
                            {...register('name')}
                            placeholder='Nhập tên sản phẩm'
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className='text-red-500 text-sm'>{errors.name.message}</p>
                        )}
                    </div>

                    {/* Mô tả */}
                    <div className='space-y-2'>
                        <Label htmlFor='description'>Mô tả *</Label>
                        <Textarea
                            id='description'
                            {...register('description')}
                            placeholder='Nhập mô tả sản phẩm'
                            className={errors.description ? 'border-red-500' : ''}
                            rows={4}
                        />
                        {errors.description && (
                            <p className='text-red-500 text-sm'>{errors.description.message}</p>
                        )}
                    </div>

                    {/* Giá và Số lượng */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='price'>Giá (VND) *</Label>
                            <Input
                                id='price'
                                type='number'
                                step='1000'
                                {...register('price', { valueAsNumber: true })}
                                placeholder='0'
                                className={errors.price ? 'border-red-500' : ''}
                            />
                            {errors.price && (
                                <p className='text-red-600 text-sm'>{errors.price.message}</p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='stockQuantity'>Số lượng *</Label>
                            <Input
                                id='stockQuantity'
                                type='number'
                                {...register('stockQuantity', { valueAsNumber: true })}
                                placeholder='0'
                                className={errors.stockQuantity ? 'border-red-500' : ''}
                            />
                            {errors.stockQuantity && (
                                <p className='text-red-600 text-sm'>{errors.stockQuantity.message}</p>
                            )}
                        </div>
                    </div>

                    {/* URL hình ảnh */}
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">URL hình ảnh *</Label>
                        <Input
                            id="imageUrl"
                            {...register('imageUrl')}
                            placeholder="https://example.com/image.jpg"
                            className={errors.imageUrl ? 'border-red-500' : ''}
                        />
                        {errors.imageUrl && (
                            <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
                        )}

                        {/* Preview hình ảnh hiện tại */}
                        {watchedImageUrl && (
                            <div className="mt-3">
                                <Label className="text-sm text-gray-600">Preview:</Label>
                                <div className="mt-2 border rounded-lg overflow-hidden">
                                    <img
                                        src={watchedImageUrl}
                                        alt="Product preview"
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                        onLoad={(e) => {
                                            e.currentTarget.style.display = 'block';
                                            e.currentTarget.nextElementSibling?.classList.add('hidden');
                                        }}
                                    />
                                    <div className="hidden p-4 text-center text-gray-500 bg-gray-50">
                                        <p className="text-sm">Không thể tải hình ảnh</p>
                                        <p className="text-xs">Vui lòng kiểm tra URL</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Danh mục */}
                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Danh mục *</Label>
                        <Select
                            value={selectedCategoryId || ''}
                            onValueChange={(value) => {
                                console.log('Selected category:', value);
                                setValue('categoryId', value);
                            }}
                        >
                            <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && (
                            <p className="text-sm text-red-600">{errors.categoryId.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="flex-1"
                        >
                            {isSubmitting || isLoading
                                ? 'Đang xử lý...'
                                : product
                                    ? 'Cập Nhật'
                                    : 'Thêm Sản Phẩm'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting || isLoading}
                        >
                            Hủy
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProductForm;