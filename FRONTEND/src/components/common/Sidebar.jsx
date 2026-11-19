import {
    CheckSquare,
    FileText,
    FolderKanban,
    LayoutDashboard,
    Settings,
    ShieldAlert,
    Users,
} from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { Badge } from './Badge';

export const Sidebar = () => {
    const { projectId } = useParams();
    const { project, userRole, loading } = useProject();

    const navItemClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isActive
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
        }`;

    return (
        <aside className="w-64 border-r border-slate-800/80 bg-slate-950/60 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
            {/* Current Project Info (if on project page) */}
            {projectId && (
                <div className="p-4 border-b border-slate-800/80">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Active Project
                        </span>
                        {userRole && <Badge variant={userRole}>{userRole.replace('_', ' ')}</Badge>}
                    </div>
                    <h2 className="text-sm font-bold text-white truncate leading-tight">
                        {loading ? 'Loading...' : project?.name || 'Project'}
                    </h2>
                    {project?.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {project.description}
                        </p>
                    )}
                </div>
            )}

            {/* Navigation links */}
            <div className="p-3 space-y-1 flex-1">
                {projectId ? (
                    <>
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Project Menu
                        </div>
                        <NavLink to={`/projects/${projectId}`} end className={navItemClass}>
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Overview</span>
                        </NavLink>
                        <NavLink to={`/projects/${projectId}/tasks`} className={navItemClass}>
                            <CheckSquare className="w-4 h-4" />
                            <span>Tasks & Subtasks</span>
                        </NavLink>
                        <NavLink to={`/projects/${projectId}/notes`} className={navItemClass}>
                            <FileText className="w-4 h-4" />
                            <span>Project Notes</span>
                        </NavLink>
                        <NavLink to={`/projects/${projectId}/members`} className={navItemClass}>
                            <Users className="w-4 h-4" />
                            <span>Team Members</span>
                        </NavLink>

                        <div className="pt-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            General
                        </div>
                    </>
                ) : null}

                <NavLink to="/dashboard" end className={navItemClass}>
                    <FolderKanban className="w-4 h-4" />
                    <span>All Projects</span>
                </NavLink>
                <NavLink to="/settings" className={navItemClass}>
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                </NavLink>
            </div>

            {/* Footer / Role indicator */}
            {projectId && userRole && (
                <div className="p-3 m-3 rounded-xl border border-slate-800/80 bg-slate-900/40 text-xs text-slate-400">
                    <div className="flex items-center gap-2 mb-1 text-slate-300 font-semibold">
                        <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Role: {userRole.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                        {userRole === 'admin'
                            ? 'Full project administration & permissions.'
                            : userRole === 'project_admin'
                              ? 'Can manage tasks and subtasks.'
                              : 'Can view project & toggle subtask status.'}
                    </p>
                </div>
            )}
        </aside>
    );
};
