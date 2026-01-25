<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useRegistrationStore } from '../../stores/registration';

const router = useRouter();
const authStore = useAuthStore();
const registrationStore = useRegistrationStore();

const currentStep = ref(1);
const loading = ref(false);
const error = ref('');
const success = ref(false);

const formData = ref({
  // Personal Info
  nik: '',
  nama: '',
  tanggalLahir: '',
  alamat: '',
  kelurahan: '',
  noTelepon: '',
  
  // Institution
  instansi: '',
  
  // Self-Assessment (4 items only)
  tidakHaid: false,
  tidakDouching: false,
  tidakBerhubungan: false,
  tidakHamil: false,
});

const isLuarKelurahan = ref(false);
const isLuarKota = ref(false);
const customKelurahan = ref('');

const kelurahanOptions = [
  'Bugangan',
  'Kebonagung',
  'Mlatiharjo',
  'Luar Wilayah Kota Semarang',
  'Luar Kota',
];

const allRequirementsMet = () => {
  return formData.value.tidakHaid &&
         formData.value.tidakDouching &&
         formData.value.tidakBerhubungan &&
         formData.value.tidakHamil;
};

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleSubmit = async () => {
  if (!allRequirementsMet()) {
    error.value = 'Semua syarat pemeriksaan harus dipenuhi';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // For Luar Wilayah Kota Semarang, we still save as "Luar Wilayah Kota Semarang" to maintain category
    // The custom kelurahan name is only for admin reference, not for stats
    const submitData = {
      ...formData.value,
      // Keep the category name for stats, not the custom input
      kelurahan: formData.value.kelurahan
    };
    
    console.log('📝 Submitting registration data:', submitData);
    
    await registrationStore.createRegistration(submitData);
    success.value = true;
    
    setTimeout(() => {
      router.push('/patient/dashboard');
    }, 2000);
  } catch (err) {
    console.error('❌ Registration error:', err);
    console.error('Error response:', err.response?.data);
    error.value = registrationStore.error || 'Terjadi kesalahan saat mendaftar';
  } finally {
    loading.value = false;
  }
};

// Auto-fill user data from auth store
onMounted(() => {
  if (authStore.user) {
    formData.value.nik = authStore.user.nik || '';
    formData.value.nama = authStore.user.name || '';
    formData.value.noTelepon = authStore.user.phoneNumber || '';
    
    // Format birth date to YYYY-MM-DD for date input
    if (authStore.user.birthDate) {
      const date = new Date(authStore.user.birthDate);
      formData.value.tanggalLahir = date.toISOString().split('T')[0];
    }
  }
});

// Watch kelurahan selection for input visibility
watch(() => formData.value.kelurahan, (newValue) => {
  isLuarKelurahan.value = newValue === 'Luar Wilayah Kota Semarang';
  isLuarKota.value = newValue === 'Luar Kota';
  if (!isLuarKelurahan.value) {
    customKelurahan.value = '';
  }
});
</script>

