@echo off
title MADIPRO - Live Staging Tunnel
color 0A

echo ========================================================
echo         MADIPRO - LIVE STAGING TUNNEL RUNNER
echo       Relawan Nusantara - Staging Environment
echo ========================================================
echo.
echo Pastikan Frontend (port 3001) dan Backend (port 5001)
echo sudah menyala sebelum menjalankan tunnel ini.
echo.
echo [1] Menggunakan Cloudflare Tunnel (Tanpa Password, Sangat Cepat)
echo [2] Menggunakan Localtunnel (loca.lt)
echo.
set /p choice="Pilih tools tunnel (ketik 1 atau 2, default: 1): "

if "%choice%"=="2" (
    echo.
    echo Menjalankan Localtunnel pada port 3001...
    echo Catatan: Buka link lalu jika diminta password, buka https://loca.lt/mytunnelpassword
    echo.
    npx localtunnel --port 3001
) else (
    echo.
    echo Menjalankan Cloudflare Tunnel pada port 3001...
    echo Tunggu beberapa detik hingga muncul link https://....trycloudflare.com
    echo Link tersebut siap Anda bagikan ke mentor/stakeholder!
    echo.
    npx cloudflared tunnel --url http://localhost:3001
)

pause

