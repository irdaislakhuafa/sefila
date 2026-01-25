<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  nik: '',
  password: '',
});

const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    console.log('Attempting login with:', { nik: formData.value.nik });
    await authStore.login(formData.value);
    
    console.log('Login successful, redirecting...');
    // Redirect based on role
    if (authStore.isAdmin) {
      router.push('/admin/dashboard');
    } else {
      router.push('/patient/dashboard');
    }
  } catch (err) {
    console.error('Login error:', err);
    
    // Detailed error handling
    if (err.response) {
      // Server responded with error
      const status = err.response.status;
      const message = err.response.data?.message;
      
      if (status === 401) {
        error.value = message || 'NIK atau password salah.';
      } else if (status === 500) {
        error.value = 'Terjadi kesalahan di server. Silakan coba lagi.';
      } else {
        error.value = message || `Error ${status}: Gagal login.`;
      }
    } else if (err.request) {
      // Request made but no response
      error.value = '❌ Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:3001';
      console.error('Backend tidak merespon. Periksa apakah server berjalan.');
    } else {
      // Something else happened
      error.value = authStore.error || 'Terjadi kesalahan saat login.';
    }
    
    console.error('Error details:', {
      hasResponse: !!err.response,
      hasRequest: !!err.request,
      message: err.message
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-indigo-600 mb-2">
          Masuk ke SEFILA
        </h1>
        <p class="text-gray-600">Akses dashboard Anda untuk melihat informasi terkini</p>
      </div>

      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- NIK -->
          <div>
            <label for="nik" class="block text-sm font-semibold text-textPrimary mb-2">
              NIK
            </label>
            <input
              id="nik"
              type="text"
              v-model="formData.nik"
              required
              maxlength="16"
              class="input-field"
              placeholder="Contoh: 3374010101950001"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-semibold text-textPrimary mb-2">
              Password (Tanggal Lahir)
            </label>
            <input
              id="password"
              type="password"
              v-model="formData.password"
              required
              class="input-field"
              placeholder="Contoh: 15011990"
            />
            <p class="mt-1 text-xs text-gray-500">
              Format: DDMMYYYY (contoh: 15011990 untuk 15 Januari 1990)
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full"
          >
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Belum punya akun? Hubungi admin untuk registrasi.
          </p>
        </div>
      </div>

      <div class="mt-6 text-center">
        <RouterLink to="/" class="text-gray-600 hover:text-primary transition-colors">
          ← Kembali ke Beranda
        </RouterLink>
      </div>
    </div>
  </div>
</template>
