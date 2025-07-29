import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SummaryCardProps {
    readonly title: string;
    readonly value: string | number;
    readonly icon: React.ComponentType<{ className?: string }>;
    readonly trend?: 'up' | 'down';
    readonly trendValue?: string;
    readonly description?: string;
    className?: string;
}

/**
 * Card component hiển thị summary data
 * Hỗ trợ icon, trend arrows, description text
 */
export const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    description,
    className
}) => {
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>

                {/* Hiển thị trend với arrow direction */}
                {trend && trendValue && (
                    <div className={cn(
                        "flex items-center text-xs mt-1",
                        trend === 'up' ? "text-green-600" : "text-red-600"
                    )}>
                        <TrendingUp className={cn(
                            "mr-1 h-3 w-3",
                            trend === 'down' && "rotate-180"
                        )} />
                        {trendValue}
                    </div>
                )}

                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}; 