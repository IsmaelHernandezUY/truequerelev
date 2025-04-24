#!/bin/bash

# Salir si hay algún error
set -e

echo "📦 Instalando dependencias (con devDependencies incluidas)..."
npm ci

echo "🚧 Ejecutando build con Vite..."
npm run build

echo "✅ Build completo"
