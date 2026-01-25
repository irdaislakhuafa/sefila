<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ref } from 'vue';

const authStore = useAuthStore();
const route = useRoute();
const mobileMenuOpen = ref(false);

const logout = () => {
  authStore.logout();
  window.location.href = '/';
};
</script>

<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">S</span>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-xl text-textPrimary leading-tight">SEFILA</span>
            <span class="text-xs text-gray-500 leading-tight">Puskesmas Bugangan</span>
          </div>
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <RouterLink 
            v-if="!authStore.isAuthenticated" 
            to="/" 
            class="text-textPrimary hover:text-primary transition-colors font-medium"
          >
            Beranda
          </RouterLink>
          
          <RouterLink 
            v-if="authStore.isPatient" 
            to="/patient/dashboard" 
            class="text-textPrimary hover:text-primary transition-colors font-medium"
          >
            Dashboard
          </RouterLink>
          
          <RouterLink 
            v-if="authStore.isPatient" 
            to="/patient/hasil" 
            class="text-textPrimary hover:text-primary transition-colors font-medium"
          >
            Hasil Lab
          </RouterLink>
          
          <RouterLink 
            v-if="authStore.isAdmin" 
            to="/admin/dashboard" 
            class="text-textPrimary hover:text-primary transition-colors font-medium"
          >
            Dashboard
          </RouterLink>
          
          <RouterLink 
            v-if="authStore.isAdmin" 
            to="/admin/users" 
            class="text-textPrimary hover:text-primary transition-colors font-medium"
          >
            Manajemen User
          </RouterLink>
          
          <RouterLink 
            v-if="authStore.isAdmin" 
            to="/admin/pendaftaran" 
            class="text-textPrimary hover:text-primary transition-colors font-medium"
          >
            Pendaftaran
          </RouterLink>

          <!-- Auth Buttons -->
          <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-4">
            <RouterLink to="/login" class="text-primary hover:text-primary-600 font-semibold">
              Masuk
            </RouterLink>
          </div>

          <!-- User Menu -->
          <div v-else class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
            <button @click="logout" class="text-red-500 hover:text-red-600 font-semibold">
              Keluar
            </button>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen" 
          class="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              v-if="!mobileMenuOpen" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path 
              v-else 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t">
        <div class="flex flex-col space-y-4">
          <RouterLink 
            v-if="!authStore.isAuthenticated" 
            to="/" 
            class="text-textPrimary hover:text-primary transition-colors font-medium"
            @click="mobileMenuOpen = false"
          >
            Beranda
          </RouterLink>
          
          <RouterLink 
            v-if="authStore.isPatient" 
            to="/patient/dashboard" 
            class="text-textPrimary hover:text-primary transition-colors font-medium"
            @click="mobileMenuOpen = false"
          >
            Dashboard
          </RouterLink>
          
          <RouterLink 
            v-if="authStore.isPatient" 
            to="/patient/hasil" 
            class="text-textPrimary hover:text-primary transition-colors font-medium"
            @click="mobileMenuOpen = false"
          >
            Hasil Lab
          </RouterLink>
          
          <RouterLink 
            v-if="authStore.isAdmin" 
            to="/admin/dashboard" 
            class="text-textPrimary hover:text-primary transition-colors font-medium"
            @click="mobileMenuOpen = false"
          >
            Dashboard
          </RouterLink>
          
          <RouterLink 
            v-if="authStore.isAdmin" 
            to="/admin/users" 
            class="text-textPrimary hover:text-primary transition-colors font-medium"
            @click="mobileMenuOpen = false"
          >
            Manajemen User
          </RouterLink>
          
          <RouterLink 
            v-if="authStore.isAdmin" 
            to="/admin/pendaftaran" 
            class="text-textPrimary hover:text-primary transition-colors font-medium"
            @click="mobileMenuOpen = false"
          >
            Pendaftaran
          </RouterLink>

          <div v-if="!authStore.isAuthenticated" class="flex flex-col space-y-2 pt-4 border-t">
            <RouterLink to="/login" class="btn-primary text-center">
              Masuk
            </RouterLink>
          </div>

          <div v-else class="flex flex-col space-y-2 pt-4 border-t">
            <div class="text-sm font-medium text-gray-700">{{ authStore.user?.name }}</div>
            <button @click="logout" class="text-red-500 hover:text-red-600 font-semibold text-left">
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
