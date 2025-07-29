import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { UserRole } from '@web-ecom/shared-types/auth/enums';

export interface UsersFiltersProps {
    readonly searchTerm: string;
    readonly selectedRole: string;
    readonly onSearchTermChange: (term: string) => void;
    readonly onSearch: () => void;
    readonly onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    readonly onRoleFilter: (role: string) => void;
    readonly onRefresh: () => void;
    readonly isLoading?: boolean;
}

/**
 * Search và filter component cho users
 * Bao gồm search text, role filter, Enter key support
 */
export const UsersFilters: React.FC<UsersFiltersProps> = ({
    searchTerm,
    selectedRole,
    onSearchTermChange,
    onSearch,
    onSearchKeyDown,
    onRoleFilter,
    onRefresh,
    isLoading = false
}) => {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm theo email hoặc tên người dùng..."
                            value={searchTerm}
                            onChange={(e) => onSearchTermChange(e.target.value)}
                            onKeyDown={onSearchKeyDown}
                            className="pl-10"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Action Buttons và Role Filter */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={onSearch}
                            className="whitespace-nowrap"
                            disabled={isLoading}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Tìm kiếm
                        </Button>

                        <Button
                            variant="outline"
                            onClick={onRefresh}
                            className="whitespace-nowrap"
                            disabled={isLoading}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Làm mới
                        </Button>

                        {/* Role Filter */}
                        <Select
                            value={selectedRole}
                            onValueChange={onRoleFilter}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-40">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value={UserRole.ADMIN}>Quản trị</SelectItem>
                                <SelectItem value={UserRole.USER}>Người dùng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 