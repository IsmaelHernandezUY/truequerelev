#!/bin/bash

echo "Forzando instalación completa con devDependencies"
npm ci

echo "Ejecutando build de Vite"
npm run build
