@echo off
REM AI Builder - Install Script for Windows
REM Instalador para uso práctico en Windows

echo.
echo 🔧 AI Builder - Instalador Local
echo ================================

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Node.js no encontrado. Instala desde https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% detectado

REM Verificar npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ npm no encontrado.
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✓ npm %NPM_VERSION% detectado

REM Instalar dependencias
echo.
echo 📦 Instalando dependencias...
call npm install

REM Build
echo.
echo 🔨 Compilando proyecto...
call npm run build

REM Crear enlace global
echo.
echo 🔗 Configurando acceso global...
call npm link

REM Verificar
echo.
echo ✅ Verificando instalación...
where ai-builder >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ AI Builder instalado correctamente
    call ai-builder --help
) else (
    echo ⚠️  Usa: npx ai-builder para ejecutar desde aquí
    call npx ai-builder --help
)

echo.
echo 🎉 ¡Instalación completada!
echo.
echo Próximos pasos:
echo   1. ai-builder analyze .
echo   2. ai-builder admin --enable "tu-contraseña" "Mi-PC"
echo.
pause
