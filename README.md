# SEFILA - Sistem Informasi Deteksi Kanker Leher Rahim

Aplikasi web untuk digitalisasi pendaftaran dan pengelolaan skrining IVA Test (Inspeksi Visual dengan Asam Asetat) di Puskesmas Bugangan, Semarang.

## 🏥 Tentang Aplikasi

SEFILA adalah sistem informasi berbasis web yang memfasilitasi:
- Pendaftaran online skrining IVA Test untuk pasien
- Pengelolaan data pasien dan jadwal pemeriksaan
- Input dan penyampaian hasil laboratorium secara digital
- Visualisasi peta sebaran pasien berdasarkan kelurahan
- Dashboard untuk pasien dan admin/bidan

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, Prisma ORM, MySQL
- **Frontend**: Vue 3 (Composition API), Vite, Tailwind CSS, Pinia
- **Authentication**: JWT (JSON Web Tokens)
- **Maps**: Leaflet.js (untuk visualisasi sebaran pasien)

## 📋 Prasyarat

Pastikan Anda sudah menginstall:
- **Node.js** (v16 atau lebih baru)
- **MySQL** (v8 atau lebih baru)
- **npm** atau **yarn**

## 🚀 Cara Instalasi

### 1. Clone Repository

```bash
cd d:\anies\enjel
```

### 2. Setup Database MySQL

Buat database baru di MySQL:

```sql
CREATE DATABASE sefila_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy .env.example menjadi .env
copy .env.example .env
```

Edit file `.env` dan sesuaikan konfigurasi database Anda:

```env
NODE_ENV=development
PORT=5000

# Sesuaikan dengan konfigurasi MySQL Anda
DATABASE_URL="mysql://root:password@localhost:3306/sefila_db"

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

Jalankan migrasi database:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install
```

File `.env` sudah tersedia dengan konfigurasi default.

### 5. Buat Akun Admin (Opsional)

Anda dapat membuat akun admin melalui Prisma Studio atau langsung via MySQL:

```bash
cd backend
npx prisma studio
```

Atau via MySQL:

```sql
USE sefila_db;

-- Buat user admin dengan password: admin123
INSERT INTO users (email, password, name, role, createdAt, updatedAt) 
VALUES (
  'admin@sefila.com', 
  '$2a$10$rGXqHqSFz8Y4KviKfLnHleWlNj.5NQHBdxw6W2OOhJWwZCrLxU1Ey',  -- password: admin123
  'Administrator',
  'ADMIN',
  NOW(),
  NOW()
);
```

## 🎯 Menjalankan Aplikasi

### Development Mode

Buka 2 terminal terpisah:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend akan berjalan di `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

### Akses Aplikasi

- **Landing Page**: http://localhost:5173
- **Login**: http://localhost:5173/login
- **Register**: http://localhost:5173/register

## 👥 User Roles

### Pasien (PATIENT)
- Mendaftar akun
- Mengisi formulir pendaftaran IVA Test
- Melihat status pendaftaran
- Melihat hasil pemeriksaan lab
- Download hasil lab (PDF)

### Admin/Bidan (ADMIN)
- Login dengan akun admin
- Melihat dashboard statistik
- Mengelola pendaftaran pasien
- Mengubah status pendaftaran
- Input hasil laboratorium
- Melihat peta sebaran pasien

## 🎨 Color Palette

- **Primary** (#4F46E5): Indigo Blue - Navbar, tombol utama
- **Secondary** (#EC4899): Soft Magenta - Aksen feminin
- **Background** (#F3F4F6): Cool Gray - Latar belakang
- **Success** (#10B981): Emerald Green - Status normal
- **Warning** (#F59E0B): Amber - Status menunggu
- **Text** (#1F2937): Dark Charcoal - Teks utama

## 📁 Struktur Folder

```
d:\anies\enjel\
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── config/             # Database config
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Auth & error handling
│   │   ├── routes/             # API routes
│   │   └── server.js           # Main server file
│   ├── .env                    # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/         # Reusable components
    │   ├── views/              # Page components
    │   ├── stores/             # Pinia stores
    │   ├── services/           # API services
    │   ├── router/             # Vue Router
    │   ├── App.vue
    │   └── main.js
    ├── .env                    # Frontend config
    ├── tailwind.config.js      # Tailwind customization
    └── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi pasien baru
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Registrations
- `POST /api/registrations` - Buat pendaftaran baru (Patient)
- `GET /api/registrations` - Get semua pendaftaran (Admin)
- `GET /api/registrations/:id` - Get detail pendaftaran
- `GET /api/registrations/my-registrations` - Get pendaftaran sendiri (Patient)
- `PATCH /api/registrations/:id/status` - Update status (Admin)

### Lab Results
- `POST /api/lab-results` - Input hasil lab (Admin)
- `GET /api/lab-results/registration/:registrationId` - Get hasil by registration
- `PUT /api/lab-results/:id` - Update hasil lab (Admin)
- `GET /api/lab-results/my-results` - Get hasil lab sendiri (Patient)

### Statistics
- `GET /api/stats/dashboard` - Dashboard stats (Admin)
- `GET /api/stats/distribution` - Sebaran pasien by kelurahan (Admin)
- `GET /api/stats/monthly-trends` - Tren bulanan (Admin)

## 📝 Database Schema

### Users
- `id`, `email`, `password`, `name`, `role` (PATIENT/ADMIN)

### Pendaftaran
- Data personal: `nik`, `nama`, `tanggalLahir`, `alamat`, `kelurahan`, `kecamatan`
- `instansi`, `noTelepon`
- Checklist syarat: 7 boolean fields (tidakHaid, tidakDouching, dll)
- `status`: PENDING, SCHEDULED, COMPLETED, CANCELLED

### HasilLab
- `jenisSampel`, `epitel`, `leukosit`
- `gramNegatif`, `gramPositif`, `bakteri`, `jamur`
- `catatanDokter`, `hasilAkhir` (NORMAL/ABNORMAL/PERLU_PEMERIKSAAN_LANJUTAN)

## 🤝 Kontribusi

Aplikasi ini dikembangkan untuk Puskesmas Bugangan, Semarang.

## 📄 License

Private - Puskesmas Bugangan

## 📧 Kontak

Untuk pertanyaan atau dukungan, hubungi:
- Email: info@puskesmasbugangan.com
- Telp: (024) 1234-5678
