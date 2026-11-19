import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { projectApi } from '../api/project.api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ projectId, children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjectData = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        try {
            const [projRes, membersRes] = await Promise.all([
                projectApi.getProjectById(projectId),
                projectApi.getProjectMembers(projectId).catch(() => ({ data: [] })),
            ]);

            setProject(projRes?.data || null);
            setMembers(membersRes?.data || []);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to load project';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [projectId, showToast]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    // Compute current user's role in this project
    const currentMember = members.find((m) => {
        const memberUserId = m.user?._id || m.user;
        const currentUserId = user?._id;
        return (
            memberUserId && currentUserId && memberUserId.toString() === currentUserId.toString()
        );
    });

    // Fallback to project.createdBy if admin
    const isCreator = project?.createdBy === user?._id || project?.createdBy?._id === user?._id;
    const userRole = currentMember?.role || (isCreator ? 'admin' : 'member');

    const isAdmin = userRole === 'admin';
    const isProjectAdmin = userRole === 'project_admin';
    const isMember = userRole === 'member';
    const canManageTasks = isAdmin || isProjectAdmin;
    const canManageNotes = isAdmin;
    const canManageMembers = isAdmin;

    return (
        <ProjectContext.Provider
            value={{
                project,
                members,
                loading,
                userRole,
                isAdmin,
                isProjectAdmin,
                isMember,
                canManageTasks,
                canManageNotes,
                canManageMembers,
                refreshProject: fetchProjectData,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    return context || {};
};
