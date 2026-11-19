import api from "./axios"

export const noteApi = {
    getNotes: async (projectId) => {
        const response = await api.get(`/notes/${projectId}`)
        return response.data
    },

    getNoteById: async (projectId, noteId) => {
        const response = await api.get(`/notes/${projectId}/n/${noteId}`)
        return response.data
    },

    createNote: async (projectId, { content }) => {
        const response = await api.post(`/notes/${projectId}`, { content })
        return response.data
    },

    updateNote: async (projectId, noteId, { content }) => {
        const response = await api.put(`/notes/${projectId}/n/${noteId}`, { content })
        return response.data
    },

    deleteNote: async (projectId, noteId) => {
        const response = await api.delete(`/notes/${projectId}/n/${noteId}`)
        return response.data
    }
}
