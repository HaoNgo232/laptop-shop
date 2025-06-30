import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Grid, Circle } from 'lucide-react';

interface MinimalBackgroundProps {
    children?: React.ReactNode;
    showCTA?: boolean;
    onCTAClick?: () => void;
    theme?: 'light' | 'dark';
}

export function MinimalBackground({
    children,
    showCTA = true,
    onCTAClick,
    theme = 'light'
}: MinimalBackgroundProps) {

    const isDark = theme === 'dark';

    return (
        <div className={`relative min-h-[500px] ${isDark ? 'bg-gray-900' : 'bg-gray-50'} overflow-hidden pt-10 pb-10`}>
            {/* Geometric grid pattern */}
            <div className="absolute inset-0">
                {/* Grid dots */}
                <div className="absolute inset-0 opacity-30">
                    <div
                        className={`w-full h-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
                        style={{
                            backgroundImage: `radial-gradient(circle, ${isDark ? '#374151' : '#d1d5db'} 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                {/* Animated geometric elements */}
                <motion.div
                    className={`absolute top-20 right-20 w-32 h-32 ${isDark ? 'border-gray-700' : 'border-gray-300'} border-2 rounded-lg`}
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                <motion.div
                    className={`absolute bottom-32 left-16 w-24 h-24 ${isDark ? 'border-gray-600' : 'border-gray-400'} border-2 rounded-full`}
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Floating minimal shapes */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${15 + i * 18}%`,
                            top: `${10 + (i % 2) * 40}%`,
                        }}
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                            duration: 5 + i,
                            repeat: Infinity,
                            delay: i * 1.2,
                        }}
                    >
                        {i % 2 === 0 ? (
                            <Circle className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                        ) : (
                            <Grid className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Main heading */}
                    <motion.h1
                        className={`text-4xl md:text-6xl font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Mua sắm
                        <br />
                        <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            hiện đại
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        className={`text-lg md:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto leading-relaxed font-light`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Thiết kế tối giản, trải nghiệm tối đa.
                        Tìm kiếm sản phẩm yêu thích một cách dễ dàng.
                    </motion.p>

                    {/* CTA Button */}
                    {showCTA && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <Button
                                onClick={onCTAClick}
                                variant="outline"
                                size="lg"
                                className="bg-gray-700/30 border-gray-600 text-gray-100 hover:bg-gray-600/50 hover:border-gray-500"
                            >
                                Bắt đầu
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                    )}

                    {/* Simple stats */}
                    <motion.div
                        className={`flex justify-center gap-12 mt-12 ${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm uppercase tracking-widest`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <div>12K+ Khách hàng</div>
                        <div>1.2K+ Sản phẩm</div>
                        <div>5.6K+ Đơn hàng</div>
                    </motion.div>
                </motion.div>

                {/* Custom children content */}
                {children}
            </div>

            {/* Minimal bottom line */}
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
    );
} 