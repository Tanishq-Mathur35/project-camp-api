import { CheckSquare, Loader2, Plus, Square, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { taskApi } from '../../api/task.api';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';

export const SubtaskList = ({ projectId, taskId, subtasks = [], onSubtasksUpdated }) => {
    const { canManageTasks } = useProject();
    const { showToast } = useToast();
    const [newTitle, setNewTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loadingMap, setLoadingMap] = useState({});

    const handleToggle = async (subtask) => {
        const nextCompleted = !subtask.isCompleted;
        setLoadingMap((prev) => ({ ...prev, [subtask._id]: true }));
        try {
            await taskApi.updateSubtask(projectId, subtask._id, {
                isCompleted: nextCompleted,
            });
            onSubtasksUpdated();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update subtask', 'error');
        } finally {
            setLoadingMap((prev) => ({ ...prev, [subtask._id]: false }));
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        setIsAdding(true);
        try {
            await taskApi.createSubtask(projectId, taskId, { title: newTitle.trim() });
            setNewTitle('');
            showToast('Subtask added!', 'success');
            onSubtasksUpdated();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to add subtask', 'error');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (subTaskId) => {
        try {
            await taskApi.deleteSubtask(projectId, subTaskId);
            showToast('Subtask removed', 'info');
            onSubtasksUpdated();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete subtask', 'error');
        }
    };

    const completedCount = subtasks.filter((s) => s.isCompleted).length;
    const totalCount = subtasks.length;

    return (
        <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Subtasks ({completedCount}/{totalCount})
                </span>
                {totalCount > 0 && (
                    <span className="text-xs text-indigo-400 font-medium">
                        {Math.round((completedCount / totalCount) * 100)}% done
                    </span>
                )}
            </div>

            {/* Progress bar */}
            {totalCount > 0 && (
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    />
                </div>
            )}

            {/* Subtask items */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {subtasks.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-1">No subtasks added yet.</p>
                ) : (
                    subtasks.map((st) => {
                        const isLoading = !!loadingMap[st._id];
                        return (
                            <div
                                key={st._id}
                                className={`flex items-center justify-between p-2 rounded-xl text-xs border transition-all ${
                                    st.isCompleted
                                        ? 'bg-slate-900/40 border-slate-800 text-slate-400 line-through'
                                        : 'bg-slate-900/80 border-slate-800/80 text-slate-200'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleToggle(st)}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-indigo-400 shrink-0" />
                                    ) : st.isCompleted ? (
                                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                                    ) : (
                                        <Square className="w-4 h-4 text-slate-500 hover:text-slate-300 shrink-0" />
                                    )}
                                    <span className="break-all">{st.title}</span>
                                </button>

                                {canManageTasks && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(st._id)}
                                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors shrink-0 ml-2"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Subtask Form (Admin & Project Admin only per PRD) */}
            {canManageTasks && (
                <form onSubmit={handleAdd} className="flex gap-2 pt-1">
                    <input
                        type="text"
                        placeholder="Add a new subtask..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="flex-1 bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-1.5 text-xs transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        isLoading={isAdding}
                        disabled={!newTitle.trim()}
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                    </Button>
                </form>
            )}
        </div>
    );
};
