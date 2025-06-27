import { useState, useEffect } from 'react';

export const useAppLoading = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {

            // Minimum loading time để thấy được animation
            const minimumLoadTime = 2000;
            const startTime = Date.now();

            try {
                // Đợi các tác vụ khởi tạo hoàn thành
                await Promise.all([
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);

                // Đảm bảo loading tối thiểu 1.5s
                const elapsed = Date.now() - startTime;
                if (elapsed < minimumLoadTime) {
                    await new Promise(resolve =>
                        setTimeout(resolve, minimumLoadTime - elapsed)
                    );
                }

                setIsLoading(false);
            } catch (error) {
                console.error('App initialization error:', error);
                setIsLoading(false);
            }
        };

        initializeApp();
    }, []);

    return { isLoading };
};