import { FileText, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const NoteModal = ({ isOpen, onClose, onSubmit, note = null }) => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (note) {
            setContent(note.content || '');
        } else {
            setContent('');
        }
        setError('');
    }, [note, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Note content is required');
            return;
        }

        setIsLoading(true);
        try {
            await onSubmit({ content: content.trim() });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save note');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={note ? 'Edit Project Note' : 'Create Project Note'}
            description="Notes are visible to all project team members"
            maxWidth="max-w-xl"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                        Note Content
                    </label>
                    <textarea
                        rows={6}
                        placeholder="Document project architecture, meeting minutes, sprint decisions, or team guidelines..."
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            if (error) setError('');
                        }}
                        className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-slate-100 placeholder-slate-500 rounded-xl p-3.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        required
                    />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isLoading}>
                        {note ? <Save className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        {note ? 'Update Note' : 'Save Note'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
