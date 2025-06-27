import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
            <div className="text-center">
                {/* Logo hoặc brand name */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-primary">
                        Web-Ecom
                    </h1>
                    <p className="text-gray-600 mt-2">Đang tải...</p>
                </motion.div>

                {/* Loading animation */}
                <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className="w-3 h-3 bg-primary rounded-full"
                            animate={{
                                y: [0, -16, 0],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: index * 0.2
                            }}
                        />
                    ))}
                </div>

                {/* Progress bar */}
                <div className="mt-8 w-64 mx-auto">
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-blue-600"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                {/* Spinning icon */}
                <motion.div
                    className="mt-6 flex justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </motion.div>
            </div>
        </div>
    );
};

export default LoadingScreen;