import { Compass, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-center">
            <div className="max-w-md space-y-4">
                <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/20">
                    <Compass className="w-8 h-8 animate-pulse" />
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
                <h2 className="text-lg font-bold text-slate-200">Page Not Found</h2>
                <p className="text-xs text-slate-400">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <div className="pt-2">
                    <Link to="/dashboard">
                        <Button variant="primary">
                            <Home className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
