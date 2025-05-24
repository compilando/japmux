#!/bin/bash
# Script de build para producción de JAPMUX

set -e  # Exit on any error

echo "🚀 Building JAPMUX for Production..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Limpiar build anterior
echo "🧹 Cleaning previous build..."
rm -rf .next
rm -rf out

# Instalar dependencias
echo "📦 Installing dependencies..."
npm ci --only=production

# Generar cliente API
echo "🔧 Generating API client..."
npm run generate:api

# Build de la aplicación
echo "🏗️ Building application..."
NODE_ENV=production npm run build

# Verificar que el build fue exitoso
if [ -d ".next" ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build size analysis:"
    du -sh .next
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Production build ready!" 