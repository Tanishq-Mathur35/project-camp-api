import { Calendar, Edit2, FileText, Lock, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { noteApi } from '../../api/note.api';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { NoteModal } from './NoteModal';

export const NoteList = ({ notes = [], onNotesUpdated }) => {
    const { project, canManageNotes } = useProject();
    const { showToast } = useToast();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    const handleCreateOrUpdate = async (formData) => {
        if (selectedNote) {
            await noteApi.updateNote(project._id, selectedNote._id, formData);
            showToast('Note updated successfully', 'success');
        } else {
            await noteApi.createNote(project._id, formData);
            showToast('Note created successfully', 'success');
        }
        onNotesUpdated();
    };

    const handleDelete = async (note) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await noteApi.deleteNote(project._id, note._id);
            showToast('Note deleted', 'info');
            onNotesUpdated();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete note', 'error');
        }
    };

    return (
        <div className="space-y-6">
            {/* Top action row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Project Notes</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Important documentation, sprint logs, and team architectural notes.
                    </p>
                </div>

                {canManageNotes ? (
                    <Button
                        variant="primary"
                        onClick={() => {
                            setSelectedNote(null);
                            setModalOpen(true);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        Add Note
                    </Button>
                ) : (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Admin only note creation</span>
                    </div>
                )}
            </div>

            {/* Notes Grid / List */}
            {notes.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="No notes yet"
                    description={
                        canManageNotes
                            ? 'Keep everyone on the same page by documenting key decisions and meeting notes.'
                            : 'No notes have been added to this project yet.'
                    }
                    action={
                        canManageNotes && (
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setSelectedNote(null);
                                    setModalOpen(true);
                                }}
                            >
                                <Plus className="w-4 h-4" />
                                Create First Note
                            </Button>
                        )
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notes.map((note) => {
                        const creator = note.createdBy || {};
                        const formattedDate = note.createdAt
                            ? new Date(note.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                              })
                            : '';

                        return (
                            <div
                                key={note._id}
                                className="glass-card hover:border-indigo-500/30 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200"
                            >
                                <div>
                                    {/* Note header: Creator & actions */}
                                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800/80">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-xs font-bold text-indigo-300">
                                                {creator.avatar?.url ? (
                                                    <img
                                                        src={creator.avatar.url}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    creator.username
                                                        ?.substring(0, 2)
                                                        .toUpperCase() || 'U'
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-xs font-semibold text-slate-200 block">
                                                    @{creator.username || 'user'}
                                                </span>
                                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{formattedDate}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Admin actions menu */}
                                        {canManageNotes && (
                                            <div className="relative">
                                                <button
                                                    onClick={() =>
                                                        setActiveMenuId(
                                                            activeMenuId === note._id
                                                                ? null
                                                                : note._id,
                                                        )
                                                    }
                                                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>

                                                {activeMenuId === note._id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-20"
                                                            onClick={() => setActiveMenuId(null)}
                                                        />
                                                        <div className="absolute right-0 mt-1 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-30 p-1 text-xs">
                                                            <button
                                                                onClick={() => {
                                                                    setActiveMenuId(null);
                                                                    setSelectedNote(note);
                                                                    setModalOpen(true);
                                                                }}
                                                                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />{' '}
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setActiveMenuId(null);
                                                                    handleDelete(note);
                                                                }}
                                                                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />{' '}
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Note Content */}
                                    <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                                        {note.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Note Modal */}
            <NoteModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreateOrUpdate}
                note={selectedNote}
            />
        </div>
    );
};
