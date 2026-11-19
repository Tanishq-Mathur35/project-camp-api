import { Lock, LogIn, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Welcome back</h2>
                <p className="text-xs text-slate-400 mt-1">
                    Enter your email or username to access your projects
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email or Username"
                    name="email"
                    type="text"
                    placeholder="admin@example.com or username"
                    icon={Mail}
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <div>
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        icon={Lock}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <div className="flex justify-end mt-1.5">
                        <Link
                            to="/forgot-password"
                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-2"
                    isLoading={isLoading}
                >
                    <LogIn className="w-4 h-4" />
                    Sign In
                </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
                Don't have an account?{' '}
                <Link
                    to="/register"
                    className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    Create an account
                </Link>
            </div>
        </div>
    );
};
