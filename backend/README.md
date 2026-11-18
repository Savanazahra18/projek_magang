# MADIPRO Backend (Flask Python)
**Manajemen Divisi Program — Relawan Nusantara**

Backend REST API berbasis **Python Flask** untuk melayani modul-modul pada aplikasi MADIPRO:
- **Authentication**: Login, registrasi staf, profil pengguna
- **Dashboard**: Ringkasan 8 metrik KPI, program berjalan, tugas tertunda, log aktivitas
- **Proposal**: CRUD data proposal, filter dinamis (status, program, lokasi, pencarian), unggah berkas
- **MOU (Memorandum of Understanding)**: Pustaka nota kesepahaman mitra, status legalitas, review klausul
- **Assessment**: Formulir survei komprehensif (Assessment Pohon, UMKM 12 bagian, Petani 12 bagian, dsb.)
- **Request Program**: Pengajuan program inisiatif baru dari cabang/relawan
- **Uploads**: Penanganan unggahan dokumen PDF & gambar foto dokumentasi survei lapangan

---

## 🚀 Persyaratan Sistem & Instalasi

### 1. Prasyarat
- Python 3.10+ (Terverifikasi menggunakan Python 3.13)
- Pip

### 2. Pemasangan Dependensi
Dependensi utama telah menggunakan pustaka inti yang ringan dan standar:
```bash
cd backend
pip install -r requirements.txt
```

Pustaka yang digunakan:
- `Flask`: Kerangka kerja web mikro WSGI
- `flask-cors`: Mengizinkan komunikasi lintas domain (CORS) dari frontend Next.js (`http://localhost:3001`)
- `Werkzeug`: Utilitas keamanan hashing password & penanganan nama berkas unggahan
- `python-dotenv`: Membaca variabel lingkungan dari berkas `.env`
- `sqlite3`: Basis data SQL relasional bawaan tanpa konfigurasi rumit

---

## 🗄️ Konfigurasi Basis Data PostgreSQL

Backend MADIPRO mendukung koneksi langsung ke **PostgreSQL**:
- Pustaka driver: `psycopg2-binary`
- Otomatis membuat database `madipro_db` jika belum ada di server PostgreSQL
- Otomatis membuat skema tabel (*Users, Proposals, MOUs, Assessments, Request Programs, Dashboard*)
- Otomatis melakukan *seeding* data awal

### Pengaturan di berkas `backend/.env`:
```ini
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=madipro_db
DB_USER=postgres
DB_PASSWORD=password_postgres_anda
FALLBACK_TO_SQLITE=1
```
> **Catatan**: Jika server PostgreSQL memerlukan password, cukup isi `DB_PASSWORD` di berkas `.env`. Jika PostgreSQL belum aktif atau password belum diisi, backend secara cerdas akan menggunakan SQLite lokal sementara agar sistem tidak crash.

### Skrip Verifikasi & Inisialisasi PostgreSQL:
```bash
python init_postgres.py
```

---

Dari folder `backend`:
```bash
python run.py
```
Server akan aktif di:
👉 **`http://127.0.0.1:5001`**

Saat pertama kali dijalankan, sistem otomatis:
1. Membuat direktori `instance/` dan berkas basis data SQLite `instance/madipro.db`
2. Membuat direktori penyimpanan berkas unggahan `uploads/`
3. Menjalankan skrip *seeder* data awal (akun demo, proposal, mou, assessment, dan aktivitas)

---

## 📡 Daftar Endpoint API (REST API)

### 1. Autentikasi (`/api/auth`)
| Method | Endpoint | Keterangan |
|---|---|---|
| `POST` | `/api/auth/login` | Login pengguna (Email & Kata sandi) |
| `GET` | `/api/auth/me` | Memperoleh data profil sesi aktif |
| `POST` | `/api/auth/register` | Pendaftaran pengguna baru |

**Kredensial Demo Awal:**
- **Email**: `admin@relawannusantara.org`
- **Kata Sandi**: `admin123`

---

### 2. Dashboard (`/api/dashboard`)
| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/dashboard/summary` | 8 kartu ringkasan KPI (Assessment, Proposal, MOU, MIPro, DSS, dsb.) |
| `GET` | `/api/dashboard/programs` | Daftar program berjalan dengan persentase kemajuan |
| `GET` | `/api/dashboard/tasks` | Daftar tugas penting & tenggat waktu |
| `GET` | `/api/dashboard/activities` | Riwayat aktivitas dan log sistem terkini |

---

### 3. Proposal (`/api/proposals`)
| Method | Endpoint | Parameter Query | Keterangan |
|---|---|---|---|
| `GET` | `/api/proposals` | `status`, `category`, `location`, `q` | Mendapatkan daftar proposal + total count KPI |
| `GET` | `/api/proposals/<id>` | - | Detail lengkap satu proposal |
| `POST` | `/api/proposals` | - | Mengajukan proposal baru |
| `PUT` | `/api/proposals/<id>/status` | - | Memperbarui status review dan catatan peninjau |
| `DELETE` | `/api/proposals/<id>` | - | Menghapus proposal |

---

### 4. MOU Kemitraan (`/api/mous`)
| Method | Endpoint | Parameter Query | Keterangan |
|---|---|---|---|
| `GET` | `/api/mous` | `status`, `category`, `location`, `q` | Daftar pustaka MOU & metrik status |
| `GET` | `/api/mous/<id>` | - | Detail lengkap MOU beserta data mitra |
| `POST` | `/api/mous` | - | Membuat/mengajukan draf MOU baru |
| `PUT` | `/api/mous/<id>/status` | - | Memperbarui status pengesahan & catatan legalitas |
| `DELETE` | `/api/mous/<id>` | - | Menghapus dokumen MOU |

---

### 5. Assessment Lapangan (`/api/assessments`)
| Method | Endpoint | Parameter Query | Keterangan |
|---|---|---|---|
| `GET` | `/api/assessments` | `type`, `status`, `q` | Daftar formulir survei (pohon, umkm, petani, dsb.) |
| `GET` | `/api/assessments/<id>` | - | Detail isian assessment lengkap (JSON data) |
| `POST` | `/api/assessments` | - | Menyimpan hasil survei assessment baru |
| `PUT` | `/api/assessments/<id>` | - | Memperbarui data atau verifikasi status |
| `DELETE` | `/api/assessments/<id>` | - | Menghapus data assessment |

---

### 6. Pengelolaan Berkas (`/api/uploads`)
| Method | Endpoint | Payload | Keterangan |
|---|---|---|---|
| `POST` | `/api/uploads` | `multipart/form-data` (`file`) | Mengunggah dokumen (PDF, Word, Foto JPEG/PNG) |
| `GET` | `/api/uploads/<filename>` | - | Mengunduh / menampilkan berkas statis |

---

### 7. Health Check
| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/health` | Cek status kesehatan server backend |

