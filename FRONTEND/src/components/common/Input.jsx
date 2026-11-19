export const Input = ({
    label,
    error,
    icon: Icon,
    className = '',
    id,
    type = 'text',
    ...props
}) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
        <div className="w-full flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-xs font-semibold tracking-wide text-slate-300 uppercase"
                >
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                {Icon && (
                    <div className="absolute left-3.5 pointer-events-none text-slate-400">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    id={inputId}
                    type={type}
                    className={`w-full bg-slate-900/80 border text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                        Icon ? 'pl-10' : ''
                    } ${
                        error
                            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
                            : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500'
                    } ${className}`}
                    {...props}
                />
            </div>
            {error && <span className="text-xs text-rose-400 mt-0.5">{error}</span>}
        </div>
    );
};
