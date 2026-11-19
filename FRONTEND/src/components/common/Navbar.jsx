import { Activity, ChevronDown, Layers, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isApiHealthy, setIsApiHealthy] = useState(null);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                await authApi.checkHealth();
                setIsApiHealthy(true);
            } catch {
                setIsApiHealthy(false);
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                {/* Brand */}
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-base font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                                Project Camp
                            </span>
                            <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                                v1.0
                            </span>
                        </div>
                    </Link>

                    {/* API Health badge */}
                    {isApiHealthy !== null && (
                        <div
                            className={`hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                                isApiHealthy
                                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                                    : 'bg-rose-950/40 text-rose-400 border-rose-500/20'
                            }`}
                            title={
                                isApiHealthy ? 'Backend API is online' : 'Backend API unreachable'
                            }
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                    isApiHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                                }`}
                            />
                            <Activity className="w-3 h-3" />
                            <span>{isApiHealthy ? 'API Live' : 'API Offline'}</span>
                        </div>
                    )}
                </div>

                {/* User profile actions */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 transition-all text-left"
                        >
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300">
                                {user?.avatar?.url ? (
                                    <img
                                        src={user.avatar.url}
                                        alt={user.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    user?.username?.substring(0, 2).toUpperCase() || 'U'
                                )}
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-xs font-semibold text-slate-100 leading-tight">
                                    {user?.fullName || user?.username}
                                </span>
                                <span className="text-[10px] text-slate-400 leading-tight">
                                    @{user?.username}
                                </span>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-30"
                                    onClick={() => setDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                                        <p className="text-xs text-slate-400">Signed in as</p>
                                        <p className="text-sm font-semibold text-white truncate">
                                            {user?.email}
                                        </p>
                                        {user?.isEmailVerified ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                                                <ShieldCheck className="w-3 h-3" /> Email Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 mt-1">
                                                Unverified Email
                                            </span>
                                        )}
                                    </div>

                                    <Link
                                        to="/settings"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                                    >
                                        <Settings className="w-4 h-4 text-slate-400" />
                                        Account Settings
                                    </Link>

                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            logout();
                                            navigate('/login');
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-1"
                                    >
                                        <LogOut className="w-4 h-4 text-rose-400" />
                                        Sign out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
