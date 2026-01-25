import { defineStore } from 'pinia';
import api from '../services/api';

export const useRegistrationStore = defineStore('registration', {
    state: () => ({
        registrations: [],
        myRegistrations: [],
        currentRegistration: null,
        loading: false,
        error: null,
    }),

    actions: {
        async createRegistration(data) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.createRegistration(data);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal membuat pendaftaran';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchAllRegistrations(filters = {}) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.getAllRegistrations(filters);
                this.registrations = response.data.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal memuat data pendaftaran';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchMyRegistrations() {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.getMyRegistrations();
                this.myRegistrations = response.data.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal memuat data pendaftaran';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchRegistrationById(id) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.getRegistrationById(id);
                this.currentRegistration = response.data.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal memuat detail pendaftaran';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateStatus(id, data) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.updateRegistrationStatus(id, data);
                // Update in list if exists
                const index = this.registrations.findIndex(r => r.id === id);
                if (index !== -1) {
                    this.registrations[index] = response.data.data;
                }
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal memperbarui status';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async verifyArrival(id) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.verifyArrival(id);
                // Update in list if exists
                const index = this.registrations.findIndex(r => r.id === id);
                if (index !== -1) {
                    this.registrations[index] = response.data.data;
                }
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal memverifikasi kedatangan';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
