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
node -e "const [major,minor]=process.versions.node.split('.').map(Number);process.exit(major<22||(major===22&&minor<13)?1:0)"
if %ERRORLEVEL% NEQ 0 (
    echo ✗ AI Builder requiere Node.js 22.13.0 o superior.
    exit /b 1
)

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
call npm ci
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

REM Build
echo.
echo 🔨 Compilando proyecto...
call npm run build
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

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
    echo ℹ️  No se creó un enlace global; puedes ejecutarlo desde este directorio:
    call node ./bin/ai-builder.js --help
)

echo.
echo 🎉 ¡Instalación completada!
echo.
echo Próximos pasos:
echo   1. ai-builder analyze .
echo   2. ai-builder admin --enable
echo.
pause
