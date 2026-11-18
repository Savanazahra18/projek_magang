@echo off
cd /d "%~dp0"
title MADIPRO - 1-Click Staging All-in-One Launcher
color 0B

echo ========================================================
echo       MADIPRO - 1-CLICK STAGING ALL-IN-ONE LAUNCHER
echo                 Relawan Nusantara
echo ========================================================
echo.
echo Sedang menyiapkan Staging Environment untuk Presentasi/Demo...
echo.

:: 1. Jalankan Backend Flask di Window Baru
echo [1/3] Menjalankan Backend Flask (Port 5001)...
if exist "backend\venv\Scripts\python.exe" (
    start "MADIPRO Backend (Flask Port 5001)" cmd /k "cd backend && venv\Scripts\python run.py"
) else (
    start "MADIPRO Backend (Flask Port 5001)" cmd /k "cd backend && python run.py"
)

:: Beri jeda 2 detik
timeout /t 2 /nobreak >nul

:: 2. Jalankan Frontend Next.js di Window Baru
echo [2/3] Menjalankan Frontend Next.js (Port 3001)...
start "MADIPRO Frontend (Next.js Port 3001)" cmd /k "cd frontend && npm run dev"

:: Beri jeda 3 detik
timeout /t 3 /nobreak >nul

:: 3. Jalankan Cloudflare Tunnel di Window Baru
echo [3/3] Menjalankan Cloudflare Live Staging Tunnel...
start "MADIPRO Live Public Tunnel (Staging Link)" cmd /k "echo Menghubungkan port 3001 ke Cloudflare Tunnel... && npx -y cloudflared tunnel --url http://localhost:3001"

echo.
echo ========================================================
echo   SEMUA SERVICE TELAH DIJALANKAN DALAM WINDOW TERPISAH!
echo ========================================================
echo.
echo Akses Lokal:
echo   - Frontend  : http://localhost:3001
echo   - Backend   : http://localhost:5001/api/health
echo.
echo Akses Staging Online untuk Mentor / Stakeholder:
echo   - Lihat link https://....trycloudflare.com pada window:
echo     "MADIPRO Live Public Tunnel (Staging Link)"
echo.
echo Akun Login Uji Coba:
echo   1. Divisi Program : program@relawannusantara.org
echo   2. Divisi Keuangan: keuangan@relawannusantara.org
echo   3. Direktur       : direktur@relawannusantara.org
echo.
echo Tekan sembarang tombol untuk membuka http://localhost:3001 di browser...
pause >nul

start http://localhost:3001

