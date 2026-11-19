import { ExternalLink, FileText, Save, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { SubtaskList } from './SubtaskList';

export const TaskModal = ({
    isOpen,
    onClose,
    onSubmit,
    task = null,
    initialStatus = 'todo',
    onTaskUpdated,
}) => {
    const { project, members, canManageTasks } = useProject();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: initialStatus,
        assignedTo: '',
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'todo',
                assignedTo: task.assignedTo?._id || task.assignedTo || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: initialStatus,
                assignedTo: '',
            });
        }
        setSelectedFiles([]);
        setError('');
    }, [task, initialStatus, isOpen]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setError('Task title is required');
            return;
        }

        setIsLoading(true);
        try {
            if (selectedFiles.length > 0) {
                // Send multipart form data
                const data = new FormData();
                data.append('title', formData.title);
                if (formData.description) data.append('description', formData.description);
                data.append('status', formData.status);
                if (formData.assignedTo) data.append('assignedTo', formData.assignedTo);

                selectedFiles.forEach((file) => {
                    data.append('attachments', file);
                });

                await onSubmit(data);
            } else {
                await onSubmit(formData);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save task');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={task ? 'Task Details & Editing' : 'Create New Task'}
            description={
                task
                    ? `Manage task attributes, subtasks, and files`
                    : `Add a task to ${project?.name}`
            }
            maxWidth="max-w-2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                        {error}
                    </div>
                )}

                <Input
                    label="Title"
                    placeholder="e.g. Implement authentication flow"
                    value={formData.title}
                    disabled={!canManageTasks}
                    onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value });
                        if (error) setError('');
                    }}
                    required
                />

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Details, requirements, and acceptance criteria..."
                        value={formData.description}
                        disabled={!canManageTasks}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-60"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Status select */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            disabled={!canManageTasks}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-60"
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    {/* Assigned To select */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                            Assignee
                        </label>
                        <select
                            value={formData.assignedTo}
                            disabled={!canManageTasks}
                            onChange={(e) =>
                                setFormData({ ...formData, assignedTo: e.target.value })
                            }
                            className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-60"
                        >
                            <option value="">Unassigned</option>
                            {members.map((m) => {
                                const u = m.user || {};
                                return (
                                    <option key={u._id} value={u._id}>
                                        {u.fullName ? `${u.fullName} (@${u.username})` : u.username}{' '}
                                        ({m.role})
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {/* Existing Attachments */}
                {task?.attachments?.length > 0 && (
                    <div className="pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Attached Files ({task.attachments.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {task.attachments.map((file, idx) => (
                                <a
                                    key={idx}
                                    href={file.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200 hover:text-indigo-300 hover:border-indigo-500/40 transition-all truncate"
                                >
                                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <span className="truncate flex-1">
                                        {file.url.split('/').pop()}
                                    </span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* File Attachments Upload (Only on create or if canManageTasks) */}
                {!task && canManageTasks && (
                    <div className="flex flex-col gap-1.5 pt-1">
                        <label className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                            Upload Attachments (Optional)
                        </label>
                        <div className="border border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-indigo-500 transition-colors bg-slate-900/40">
                            <input
                                type="file"
                                multiple
                                id="file-upload"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center gap-1.5"
                            >
                                <Upload className="w-6 h-6 text-indigo-400" />
                                <span className="text-xs text-slate-300 font-medium">
                                    Click to select files
                                </span>
                                <span className="text-[11px] text-slate-500">
                                    Max size 1MB each
                                </span>
                            </label>
                            {selectedFiles.length > 0 && (
                                <div className="mt-2 text-xs text-emerald-400 font-medium">
                                    {selectedFiles.length} file(s) selected
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Subtasks Section (available when task exists) */}
                {task && (
                    <div className="pt-2 border-t border-slate-800">
                        <SubtaskList
                            projectId={project?._id}
                            taskId={task._id}
                            subtasks={task.subtasks || []}
                            onSubtasksUpdated={onTaskUpdated}
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800/80">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        Close
                    </Button>
                    {canManageTasks && (
                        <Button type="submit" variant="primary" isLoading={isLoading}>
                            <Save className="w-4 h-4" />
                            {task ? 'Save Changes' : 'Create Task'}
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
};
