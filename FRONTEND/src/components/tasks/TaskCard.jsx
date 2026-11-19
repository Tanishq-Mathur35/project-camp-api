import { CheckSquare, Edit2, MoreVertical, Paperclip, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useProject } from '../../context/ProjectContext';

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange, onOpenDetails }) => {
    const { canManageTasks } = useProject();
    const [menuOpen, setMenuOpen] = useState(false);

    const subtasksCount = task.subtasks?.length || 0;
    const completedSubtasks = task.subtasks?.filter((s) => s.isCompleted)?.length || 0;
    const attachmentsCount = task.attachments?.length || 0;

    return (
        <div className="bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/40 rounded-2xl p-4 transition-all duration-200 shadow-md group relative flex flex-col justify-between">
            <div>
                {/* Header: title & options */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <button
                        onClick={() => onOpenDetails(task)}
                        className="text-left font-bold text-sm text-slate-100 hover:text-indigo-300 transition-colors line-clamp-2"
                    >
                        {task.title}
                    </button>

                    {canManageTasks && (
                        <div className="relative shrink-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(!menuOpen);
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>

                            {menuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-20"
                                        onClick={() => setMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-1 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-30 p-1 text-xs">
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onEdit(task);
                                            }}
                                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onDelete(task);
                                            }}
                                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Description snippet */}
                {task.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>
                )}
            </div>

            {/* Footer info: Assignee, Subtasks, Attachments, Status shift */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-2">
                {/* Assignee */}
                <div className="flex items-center gap-1.5">
                    {task.assignedTo ? (
                        <div
                            className="flex items-center gap-1.5"
                            title={`Assigned to ${task.assignedTo.fullName || task.assignedTo.username}`}
                        >
                            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-[10px] text-indigo-300 font-bold">
                                {task.assignedTo.avatar?.url ? (
                                    <img
                                        src={task.assignedTo.avatar.url}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    task.assignedTo.username?.substring(0, 2).toUpperCase()
                                )}
                            </div>
                            <span className="text-[11px] text-slate-300 max-w-[80px] truncate">
                                {task.assignedTo.username}
                            </span>
                        </div>
                    ) : (
                        <span className="text-[11px] text-slate-500 italic">Unassigned</span>
                    )}
                </div>

                {/* Badges / Metrics */}
                <div className="flex items-center gap-2.5">
                    {subtasksCount > 0 && (
                        <div
                            className={`flex items-center gap-1 text-[11px] ${
                                completedSubtasks === subtasksCount
                                    ? 'text-emerald-400'
                                    : 'text-slate-400'
                            }`}
                            title={`${completedSubtasks} of ${subtasksCount} subtasks completed`}
                        >
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>
                                {completedSubtasks}/{subtasksCount}
                            </span>
                        </div>
                    )}

                    {attachmentsCount > 0 && (
                        <div
                            className="flex items-center gap-1 text-[11px] text-indigo-400"
                            title={`${attachmentsCount} attachment(s)`}
                        >
                            <Paperclip className="w-3.5 h-3.5" />
                            <span>{attachmentsCount}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
