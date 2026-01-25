import { defineStore } from 'pinia';
import api from '../services/api';

export const useStatsStore = defineStore('stats', {
    state: () => ({
        dashboardStats: null,
        patientDistribution: [],
        monthlyTrends: [],
        kelurahanStats: null,
        loading: false,
        error: null,
    }),

    actions: {
        async fetchDashboardStats() {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.getDashboardStats();
                this.dashboardStats = response.data.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal memuat statistik';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchPatientDistribution() {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.getPatientDistribution();
                this.patientDistribution = response.data.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal memuat data sebaran pasien';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchMonthlyTrends(year) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.getMonthlyTrends({ year });
                this.monthlyTrends = response.data.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal memuat tren bulanan';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchKelurahanStats() {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.getKelurahanStats();
                this.kelurahanStats = response.data.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Gagal memuat statistik kelurahan';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
