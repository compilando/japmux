#!/bin/bash
# Script para probar la construcción de la imagen Docker para producción

echo "Iniciando la construcción de la imagen Docker para producción..."
echo "Tag de la imagen: japmux-prod-build-test:latest"
echo "Usando Dockerfile en el directorio actual."

docker build -t japmux-prod-build-test:latest -f Dockerfile .

if [ $? -eq 0 ]; then
  echo ""
  echo "--------------------------------------------------------------------"
  echo "¡Construcción de la imagen Docker completada exitosamente!"
  echo "Puedes ejecutar la imagen con un comando similar a:"
  echo "docker run -p 3000:3000 japmux-prod-build-test:latest"
  echo "--------------------------------------------------------------------"
else
  echo ""
  echo "--------------------------------------------------------------------"
  echo "Error durante la construcción de la imagen Docker."
  echo "Revisa los mensajes de error de Docker más arriba."
  echo "--------------------------------------------------------------------"
fi 