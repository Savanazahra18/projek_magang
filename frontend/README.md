# Relawan Nusantara Frontend

Frontend Next.js untuk MADIPRO, aplikasi pengelolaan penyaluran program Relawan Nusantara. Deployment awal memakai data demo dan dapat berjalan tanpa backend atau database.

Lihat [README utama](../README.md) untuk tujuan proyek, lifecycle program, rencana modul, business rules yang belum final, serta workflow Git dan Pull Request.

## Technology Stack

- Next.js 15 dan React 19.
- TypeScript.
- Tailwind CSS 4 melalui PostCSS; sebagian komponen masih menggunakan CSS custom selama migrasi.
- npm dengan versi dependency yang dikunci di [`package-lock.json`](package-lock.json).

### Planned Backend and Database

- **Backend:** Flask — direncanakan untuk tahap integrasi backend.
- **Database:** PostgreSQL — direncanakan untuk tahap desain dan implementasi database.

Flask dan PostgreSQL belum digunakan oleh deployment frontend saat ini. Deployment Vercel hanya menjalankan aplikasi Next.js dengan data demo.

## Prerequisites

Gunakan Node.js LTS yang didukung dependency proyek dan npm. Tailwind yang terpasang membutuhkan Node.js minimal versi 20; Node.js 22 LTS dapat dipakai untuk lokal dan Vercel.

## Installation

Dari root repository:

```bash
cd frontend
npm install
cp .env.example .env.local
```

Jika terminal sudah berada di folder `frontend`, lewati `cd frontend`. File `.env.local` diabaikan Git dan tidak boleh di-commit.

## Development

Jalankan dari folder `frontend`:

```bash
npm run dev
```

Buka alamat yang ditampilkan Next.js, biasanya [http://localhost:3001](http://localhost:3001).

## Type Check and Production Build

Jalankan dari folder `frontend`:

```bash
npx tsc --noEmit
npm run build
```

Untuk menjalankan hasil production build secara lokal:

```bash
npm run start
```

## Environment Variables

Template tersedia di [`.env.example`](.env.example).

| Variable | Default | Keterangan |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | `development` | Label environment aplikasi. |
| `NEXT_PUBLIC_API_BASE_URL` | kosong | URL dasar backend, misalnya `https://api.example.com`. |
| `NEXT_PUBLIC_USE_DEMO_DATA` | `true` | Konfigurasi mode demo untuk integrasi data mendatang. |

Semua nilai dengan prefix `NEXT_PUBLIC_` dapat terlihat di browser. Jangan gunakan prefix ini untuk password, token privat, `DATABASE_URL`, atau credential server.

Next.js memasukkan nilai `NEXT_PUBLIC_*` ke bundle saat build. Lakukan redeploy setelah mengubah environment variable di Vercel.

## Demo Mode

Halaman saat ini menggunakan data demo secara langsung dan tidak memanggil backend. Untuk deployment awal, biarkan URL API kosong dan mode demo `true`.

Konfigurasi [`src/lib/env.ts`](src/lib/env.ts) dan helper [`src/lib/api.ts`](src/lib/api.ts) disiapkan untuk integrasi berikutnya. Mengubah flag demo menjadi `false` belum otomatis mengganti sumber data. Saat backend tersedia, hubungkan halaman ke helper API dan validasi endpoint sebelum menonaktifkan mode demo.

## Vercel Deployment

Import repository ke Vercel dan gunakan pengaturan berikut:

| Pengaturan | Nilai |
| --- | --- |
| Root Directory | `frontend` |
| Framework Preset | Next.js |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | Default Next.js; jangan diisi `out` atau `dist` |

Set environment variable sesuai target deployment:

| Variable | Development | Preview | Production |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | `development` | `preview` | `production` |
| `NEXT_PUBLIC_API_BASE_URL` | kosong | kosong | kosong |
| `NEXT_PUBLIC_USE_DEMO_DATA` | `true` | `true` | `true` |

URL API boleh tidak diisi sampai backend tersedia. Deployment ini belum menyediakan autentikasi server, penyimpanan database, atau integrasi backend.

## Frontend Structure

```text
frontend/
├── public/              # Gambar dan aset publik
├── src/
│   ├── app/             # Route, layout, dan CSS global Next.js
│   ├── components/      # Komponen bersama dan fitur
│   ├── context/         # State aplikasi di client
│   ├── lib/             # Konfigurasi env dan helper API
│   └── styles/          # CSS custom selama migrasi Tailwind
├── .env.example         # Template environment publik
├── next.config.mjs      # Konfigurasi Next.js
├── postcss.config.mjs   # Integrasi Tailwind CSS
└── package.json         # Dependency dan script frontend
```

## Troubleshooting

### `package.json` tidak ditemukan saat build

Root repository tidak memiliki `package.json` aplikasi. Jalankan perintah dari folder `frontend`, atau gunakan perintah berikut dari root:

```bash
npm --prefix frontend run build
npm --prefix frontend run dev
```

Pada Vercel, pastikan **Root Directory** diatur ke `frontend`.

### `next: command not found`

Pasang dependency terlebih dahulu dari folder `frontend`:

```bash
npm install
npm run dev
```

## Related Documentation

- [Overview dan workflow MADIPRO](../README.md).
- [Template environment](.env.example).
