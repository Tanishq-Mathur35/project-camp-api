import { KeyRound, Lock, Mail, Save, Send, ShieldAlert, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';
import { authApi } from '../api/auth.api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SettingsPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isResendingEmail, setIsResendingEmail] = useState(false);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!passwordData.oldPassword || !passwordData.newPassword) {
            showToast('Please fill in both old and new password', 'error');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('New passwords do not match', 'error');
            return;
        }

        setIsChangingPassword(true);
        try {
            await authApi.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });
            showToast('Password updated successfully!', 'success');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update password', 'error');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleResendEmail = async () => {
        setIsResendingEmail(true);
        try {
            await authApi.resendEmailVerification();
            showToast('Verification email sent! Check your inbox.', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to send email', 'error');
        } finally {
            setIsResendingEmail(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-8 animate-in fade-in duration-200">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Account Settings</h1>
                <p className="text-xs text-slate-400 mt-1">
                    Manage your personal profile, email verification, and security credentials.
                </p>
            </div>

            {/* Profile Overview Card */}
            <div className="glass-panel p-6 rounded-3xl space-y-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400" /> Profile Information
                </h2>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-indigo-500/30 overflow-hidden flex items-center justify-center font-bold text-xl text-indigo-300">
                        {user?.avatar?.url ? (
                            <img
                                src={user.avatar.url}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            user?.username?.substring(0, 2).toUpperCase() || 'U'
                        )}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-white">
                            {user?.fullName || user?.username}
                        </h3>
                        <p className="text-xs text-slate-400">@{user?.username}</p>
                        <p className="text-xs text-slate-300">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Email Verification Status */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-400" /> Email Verification
                </h2>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-3">
                        {user?.isEmailVerified ? (
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold text-white">
                                {user?.isEmailVerified
                                    ? 'Email is Verified'
                                    : 'Email is not verified'}
                            </p>
                            <p className="text-xs text-slate-400">
                                {user?.isEmailVerified
                                    ? 'Your account email is verified and secure.'
                                    : 'Please verify your email to ensure account recovery access.'}
                            </p>
                        </div>
                    </div>

                    {!user?.isEmailVerified && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleResendEmail}
                            isLoading={isResendingEmail}
                        >
                            <Send className="w-3.5 h-3.5" />
                            Resend Verification Email
                        </Button>
                    )}
                </div>
            </div>

            {/* Change Password Form */}
            <div className="glass-panel p-6 rounded-3xl space-y-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-indigo-400" /> Change Password
                </h2>

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                    <Input
                        label="Current Password"
                        type="password"
                        placeholder="••••••••"
                        icon={Lock}
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, oldPassword: e.target.value })
                        }
                        required
                    />

                    <Input
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                        icon={Lock}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        required
                    />

                    <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="••••••••"
                        icon={Lock}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isChangingPassword}
                        className="mt-2"
                    >
                        <Save className="w-4 h-4" />
                        Update Password
                    </Button>
                </form>
            </div>
        </div>
    );
};
