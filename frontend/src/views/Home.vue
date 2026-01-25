<script setup>
import { RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '../services/api';

const kelurahanStats = ref(null);
const loadingStats = ref(true);

onMounted(async () => {
  try {
    const response = await api.getKelurahanStatsPublic();
    kelurahanStats.value = response.data.data;
  } catch (error) {
    console.error('Failed to load stats:', error);
  } finally {
    loadingStats.value = false;
  }
});

const getBarColor = (index) => {
  const colors = ['bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500'];
  return colors[index % colors.length];
};
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section class="gradient-primary text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl font-bold mb-4 animate-fade-in">
            SEFILA
          </h1>
          <p class="text-2xl font-semibold mb-2 opacity-95">
            Sistem Informasi Deteksi Kanker Leher Rahim
          </p>
          <p class="text-lg mb-6 opacity-90">
            Puskesmas Bugangan
          </p>
          
          <!-- Statistics Alert -->
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 text-left max-w-2xl mx-auto">
            <p class="text-white/90 mb-3">
              📊 Angka kejadian kanker leher rahim menjadi <strong>urutan ke-2 tertinggi</strong> di Indonesia, 
              dengan angka kematian yang mencapai <strong class="text-yellow-300">57%</strong> dari angka kejadian.
            </p>
            <p class="text-white/90">
              ⚠️ Penyebabnya <strong>70%</strong> kanker leher rahim ditemukan pada kasus stadium lanjut,
              <strong class="text-yellow-300">karena tidak bergejala</strong>.
            </p>
          </div>
          
          <p class="text-lg mb-8 opacity-90 max-w-3xl mx-auto">
            Untuk mendukung program <strong>Akselerasi Eliminasi Kanker Leher Rahim</strong>, 
            diharapkan seluruh wanita ikut serta mendeteksi dini Kanker Leher Rahim
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink to="/register" class="btn-secondary text-lg px-8 py-4">
              Daftar Sekarang
            </RouterLink>
            <RouterLink to="/login" class="bg-white/20 hover:bg-white/30 text-white text-lg px-8 py-4 rounded-lg font-semibold transition-colors">
              Masuk ke Akun
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Rekap Kelurahan Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4 text-textPrimary">
          📊 Rekap Data per Kelurahan
        </h2>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Distribusi pendaftaran berdasarkan kelurahan
        </p>
        
        <div class="max-w-2xl mx-auto">
          <div v-if="loadingStats" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          
          <div v-else-if="kelurahanStats && kelurahanStats.kelurahanStats.length > 0" class="card">
            <div class="mb-6 text-center">
              <p class="text-sm text-gray-600">Total Pendaftaran</p>
              <p class="text-4xl font-bold text-primary">{{ kelurahanStats.total }}</p>
            </div>
            
            <div class="space-y-4">
              <div v-for="(item, index) in kelurahanStats.kelurahanStats" :key="item.kelurahan" class="border-b pb-4 last:border-b-0">
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
          
          <div v-else class="text-center py-8 text-gray-500">
            <div class="text-4xl mb-4">📋</div>
            <p>Belum ada data pendaftaran</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Deteksi Dini Section -->
    <section class="py-16 bg-gradient-to-br from-gray-50 to-pink-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4 text-textPrimary">
          🔬 Deteksi Dini
        </h2>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Beberapa metode pemeriksaan yang tersedia untuk mendeteksi dini kanker leher rahim
        </p>
        
        <div class="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div class="card text-center hover:shadow-xl transition-shadow">
            <div class="text-4xl mb-4">👁️</div>
            <h3 class="text-lg font-semibold mb-2 text-primary">IVA</h3>
            <p class="text-sm text-gray-600">Inspeksi Visual dengan Asam Asetat</p>
          </div>
          <div class="card text-center hover:shadow-xl transition-shadow">
            <div class="text-4xl mb-4">🔬</div>
            <h3 class="text-lg font-semibold mb-2 text-primary">Pap Smear</h3>
            <p class="text-sm text-gray-600">Pemeriksaan sel serviks</p>
          </div>
          <div class="card text-center hover:shadow-xl transition-shadow">
            <div class="text-4xl mb-4">🔎</div>
            <h3 class="text-lg font-semibold mb-2 text-primary">Kolposkopi</h3>
            <p class="text-sm text-gray-600">Pemeriksaan dengan alat pembesar</p>
          </div>
          <div class="card text-center hover:shadow-xl transition-shadow border-2 border-secondary">
            <div class="absolute -top-3 right-0 left-0 flex justify-center">
              <span class="bg-secondary text-white text-xs px-3 py-1 rounded-full">Performa Tinggi</span>
            </div>
            <div class="text-4xl mb-4 mt-2">🧬</div>
            <h3 class="text-lg font-semibold mb-2 text-secondary">Tes DNA HPV</h3>
            <p class="text-sm text-gray-600">Deteksi materi genetik virus HPV</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Syarat Pemeriksaan Section -->
    <section class="py-16 bg-gradient-to-br from-secondary-50 to-primary-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4 text-textPrimary">
          📋 Syarat Pemeriksaan
        </h2>
        <p class="text-center text-gray-600 mb-12">
          Pastikan Anda memenuhi syarat berikut sebelum melakukan pemeriksaan
        </p>
        
        <div class="max-w-3xl mx-auto">
          <div class="card">
            <div class="space-y-4">
              <div class="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <span class="text-success text-2xl">✓</span>
                <div>
                  <p class="font-semibold text-textPrimary">Sudah pernah berhubungan seksual</p>
                  <p class="text-sm text-gray-600">Diutamakan usia 30-69 tahun</p>
                </div>
              </div>
              <div class="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <span class="text-success text-2xl">✓</span>
                <div>
                  <p class="font-semibold text-textPrimary">Tidak sedang menstruasi</p>
                  <p class="text-sm text-gray-600">Pemeriksaan dilakukan di luar periode menstruasi</p>
                </div>
              </div>
              <div class="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <span class="text-success text-2xl">✓</span>
                <div>
                  <p class="font-semibold text-textPrimary">Tidak menggunakan produk kewanitaan 24 jam sebelumnya</p>
                  <p class="text-sm text-gray-600">Tidak douching vagina, memasukkan tampon, cream, atau vaginal suppositoria</p>
                </div>
              </div>
              <div class="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <span class="text-success text-2xl">✓</span>
                <div>
                  <p class="font-semibold text-textPrimary">Tidak sedang hamil</p>
                  <p class="text-sm text-gray-600">Pemeriksaan dilakukan saat tidak dalam kondisi hamil</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Penatalaksanaan Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4 text-textPrimary">
          💊 Penatalaksanaan
        </h2>
        <p class="text-center text-gray-600 mb-12">
          Jika terdeteksi dini, kanker leher rahim dapat ditangani dengan baik
        </p>
        
        <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="card text-center bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
            <div class="text-4xl mb-4">❄️</div>
            <h3 class="text-xl font-semibold mb-2 text-blue-700">Krioterapi</h3>
            <p class="text-sm text-gray-600">Pengobatan dengan gas dingin untuk menghilangkan luka</p>
          </div>
          <div class="card text-center bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
            <div class="text-4xl mb-4">🔥</div>
            <h3 class="text-xl font-semibold mb-2 text-orange-700">Thermal Ablation</h3>
            <p class="text-sm text-gray-600">Pengobatan dengan suhu panas untuk menghilangkan jaringan abnormal</p>
          </div>
          <div class="card text-center bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
            <div class="text-4xl mb-4">🏥</div>
            <h3 class="text-xl font-semibold mb-2 text-purple-700">Rujukan</h3>
            <p class="text-sm text-gray-600">Penanganan lanjutan di fasilitas kesehatan yang lebih lengkap</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4 text-textPrimary">
          ❓ Pertanyaan Umum
        </h2>
        <p class="text-center text-gray-600 mb-12">
          Jawaban dari tim medis kami
        </p>
        
        <div class="max-w-4xl mx-auto space-y-6">
          <!-- Q1 -->
          <div class="card">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-2xl flex-shrink-0">
                👩‍⚕️
              </div>
              <div class="flex-1">
                <p class="font-bold text-primary mb-2">Prosedurnya bagaimana, sakit gak?</p>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-gray-700 mb-3">
                    Pemeriksaan DNA HPV prosedur sama seperti IVA (2-5 menit) dan saya rasa tidak sakit. 
                    Saya sendiri sudah pernah periksa, dan masih bisa ditoleransi jika rileks.
                  </p>
                  <p class="text-gray-700 mb-3">
                    Jangan dicepit-cepit atau berusaha mengejan untuk mengeluarkan alat. 
                    Jadi sakit tidaknya tergantung cara menerimanya.
                  </p>
                  <p class="text-success font-semibold">
                    ✅ 90-95% pasien tidak kesakitan
                  </p>
                </div>
                <p class="text-sm text-gray-500 mt-2 text-right">— Bidan Enjelita</p>
              </div>
            </div>
          </div>

          <!-- Q2 -->
          <div class="card">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-2xl flex-shrink-0">
                👩‍⚕️
              </div>
              <div class="flex-1">
                <p class="font-bold text-primary mb-2">Tingkat deteksinya apa saja? Apa hasilnya langsung positif atau negatif kanker?</p>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-gray-700 mb-3">
                    Prosedur dari skrining DNA HPV adalah untuk pemeriksaan 2 item: <strong>IVA</strong> dan <strong>DNA HPV</strong>.
                  </p>
                  <p class="text-gray-700 mb-3">
                    <strong>DNA HPV</strong> adalah mendeteksi materi genetik HPV di laboratorium.
                  </p>
                  <p class="text-gray-700 mb-3">
                    <strong>IVA</strong> (Inspeksi Visual Asam Asetat) adalah melihat reaksi dari Leher Rahim jika diolesi asam asetat. 
                    Di sini kita bisa melihat apakah ada luka pra kanker dan identifikasi titik lukanya ada dimana 
                    — seperti menentukan titik peta luka pra kanker.
                  </p>
                </div>
                <p class="text-sm text-gray-500 mt-2 text-right">— Bidan Enjelita</p>
              </div>
            </div>
          </div>

          <!-- Q3 -->
          <div class="card">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
                👨‍⚕️
              </div>
              <div class="flex-1">
                <p class="font-bold text-primary mb-2">Luka Pra Kanker? Agak ngeri yaa, berapa lama jadi kanker?</p>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-gray-700 mb-3">
                    Jika terdeteksi <strong class="text-secondary">IVA POSITIF ITU BUKAN KANKER</strong> 
                    (Anda beruntung, dan bisa diobati!)
                  </p>
                  <p class="text-gray-700">
                    Bisa jadi kanker kalau dibiarkan <strong>bertahun-tahun</strong>, mungkin 3-10 tahun.
                  </p>
                </div>
                <p class="text-sm text-gray-500 mt-2 text-right">— dr. Melisa Est</p>
              </div>
            </div>
          </div>

          <!-- Q4 -->
          <div class="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
                👨‍⚕️
              </div>
              <div class="flex-1">
                <p class="font-bold text-primary mb-2">Apa bisa dihilangkan jika IVA sudah Positif?</p>
                <div class="bg-white/70 rounded-lg p-4">
                  <p class="text-gray-700 mb-3">
                    <strong class="text-green-600 text-xl">Bisa dong!</strong> 💚
                  </p>
                  <p class="text-gray-700 mb-3">
                    Pengobatannya dengan <strong>krioterapi</strong> disemprot gas dingin untuk membentuk bunga es. 
                    Efek sampingnya memang keputihan bening seperti air (cukup memakai pembalut).
                  </p>
                  <p class="text-gray-700 mb-3">
                    <strong>HAL BAIK</strong> setelah krioterapi: tidak hanya luka jaringan IVA (+) yang luruh, 
                    mulut rahim juga ikut <strong class="text-pink-600">GLOWING DAN CANTIK</strong> kayak gadis! ✨
                  </p>
                  <p class="text-success font-semibold">
                    Jadi jangan ragu untuk periksa ya bu, agar cantik luar dalam ❤️
                  </p>
                </div>
                <p class="text-sm text-gray-500 mt-2 text-right">— dr. Melisa Est</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Video Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4 text-textPrimary">
          🎬 Video Informasi
        </h2>
        <p class="text-center text-gray-600 mb-12">
          Pelajari lebih lanjut tentang pemeriksaan IVA dan DNA HPV
        </p>
        
        <div class="max-w-3xl mx-auto">
          <div class="aspect-video rounded-xl overflow-hidden shadow-2xl">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/pWU20tO6QSQ" 
              title="Video Edukasi IVA Test" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gray-900 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-6">Siap untuk Memulai?</h2>
        <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Daftar sekarang dan jadwalkan pemeriksaan IVA Test Anda. 
          Deteksi dini adalah kunci untuk pencegahan!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/register" class="btn-secondary text-lg px-10 py-4 inline-block">
            Daftar Sekarang →
          </RouterLink>
          <RouterLink to="/login" class="bg-white/20 hover:bg-white/30 text-white text-lg px-10 py-4 rounded-lg font-semibold transition-colors inline-block">
            Masuk ke Akun
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4 text-textPrimary">
          📍 Hubungi Kami
        </h2>
        <p class="text-center text-gray-600 mb-12">
          Puskesmas Bugangan Semarang
        </p>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <!-- Google Maps -->
          <a 
            href="https://maps.app.goo.gl/McVMDfLVnonwX9fA9" 
            target="_blank"
            class="card text-center hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
          >
            <div class="text-4xl mb-3">📍</div>
            <h3 class="font-semibold text-textPrimary">Lokasi</h3>
            <p class="text-sm text-gray-500">Google Maps</p>
          </a>
          
          <!-- WhatsApp -->
          <a 
            href="https://wa.me/628112629888" 
            target="_blank"
            class="card text-center hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer bg-green-50"
          >
            <div class="text-4xl mb-3">📱</div>
            <h3 class="font-semibold text-green-700">WhatsApp</h3>
            <p class="text-sm text-gray-500">0811-2629-888</p>
          </a>
          
          <!-- YouTube -->
          <a 
            href="https://www.youtube.com/@puskesmasbugangan" 
            target="_blank"
            class="card text-center hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer bg-red-50"
          >
            <div class="text-4xl mb-3">📺</div>
            <h3 class="font-semibold text-red-700">YouTube</h3>
            <p class="text-sm text-gray-500">Channel Kami</p>
          </a>
          
          <!-- Instagram -->
          <a 
            href="https://www.instagram.com/puskesmasbugangan/" 
            target="_blank"
            class="card text-center hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer bg-purple-50"
          >
            <div class="text-4xl mb-3">📷</div>
            <h3 class="font-semibold text-purple-700">Instagram</h3>
            <p class="text-sm text-gray-500">@puskesmasbugangan</p>
          </a>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div class="text-5xl font-bold text-indigo-600 mb-2">
              1000+
            </div>
            <p class="text-gray-600 font-medium">Pasien Terlayani</p>
          </div>
          <div>
            <div class="text-5xl font-bold text-indigo-600 mb-2">
              95%
            </div>
            <p class="text-gray-600 font-medium">Tingkat Kepuasan</p>
          </div>
          <div>
            <div class="text-5xl font-bold text-indigo-600 mb-2">
              100%
            </div>
            <p class="text-gray-600 font-medium">100% Gratis</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
      <div class="container mx-auto px-4 text-center">
        <h3 class="text-xl font-bold mb-2">SEFILA</h3>
        <p class="text-gray-400 mb-4">Sistem Informasi Deteksi Kanker Leher Rahim</p>
        <p class="text-gray-500 text-sm">
          © 2026 Puskesmas Bugangan Semarang. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>
