import api from "./axios"

export const authApi = {
    register: async (userData) => {
        const response = await api.post("/auth/register", userData)
        return response.data
    },

    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials)
        return response.data
    },

    logout: async () => {
        const response = await api.post("/auth/logout")
        return response.data
    },

    getCurrentUser: async () => {
        const response = await api.get("/auth/current-user")
        return response.data
    },

    changePassword: async (passwordData) => {
        const response = await api.post("/auth/change-password", passwordData)
        return response.data
    },

    forgotPassword: async (email) => {
        const response = await api.post("/auth/forgot-password", { email })
        return response.data
    },

    resetPassword: async (token, newPassword) => {
        const response = await api.post(`/auth/reset-password/${token}`, { newPassword })
        return response.data
    },

    verifyEmail: async (token) => {
        const response = await api.get(`/auth/verify-email/${token}`)
        return response.data
    },

    resendEmailVerification: async () => {
        const response = await api.post("/auth/resend-email-verification")
        return response.data
    },

    checkHealth: async () => {
        const response = await api.get("/healthcheck")
        return response.data
    }
}
