#!/bin/bash

# AI Builder - Quick Start Script
# Script rápido para comenzar a usar AI Builder

set -e

echo "🚀 AI Builder - Inicio Rápido"
echo "============================"
echo ""

# Opción 1: Analizar proyecto
if [ $# -eq 0 ]; then
    echo "Uso: ./quickstart.sh <comando> [ruta]"
    echo ""
    echo "Comandos disponibles:"
    echo "  analyze <ruta>    - Analizar un proyecto"
    echo "  admin-setup       - Configurar admin"
    echo "  docs <ruta>       - Generar documentación"
    echo "  validate <ruta>   - Validar seguridad"
    echo ""
    echo "Ejemplos:"
    echo "  ./quickstart.sh analyze ./mi-proyecto"
    echo "  ./quickstart.sh admin-setup"
    exit 0
fi

case "$1" in
    analyze)
        TARGET="${2:-.}"
        echo "📊 Analizando: $TARGET"
        npx ai-builder analyze "$TARGET"
        ;;
    admin-setup)
        echo "🔐 Configurando acceso de administrador..."
        echo ""
        read -sp "Ingresa contraseña (min 12 caracteres): " PASSWORD
        echo ""
        read -p "Nombre de dispositivo: " DEVICE
        npx ai-builder admin --enable "$PASSWORD" "$DEVICE"
        echo ""
        echo "✅ Admin configurado correctamente"
        ;;
    docs)
        TARGET="${2:-.}"
        echo "📚 Generando documentación para: $TARGET"
        npx ai-builder docs "$TARGET"
        ;;
    validate)
        TARGET="${2:-.}"
        echo "✓ Validando: $TARGET"
        npx ai-builder validate "$TARGET"
        ;;
    *)
        echo "✗ Comando no reconocido: $1"
        exit 1
        ;;
esac
