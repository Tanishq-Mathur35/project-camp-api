import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { Button } from '../../components/common/Button';

export const VerifyEmailPage = () => {
    const { verificationToken } = useParams();
    const [status, setStatus] = useState('verifying'); // verifying | success | error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await authApi.verifyEmail(verificationToken);
                setStatus('success');
                setMessage(res?.message || 'Your email has been verified successfully!');
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Invalid or expired verification token.');
            }
        };

        if (verificationToken) {
            verify();
        } else {
            setStatus('error');
            setMessage('Verification token is missing.');
        }
    }, [verificationToken]);

    return (
        <div className="text-center py-6 space-y-4">
            {status === 'verifying' && (
                <div className="space-y-3">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto" />
                    <h2 className="text-lg font-bold text-white">Verifying your email...</h2>
                    <p className="text-xs text-slate-400">
                        Please wait while we confirm your account.
                    </p>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-4">
                    <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Email Verified!</h2>
                    <p className="text-xs text-slate-300 max-w-xs mx-auto">{message}</p>
                    <div className="pt-2">
                        <Link to="/login">
                            <Button variant="primary" className="w-full">
                                Proceed to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="space-y-4">
                    <div className="w-14 h-14 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
                        <XCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Verification Failed</h2>
                    <p className="text-xs text-slate-300 max-w-xs mx-auto">{message}</p>
                    <div className="pt-2 flex flex-col gap-2">
                        <Link to="/login">
                            <Button variant="secondary" className="w-full">
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};
