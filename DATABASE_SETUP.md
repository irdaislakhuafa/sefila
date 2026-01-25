# SEFILA - Setup Database

## Langkah-langkah Setup Database

### 1. Buat Database MySQL

Masuk ke MySQL dan jalankan:

```sql
CREATE DATABASE sefila_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Konfigurasi .env

Edit file `backend/.env` dan sesuaikan dengan konfigurasi MySQL Anda:

```env
DATABASE_URL="mysql://username:password@localhost:3306/sefila_db"
```

Contoh:
```env
DATABASE_URL="mysql://root:admin123@localhost:3306/sefila_db"
```

### 3. Jalankan Migrasi

Di folder `backend`, jalankan:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. (Opsional) Buat Akun Admin

Untuk membuat akun admin pertama, Anda bisa menggunakan Prisma Studio:

```bash
npx prisma studio
```

Atau langsung via SQL:

```sql
USE sefila_db;

-- Password terenkripsi untuk: admin123
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

Login dengan:
- **Email**: admin@sefila.com
- **Password**: admin123

### 5. Verifikasi

Cek apakah tabel sudah terbuat:

```sql
USE sefila_db;
SHOW TABLES;
```

Anda seharusnya melihat tabel:
- `users`
- `pendaftaran`
- `hasil_lab`
- `_prisma_migrations`

## Troubleshooting

### Error: "Can't connect to MySQL server"

- Pastikan MySQL service sudah berjalan
- Periksa host, port, username, dan password di DATABASE_URL

### Error: "Access denied for user"

- Pastikan username dan password MySQL benar
- Pastikan user memiliki hak akses ke database

### Error: "Unknown database"

- Pastikan database `sefila_db` sudah dibuat
- Jalankan perintah CREATE DATABASE terlebih dahulu
