# Quick Start Guide - SEFILA

## Setup Cepat (5 Menit)

### 1. Setup Database (2 menit)

Buka MySQL dan jalankan:

```sql
CREATE DATABASE sefila_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sefila_db;

-- Buat admin user (Email: admin@sefila.com, Password: admin123)
INSERT INTO users (email, password, name, role, createdAt, updatedAt) 
VALUES (
  'admin@sefila.com', 
  '$2a$10$rGXqHqSFz8Y4KviKfLnHleWlNj.5NQHBdxw6W2OOhJWwZCrLxU1Ey',
  'Administrator',
  'ADMIN',
  NOW(),
  NOW()
);
```

### 2. Konfigurasi Backend (.env)

Edit `backend/.env`:
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/sefila_db"
```

Ganti `YOUR_PASSWORD` dengan password MySQL Anda.

### 3. Migrasi Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Jalankan Aplikasi

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### 5. Akses Aplikasi

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Login sebagai Admin:
- Email: `admin@sefila.com`
- Password: `admin123`

### Registrasi sebagai Pasien:
Klik "Daftar" di landing page

---

## Troubleshooting

**Backend tidak jalan?**
- Cek apakah MySQL sudah running
- Cek DATABASE_URL di `.env`
- Pastikan sudah run `npx prisma generate`

**Frontend error CORS?**
- Pastikan backend sudah running di port 5000
- Cek VITE_API_BASE_URL di `frontend/.env`

**Database error?**
- Pastikan database `sefila_db` sudah dibuat
- Jalankan `npx prisma migrate reset` jika perlu reset database
