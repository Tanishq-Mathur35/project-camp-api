import { FolderKanban } from 'lucide-react';

export const EmptyState = ({
    icon: Icon = FolderKanban,
    title = 'No data found',
    description = 'Get started by creating something new.',
    action,
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-indigo-400 mb-4 border border-slate-700/50 shadow-inner">
                <Icon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-200">{title}</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mb-6">{description}</p>
            {action}
        </div>
    );
};
