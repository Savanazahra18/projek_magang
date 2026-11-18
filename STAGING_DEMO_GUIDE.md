# Panduan Staging & Demo Presentasi MADIPRO

Dokumen ini memandu Anda untuk menjalankan **Staging Environment & Live Demo** aplikasi MADIPRO untuk sesi review dan presentasi magang di Relawan Nusantara.

---

## 1. Arsitektur Staging MADIPRO

Untuk menjamin presentasi berjalan lancar, aman dari risiko *mixed-content* atau server *down*, sistem telah dikonfigurasi dengan arsitektur **Proxy Reverse-Tunnel**:

```
[ Browser Mentor / HP / Laptop ]
               │
               ▼ (HTTPS via Cloudflare Tunnel)
       https://*.trycloudflare.com
               │
               ▼
[ Next.js Frontend Server (Port 3001) ]
  ├── Halaman UI & Assets
  └── Next.js API Rewrite Proxy (/api/*)
               │
               ▼ (Internal 127.0.0.1:5001)
[ Flask Backend API (Port 5001) ]
               │
               ▼
[ PostgreSQL / SQLite Database ]
```

### Keunggulan Konfigurasi Ini:
1. **Satu Link untuk Semua:** Anda hanya perlu membagikan 1 link HTTPS ke mentor.
2. **Bebas Error CORS & Mixed-Content:** Semua panggilan data `/api/...` otomatis di-proxy oleh Next.js langsung ke Flask backend.
3. **Database Lokal Tetap Dipakai:** Semua akun login resmi dan data MIPro yang sudah kita input tetap utuh.

---

## 2. Cara Menjalankan Staging (1-Click)

Anda memiliki dua pilihan praktis:

### Opsi A: 1-Click All-in-One (`start-staging.bat`)
1. Di File Explorer Windows, buka folder `d:\projek magang`.
2. Klik **2 kali (Double-Click)** file:
   **`start-staging.bat`**
3. Tiga jendela Command Prompt akan terbuka otomatis:
   - Jendela 1: **Backend Flask (Port 5001)**
   - Jendela 2: **Frontend Next.js (Port 3001)**
   - Jendela 3: **Live Public Tunnel (Cloudflare)**
4. Browser laptop Anda akan langsung membuka `http://localhost:3001`.
5. Di jendela ke-3, salin link HTTPS yang berakhiran `.trycloudflare.com` untuk dibagikan ke mentor/stakeholder jika mereka ingin mencoba di HP/laptop masing-masing.

---

### Opsi B: Jalankan Tunnel Saja (`run-tunnel.bat`)
Jika Anda sudah biasa menjalankan `python run.py` dan `npm run dev` sendiri:
1. Buka file **`run-tunnel.bat`**.
2. Pilih opsi **1 (Cloudflare Tunnel)** atau **2 (Localtunnel)**.
3. Link staging publik siap digunakan.

---

## 3. Akun Login untuk Demo / Review

Sesuai dengan basis data tabel `users` yang telah kita buat:

| Role / Divisi | Email Login | Password Default | Akses Menu Utama |
| :--- | :--- | :--- | :--- |
| **Divisi Program** | `program@relawannusantara.org` | *(password akun program)* | Request Program, MIPro, Proposal, RAB, SPK, Monev |
| **Divisi Keuangan** | `keuangan@relawannusantara.org` | *(password akun keuangan)* | Verifikasi Dana Masuk, Pencairan Anggaran, Verifikasi Bukti CA, Fiksasi Sumber Dana, Review & Approval RAB |
| **Direktur** | `direktur@relawannusantara.org` | *(password akun direktur)* | Approval Proposal, Approval MIPro, Monitoring Program & Laporan |

---

## 4. Rencana Presentasi & Tips Menjawab Pertanyaan Reviewer

### Skenario Demo Fitur yang Direkomendasikan:
1. **Login sebagai Divisi Program:**
   - Tunjukkan pembuatan Request Program & Form MIPro.
   - Perlihatkan data anggaran/nominal yang diinput.
2. **Login sebagai Divisi Keuangan:**
   - Buka menu baru **Verifikasi Dana Masuk**.
   - Klik tombol **Aksi** pada baris data MIPro.
   - Tunjukkan detail formulir MIPro dan nominal anggaran di kolom kiri.
   - Tunjukkan logika verifikasi di kolom kanan:
     - Jika memilih **Tidak Verifikasi**: form bukti keuangan disembunyikan.
     - Jika memilih **Verifikasi**: form unggah bukti transfer/setoran, pilihan rekening bank, dan nomor referensi mutasi muncul lengkap.

### Contoh Jawaban Profesional Jika Ditanya Seputar Staging/Hosting:
> *"Untuk review magang kali ini, kami menyiapkan **Staging Environment dengan Secure Tunneling** agar bapak/ibu dapat langsung menguji coba di perangkat masing-masing secara live dan responsif. Semua alur data antara Next.js dan Flask sudah terintegrasi secara modular. Rencana tindak lanjut setelah seluruh masukan review ini disetujui adalah melakukan **Production Cloud Deployment** ke infrastruktur server yang ditentukan oleh tim IT Relawan Nusantara."*

