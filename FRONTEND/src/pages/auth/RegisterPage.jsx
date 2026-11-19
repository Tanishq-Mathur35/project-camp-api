import { AtSign, Lock, Mail, User, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
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
        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Create your account</h2>
                <p className="text-xs text-slate-400 mt-1">
                    Start managing projects, tasks, and notes with your team
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
                <Input
                    label="Full Name (Optional)"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    icon={User}
                    value={formData.fullName}
                    onChange={handleChange}
                />

                <Input
                    label="Username"
                    name="username"
                    type="text"
                    placeholder="johndoe (min 3 chars, lowercase)"
                    icon={AtSign}
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    icon={Mail}
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

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

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-3"
                    isLoading={isLoading}
                >
                    <UserPlus className="w-4 h-4" />
                    Create Account
                </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    Sign in
                </Link>
            </div>
        </div>
    );
};
