import {
    ArrowRight,
    CheckCircle,
    CheckSquare,
    Clock,
    FileText,
    ListTodo,
    Users,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { noteApi } from '../api/note.api';
import { taskApi } from '../api/task.api';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MemberList } from '../components/members/MemberList';
import { NoteList } from '../components/notes/NoteList';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { useProject } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';

export const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const { project, members, userRole, loading: projectLoading, refreshProject } = useProject();
    const { showToast } = useToast();

    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    // Determine active view: overview | tasks | notes | members
    const pathname = location.pathname;
    const isTasksView = pathname.endsWith('/tasks');
    const isNotesView = pathname.endsWith('/notes');
    const isMembersView = pathname.endsWith('/members');
    const isOverview = !isTasksView && !isNotesView && !isMembersView;

    const fetchTasksAndNotes = useCallback(async () => {
        if (!projectId) return;
        setDataLoading(true);
        try {
            const [tasksRes, notesRes] = await Promise.all([
                taskApi.getTasks(projectId).catch(() => ({ data: [] })),
                noteApi.getNotes(projectId).catch(() => ({ data: [] })),
            ]);
            setTasks(tasksRes?.data || []);
            setNotes(notesRes?.data || []);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to load project contents', 'error');
        } finally {
            setDataLoading(false);
        }
    }, [projectId, showToast]);

    useEffect(() => {
        fetchTasksAndNotes();
    }, [fetchTasksAndNotes]);

    if (projectLoading) {
        return <LoadingSpinner text="Loading project details..." />;
    }

    if (!project) {
        return (
            <div className="text-center py-16 space-y-3">
                <h2 className="text-xl font-bold text-white">Project Not Found</h2>
                <p className="text-sm text-slate-400">
                    The requested project does not exist or you don't have access.
                </p>
                <Link to="/dashboard" className="text-sm text-indigo-400 hover:underline">
                    Return to All Projects
                </Link>
            </div>
        );
    }

    // Quick stats
    const todoCount = tasks.filter((t) => t.status === 'todo').length;
    const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
    const doneCount = tasks.filter((t) => t.status === 'done').length;
    const totalTasks = tasks.length;
    const completionPercentage = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            {/* Project Banner */}
            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Project Space
                            </span>
                            <Badge variant={userRole}>{userRole.replace('_', ' ')}</Badge>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            {project.name}
                        </h1>
                        {project.description && (
                            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                                {project.description}
                            </p>
                        )}
                    </div>

                    {/* Tab Navigation Shortcuts */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto text-xs">
                        <Link
                            to={`/projects/${projectId}`}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                isOverview
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Overview
                        </Link>
                        <Link
                            to={`/projects/${projectId}/tasks`}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                isTasksView
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Tasks ({totalTasks})
                        </Link>
                        <Link
                            to={`/projects/${projectId}/notes`}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                isNotesView
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Notes ({notes.length})
                        </Link>
                        <Link
                            to={`/projects/${projectId}/members`}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                isMembersView
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Team ({members.length})
                        </Link>
                    </div>
                </div>
            </div>

            {/* Render View Depending on route */}
            {dataLoading ? (
                <LoadingSpinner text="Loading project components..." />
            ) : isTasksView ? (
                <TaskBoard tasks={tasks} onTasksUpdated={fetchTasksAndNotes} />
            ) : isNotesView ? (
                <NoteList notes={notes} onNotesUpdated={fetchTasksAndNotes} />
            ) : isMembersView ? (
                <MemberList members={members} onMembersUpdated={refreshProject} />
            ) : (
                /* Overview View */
                <div className="space-y-6">
                    {/* Progress & Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-300 flex items-center justify-center border border-slate-500/20">
                                <ListTodo className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block font-medium">
                                    To Do
                                </span>
                                <span className="text-xl font-bold text-white">{todoCount}</span>
                            </div>
                        </div>

                        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-300 flex items-center justify-center border border-amber-500/20">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block font-medium">
                                    In Progress
                                </span>
                                <span className="text-xl font-bold text-white">
                                    {inProgressCount}
                                </span>
                            </div>
                        </div>

                        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-300 flex items-center justify-center border border-emerald-500/20">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block font-medium">
                                    Completed
                                </span>
                                <span className="text-xl font-bold text-white">{doneCount}</span>
                            </div>
                        </div>

                        <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-300 flex items-center justify-center border border-indigo-500/20">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block font-medium">
                                    Team Members
                                </span>
                                <span className="text-xl font-bold text-white">
                                    {members.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Overall Sprint Completion Bar */}
                    <div className="glass-card p-5 rounded-2xl">
                        <div className="flex items-center justify-between mb-2 text-xs">
                            <span className="font-semibold text-slate-300">Sprint Completion</span>
                            <span className="font-bold text-indigo-400">
                                {completionPercentage}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Two-column preview: Recent Tasks & Recent Notes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Tasks */}
                        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                                        <h3 className="text-sm font-bold text-white">
                                            Recent Tasks
                                        </h3>
                                    </div>
                                    <Link
                                        to={`/projects/${projectId}/tasks`}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        View Board <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                <div className="space-y-2">
                                    {tasks.length === 0 ? (
                                        <p className="text-xs text-slate-500 py-4 italic text-center">
                                            No tasks yet in this project.
                                        </p>
                                    ) : (
                                        tasks.slice(0, 4).map((task) => (
                                            <div
                                                key={task._id}
                                                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
                                            >
                                                <span className="font-medium text-slate-200 truncate pr-2">
                                                    {task.title}
                                                </span>
                                                <Badge variant={task.status}>
                                                    {task.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Notes */}
                        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-indigo-400" />
                                        <h3 className="text-sm font-bold text-white">
                                            Project Notes
                                        </h3>
                                    </div>
                                    <Link
                                        to={`/projects/${projectId}/notes`}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        View All Notes <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                <div className="space-y-2">
                                    {notes.length === 0 ? (
                                        <p className="text-xs text-slate-500 py-4 italic text-center">
                                            No notes created yet.
                                        </p>
                                    ) : (
                                        notes.slice(0, 3).map((note) => (
                                            <div
                                                key={note._id}
                                                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1.5"
                                            >
                                                <p className="text-slate-300 line-clamp-2 leading-relaxed">
                                                    {note.content}
                                                </p>
                                                <span className="text-[10px] text-slate-500 block">
                                                    By @{note.createdBy?.username || 'user'}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
