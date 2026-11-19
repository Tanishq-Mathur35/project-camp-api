import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth.api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('currentUser');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const checkAuth = useCallback(async () => {
        try {
            const res = await authApi.getCurrentUser();
            if (res?.data) {
                setUser(res.data);
                localStorage.setItem('currentUser', JSON.stringify(res.data));
            }
        } catch {
            // not logged in or token invalid
            setUser(null);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (credentials) => {
        try {
            const res = await authApi.login(credentials);
            const data = res?.data;
            if (data?.user) {
                setUser(data.user);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
            }
            if (data?.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }
            if (data?.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }
            showToast(res?.message || 'Logged in successfully!', 'success');
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to log in';
            showToast(msg, 'error');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const res = await authApi.register(userData);
            showToast(
                res?.message || 'Registered successfully! Please check your email.',
                'success',
            );
            return res?.data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to register';
            showToast(msg, 'error');
            throw err;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.warn('Logout error:', err);
        } finally {
            setUser(null);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            showToast('Logged out successfully', 'info');
        }
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                updateUser,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
