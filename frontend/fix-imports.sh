#!/bin/bash

# Script để sửa tất cả import paths thành @/types
# Tuân theo Single Responsibility Principle - chỉ làm một việc: sửa imports

echo "🔧 Đang sửa các import paths..."

# Tìm tất cả file .ts và .tsx
find src -name "*.ts" -o -name "*.tsx" | while read file; do
    if [ -f "$file" ]; then
        # Thay thế tất cả các import từ @/types/xxx thành @/types
        sed -i 's|from ['\''"]@/types/[^'\''"]*['\''"]|from "@/types"|g' "$file"
        sed -i "s|from ['\\'']@/types/[^'\\'']*['\\'']|from '@/types'|g" "$file"
        
        echo "✅ Đã sửa: $file"
    fi
done

echo "🎉 Hoàn thành! Tất cả import đã được chuyển về @/types"
