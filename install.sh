#!/bin/bash

# AI Builder - Install Script
# Instalador para uso práctico en cualquier sistema

set -e

echo "🔧 AI Builder - Instalador Local"
echo "================================"

# Detectar SO
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
else
    OS="unknown"
fi

echo "✓ Sistema detectado: $OS"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "✗ Node.js no encontrado. Instala Node.js >=22.13.0 desde https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node.js $NODE_VERSION detectado"
if ! node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major < 22 || (major === 22 && minor < 13) ? 1 : 0)'; then
    echo "✗ AI Builder requiere Node.js >=22.13.0"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "✗ npm no encontrado."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✓ npm $NPM_VERSION detectado"

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm ci

# Build
echo ""
echo "🔨 Compilando proyecto..."
npm run build

# Crear enlace global (opcional)
echo ""
echo "🔗 Configurando acceso global..."
if [ "$OS" != "windows" ]; then
    npm link 2>/dev/null || echo "⚠️  Usa 'sudo npm link' si necesitas acceso global"
else
    npm link
fi

# Verificar instalación
echo ""
echo "✅ Verificando instalación..."
if command -v ai-builder &> /dev/null; then
    echo "✓ AI Builder instalado correctamente"
    ai-builder --help
else
    echo "ℹ️  No se creó un enlace global; puedes ejecutarlo desde este directorio:"
    node ./bin/ai-builder.js --help
fi

echo ""
echo "🎉 ¡Instalación completada!"
echo ""
echo "Próximos pasos:"
echo "  1. ai-builder analyze ./tu-proyecto"
echo "  2. ai-builder admin --enable 'tu-contraseña-fuerte' 'Mi-Dispositivo'"
echo ""
