<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  nik: '',
  name: '',
  phoneNumber: '',
  email: '',
  birthDate: '',
});

const error = ref('');
const loading = ref(false);

const handleRegister = async () => {
  error.value = '';

  // Validation
  if (!formData.value.nik) {
    error.value = 'NIK wajib diisi.';
    return;
  }

  if (!/^\d{16}$/.test(formData.value.nik)) {
    error.value = 'NIK harus 16 digit angka.';
    return;
  }

  if (!formData.value.name) {
    error.value = 'Nama lengkap wajib diisi.';
    return;
  }

  if (!formData.value.birthDate) {
    error.value = 'Tanggal lahir wajib diisi.';
    return;
  }

  loading.value = true;

  try {
    await authStore.register({
      nik: formData.value.nik,
      name: formData.value.name,
      phoneNumber: formData.value.phoneNumber || null,
      email: formData.value.email || null,
      birthDate: formData.value.birthDate,
    });

    // Redirect to patient dashboard
    router.push('/patient/dashboard');
  } catch (err) {
    error.value = authStore.error || 'Registrasi gagal. Silakan coba lagi.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-pink-600 mb-2">
          Daftar SEFILA
        </h1>
        <p class="text-gray-600">Buat akun untuk mulai mendaftar skrining IVA Test</p>
      </div>

      <div class="card">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- NIK -->
          <div>
            <label for="nik" class="block text-sm font-semibold text-textPrimary mb-2">
              NIK <span class="text-red-500">*</span>
            </label>
            <input
              id="nik"
              type="text"
              v-model="formData.nik"
              required
              maxlength="16"
              class="input-field"
              placeholder="16 digit NIK"
            />
            <p class="mt-1 text-xs text-gray-500">
              Masukkan 16 digit Nomor Induk Kependudukan
            </p>
          </div>

          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-semibold text-textPrimary mb-2">
              Nama Lengkap <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              v-model="formData.name"
              required
              class="input-field"
              placeholder="Nama Lengkap Anda"
            />
          </div>

          <!-- Tanggal Lahir -->
          <div>
            <label for="birthDate" class="block text-sm font-semibold text-textPrimary mb-2">
              Tanggal Lahir <span class="text-red-500">*</span>
            </label>
            <input
              id="birthDate"
              type="date"
              v-model="formData.birthDate"
              required
              class="input-field"
            />
            <p class="mt-1 text-xs text-gray-500">
              Password Anda akan otomatis dibuat dari tanggal lahir (format: DDMMYYYY)
            </p>
          </div>

          <!-- Email (Optional) -->
          <div>
            <label for="email" class="block text-sm font-semibold text-textPrimary mb-2">
              Email <span class="text-gray-400">(Opsional)</span>
            </label>
            <input
              id="email"
              type="email"
              v-model="formData.email"
              class="input-field"
              placeholder="nama@email.com"
            />
          </div>

          <!-- No HP -->
          <div>
            <label for="phoneNumber" class="block text-sm font-semibold text-textPrimary mb-2">
              No. HP <span class="text-gray-400">(Opsional)</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              v-model="formData.phoneNumber"
              class="input-field"
              placeholder="081234567890"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-secondary w-full"
          >
            {{ loading ? 'Mendaftar...' : 'Daftar Sekarang' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Sudah punya akun?
            <RouterLink to="/login" class="text-secondary font-semibold hover:underline">
              Masuk
            </RouterLink>
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
