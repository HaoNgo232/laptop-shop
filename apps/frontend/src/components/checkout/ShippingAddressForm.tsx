import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import type { ShippingAddress } from '@/types/order';

interface ShippingAddressFormProps {
    onSubmit: (address: ShippingAddress) => void;
    initialData?: ShippingAddress;
    isLoading?: boolean;
}

export function ShippingAddressForm({ onSubmit, initialData, isLoading = false }: ShippingAddressFormProps) {
    const [fullAddress, setFullAddress] = useState(initialData?.fullAddress || '');
    const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '');
    const [note, setNote] = useState(initialData?.note || '');
    const [errors, setErrors] = useState<{ fullAddress?: string }>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        const newErrors: { fullAddress?: string } = {};
        if (!fullAddress.trim()) {
            newErrors.fullAddress = 'Địa chỉ giao hàng không được để trống';
        } else if (fullAddress.trim().length < 10) {
            newErrors.fullAddress = 'Địa chỉ giao hàng phải có ít nhất 10 ký tự';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onSubmit({
                fullAddress: fullAddress.trim(),
                phoneNumber: phoneNumber.trim(),
                note: note.trim() || undefined
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Địa chỉ giao hàng</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Địa chỉ đầy đủ */}
                    <div className="space-y-2">
                        <Label htmlFor="fullAddress">
                            Địa chỉ đầy đủ <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="fullAddress"
                            type="text"
                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                            value={fullAddress}
                            onChange={(e) => setFullAddress(e.target.value)}
                            disabled={isLoading}
                            className={errors.fullAddress ? 'border-destructive' : ''}
                        />
                        {errors.fullAddress && (
                            <p className="text-sm text-destructive">{errors.fullAddress}</p>
                        )}
                    </div>

                    {/* Số điện thoại */}

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">
                            Số điện thoại <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="phoneNumber"
                            type="text"
                            placeholder="Số điện thoại"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Ghi chú */}
                    <div className="space-y-2">
                        <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                        <Input
                            id="note"
                            type="text"
                            placeholder="Ví dụ: Giao ngoài giờ hành chính, gọi trước khi giao..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Xác nhận địa chỉ'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 