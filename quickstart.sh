#!/bin/bash

# AI Builder - Quick Start Script
# Script rápido para comenzar a usar AI Builder

set -e

echo "🚀 AI Builder - Inicio Rápido"
echo "============================"
echo ""

# Opción 1: Analizar proyecto
if [ $# -eq 0 ]; then
    echo "Uso: ./quickstart.sh <comando> [ruta o descripción]"
    echo ""
    echo "Comandos disponibles:"
    echo "  analyze <ruta>    - Analizar un proyecto"
    echo "  admin-setup       - Configurar admin"
    echo "  docs <ruta>       - Generar documentación"
    echo "  validate <ruta>   - Validar seguridad"
    echo "  generate <descripción> - Crear starter local"
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
        node ./bin/ai-builder.js analyze "$TARGET"
        ;;
    admin-setup)
        echo "🔐 Configurando administrador local..."
        node ./bin/ai-builder.js admin --enable
        echo "✅ Admin configurado correctamente"
        ;;
    docs)
        TARGET="${2:-.}"
        echo "📚 Generando documentación para: $TARGET"
        node ./bin/ai-builder.js docs "$TARGET"
        ;;
    validate)
        TARGET="${2:-.}"
        echo "✓ Validando: $TARGET"
        node ./bin/ai-builder.js validate "$TARGET"
        ;;
    generate)
        shift
        if [ $# -eq 0 ]; then echo "Incluye una descripción entre comillas."; exit 1; fi
        node ./bin/ai-builder.js generate "$@"
        ;;
    *)
        echo "✗ Comando no reconocido: $1"
        exit 1
        ;;
esac
