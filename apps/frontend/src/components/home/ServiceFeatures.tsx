import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Shield, Phone } from 'lucide-react';
import { MinimalDarkWrapper } from '@/components/backgrounds/MinimalDarkWrapper';

export function ServiceFeatures() {
    return (
        <>
            {/* Service Features */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                            <Truck className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Giao hàng nhanh</h3>
                        <p className="text-gray-600 text-sm">
                            Giao hàng trong 24h tại TP.HCM và Hà Nội
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                            <Shield className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Đảm bảo chất lượng</h3>
                        <p className="text-gray-600 text-sm">
                            100% hàng chính hãng, đổi trả trong 7 ngày
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                            <Phone className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Hỗ trợ 24/7</h3>
                        <p className="text-gray-600 text-sm">
                            Đội ngũ tư vấn nhiệt tình, sẵn sàng hỗ trợ
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Newsletter Section */}
            <MinimalDarkWrapper padding="lg" className="rounded-lg">
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Nhận thông tin ưu đãi</h3>
                    <p className="text-gray-300 mb-4">
                        Đăng ký để nhận thông báo về sản phẩm mới và khuyến mãi
                    </p>
                    <div className="max-w-md mx-auto flex gap-2">
                        <input
                            type="email"
                            placeholder="Email của bạn"
                            className="flex-1 px-3 py-2 rounded bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none"
                        />
                        <Button className="bg-white text-gray-900 hover:bg-gray-300 mt-0.5">
                            Đăng ký
                        </Button>
                    </div>
                </div>
            </MinimalDarkWrapper>
        </>
    );
} 