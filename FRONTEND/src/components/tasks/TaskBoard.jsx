import { ArrowLeft, ArrowRight, CheckCircle, Clock, ListTodo, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { taskApi } from '../../api/task.api';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';

export const TaskBoard = ({ tasks = [], onTasksUpdated }) => {
    const { project, canManageTasks } = useProject();
    const { showToast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [columnDefaultStatus, setColumnDefaultStatus] = useState('todo');

    const columns = [
        {
            id: 'todo',
            label: 'To Do',
            icon: ListTodo,
            badgeColor: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
            accent: 'border-t-slate-500',
        },
        {
            id: 'in_progress',
            label: 'In Progress',
            icon: Clock,
            badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
            accent: 'border-t-amber-500',
        },
        {
            id: 'done',
            label: 'Done',
            icon: CheckCircle,
            badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
            accent: 'border-t-emerald-500',
        },
    ];

    const filteredTasks = tasks.filter((t) => {
        return (
            t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.assignedTo?.username?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const handleCreateOrUpdate = async (formData) => {
        if (selectedTask) {
            await taskApi.updateTask(project._id, selectedTask._id, formData);
            showToast('Task updated successfully!', 'success');
        } else {
            await taskApi.createTask(project._id, formData);
            showToast('Task created successfully!', 'success');
        }
        onTasksUpdated();
    };

    const handleDelete = async (task) => {
        if (!window.confirm(`Delete task "${task.title}" and all its subtasks?`)) {
            return;
        }
        try {
            await taskApi.deleteTask(project._id, task._id);
            showToast('Task deleted successfully', 'success');
            onTasksUpdated();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete task', 'error');
        }
    };

    const handleStatusShift = async (task, newStatus) => {
        try {
            await taskApi.updateTask(project._id, task._id, { status: newStatus });
            showToast(`Task moved to ${newStatus.replace('_', ' ')}`, 'success');
            onTasksUpdated();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update status', 'error');
        }
    };

    const openNewTaskModal = (status = 'todo') => {
        setSelectedTask(null);
        setColumnDefaultStatus(status);
        setModalOpen(true);
    };

    const openEditModal = async (task) => {
        try {
            // Fetch full task data (with populated subtasks)
            const res = await taskApi.getTaskById(project._id, task._id);
            setSelectedTask(res?.data || task);
        } catch {
            setSelectedTask(task);
        }
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Search and Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-80">
                    <Input
                        placeholder="Search tasks or assignees..."
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {canManageTasks && (
                    <Button variant="primary" onClick={() => openNewTaskModal('todo')}>
                        <Plus className="w-4 h-4" />
                        Add Task
                    </Button>
                )}
            </div>

            {/* Kanban Board Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                {columns.map((col) => {
                    const ColIcon = col.icon;
                    const colTasks = filteredTasks.filter((t) => (t.status || 'todo') === col.id);

                    return (
                        <div
                            key={col.id}
                            className={`glass-panel rounded-2xl border-t-4 ${col.accent} p-4 flex flex-col min-h-[550px] shadow-lg`}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                                <div className="flex items-center gap-2">
                                    <ColIcon className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-bold text-white">
                                        {col.label}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${col.badgeColor}`}
                                    >
                                        {colTasks.length}
                                    </span>
                                </div>

                                {canManageTasks && (
                                    <button
                                        onClick={() => openNewTaskModal(col.id)}
                                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                        title={`Add task to ${col.label}`}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Tasks List */}
                            <div className="flex-1 space-y-3 overflow-y-auto max-h-[70vh] pr-1">
                                {colTasks.length === 0 ? (
                                    <div className="h-32 flex items-center justify-center border border-dashed border-slate-800/80 rounded-xl text-xs text-slate-500 italic">
                                        No tasks in {col.label.toLowerCase()}
                                    </div>
                                ) : (
                                    colTasks.map((task) => (
                                        <div key={task._id} className="relative group/card">
                                            <TaskCard
                                                task={task}
                                                onEdit={openEditModal}
                                                onDelete={handleDelete}
                                                onOpenDetails={openEditModal}
                                                onStatusChange={handleStatusShift}
                                            />

                                            {/* Quick Move Arrows */}
                                            {canManageTasks && (
                                                <div className="flex items-center justify-end gap-1 mt-1.5 px-1 opacity-80 group-hover/card:opacity-100 transition-opacity">
                                                    {col.id !== 'todo' && (
                                                        <button
                                                            onClick={() =>
                                                                handleStatusShift(
                                                                    task,
                                                                    col.id === 'done'
                                                                        ? 'in_progress'
                                                                        : 'todo',
                                                                )
                                                            }
                                                            className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-[10px] text-slate-300 hover:text-white flex items-center gap-1 transition-all"
                                                        >
                                                            <ArrowLeft className="w-3 h-3" /> Back
                                                        </button>
                                                    )}
                                                    {col.id !== 'done' && (
                                                        <button
                                                            onClick={() =>
                                                                handleStatusShift(
                                                                    task,
                                                                    col.id === 'todo'
                                                                        ? 'in_progress'
                                                                        : 'done',
                                                                )
                                                            }
                                                            className="px-2 py-1 bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 rounded-lg text-[10px] text-indigo-300 hover:text-white flex items-center gap-1 transition-all"
                                                        >
                                                            Move <ArrowRight className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Task Modal (Create, Edit & Subtasks) */}
            <TaskModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreateOrUpdate}
                task={selectedTask}
                initialStatus={columnDefaultStatus}
                onTaskUpdated={async () => {
                    if (selectedTask) {
                        const res = await taskApi.getTaskById(project._id, selectedTask._id);
                        setSelectedTask(res?.data || selectedTask);
                    }
                    onTasksUpdated();
                }}
            />
        </div>
    );
};
