# StatusMarket - Script de démarrage rapide (PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  StatusMarket - Demarrage rapide" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérification des fichiers .env
Write-Host "[1/4] Verification des fichiers .env..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.env")) {
    Write-Host "ERREUR: backend\.env n'existe pas!" -ForegroundColor Red
    Write-Host "Copiez backend\env.example vers backend\.env et configurez-le." -ForegroundColor Red
    Read-Host "Appuyez sur Entree pour quitter"
    exit 1
}

if (-not (Test-Path "frontend\.env")) {
    Write-Host "ERREUR: frontend\.env n'existe pas!" -ForegroundColor Red
    Write-Host "Copiez frontend\env.example vers frontend\.env et configurez-le." -ForegroundColor Red
    Read-Host "Appuyez sur Entree pour quitter"
    exit 1
}

Write-Host "[2/4] Verification de PostgreSQL..." -ForegroundColor Yellow
Write-Host "(Assurez-vous que PostgreSQL est demarre)" -ForegroundColor Gray

Write-Host "[3/4] Demarrage du backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "[4/4] Demarrage du frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Application demarree!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Entree pour fermer cette fenetre..." -ForegroundColor Gray
Read-Host


