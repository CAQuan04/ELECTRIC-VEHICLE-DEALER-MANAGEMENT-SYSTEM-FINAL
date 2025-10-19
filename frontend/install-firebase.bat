@echo off
echo ========================================
echo Installing Firebase SDK
echo ========================================
echo.

cd /d "%~dp0"

echo Installing firebase package...
call npm install firebase

echo.
echo ========================================
echo Firebase installation completed!
echo ========================================
echo.
echo Next steps:
echo 1. Configure .env file with Firebase credentials
echo 2. See FIREBASE_FACEBOOK_SETUP.md for setup instructions
echo 3. See FIREBASE_MIGRATION_GUIDE.md for code migration
echo.
pause
