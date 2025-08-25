import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Shield, Phone } from 'lucide-react';
import { MinimalDarkWrapper } from '@/components/backgrounds/MinimalDarkWrapper';
import { useTranslation } from 'react-i18next';

export function ServiceFeatures() {
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log('Newsletter subscribe:', formData.get('email'));
    };

    return (
        <>
            {/* Service Features */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                            <Truck className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2">{t('serviceFeatures.deliveryTitle')}</h3>
                        <p className="text-gray-600 text-sm">
                            {t('serviceFeatures.deliveryDesc')}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                            <Shield className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2">{t('serviceFeatures.qualityTitle')}</h3>
                        <p className="text-gray-600 text-sm">
                            {t('serviceFeatures.qualityDesc')}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                            <Phone className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2">{t('serviceFeatures.supportTitle')}</h3>
                        <p className="text-gray-600 text-sm">
                            {t('serviceFeatures.supportDesc')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Newsletter Section */}
            <MinimalDarkWrapper padding="lg" className="rounded-lg">
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">{t('serviceFeatures.newsletterTitle')}</h3>
                    <p className="text-gray-300 mb-4">
                        {t('serviceFeatures.newsletterDesc')}
                    </p>
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
                        <label htmlFor="newsletter-email" className="sr-only">
                            {t('serviceFeatures.newsletterPlaceholder')}
                        </label>
                        <input
                            id="newsletter-email"
                            name="email"
                            type="email"
                            placeholder={t('serviceFeatures.newsletterPlaceholder')}
                            className="flex-1 px-3 py-2 rounded bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:border-gray-600 focus:outline-none"
                        />
                        <Button type="submit" className="bg-white text-gray-900 hover:bg-gray-300 mt-0.5">
                            {t('serviceFeatures.newsletterSubmit')}
                        </Button>
                    </form>
                </div>
            </MinimalDarkWrapper>
        </>
    );
}