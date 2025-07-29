import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

type TabType = 'profile' | 'orders';

interface Tab {
    type: TabType;
    label: string;
    icon: LucideIcon;
}

interface ProfileTabsProps {
    readonly tabs: Tab[];
    readonly activeTab: TabType;
    readonly onTabChange: (tab: TabType) => void;
}

export const ProfileTabs = ({ tabs, activeTab, onTabChange }: ProfileTabsProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 max-w-fit"
        >
            {tabs.map((tab) => (
                <button
                    key={tab.type}
                    onClick={() => onTabChange(tab.type)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === tab.type
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                </button>
            ))}
        </motion.div>
    );
}; 