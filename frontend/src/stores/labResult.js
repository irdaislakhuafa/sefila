import { defineStore } from 'pinia';
import api from '../services/api';

export const useLabResultStore = defineStore('labResult', {
    state: () => ({
        labResults: [],
        currentLabResult: null,
        loading: false,
        error: null,
    }),

    getters: {
        currentResult: (state) => state.currentLabResult,
    },

    actions: {
        async createLabResult(data) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.createLabResult(data);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal menyimpan hasil lab';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchLabResultByRegistration(registrationId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.getLabResultByRegistration(registrationId);
                this.currentLabResult = response.data.data;
                return response.data.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal memuat hasil lab';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchMyLabResults() {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.getMyLabResults();
                this.labResults = response.data.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal memuat hasil lab';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateLabResult(id, data) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.updateLabResult(id, data);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal memperbarui hasil lab';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});

