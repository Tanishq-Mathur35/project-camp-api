import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // sends cookies for authentication
    headers: {
        "Content-Type": "application/json",
    },
})

// Attach token from localStorage if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Intercept 401 errors and attempt token refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/register") &&
            !originalRequest.url?.includes("/auth/refresh-token")
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return api(originalRequest)
                    })
                    .catch((err) => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const storedRefreshToken = localStorage.getItem("refreshToken")
                const res = await axios.post(
                    `${API_BASE_URL}/auth/refresh-token`,
                    { refreshToken: storedRefreshToken },
                    { withCredentials: true }
                )

                const newAccessToken = res.data?.data?.accessToken
                const newRefreshToken = res.data?.data?.refreshToken

                if (newAccessToken) {
                    localStorage.setItem("accessToken", newAccessToken)
                }
                if (newRefreshToken) {
                    localStorage.setItem("refreshToken", newRefreshToken)
                }

                api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
                processQueue(null, newAccessToken)

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                localStorage.removeItem("currentUser")
                if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                    window.location.href = "/login"
                }
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default api
