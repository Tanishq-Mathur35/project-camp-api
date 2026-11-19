import { ArrowLeft, Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await authApi.forgotPassword(email);
            setIsSent(true);
            showToast('Password reset email sent!', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to send reset link', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Reset password</h2>
                <p className="text-xs text-slate-400 mt-1">
                    Enter your registered email address and we'll send you a password reset link
                </p>
            </div>

            {isSent ? (
                <div className="text-center py-4 space-y-3">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                        <Mail className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-slate-200">
                        A password reset email has been sent to{' '}
                        <span className="text-indigo-400 font-semibold">{email}</span>.
                    </p>
                    <p className="text-xs text-slate-400">
                        Please check your inbox and click the link to reset your password.
                    </p>
                    <div className="pt-4">
                        <Link to="/login">
                            <Button variant="secondary" className="w-full">
                                Back to Sign in
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        icon={Mail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full mt-2"
                        isLoading={isLoading}
                    >
                        <Send className="w-4 h-4" />
                        Send Reset Link
                    </Button>

                    <div className="text-center mt-4">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to sign in
                        </Link>
                    </div>
                </form>
            )}
        </div>
    );
};
