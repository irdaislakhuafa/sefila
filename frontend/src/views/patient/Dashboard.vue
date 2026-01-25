<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useRegistrationStore } from '../../stores/registration';
import StatusBadge from '../../components/StatusBadge.vue';
import html2canvas from 'html2canvas';

const router = useRouter();
const authStore = useAuthStore();
const registrationStore = useRegistrationStore();

const loading = ref(true);
const registrationTableRef = ref(null);

onMounted(async () => {
  try {
    await registrationStore.fetchMyRegistrations();
  } catch (error) {
    console.error('Failed to load registrations:', error);
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Export registrations to PNG
const exportRegistrations = async () => {
  if (!registrationTableRef.value) return;
  
  try {
    const canvas = await html2canvas(registrationTableRef.value, {
      backgroundColor: '#ffffff',
      scale: 2
    });
    
    const link = document.createElement('a');
    link.download = `riwayat-pendaftaran-${authStore.user?.name || 'pasien'}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to export:', error);
    alert('Gagal mengexport data');
  }
};
</script>

<template>
  <div class="min-h-screen bg-background py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-textPrimary mb-2">
          Selamat Datang, {{ authStore.user?.name }}
        </h1>
        <p class="text-gray-600">Dashboard Pasien - Informasi pendaftaran dan hasil pemeriksaan Anda</p>
      </div>

      <!-- Quick Actions -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="card cursor-pointer hover:shadow-2xl transition-all" @click="router.push('/patient/daftar')">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 gradient-primary rounded-lg flex items-center justify-center text-3xl">
              📝
            </div>
            <div>
              <h3 class="text-xl font-semibold text-textPrimary mb-1">Daftar IVA Test</h3>
              <p class="text-gray-600 text-sm">Buat pendaftaran baru untuk skrining</p>
            </div>
          </div>
        </div>

        <div class="card cursor-pointer hover:shadow-2xl transition-all" @click="router.push('/patient/hasil')">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 gradient-secondary rounded-lg flex items-center justify-center text-3xl">
              📊
            </div>
            <div>
              <h3 class="text-xl font-semibold text-textPrimary mb-1">Lihat Hasil Lab</h3>
              <p class="text-gray-600 text-sm">Akses hasil pemeriksaan Anda</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Registrations List -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-textPrimary">Riwayat Pendaftaran</h2>
          <button 
            v-if="registrationStore.myRegistrations.length > 0"
            @click="exportRegistrations" 
            class="btn-outline flex items-center gap-2"
          >
            📥 Export PNG
          </button>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p class="mt-4 text-gray-600">Memuat data...</p>
        </div>

        <div v-else-if="registrationStore.myRegistrations.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📋</div>
          <p class="text-gray-600 mb-4">Belum ada pendaftaran</p>
          <button @click="router.push('/patient/daftar')" class="btn-primary">
            Daftar Sekarang
          </button>
        </div>

        <div v-else ref="registrationTableRef" class="overflow-x-auto bg-white p-4 rounded-lg">
          <div class="mb-4 text-center border-b pb-4">
            <h3 class="text-lg font-bold text-textPrimary">Riwayat Pendaftaran IVA Test</h3>
            <p class="text-sm text-gray-600">{{ authStore.user?.name }} - {{ new Date().toLocaleDateString('id-ID') }}</p>
          </div>
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold text-textPrimary">NIK</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-textPrimary">Nama</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-textPrimary">Tanggal Daftar</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-textPrimary">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="reg in registrationStore.myRegistrations" :key="reg.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-700">{{ reg.nik }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ reg.nama }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(reg.tanggalDaftar) }}</td>
                <td class="px-4 py-3 text-sm">
                  <StatusBadge :status="reg.status" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Action buttons for completed registrations -->
        <div v-if="!loading && registrationStore.myRegistrations.length > 0" class="mt-4 pt-4 border-t">
          <div v-for="reg in registrationStore.myRegistrations" :key="'action-' + reg.id" class="flex items-center justify-between py-2">
            <span class="text-sm text-gray-600">{{ reg.nama }} - {{ formatDate(reg.tanggalDaftar) }}</span>
            <button 
              v-if="reg.status === 'COMPLETED'" 
              @click="router.push('/patient/hasil')"
              class="text-primary hover:text-primary-600 font-semibold text-sm"
            >
              Lihat Hasil Lab
            </button>
            <span v-else class="text-gray-400 text-sm">{{ reg.status === 'PENDING' ? 'Menunggu konfirmasi' : reg.status === 'SCHEDULED' ? 'Terjadwal' : '-' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
