<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';

const router = useRouter();
const users = ref([]);
const loading = ref(false);
const showModal = ref(false);
const editingUser = ref(null);
const showCredentials = ref(null);
const deleteConfirm = ref(null); // User to be deleted

const formData = ref({
  nik: '',
  name: '',
  birthDate: '',
  email: '',
  phoneNumber: ''
});

// Fetch all users
const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await api.getAllUsers();
    users.value = response.data.data;
  } catch (error) {
    alert('Gagal memuat data user');
  } finally {
    loading.value = false;
  }
};

// Open create modal
const openCreateModal = () => {
  editingUser.value = null;
  formData.value = {
    nik: '',
    name: '',
    birthDate: '',
    email: '',
    phoneNumber: ''
  };
  showModal.value = true;
};

// Open edit modal
const openEditModal = (user) => {
  editingUser.value = user;
  formData.value = {
    nik: user.nik,
    name: user.name,
    birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || ''
  };
  showModal.value = true;
};

// Create or update user
const saveUser = async () => {
  try {
    if (editingUser.value) {
      // Update
      await api.updateUser(editingUser.value.id, formData.value);
      alert('User berhasil diupdate!');
    } else {
      // Create
      const response = await api.createUser(formData.value);
      const data = response.data.data;
      
      // Show credentials
      showCredentials.value = {
        nik: data.user.nik,
        password: data.password,
        loginInstructions: data.loginInstructions
      };
    }
    
    showModal.value = false;
    fetchUsers();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menyimpan user');
  }
};

// Delete user - show confirmation modal
const showDeleteConfirm = (user) => {
  deleteConfirm.value = user;
};

// Confirm delete
const confirmDelete = async () => {
  if (!deleteConfirm.value) return;
  
  try {
    await api.deleteUser(deleteConfirm.value.id);
    alert('User berhasil dihapus');
    deleteConfirm.value = null;
    fetchUsers();
  } catch (error) {
    alert('Gagal menghapus user');
    deleteConfirm.value = null;
  }
};

// Format phone for WhatsApp
const getWhatsAppLink = (phone) => {
  if (!phone) return '';
  return `https://wa.me/${phone}`;
};

const formatPhone = (phone) => {
  if (!phone) return '-';
  // Format: 628xxx -> +62 8xxx
  if (phone.startsWith('62')) {
    return `+${phone.slice(0, 2)} ${phone.slice(2)}`;
  }
  return phone;
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID');
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-textPrimary">Manajemen User</h1>
      <button @click="openCreateModal" class="btn-primary">
        + Tambah User Baru
      </button>
    </div>

    <!-- Users Table -->
    <div class="card overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIK</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal Lahir</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">WhatsApp</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{{ user.nik }}</td>
            <td class="px-4 py-3 text-sm font-medium">{{ user.name }}</td>
            <td class="px-4 py-3 text-sm">{{ formatDate(user.birthDate) }}</td>
            <td class="px-4 py-3 text-sm">{{ user.email || '-' }}</td>
            <td class="px-4 py-3 text-sm">
              <a v-if="user.phoneNumber" 
                 :href="getWhatsAppLink(user.phoneNumber)"
                 target="_blank"
                 class="text-green-600 hover:text-green-800 hover:underline">
                {{ formatPhone(user.phoneNumber) }}
              </a>
              <span v-else>-</span>
            </td>
            <td class="px-4 py-3 text-sm">
              <span :class="user.role === 'ADMIN' ? 'badge-danger' : 'badge-primary'">
                {{ user.role }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm space-x-2">
              <button @click="openEditModal(user)" class="text-blue-600 hover:text-blue-800 font-medium">
                Edit
              </button>
              <button @click="showDeleteConfirm(user)" class="text-red-600 hover:text-red-800 font-medium">
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="users.length === 0 && !loading" class="text-center py-8 text-gray-500">
        Belum ada user
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-bold mb-4">
          {{ editingUser ? 'Edit User' : 'Tambah User Baru' }}
        </h2>

        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1">NIK *</label>
            <input 
              v-model="formData.nik" 
              type="text" 
              required
              maxlength="16"
              class="input-field"
              placeholder="16 digit NIK"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Nama Lengkap *</label>
            <input 
              v-model="formData.name" 
              type="text" 
              required
              class="input-field"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Tanggal Lahir *</label>
            <input 
              v-model="formData.birthDate" 
              type="date" 
              required
              class="input-field"
            />
            <p class="text-xs text-gray-500 mt-1">
              Password otomatis: DDMMYYYY dari tanggal lahir
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Email (opsional)</label>
            <input 
              v-model="formData.email" 
              type="email"
              class="input-field"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">No. WhatsApp (opsional)</label>
            <input 
              v-model="formData.phoneNumber" 
              type="tel"
              class="input-field"
              placeholder="628123456789"
            />
            <p class="text-xs text-gray-500 mt-1">
              Format: 628xxx (dengan kode negara)
            </p>
          </div>

          <div class="flex gap-2 pt-4">
            <button type="submit" class="btn-primary flex-1">
              {{ editingUser ? 'Update' : 'Buat User' }}
            </button>
            <button type="button" @click="showModal = false" class="btn-secondary flex-1">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Credentials Modal -->
    <div v-if="showCredentials" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-bold mb-4 text-green-600">✅ User Berhasil Dibuat!</h2>
        
        <div class="bg-green-50 border border-green-200 rounded p-4 mb-4">
          <p class="font-semibold mb-2">Kredensial Login:</p>
          <div class="space-y-2">
            <div>
              <span class="text-sm text-gray-600">NIK:</span>
              <p class="font-mono font-bold text-lg">{{ showCredentials.nik }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-600">Password:</span>
              <p class="font-mono font-bold text-lg">{{ showCredentials.password }}</p>
            </div>
          </div>
        </div>

        <p class="text-sm text-gray-600 mb-4">
          ⚠️ Berikan informasi ini kepada pasien. Password adalah tanggal lahir format DDMMYYYY.
        </p>

        <button @click="showCredentials = null" class="btn-primary w-full">
          OK, Mengerti
        </button>
      </div>
    </div>
    <!-- Delete Confirmation Modal -->
    <div v-if="deleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-bold mb-4 text-red-600">⚠️ Konfirmasi Hapus</h2>
        
        <p class="text-gray-700 mb-6">
          Anda yakin ingin menghapus user <strong class="text-red-600">{{ deleteConfirm.name }}</strong>?
        </p>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
          <p class="text-sm text-yellow-800">
            <strong>Perhatian:</strong> Data user dan semua pendaftaran terkait akan terhapus permanen!
          </p>
        </div>

        <div class="flex gap-2">
          <button @click="confirmDelete" class="btn-danger flex-1">
            Ya, Hapus
          </button>
          <button @click="deleteConfirm = null" class="btn-secondary flex-1">
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.badge-primary {
  @apply inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800;
}

.badge-danger {
  @apply inline-block px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800;
}

.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors;
}
</style>
