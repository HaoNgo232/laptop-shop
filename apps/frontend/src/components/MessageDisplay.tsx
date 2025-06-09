import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface MessageDisplayProps {
    message: string;
    type?: 'info' | 'success' | 'warning';
    className?: string;
}

export function MessageDisplay({ message, type = 'info', className = '' }: MessageDisplayProps) {
    if (!message?.trim()) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-4 w-4" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'border-green-200 bg-green-50 text-green-800';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50 text-yellow-800';
            default:
                return 'border-blue-200 bg-blue-50 text-blue-800';
        }
    };

    return (
        <Alert className={`${getStyles()} ${className}`}>
            {getIcon()}
            <AlertDescription>
                {message}
            </AlertDescription>
        </Alert>
    );
} 