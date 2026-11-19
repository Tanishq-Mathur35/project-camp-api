import {
    ArrowRight,
    Calendar,
    Edit2,
    FolderKanban,
    MoreVertical,
    Trash2,
    Users,
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';

export const ProjectCard = ({ projectItem, onEdit, onDelete }) => {
    // projectItem shape from getProjects: { project: { _id, name, description, members, createdAt }, role }
    const project = projectItem.project || projectItem;
    const role = projectItem.role || 'member';
    const isAdmin = role === 'admin';

    const [menuOpen, setMenuOpen] = React.useState(false);

    const formattedDate = project.createdAt
        ? new Date(project.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : '';

    return (
        <div className="glass-card hover:border-indigo-500/40 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between group relative">
            <div>
                {/* Header: icon, title, role, actions */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors">
                            <FolderKanban className="w-5 h-5" />
                        </div>
                        <div>
                            <Link
                                to={`/projects/${project._id}`}
                                className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1"
                            >
                                {project.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant={role}>{role.replace('_', ' ')}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Admin options menu */}
                    {isAdmin && (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
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
                                    <div className="absolute right-0 mt-1 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-30 p-1">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setMenuOpen(false);
                                                onEdit(project);
                                            }}
                                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setMenuOpen(false);
                                                onDelete(project);
                                            }}
                                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 min-h-[2rem]">
                    {project.description || 'No description provided.'}
                </p>
            </div>

            {/* Footer: members & link */}
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>{project.members ?? 1} members</span>
                    </div>
                    {formattedDate && (
                        <div className="hidden sm:flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{formattedDate}</span>
                        </div>
                    )}
                </div>

                <Link
                    to={`/projects/${project._id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    Open <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
};
