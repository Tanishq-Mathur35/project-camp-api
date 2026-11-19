import { FolderKanban, FolderPlus, Search, Shield, Sparkles, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { projectApi } from '../api/project.api';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/common/Input';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectModal } from '../components/projects/ProjectModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const DashboardPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [projectsList, setProjectsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all'); // all | admin | member

    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const res = await projectApi.getProjects();
            setProjectsList(res?.data || []);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to load projects', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleCreateOrUpdate = async (formData) => {
        if (editingProject) {
            const res = await projectApi.updateProject(editingProject._id, formData);
            showToast('Project updated successfully!', 'success');
            fetchProjects();
            return res;
        } else {
            const res = await projectApi.createProject(formData);
            showToast('Project created successfully!', 'success');
            fetchProjects();
            return res;
        }
    };

    const handleDelete = async (project) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
            )
        ) {
            return;
        }
        try {
            await projectApi.deleteProject(project._id);
            showToast('Project deleted successfully', 'success');
            fetchProjects();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete project', 'error');
        }
    };

    // Filter projects
    const filteredProjects = projectsList.filter((item) => {
        const proj = item.project || item;
        const role = item.role || 'member';
        const matchesSearch =
            proj.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            proj.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole =
            filterRole === 'all' ||
            (filterRole === 'admin' && role === 'admin') ||
            (filterRole === 'member' && (role === 'member' || role === 'project_admin'));

        return matchesSearch && matchesRole;
    });

    // Stats
    const totalCount = projectsList.length;
    const adminCount = projectsList.filter((p) => p.role === 'admin').length;
    const memberCount = totalCount - adminCount;

    return (
        <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Banner / Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">
                            Welcome back, {user?.fullName || user?.username}!
                        </h1>
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        Organize tasks, manage sprint notes, and coordinate team members.
                    </p>
                </div>

                <Button
                    variant="primary"
                    onClick={() => {
                        setEditingProject(null);
                        setModalOpen(true);
                    }}
                    className="self-start md:self-auto"
                >
                    <FolderPlus className="w-4 h-4" />
                    Create Project
                </Button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                        <FolderKanban className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Total Projects
                        </p>
                        <p className="text-2xl font-bold text-white mt-0.5">{totalCount}</p>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Administered
                        </p>
                        <p className="text-2xl font-bold text-white mt-0.5">{adminCount}</p>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Team Member In
                        </p>
                        <p className="text-2xl font-bold text-white mt-0.5">{memberCount}</p>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:w-80">
                    <Input
                        placeholder="Search projects..."
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs self-stretch sm:self-auto">
                    <button
                        onClick={() => setFilterRole('all')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            filterRole === 'all'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        All ({totalCount})
                    </button>
                    <button
                        onClick={() => setFilterRole('admin')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            filterRole === 'admin'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Admin ({adminCount})
                    </button>
                    <button
                        onClick={() => setFilterRole('member')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            filterRole === 'member'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Member ({memberCount})
                    </button>
                </div>
            </div>

            {/* Project Grid */}
            {loading ? (
                <LoadingSpinner text="Loading projects..." />
            ) : filteredProjects.length === 0 ? (
                <EmptyState
                    title={searchQuery ? 'No matching projects' : 'No projects yet'}
                    description={
                        searchQuery
                            ? 'Try adjusting your search criteria or clear filters.'
                            : 'Create your first project space to start collaborating on tasks and notes.'
                    }
                    action={
                        !searchQuery && (
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setEditingProject(null);
                                    setModalOpen(true);
                                }}
                            >
                                <FolderPlus className="w-4 h-4" />
                                Create New Project
                            </Button>
                        )
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredProjects.map((item) => (
                        <ProjectCard
                            key={item.project?._id || item._id}
                            projectItem={item}
                            onEdit={(proj) => {
                                setEditingProject(proj);
                                setModalOpen(true);
                            }}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Create / Edit Project Modal */}
            <ProjectModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreateOrUpdate}
                project={editingProject}
            />
        </div>
    );
};
