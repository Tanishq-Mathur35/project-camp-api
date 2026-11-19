import { Check, Lock } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';

export const ResetPasswordPage = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await authApi.resetPassword(resetToken, newPassword);
            showToast('Password reset successfully! Please sign in.', 'success');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired reset token');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Set new password</h2>
                <p className="text-xs text-slate-400 mt-1">
                    Create a new strong password for your account
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError('');
                    }}
                    required
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                    }}
                    required
                />

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-2"
                    isLoading={isLoading}
                >
                    <Check className="w-4 h-4" />
                    Update Password
                </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
                Remember your password?{' '}
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
