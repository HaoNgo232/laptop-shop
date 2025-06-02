import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
    placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Tìm kiếm sản phẩm..." }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');

    // Handle search khi nhấn nút hoặc Enter
    const handleSearch = () => {
        onSearch(searchTerm.trim());
    };

    // Handle Enter key
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Clear search
    const handleClear = () => {
        setSearchTerm('');
        onSearch(''); // Search empty để show all products
    };

    return (
        <div className="flex w-full max-w-md mx-auto space-x-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 pr-10"
                />
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        ×
                    </button>
                )}
            </div>
            <Button onClick={handleSearch} size="default">
                Tìm kiếm
            </Button>
        </div>
    );
} 