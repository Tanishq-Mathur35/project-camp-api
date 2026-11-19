import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-400">
            <Loader2 className={`${sizes[size]} animate-spin text-indigo-500`} />
            {text && <span className="text-sm font-medium tracking-wide">{text}</span>}
        </div>
    );
};
