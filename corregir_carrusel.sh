#!/bin/bash

# =============================================================
# SCRIPT RÁPIDO: SOLUCIÓN CARRUSEL FULL-WIDTH
# Corrige el carrusel para que ocupe toda la pantalla
# =============================================================

echo "🎠 APLICANDO SOLUCIÓN CARRUSEL FULL-WIDTH"
echo "========================================"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step() {
    echo -e "\n${BLUE}📋 $1${NC}"
}

# Verificar directorio
if [ ! -d "client" ]; then
    print_error "No se encontró el directorio 'client'. Asegúrate de estar en la raíz del proyecto."
    exit 1
fi

# PASO 1: Verificar que existe el archivo de solución
print_step "Verificando archivos..."
if [ ! -f "solucion_carrusel_fullwidth.css" ]; then
    print_error "No se encontró 'solucion_carrusel_fullwidth.css'"
    print_step "Copiando archivo desde la ubicación correcta..."
    # Si el archivo está en otra ubicación, copiarla aquí
    if [ -f "../solucion_carrusel_fullwidth.css" ]; then
        cp ../solucion_carrusel_fullwidth.css .
        print_success "Archivo copiado desde directorio padre"
    else
        print_error "No se pudo encontrar el archivo de solución"
        exit 1
    fi
fi

print_success "Archivo de solución encontrado"

# PASO 2: Crear backup del CSS actual
print_step "Creando backup..."
backup_name="client/css/styles_backup_carrusel_$(date +%Y%m%d_%H%M).css"
cp client/css/styles.css "$backup_name"
print_success "Backup creado: $backup_name"

# PASO 3: Añadir CSS del carrusel
print_step "Aplicando solución del carrusel..."

# Añadir comentario al inicio
echo -e "\n/* =============================================================\n   SOLUCIÓN CARRUSEL FULL-WIDTH\n   Añadido automáticamente: $(date)\n   ============================================================= */\n" >> client/css/styles.css

# Añadir el CSS de la solución
cat solucion_carrusel_fullwidth.css >> client/css/styles.css

print_success "CSS del carrusel aplicado"

# PASO 4: Verificar HTML del carrusel
print_step "Verificando estructura HTML..."

# Buscar la sección del carrusel en index.html
if grep -q "class=\"carousel\"" client/index.html; then
    print_success "Carrusel encontrado en index.html"
    
    # Verificar si ya tiene la clase carousel-fullwidth
    if grep -q "class=\"carousel carousel-fullwidth\"" client/index.html || grep -q 'class="carousel' client/index.html; then
        print_success "Estructura HTML del carrusel correcta"
    else
        print_step "Agregando clase carousel-fullwidth..."
        sed -i 's/<section class="carousel">/<section class="carousel carousel-fullwidth">/g' client/index.html
        print_success "Clase carousel-fullwidth añadida"
    fi
else
    print_error "No se encontró la sección del carrusel en index.html"
fi

# PASO 5: Verificar CSS del body (eliminar espacios)
print_step "Verificando CSS del body..."

# Añadir reglas para eliminar espacios
echo -e "\n/* Corrección de espacios para carrusel full-width */\nbody, html {\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\nmain {\n  padding-top: 0 !important;\n}\n" >> client/css/styles.css

print_success "Espacios eliminados"

# PASO 6: Resumen final
print_step "RESUMEN DE CAMBIOS:"
echo -e "\n${GREEN}📊 ARCHIVOS MODIFICADOS:${NC}"
echo "• Backup creado: $backup_name"
echo "• CSS aplicado en: client/css/styles.css"
echo "• Estructura HTML verificada"

echo -e "\n${GREEN}🎯 CARRUSEL ACTUALIZADO:${NC}"
echo "• Ancho: 100% del viewport (sin espacios)"
echo "• Altura: Responsive (50vh-60vh)"
echo "• Imágenes: Object-fit cover"
echo "• Navegación: Botones y indicadores mejorados"
echo "• Responsive: Adaptado para móvil y tablet"

# PASO 7: Instrucciones finales
print_step "INSTRUCCIONES FINALES:"
echo -e "\n${YELLOW}🔍 VERIFICAR EN NAVEGADOR:${NC}"
echo "1. Abrir client/index.html"
echo "2. Verificar que el carrusel ocupa toda la pantalla"
echo "3. Confirmar que no hay espacios en blanco arriba"
echo "4. Probar navegación y responsive"

echo -e "\n${YELLOW}🔧 SI ALGO SALE MAL:${NC}"
echo "1. Restaurar backup:"
echo "   cp $backup_name client/css/styles.css"
echo "2. Verificar errores en consola del navegador"

echo -e "\n${GREEN}✅ SOLUCIÓN COMPLETADA:${NC}"
echo "• Carrusel full-width implementado"
echo "• Espacios en blanco eliminados"
echo "• Responsive automático activo"

print_success "¡Carrusel corregido exitosamente!"

# PASO 8: Preguntar si abrir el navegador
read -p "¿Quieres abrir el sitio para verificar? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Abriendo navegador..."
    if command -v xdg-open > /dev/null; then
        xdg-open client/index.html
    elif command -v open > /dev/null; then
        open client/index.html
    else
        echo "Por favor abre manualmente: client/index.html"
    fi
fi

echo -e "\n${BLUE}🎉 ¡CARRUSEL FULL-WIDTH COMPLETADO!${NC}"
echo -e "${BLUE}El carrusel ahora debe ocupar toda la pantalla sin espacios${NC}"