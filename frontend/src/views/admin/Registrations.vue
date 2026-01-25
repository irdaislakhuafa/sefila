<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRegistrationStore } from '../../stores/registration';
import { useLabResultStore } from '../../stores/labResult';
import StatusBadge from '../../components/StatusBadge.vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const router = useRouter();
const registrationStore = useRegistrationStore();
const labResultStore = useLabResultStore();

const loading = ref(true);
const selectedStatus = ref('');
const verifyingId = ref(null);
const downloadingId = ref(null);
const showResultModal = ref(false);
const currentResult = ref(null);
const resultCardRef = ref(null);

onMounted(async () => {
  loadRegistrations();
});

const loadRegistrations = async () => {
  loading.value = true;
  try {
    const filters = {};
    if (selectedStatus.value) filters.status = selectedStatus.value;
    await registrationStore.fetchAllRegistrations(filters);
  } catch (error) {
    console.error('Failed to load registrations:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const verifyArrival = async (regId) => {
  if (!confirm('Apakah Anda yakin ingin memverifikasi kedatangan pasien ini?')) return;
  
  verifyingId.value = regId;
  try {
    await registrationStore.verifyArrival(regId);
    await loadRegistrations();
  } catch (error) {
    console.error('Failed to verify arrival:', error);
    alert('Gagal memverifikasi kedatangan. Silakan coba lagi.');
  } finally {
    verifyingId.value = null;
  }
};

const viewDetails = (regId) => {
  const reg = registrationStore.registrations.find(r => r.id === regId);
  if (reg && reg.status === 'ARRIVED') {
    router.push(`/admin/input-hasil/${regId}`);
  }
};

const viewResult = async (regId) => {
  downloadingId.value = regId;
  try {
    await labResultStore.fetchLabResultByRegistration(regId);
    currentResult.value = labResultStore.currentResult;
    showResultModal.value = true;
  } catch (error) {
    console.error('Failed to load result:', error);
    alert('Gagal memuat hasil lab.');
  } finally {
    downloadingId.value = null;
  }
};

const closeModal = () => {
  showResultModal.value = false;
  currentResult.value = null;
};

const getHasilIVALabel = (value) => {
  const labels = {
    'NEGATIF': 'Negatif',
    'POSITIF': 'Positif',
    'CURIGA_KANKER': 'Curiga Kanker'
  };
  return labels[value] || value;
};

const getSubTypeLabel = (value) => {
  const labels = {
    'NEGATIF': 'Negatif',
    'POSITIF': 'Positif',
    'TIDAK_TERBACA': 'Tidak Terbaca'
  };
  return labels[value] || '-';
};

const getHasilIVAColor = (value) => {
  if (value === 'NEGATIF') return 'green';
  if (value === 'POSITIF') return 'red';
  return 'yellow';
};

const downloadPDF = async () => {
  if (!resultCardRef.value) return;

  try {
    const canvas = await html2canvas(resultCardRef.value, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PUSKESMAS BUGANGAN', pdfWidth / 2, 12, { align: 'center' });
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('HASIL PEMERIKSAAN LABORATORIUM - SEFILA', pdfWidth / 2, 18, { align: 'center' });

    pdf.addImage(imgData, 'PNG', imgX, 25, imgWidth * ratio * 0.9, imgHeight * ratio * 0.9);

    const fileName = `hasil-lab-${currentResult.value?.pendaftaran?.nama || 'pasien'}-${formatDate(currentResult.value?.createdAt)}.pdf`;
    pdf.save(fileName.replace(/\s+/g, '-').toLowerCase());

  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('Gagal membuat PDF.');
  }
};
</script>

<template>
  <div class="min-h-screen bg-background py-8">
    <div class="container mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-textPrimary mb-2">Kelola Pendaftaran</h1>
        <p class="text-gray-600">Daftar semua pendaftaran pasien IVA Test</p>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <label class="font-semibold text-textPrimary">Filter Status:</label>
          <select v-model="selectedStatus" @change="loadRegistrations" class="input-field max-w-xs">
            <option value="">Semua Status</option>
            <option value="PENDING">Menunggu</option>
            <option value="ARRIVED">Sudah Datang</option>
            <option value="SCHEDULED">Terjadwal</option>
            <option value="COMPLETED">Selesai</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
        </div>
      </div>

      <!-- Registrations Table -->
      <div class="card">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p class="mt-4 text-gray-600">Memuat data...</p>
        </div>

        <div v-else-if="registrationStore.registrations.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📋</div>
          <p class="text-gray-600">Tidak ada pendaftaran</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold text-textPrimary">NIK</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-textPrimary">Nama</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-textPrimary">Kelurahan</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-textPrimary">Tanggal Daftar</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-textPrimary">Status</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-textPrimary">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="reg in registrationStore.registrations" :key="reg.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-700">{{ reg.nik }}</td>
                <td class="px-4 py-3 text-sm font-medium text-textPrimary">{{ reg.nama }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ reg.kelurahan }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(reg.tanggalDaftar) }}</td>
                <td class="px-4 py-3 text-sm">
                  <StatusBadge :status="reg.status" />
                </td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex gap-2 flex-wrap">
                    <!-- Verify Arrival Button -->
                    <button 
                      v-if="reg.status === 'PENDING' || reg.status === 'SCHEDULED'"
                      @click="verifyArrival(reg.id)"
                      :disabled="verifyingId === reg.id"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50"
                    >
                      {{ verifyingId === reg.id ? 'Memverifikasi...' : '✓ Verifikasi Datang' }}
                    </button>
                    
                    <!-- Input Hasil Button (only for ARRIVED status) -->
                    <button 
                      v-if="reg.status === 'ARRIVED'"
                      @click="viewDetails(reg.id)"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                    >
                      📝 Input Hasil
                    </button>
                    
                    <!-- View/Download Result (for COMPLETED) -->
                    <button 
                      v-if="reg.status === 'COMPLETED'"
                      @click="viewResult(reg.id)"
                      :disabled="downloadingId === reg.id"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors disabled:opacity-50"
                    >
                      {{ downloadingId === reg.id ? 'Memuat...' : '📥 Lihat Hasil' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Result Modal -->
  <div v-if="showResultModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 class="text-lg font-bold text-textPrimary">Hasil Laboratorium</h3>
        <div class="flex gap-2">
          <button @click="downloadPDF" class="btn-primary text-sm">
            📥 Download PDF
          </button>
          <button @click="closeModal" class="p-2 hover:bg-gray-200 rounded-lg">✕</button>
        </div>
      </div>
      
      <div ref="resultCardRef" class="p-6 bg-white">
        <!-- Header -->
        <div class="text-center mb-6 pb-4 border-b">
          <h2 class="text-xl font-bold text-primary mb-1">PUSKESMAS BUGANGAN</h2>
          <p class="text-sm text-gray-600 mb-3">Sistem Informasi Deteksi Kanker Leher Rahim (SEFILA)</p>
          <div class="mt-3">
            <h3 class="text-lg font-bold text-textPrimary">
              Hasil Lab - {{ currentResult?.pendaftaran?.nama || 'Pasien' }}
            </h3>
            <p class="text-sm text-gray-600">NIK: {{ currentResult?.pendaftaran?.nik || '-' }}</p>
            <p class="text-sm text-gray-600">Tanggal: {{ formatDate(currentResult?.createdAt) }}</p>
          </div>
        </div>

        <!-- Hasil IVA -->
        <div 
          :class="[
            'p-4 rounded-lg mb-4',
            getHasilIVAColor(currentResult?.hasilIVA) === 'green' ? 'bg-green-50 border-2 border-green-500' : 
            getHasilIVAColor(currentResult?.hasilIVA) === 'red' ? 'bg-red-50 border-2 border-red-500' :
            'bg-yellow-50 border-2 border-yellow-500'
          ]"
        >
          <p class="text-sm font-semibold mb-1" :class="getHasilIVAColor(currentResult?.hasilIVA) === 'green' ? 'text-green-600' : getHasilIVAColor(currentResult?.hasilIVA) === 'red' ? 'text-red-600' : 'text-yellow-600'">
            Hasil IVA
          </p>
          <p class="text-2xl font-bold" :class="getHasilIVAColor(currentResult?.hasilIVA) === 'green' ? 'text-green-600' : getHasilIVAColor(currentResult?.hasilIVA) === 'red' ? 'text-red-600' : 'text-yellow-600'">
            {{ currentResult?.hasilIVA === 'NEGATIF' ? '✅' : currentResult?.hasilIVA === 'POSITIF' ? '⚠️' : '🔍' }}
            {{ getHasilIVALabel(currentResult?.hasilIVA) }}
          </p>
        </div>

        <!-- Hasil DNA HPV -->
        <div class="border rounded-lg p-4 mb-4 bg-gray-50">
          <h4 class="font-bold text-textPrimary mb-3">🧬 Hasil DNA HPV</h4>
          <div class="grid grid-cols-3 gap-3 mb-3 text-sm">
            <div><span class="text-gray-500">Jenis Spesimen:</span> {{ currentResult?.jenisSpesimen || '-' }}</div>
            <div><span class="text-gray-500">No. Spesimen:</span> {{ currentResult?.noSpesimen || '-' }}</div>
            <div><span class="text-gray-500">Tgl Pengambilan:</span> {{ formatDate(currentResult?.tanggalPengambilan) }}</div>
          </div>
          <div class="grid grid-cols-4 gap-2 text-center text-sm">
            <div class="p-2 bg-white rounded">
              <p class="text-xs text-gray-500">Type 16</p>
              <p class="font-bold" :class="currentResult?.subType16 === 'POSITIF' ? 'text-red-600' : 'text-green-600'">
                {{ getSubTypeLabel(currentResult?.subType16) }}
              </p>
            </div>
            <div class="p-2 bg-white rounded">
              <p class="text-xs text-gray-500">Type 18</p>
              <p class="font-bold" :class="currentResult?.subType18 === 'POSITIF' ? 'text-red-600' : 'text-green-600'">
                {{ getSubTypeLabel(currentResult?.subType18) }}
              </p>
            </div>
            <div class="p-2 bg-white rounded">
              <p class="text-xs text-gray-500">Type 52</p>
              <p class="font-bold" :class="currentResult?.subType52 === 'POSITIF' ? 'text-red-600' : 'text-green-600'">
                {{ getSubTypeLabel(currentResult?.subType52) }}
              </p>
            </div>
            <div class="p-2 bg-white rounded">
              <p class="text-xs text-gray-500">Lainnya</p>
              <p class="font-bold" :class="currentResult?.subTypeLainnya === 'POSITIF' ? 'text-red-600' : 'text-green-600'">
                {{ getSubTypeLabel(currentResult?.subTypeLainnya) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Catatan Dokter -->
        <div v-if="currentResult?.catatanDokter" class="p-3 bg-blue-50 rounded-lg mb-4">
          <p class="text-sm font-semibold text-primary mb-1">📝 Catatan Dokter</p>
          <p class="text-gray-700 text-sm">{{ currentResult.catatanDokter }}</p>
        </div>

        <!-- Footer -->
        <div class="pt-3 border-t text-center text-xs text-gray-500">
          <p>Dicetak pada {{ new Date().toLocaleDateString('id-ID') }} | SEFILA - Puskesmas Bugangan</p>
        </div>
      </div>
    </div>
  </div>
</template>
