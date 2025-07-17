import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { User } from '@/types/auth';

interface ProfileHeaderProps {
    user: User;
    isEditing: boolean;
    activeTab: string;
    onGoBack: () => void;
    onEditClick: () => void;
    getUserInitials: (username?: string, email?: string) => string;
}

export const ProfileHeader = ({
    user,
    isEditing,
    activeTab,
    onGoBack,
    onEditClick,
    getUserInitials
}: ProfileHeaderProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
        >
            <div className="flex items-center space-x-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onGoBack}
                    className="flex items-center space-x-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Quay lại</span>
                </Button>

                {/* Phần avatar */}
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                            <AvatarImage
                                src={user.avatarUrl}
                                alt={user.username}
                            />
                            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {getUserInitials(user.username, user.email)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Camera className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {user.username || 'Người dùng'}
                        </h1>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {user.role}
                            </span>
                            <span className="text-xs text-gray-500">
                                Tham gia {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {!isEditing && activeTab === 'profile' && (
                <Button onClick={onEditClick} className="flex items-center space-x-2">
                    <Edit3 className="h-4 w-4" />
                    <span>Chỉnh sửa</span>
                </Button>
            )}
        </motion.div>
    );
}; 