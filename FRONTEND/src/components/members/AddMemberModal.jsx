import { Mail, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';

export const AddMemberModal = ({ isOpen, onClose, onAddMember }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Email address is required');
            return;
        }

        setIsLoading(true);
        try {
            await onAddMember({ email: email.trim(), role });
            setEmail('');
            setRole('member');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add member');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Project Member"
            description="Invite a registered user to collaborate on this project"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                        {error}
                    </div>
                )}

                <Input
                    label="User Email Address"
                    type="email"
                    placeholder="colleague@example.com"
                    icon={Mail}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                    }}
                    required
                />

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                        Project Role
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                        <option value="member">
                            Member (Can view project & toggle subtask status)
                        </option>
                        <option value="project_admin">
                            Project Admin (Can manage tasks & subtasks)
                        </option>
                        <option value="admin">Admin (Full project control, members & notes)</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isLoading}>
                        <UserPlus className="w-4 h-4" />
                        Add Member
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
