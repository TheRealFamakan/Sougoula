@echo off
echo ========================================
echo   StatusMarket - Demarrage rapide
echo ========================================
echo.

echo [1/4] Verification des fichiers .env...
if not exist "backend\.env" (
    echo ERREUR: backend\.env n'existe pas!
    echo Copiez backend\env.example vers backend\.env et configurez-le.
    pause
    exit /b 1
)

if not exist "frontend\.env" (
    echo ERREUR: frontend\.env n'existe pas!
    echo Copiez frontend\env.example vers frontend\.env et configurez-le.
    pause
    exit /b 1
)

echo [2/4] Verification de PostgreSQL...
echo (Assurez-vous que PostgreSQL est demarre)

echo [3/4] Demarrage du backend...
start "StatusMarket Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [4/4] Demarrage du frontend...
start "StatusMarket Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Application demarree!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul


