export const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-slate-800 text-slate-300 border-slate-700/60',
        primary: 'bg-indigo-950/70 text-indigo-300 border-indigo-700/50',
        success: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50',
        warning: 'bg-amber-950/70 text-amber-300 border-amber-700/50',
        danger: 'bg-rose-950/70 text-rose-300 border-rose-700/50',
        purple: 'bg-purple-950/70 text-purple-300 border-purple-700/50',
        blue: 'bg-sky-950/70 text-sky-300 border-sky-700/50',
        // specific roles
        admin: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        project_admin: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        member: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
        // specific statuses
        todo: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
        in_progress: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        done: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                variants[variant] || variants.default
            } ${className}`}
        >
            {children}
        </span>
    );
};
