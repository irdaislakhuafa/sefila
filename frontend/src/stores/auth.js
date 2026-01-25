import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'ADMIN',
        isPatient: (state) => state.user?.role === 'PATIENT',
    },

    actions: {
        async register(userData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.register(userData);
                this.user = response.data.data.user;
                this.token = response.data.data.token;
                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('token', this.token);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Terjadi kesalahan saat registrasi';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                console.log('🔐 Auth store: Calling login API...');
                console.log('API endpoint:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api');

                const response = await api.login(credentials);

                console.log('✅ Login API response:', response.data);

                this.user = response.data.data.user;
                this.token = response.data.data.token;
                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('token', this.token);

                console.log('✅ User logged in:', this.user.name, '- Role:', this.user.role);

                return response.data;
            } catch (error) {
                console.error('❌ Login failed in auth store:', error);

                if (error.response) {
                    console.error('Server error response:', error.response.data);
                    this.error = error.response?.data?.message || 'Terjadi kesalahan saat login';
                } else if (error.request) {
                    console.error('No response from server');
                    this.error = 'Tidak dapat terhubung ke server';
                } else {
                    console.error('Error:', error.message);
                    this.error = 'Terjadi kesalahan saat login';
                }

                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchProfile() {
            try {
                const response = await api.getProfile();
                this.user = response.data.data;
                localStorage.setItem('user', JSON.stringify(this.user));
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});
