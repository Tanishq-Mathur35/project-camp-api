import { Lock, UserMinus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { projectApi } from '../../api/project.api';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { AddMemberModal } from './AddMemberModal';

export const MemberList = ({ members = [], onMembersUpdated }) => {
    const { project, canManageMembers } = useProject();
    const { showToast } = useToast();
    const [modalOpen, setModalOpen] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const handleAddMember = async ({ email, role }) => {
        await projectApi.addMember(project._id, { email, role });
        showToast('Member added to project!', 'success');
        onMembersUpdated();
    };

    const handleRoleChange = async (userId, newRole) => {
        setUpdatingId(userId);
        try {
            await projectApi.updateMemberRole(project._id, userId, newRole);
            showToast('Member role updated successfully', 'success');
            onMembersUpdated();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update role', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRemoveMember = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to remove @${username} from this project?`)) {
            return;
        }
        try {
            await projectApi.removeMember(project._id, userId);
            showToast(`Removed @${username} from project`, 'info');
            onMembersUpdated();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to remove member', 'error');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                        Project Team ({members.length})
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Manage who has access to this project and their administrative permissions.
                    </p>
                </div>

                {canManageMembers ? (
                    <Button variant="primary" onClick={() => setModalOpen(true)}>
                        <UserPlus className="w-4 h-4" />
                        Add Member
                    </Button>
                ) : (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Admin only member management</span>
                    </div>
                )}
            </div>

            {/* Members Table */}
            <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800/80">
                            <tr>
                                <th className="px-5 py-3.5">User</th>
                                <th className="px-5 py-3.5">Current Role</th>
                                {canManageMembers && (
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {members.map((member) => {
                                const u = member.user || {};
                                const isProjectCreator =
                                    project?.createdBy === u._id ||
                                    project?.createdBy?._id === u._id;
                                const isUpdating = updatingId === u._id;

                                return (
                                    <tr
                                        key={u._id || Math.random()}
                                        className="hover:bg-slate-800/30 transition-colors"
                                    >
                                        {/* User info */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-xs text-indigo-300">
                                                    {u.avatar?.url ? (
                                                        <img
                                                            src={u.avatar.url}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        u.username?.substring(0, 2).toUpperCase() ||
                                                        'U'
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                                                        <span>{u.fullName || u.username}</span>
                                                        {isProjectCreator && (
                                                            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                                                                Owner
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-slate-400 text-[11px]">
                                                        @{u.username}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role / Role Selector */}
                                        <td className="px-5 py-4">
                                            {canManageMembers && !isProjectCreator ? (
                                                <select
                                                    value={member.role}
                                                    disabled={isUpdating}
                                                    onChange={(e) =>
                                                        handleRoleChange(u._id, e.target.value)
                                                    }
                                                    className="bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                                                >
                                                    <option value="member">Member</option>
                                                    <option value="project_admin">
                                                        Project Admin
                                                    </option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                <Badge variant={member.role}>
                                                    {member.role.replace('_', ' ')}
                                                </Badge>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        {canManageMembers && (
                                            <td className="px-5 py-4 text-right">
                                                {!isProjectCreator && (
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveMember(u._id, u.username)
                                                        }
                                                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                                        title="Remove member"
                                                    >
                                                        <UserMinus className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Member Modal */}
            <AddMemberModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAddMember={handleAddMember}
            />
        </div>
    );
};