<template>
  <div class="min-h-screen bg-background py-8">
    <div class="container mx-auto px-4 max-w-3xl">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-textPrimary mb-2">Pendaftaran IVA Test</h1>
        <p class="text-gray-600">Lengkapi formulir di bawah ini untuk mendaftar skrining</p>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="card bg-success/10 border-2 border-success">
        <div class="text-center py-8">
          <div class="text-6xl mb-4">✅</div>
          <h2 class="text-2xl font-bold text-success mb-2">Pendaftaran Berhasil!</h2>
          <p class="text-gray-700">Silakan tunggu konfirmasi jadwal dari admin</p>
        </div>
      </div>

      <!-- Registration Form -->
      <div v-else class="card">
        <!-- Step Indicator -->
        <div class="flex justify-between mb-8">
          <div v-for="step in 3" :key="step" class="flex items-center">
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold',
                currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
              ]"
            >
              {{ step }}
            </div>
            <div v-if="step < 3" class="w-20 h-1 mx-2" :class="currentStep > step ? 'bg-primary' : 'bg-gray-200'"></div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- Step 1: Personal Information -->
          <div v-show="currentStep === 1" class="space-y-6">
            <h3 class="text-xl font-bold text-textPrimary mb-4">Data Diri</h3>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-blue-800">
                ℹ️ <strong>Data pribadi diambil dari akun Anda.</strong> Jika ada yang perlu diubah, silakan update di halaman profil.
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-textPrimary mb-2">NIK</label>
                <input
                  id="nik-field"
                  v-model="formData.nik"
                  name="nik"
                  type="text"
                  required
                  maxlength="16"
                  readonly
                  disabled
                  class="input-field bg-gray-100 cursor-not-allowed"
                  placeholder="16 digit NIK"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-textPrimary mb-2">Nama Lengkap</label>
                <input
                  id="nama-field"
                  v-model="formData.nama"
                  name="nama"
                  type="text"
                  required
                  readonly
                  disabled
                  class="input-field bg-gray-100 cursor-not-allowed"
                  placeholder="Nama lengkap"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-textPrimary mb-2">Tanggal Lahir</label>
                <input
                  id="tanggalLahir-field"
                  v-model="formData.tanggalLahir"
                  name="tanggalLahir"
                  type="date"
                  required
                  readonly
                  disabled
                  class="input-field bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-textPrimary mb-2">No. Telepon</label>
                <input
                  id="noTelepon-field"
                  v-model="formData.noTelepon"
                  name="noTelepon"
                  type="tel"
                  required
                  class="input-field"
                  placeholder="081234567890"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-textPrimary mb-2">Alamat Lengkap</label>
              <textarea
                id="alamat-field"
                v-model="formData.alamat"
                name="alamat"
                required
                rows="3"
                class="input-field"
                placeholder="Alamat lengkap"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-textPrimary mb-2">Kelurahan</label>
              <select id="kelurahan-field" v-model="formData.kelurahan" name="kelurahan" required class="input-field">
                <option value="">Pilih Kelurahan</option>
                <option v-for="kel in kelurahanOptions" :key="kel" :value="kel">
                  {{ kel }}
                </option>
              </select>
              
              <!-- Note for Luar Wilayah Kota Semarang -->
              <div v-if="isLuarKelurahan" class="mt-3 p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700">
                  ℹ️ Anda akan dicatat sebagai <strong>Luar Wilayah Kota Semarang</strong>
                </p>
              </div>
              
              <!-- Note for Luar Kota -->
              <div v-if="isLuarKota" class="mt-3 p-3 bg-orange-50 rounded-lg">
                <p class="text-sm text-orange-700">
                  ℹ️ Anda akan dicatat sebagai <strong>Luar Kota</strong>
                </p>
              </div>
            </div>
          </div>

          <!-- Step 2: Institution -->
          <div v-show="currentStep === 2" class="space-y-6">
            <h3 class="text-xl font-bold text-textPrimary mb-4">Informasi Instansi</h3>
            
            <div>
              <label class="block text-sm font-semibold text-textPrimary mb-2">Instansi/Tempat Kerja</label>
              <input
                id="instansi-field"
                v-model="formData.instansi"
                name="instansi"
                type="text"
                required
                class="input-field"
                placeholder="Nama instansi/tempat kerja"
              />
            </div>
          </div>

          <!-- Step 3: Self Assessment (4 items only) -->
          <div v-show="currentStep === 3" class="space-y-6">
            <h3 class="text-xl font-bold text-textPrimary mb-4">Syarat Pemeriksaan</h3>
            <p class="text-gray-600 mb-4">Pastikan Anda memenuhi semua syarat berikut:</p>

            <div class="space-y-4">
              <label class="flex items-start space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <input
                  type="checkbox"
                  v-model="formData.tidakHaid"
                  class="mt-1 w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <div>
                  <span class="font-semibold text-textPrimary">Tidak sedang haid/menstruasi</span>
                  <p class="text-sm text-gray-600">Pemeriksaan dilakukan di luar periode menstruasi</p>
                </div>
              </label>

              <label class="flex items-start space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <input
                  type="checkbox"
                  v-model="formData.tidakDouching"
                  class="mt-1 w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <div>
                  <span class="font-semibold text-textPrimary">Tidak douching 24 jam sebelumnya</span>
                  <p class="text-sm text-gray-600">Tidak menggunakan produk kewanitaan, douching vagina ataupun memasukkan tampon/cream/vaginal suppositoria 24 jam sebelum pemeriksaan</p>
                </div>
              </label>

              <label class="flex items-start space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <input
                  type="checkbox"
                  v-model="formData.tidakBerhubungan"
                  class="mt-1 w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <div>
                  <span class="font-semibold text-textPrimary">Tidak berhubungan 24 jam sebelumnya</span>
                  <p class="text-sm text-gray-600">Tidak melakukan hubungan seksual 24 jam sebelumnya</p>
                </div>
              </label>

              <label class="flex items-start space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <input
                  type="checkbox"
                  v-model="formData.tidakHamil"
                  class="mt-1 w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <div>
                  <span class="font-semibold text-textPrimary">Tidak sedang hamil</span>
                  <p class="text-sm text-gray-600">Tidak dalam kondisi hamil</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between mt-8">
            <button
              v-if="currentStep > 1"
              type="button"
              @click="prevStep"
              class="btn-outline"
            >
              Kembali
            </button>
            <div v-else></div>

            <button
              v-if="currentStep < 3"
              type="button"
              @click="nextStep"
              class="btn-primary"
            >
              Lanjut
            </button>
            <button
              v-else
              type="submit"
              :disabled="loading || !allRequirementsMet()"
              class="btn-primary"
            >
              {{ loading ? 'Memproses...' : 'Daftar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
