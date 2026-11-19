import api from "./axios"

export const taskApi = {
    getTasks: async (projectId) => {
        const response = await api.get(`/tasks/${projectId}`)
        return response.data
    },

    getTaskById: async (projectId, taskId) => {
        const response = await api.get(`/tasks/${projectId}/t/${taskId}`)
        return response.data
    },

    createTask: async (projectId, taskData) => {
        // If taskData contains files/attachments, send multipart/form-data
        if (taskData instanceof FormData) {
            const response = await api.post(`/tasks/${projectId}`, taskData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return response.data
        }
        const response = await api.post(`/tasks/${projectId}`, taskData)
        return response.data
    },

    updateTask: async (projectId, taskId, taskData) => {
        const response = await api.put(`/tasks/${projectId}/t/${taskId}`, taskData)
        return response.data
    },

    deleteTask: async (projectId, taskId) => {
        const response = await api.delete(`/tasks/${projectId}/t/${taskId}`)
        return response.data
    },

    createSubtask: async (projectId, taskId, { title }) => {
        const response = await api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, { title })
        return response.data
    },

    updateSubtask: async (projectId, subTaskId, subtaskData) => {
        const response = await api.put(`/tasks/${projectId}/st/${subTaskId}`, subtaskData)
        return response.data
    },

    deleteSubtask: async (projectId, subTaskId) => {
        const response = await api.delete(`/tasks/${projectId}/st/${subTaskId}`)
        return response.data
    }
}
