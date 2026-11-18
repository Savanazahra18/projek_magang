# MADIPRO

Program Distribution Management System

MADIPRO adalah aplikasi internal untuk membantu pengelolaan proses penyaluran program Relawan Nusantara secara terstruktur, terdokumentasi, dan dapat ditelusuri.

Aplikasi ini dirancang untuk mendukung proses pengajuan program, pengembangan, persiapan, implementasi, hingga evaluasi dan pertanggungjawaban.

> **Project Status:** Frontend Development  
> **Repository:** `Iqrammaqsa/MADIPRO`  
> **Current Scope:** Frontend-first development. Backend integration and database design will be determined separately.

---

## Project Objectives

- Menstandarkan proses penyaluran program.
- Memusatkan pengelolaan data dan dokumen program.
- Mempermudah proses review, approval, dan revisi.
- Memantau status program berdasarkan tahapan.
- Menyimpan riwayat perubahan dan dokumen.
- Meningkatkan transparansi serta akuntabilitas penyaluran.

## Program Categories

MADIPRO mendukung empat kategori penyaluran:

| Category | Description |
| --- | --- |
| Program Kemitraan | Program berdasarkan permintaan, kebutuhan, atau kerja sama dengan mitra/donor. |
| Program Campaign | Program yang berasal dari penggalangan dana melalui kanal publik. |
| Program Aspirasi | Program berdasarkan pengajuan kebutuhan dari relawan atau masyarakat. |
| Program Kedaruratan | Program respons cepat terhadap kondisi darurat atau bencana. |

## General Program Lifecycle

Secara umum, proses penyaluran terdiri dari lima tahapan:

1. **Initiation** — penerimaan kebutuhan atau pengajuan program.
2. **Development** — assessment, pengembangan konsep, dan penyusunan proposal jika diperlukan.
3. **Preparation** — penyusunan MIPro, RAB/DSS, SPK, dan persiapan pencairan.
4. **Implementation** — pelaksanaan dan dokumentasi penyaluran.
5. **Evaluation** — pelaporan program, pertanggungjawaban keuangan/CA, dan penutupan.

Setiap kategori dapat memiliki aktivitas dan dokumen yang berbeda. Jangan menganggap seluruh kategori memiliki alur identik.

## Main Modules

MADIPRO direncanakan memiliki modul berikut:

| No. | Module | Main Features |
| --- | --- | --- |
| 1 | Authentication & User Management | Login, session, user management, roles, permissions |
| 2 | Master Data | Partner, program categories, locations, funding sources, templates |
| 3 | Program Intake | PRF Kemitraan, PRF Aspirasi, disaster information |
| 4 | Assessment & Feasibility | Field assessment and campaign verification |
| 5 | Proposal & Partnership | Proposal preparation, partner response, MoU |
| 6 | Campaign & Donation | Campaign publication, promotion, donation tracking |
| 7 | MIPro | MIPro creation, review, approval, PIC assignment |
| 8 | Budgeting (RAB/DSS) | Budget preparation, review, approval, revision |
| 9 | Finance & Disbursement | Incoming funds, funding source, disbursement |
| 10 | SPK | SPK creation, numbering, authorization |
| 11 | Implementation & Distribution | Implementation updates, beneficiary distribution, documentation |
| 12 | Reporting & CA | Program reports, financial reports, CA, final report |
| 13 | Workflow & Tracking | Program timeline, statuses, revision history, audit trail |
| 14 | Notifications | Review notifications, reminders, emergency notifications |
| 15 | Documents & Archive | Document repository, version history, search |
| 16 | Dashboard & Management Reports | Operational dashboard, financial summaries, exports |

## Technology Stack and Getting Started

MADIPRO menggunakan stack berikut:

| Layer | Technology | Status |
| --- | --- | --- |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4 | Aktif di `frontend/` |
| Backend | Flask | Direncanakan untuk tahap backend |
| Database | PostgreSQL | Direncanakan untuk tahap database |

Frontend menggunakan npm. Migrasi styling ke Tailwind masih berjalan; sebagian komponen tetap menggunakan CSS custom. Flask dan PostgreSQL belum diimplementasikan dalam repository ini.

Jalankan perintah berikut dari root repository:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Untuk production build dari root repository:

```bash
npm --prefix frontend run build
```

Panduan environment, validasi, dan deployment Vercel tersedia di [README frontend](frontend/README.md).

## Repository Structure

```text
MADIPRO/
├── frontend/
│   ├── public/          # Aset publik
│   ├── src/app/         # Route dan layout Next.js
│   ├── src/components/  # Komponen bersama dan fitur
│   ├── src/context/     # State aplikasi di client
│   ├── src/lib/         # Konfigurasi env dan helper API
│   └── src/styles/      # CSS custom selama migrasi Tailwind
└── README.md           # Overview proyek dan workflow repository
```

Backend Flask dan database PostgreSQL belum tersedia dalam repository ini. Deployment saat ini hanya menjalankan frontend dengan mock/demo data.

## Development Workflow

MADIPRO uses a branch-based Git workflow.

### Main Branch

`main` is the stable integration branch.

Do not push feature work directly to `main`.

### Feature Branches

Use descriptive branch names:

```bash
feature/dashboard
feature/program-list
feature/prf-form
feature/program-detail
fix/sidebar-navigation
refactor/shared-components
```

### Daily Workflow

Before starting work:

```bash
git switch main
git pull origin main
# Buat branch baru untuk pekerjaan baru
git switch -c feature/your-feature
```

Untuk branch fitur yang sudah ada, gunakan `git switch feature/your-feature` lalu `git merge main`.

After completing a task:

```bash
git add .
git commit -m "feat: describe your change"
git push -u origin feature/your-feature
```

Then create a Pull Request targeting `main`.

### Pull Request Rules

- One PR should focus on one logical task.
- Include a clear description of the changes.
- Include screenshots for UI changes where useful.
- Explain how the changes were tested.
- Resolve merge conflicts before requesting review.
- Do not merge without the required approval.

## Development Principles

1. Keep the UI consistent across modules.
2. Prefer reusable components over duplicated implementations.
3. Use clear and consistent naming conventions.
4. Keep business logic separate from presentation where practical.
5. Validate forms and provide clear feedback.
6. Use mock data for frontend development until API contracts are established.
7. Do not hardcode business rules that have not been confirmed.
8. Preserve document and revision history requirements in future implementation.
9. Ensure the interface uses Bahasa Indonesia unless a technical term is more appropriate in English.
10. Test changes before submitting a Pull Request.

## Business Rules & Pending Confirmations

Some business decisions are still awaiting confirmation from the relevant stakeholders.

Examples:

- Final user roles and permission matrix.
- Approval authority for each program category and stage.
- RAB approval authority: the clarification document mentions CEO, while the functional requirement document specifies Director for most categories and Finance for Aspirasi.
- Exact status names and revision paths.
- Detailed form fields and document templates.
- Final notification events.

These items must not be treated as finalized implementation rules until confirmed.

## Project Documentation

Keep project documentation updated as implementation progresses.

| Document | Purpose |
| --- | --- |
| `README.md` | Project overview and setup |
| [`frontend/README.md`](frontend/README.md) | Frontend setup, environment, and deployment |
| Requirement documents | Business and functional requirements |
| Pull Requests | Implementation history and review records |

---

**MADIPRO — Program Distribution Management System**  
Relawan Nusantara
