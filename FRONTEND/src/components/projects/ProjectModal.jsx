import { FolderPlus, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';

export const ProjectModal = ({ isOpen, onClose, onSubmit, project = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
            });
        } else {
            setFormData({ name: '', description: '' });
        }
        setError('');
    }, [project, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Project name is required');
            return;
        }

        setIsLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save project');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={project ? 'Edit Project' : 'Create New Project'}
            description={
                project
                    ? 'Update project name and details'
                    : 'Add a new collaborative project space'
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                        {error}
                    </div>
                )}

                <Input
                    label="Project Name"
                    placeholder="e.g. Website Redesign, Mobile App v2"
                    value={formData.name}
                    onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
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
                        placeholder="Brief overview of project goals and objectives..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isLoading}>
                        {project ? (
                            <Save className="w-4 h-4" />
                        ) : (
                            <FolderPlus className="w-4 h-4" />
                        )}
                        {project ? 'Update Project' : 'Create Project'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
