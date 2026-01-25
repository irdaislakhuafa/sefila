<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStatsStore } from '../../stores/stats';
import { useRegistrationStore } from '../../stores/registration';
import html2canvas from 'html2canvas';

const router = useRouter();
const statsStore = useStatsStore();
const registrationStore = useRegistrationStore();

const loading = ref(true);
const kelurahanStatsRef = ref(null);

onMounted(async () => {
  try {
    await Promise.all([
      statsStore.fetchDashboardStats(),
      statsStore.fetchKelurahanStats(),
      registrationStore.fetchAllRegistrations({ status: 'PENDING' }),
    ]);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  } finally {
    loading.value = false;
  }
});

// Export kelurahan stats to PNG
const exportKelurahanStats = async () => {
  if (!kelurahanStatsRef.value) return;
  
  try {
    const canvas = await html2canvas(kelurahanStatsRef.value, {
      backgroundColor: '#ffffff',
      scale: 2
    });
    
    const link = document.createElement('a');
    link.download = `rekap-kelurahan-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to export:', error);
    alert('Gagal mengexport data');
  }
};

// Get color for progress bar based on index
const getBarColor = (index) => {
  const colors = [
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-warning', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  return colors[index % colors.length];
};
</script>

<template>
  <div class="min-h-screen bg-background py-8">
    <div class="container mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-textPrimary mb-2">Dashboard Admin</h1>
        <p class="text-gray-600">Ringkasan data pendaftaran dan pemeriksaan</p>
      </div>

      <!-- Stats Cards -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Pendaftar Bulan Ini</p>
              <p class="text-3xl font-bold text-primary">{{ statsStore.dashboardStats?.totalThisMonth || 0 }}</p>
            </div>
            <div class="text-4xl">📊</div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Menunggu</p>
              <p class="text-3xl font-bold text-warning">{{ statsStore.dashboardStats?.pending || 0 }}</p>
            </div>
            <div class="text-4xl">⏳</div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Terjadwal</p>
              <p class="text-3xl font-bold text-primary">{{ statsStore.dashboardStats?.scheduled || 0 }}</p>
            </div>
            <div class="text-4xl">📅</div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Selesai</p>
              <p class="text-3xl font-bold text-success">{{ statsStore.dashboardStats?.completed || 0 }}</p>
            </div>
            <div class="text-4xl">✅</div>
          </div>
        </div>
      </div>

      <!-- Kelurahan Statistics Section -->
      <div v-if="!loading && statsStore.kelurahanStats" class="card mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-xl font-bold text-textPrimary">Rekap Data per Kelurahan</h2>
            <p class="text-sm text-gray-600">Distribusi pendaftaran berdasarkan kelurahan</p>
          </div>
          <button @click="exportKelurahanStats" class="btn-outline flex items-center gap-2">
            📥 Export PNG
          </button>
        </div>

        <div ref="kelurahanStatsRef" class="bg-white p-4 rounded-lg">
          <div class="mb-4 text-center">
            <p class="text-sm text-gray-600">Total Pendaftaran</p>
            <p class="text-3xl font-bold text-primary">{{ statsStore.kelurahanStats.total }}</p>
          </div>

          <div v-if="statsStore.kelurahanStats.kelurahanStats.length === 0" class="text-center py-8 text-gray-500">
            Belum ada data pendaftaran
          </div>

          <div v-else class="space-y-4">
            <div v-for="(item, index) in statsStore.kelurahanStats.kelurahanStats" :key="item.kelurahan" class="border-b pb-4 last:border-b-0">
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold text-textPrimary">{{ item.kelurahan }}</span>
                <div class="text-right">
                  <span class="text-lg font-bold text-primary">{{ item.count }}</span>
                  <span class="text-sm text-gray-500 ml-2">({{ item.percentage }}%)</span>
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  :class="getBarColor(index)" 
                  class="h-3 rounded-full transition-all duration-500"
                  :style="{ width: item.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid md:grid-cols-3 gap-6">
        <div class="card cursor-pointer hover:shadow-2xl transition-all" @click="router.push('/admin/users')">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-3xl">
              👥
            </div>
            <div>
              <h3 class="text-xl font-semibold text-textPrimary mb-1">Manajemen User</h3>
              <p class="text-gray-600 text-sm">Buat dan kelola akun pasien</p>
            </div>
          </div>
        </div>

        <div class="card cursor-pointer hover:shadow-2xl transition-all" @click="router.push('/admin/pendaftaran')">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 gradient-primary rounded-lg flex items-center justify-center text-3xl">
              📋
            </div>
            <div>
              <h3 class="text-xl font-semibold text-textPrimary mb-1">Kelola Pendaftaran</h3>
              <p class="text-gray-600 text-sm">Lihat dan kelola semua pendaftaran pasien</p>
            </div>
          </div>
        </div>

        <div class="card cursor-pointer hover:shadow-2xl transition-all" @click="router.push('/admin/pendaftaran')">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 gradient-secondary rounded-lg flex items-center justify-center text-3xl">
              🔬
            </div>
            <div>
              <h3 class="text-xl font-semibold text-textPrimary mb-1">Input Hasil Lab</h3>
              <p class="text-gray-600 text-sm">Masukkan hasil pemeriksaan laboratorium</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
