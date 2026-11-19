import api from "./axios"

export const projectApi = {
    getProjects: async () => {
        const response = await api.get("/projects")
        return response.data
    },

    getProjectById: async (projectId) => {
        const response = await api.get(`/projects/${projectId}`)
        return response.data
    },

    createProject: async (projectData) => {
        const response = await api.post("/projects", projectData)
        return response.data
    },

    updateProject: async (projectId, projectData) => {
        const response = await api.put(`/projects/${projectId}`, projectData)
        return response.data
    },

    deleteProject: async (projectId) => {
        const response = await api.delete(`/projects/${projectId}`)
        return response.data
    },

    getProjectMembers: async (projectId) => {
        const response = await api.get(`/projects/${projectId}/members`)
        return response.data
    },

    addMember: async (projectId, { email, role }) => {
        const response = await api.post(`/projects/${projectId}/members`, { email, role })
        return response.data
    },

    updateMemberRole: async (projectId, userId, role) => {
        const response = await api.put(`/projects/${projectId}/members/${userId}`, { role })
        return response.data
    },

    removeMember: async (projectId, userId) => {
        const response = await api.delete(`/projects/${projectId}/members/${userId}`)
        return response.data
    }
}
