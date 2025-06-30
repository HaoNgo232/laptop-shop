import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MinimalDarkWrapperProps {
    children: ReactNode;
    className?: string;
    padding?: 'sm' | 'md' | 'lg' | 'xl';
    showPattern?: boolean;
    showFloatingElements?: boolean;
}

export function MinimalDarkWrapper({
    children,
    className = '',
    padding = 'md',
    showPattern = true,
    showFloatingElements = true
}: MinimalDarkWrapperProps) {
    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6 md:p-8',
        lg: 'p-8 md:p-12',
        xl: 'p-12 md:p-16'
    };

    return (
        <div className={`relative bg-gray-950 text-white overflow-hidden ${className}`}>
            {/* Grid Pattern Background */}
            {showPattern && (
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)
            `,
                        backgroundSize: '24px 24px'
                    }}
                />
            )}

            {/* Floating Elements */}
            {showFloatingElements && (
                <>
                    {/* Top-left geometric shape */}
                    <motion.div
                        className="absolute top-8 left-8 w-16 h-16 border border-gray-700 rotate-45 opacity-30"
                        animate={{
                            rotate: [45, 65, 45],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Top-right circle */}
                    <motion.div
                        className="absolute top-12 right-12 w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full opacity-40"
                        animate={{
                            y: [0, -10, 0],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Bottom-left triangle */}
                    <motion.div
                        className="absolute bottom-16 left-16 w-0 h-0 opacity-25"
                        style={{
                            borderLeft: '20px solid transparent',
                            borderRight: '20px solid transparent',
                            borderBottom: '35px solid rgba(107, 114, 128, 0.6)'
                        }}
                        animate={{
                            rotate: [0, 10, 0],
                            x: [0, 5, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Bottom-right diamond */}
                    <motion.div
                        className="absolute bottom-12 right-20 w-8 h-8 bg-gray-700 rotate-45 opacity-30"
                        animate={{
                            rotate: [45, 55, 45],
                            y: [0, -8, 0],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-gray-900/80 to-gray-950/90" />

            {/* Content */}
            <div className={`relative z-10 ${paddingClasses[padding]}`}>
                {children}
            </div>
        </div>
    );
} 