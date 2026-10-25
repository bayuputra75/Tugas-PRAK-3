# Tugas 3 PRAK — Review Kantin API

API ini melanjutkan proyek Tugas 2 dengan validasi Zod, autentikasi JWT,
otorisasi role, dan dokumentasi OpenAPI 3.0. Struktur Repository → Service →
Controller → Router dan endpoint Tugas 2 tetap dipertahankan.

## Menjalankan aplikasi

Prasyarat: Node.js 22.18 atau lebih baru, npm, dan SQL Server dengan database
serta tabel Tugas 2 sudah tersedia.

```powershell
npm install
Copy-Item .env.example .env
```

Sesuaikan `.env` untuk SQL Server dan ganti `JWT_SECRET` dengan secret acak
yang hanya disimpan lokal. `JWT_EXPIRES_IN` mengatur usia token (default `2h`);
`BCRYPT_SALT_ROUNDS` mengatur biaya hashing password (default `10`).

Jika belum pernah mengisi database, jalankan seed data. Jika melanjutkan database
Tugas 2 yang sudah terisi, jalankan seed password saja untuk mengganti hash
placeholder akun uji menjadi bcrypt. Kemudian jalankan server:

```powershell
npm run db:seed
npm run db:seed-auth
npm run dev
```

`db:seed` hanya dijalankan sekali pada database kosong. `db:seed-auth` hanya
memperbarui password akun uji yang sudah ada. Semua akun uji memakai password
`rahasia123`:

| Akun | Role |
| --- | --- |
| `admin@example.com` | admin |
| `owner.pagi@example.com` | owner |
| `ayu@example.com` | customer |

## Akses API

Swagger UI tersedia di [`/docs`](http://localhost:3000/docs), dan dokumen mentah
di [`/docs/swagger.json`](http://localhost:3000/docs/swagger.json). Spesifikasi
OpenAPI 3.0 dibuat dari schema Zod dengan `npm run docs:gen`. API di bawah
memakai path langsung sesuai requirement; path lama `/api/v1/auth` dan
`/api/v1/stalls` tetap tersedia sebagai alias.

| Method | Endpoint | Akses |
| --- | --- | --- |
| GET | `/stalls` | Publik |
| GET | `/stalls/:id` | Publik |
| POST | `/stalls` | Owner, admin |
| PUT | `/stalls/:id` | Owner (warung miliknya), admin |
| DELETE | `/stalls/:id` | Admin |
| POST | `/stalls/:id/reviews` | Login, semua role |
| POST | `/auth/register` | Publik |
| POST | `/auth/login` | Publik |
| GET | `/auth/me` | Login, semua role |

Endpoint lain dari Tugas 2 juga dipertahankan di bawah `/api/v1`: menu, reviews,
likes, flags, audit, dan users. Route pengelolaan menu memeriksa kepemilikan
warung; users, flags, dan audit dibatasi untuk admin. GET menu/review serta
daftar review tetap publik. DELETE review khusus admin.

## Validasi dan autentikasi

- Input path, query, dan body divalidasi melalui middleware Zod. Satu error
  handler mengembalikan format konsisten, misalnya:

  ```json
  {
    "status": "fail",
    "message": "Validasi gagal",
    "errors": [
      { "field": "name", "message": "name minimal 3 karakter" }
    ]
  }
  ```

- `GET /stalls`: `search` string trim maksimal 100; `category` trim maksimal
  50; `page` integer minimal 1 (default 1); `limit` integer 1–100 (default 10).
- `GET /stalls/:id`, `PUT /stalls/:id`, `DELETE /stalls/:id`, dan review memakai
  ID integer positif.
- `POST /stalls`: `name` wajib, trim 3–100 karakter; `category` opsional
  maksimal 50; `location` opsional maksimal 100; `description` opsional maksimal
  1000. `PUT` menerima bentuk parsial field yang sama.
- `POST /stalls/:id/reviews`: `rating` integer 1–5 wajib; `comment` opsional
  trim maksimal 1000 karakter.
- Register memvalidasi `name` trim 3–100, `email` valid trim/lowercase maksimal
  150, dan `password` 8–72 karakter. Login menerima email valid dan password
  minimal satu karakter.
- Register publik selalu membuat role `customer`; role tidak dapat dipilih
  lewat body. Password disimpan dengan bcrypt. Login mengembalikan JWT HS256;
  kirim sebagai header `Authorization: Bearer <token>`.
- Identitas `ownerId` dan `userId` selalu diambil dari JWT. Jika token hilang,
  salah, atau kedaluwarsa, responsnya `401`; pengguna terautentikasi yang tidak
  berhak menerima `403`.

## Pengujian

```powershell
npx tsc --noEmit
npm run docs:gen
```

Alur manual: login dengan salah satu akun seed, gunakan token pada tombol
**Authorize** di `/docs`, lalu uji akses owner/admin/customer dan request invalid.
