import { Layers } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-950 relative overflow-hidden">
            {/* Decorative gradient glowing spheres */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

            <div className="w-full max-w-md relative z-10">
                {/* Brand header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2.5 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                            <Layers className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                            Project Camp
                        </span>
                    </Link>
                    <p className="text-xs text-slate-400 mt-2">
                        Collaborative Project, Task & Note Management
                    </p>
                </div>

                {/* Auth form card */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-800">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
