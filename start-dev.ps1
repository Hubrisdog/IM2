# start-dev.ps1

Write-Host "Firing up the RescueHub stack..." -ForegroundColor Cyan

# 1. Start MySQL Daemon (Launches minimized to keep your screen clean, but running)
Write-Host "-> Launching MySQL Daemon..." -ForegroundColor Yellow
Start-Process -FilePath "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqld.exe" -WindowStyle Minimized

# 2. Start Express Backend
Write-Host "-> Launching Express Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

# 3. Start Vite Frontend
Write-Host "-> Launching Vite Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

# 4. Start Prisma Studio (Optional but launched anyway)
Write-Host "-> Launching Prisma Studio (Port 5555)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npx prisma studio"

Write-Host "Stack successfully deployed. Go build something." -ForegroundColor Green
