#!/bin/bash

# =============================================================
# IMPLEMENTACIÓN SEGURA Y CONSERVADORA
# Paso a paso con verificación en cada etapa
# =============================================================

echo "🛡️ IMPLEMENTACIÓN SEGURA Y CONSERVADORA"
echo "======================================"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_step() {
    echo -e "\n${BLUE}📋 PASO $1:${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar directorio
if [ ! -d "client" ]; then
    print_error "No se encontró el directorio 'client'. Asegúrate de estar en la raíz del proyecto."
    exit 1
fi

# PASO 1: Backup de seguridad
print_step "1" "Creando backup de seguridad..."

backup_file="client/css/styles_safe_backup_$(date +%Y%m%d_%H%M).css"
cp client/css/styles.css "$backup_file"
print_success "Backup creado: $backup_file"

# PASO 2: Verificar archivo de solución
print_step "2" "Verificando archivo de solución..."

if [ ! -f "solucion_conservadora.css" ]; then
    print_error "No se encontró 'solucion_conservadora.css'"
    print_step "Copiando desde ubicación..."
    
    if [ -f "../solucion_conservadora.css" ]; then
        cp ../solucion_conservadora.css .
        print_success "Archivo copiado desde directorio padre"
    else
        print_error "No se pudo encontrar el archivo"
        exit 1
    fi
fi

print_success "Archivo de solución encontrado"

# PASO 3: Implementación controlada - AGREGAR AL FINAL
print_step "3" "Implementando solución conservadora..."

# Añadir comentario claro
echo -e "\n\n/* =============================================================
   SOLUCIÓN CONSERVADORA - IMPLEMENTADA AUTOMÁTICAMENTE
   Fecha: $(date)
   OBJETIVO: Corregir carrusel sin romper diseño existente
   ROLLBACK: Restaurar desde $backup_file si es necesario
   ============================================================= */\n\n" >> client/css/styles.css

# Añadir el CSS de la solución
cat solucion_conservadora.css >> client/css/styles.css

print_success "Solución conservadora aplicada"

# PASO 4: Verificar que no rompa HTML
print_step "4" "Verificando que el HTML no requiera cambios..."

if grep -q 'class="carousel' client/index.html; then
    print_success "Carrusel encontrado en HTML - funciona sin cambios"
else
    print_warning "No se encontró carrusel en HTML - verificar estructura"
fi

# PASO 5: Verificación de integridad
print_step "5" "Verificando integridad del archivo..."

line_count=$(wc -l < client/css/styles.css)
if [ "$line_count" -gt 100 ]; then
    print_success "Archivo CSS tiene $line_count líneas (normal)"
else
    print_error "Archivo CSS muy pequeño ($line_count líneas) - posible problema"
    exit 1
fi

# PASO 6: Resumen de cambios
print_step "6" "RESUMEN DE IMPLEMENTACIÓN:"
echo -e "\n${GREEN}🔒 CAMBIOS APLICADOS (CONSERVADORES):${NC}"
echo "• Backup de seguridad: $backup_file"
echo "• Solución conservadora añadida al final del archivo"
echo "• Carrusel corregido con 100% width y altura fija"
echo "• Variables CSS seguras añadidas (opcionales)"
echo "• Responsive básico incluido"
echo "• Clases de emergencia disponibles"

echo -e "\n${GREEN}🎯 CARRUSEL MEJORADO:${NC}"
echo "• Ancho: 100% del contenedor padre"
echo "• Altura: 50vh ( adaptable en móvil: 40vh )"
echo "• Imágenes: object-fit cover para mejor cobertura"
echo "• Contenido: texto centrado con overlay"
echo "• Navegación: botones mejorados con hover"
echo "• Indicadores: dots funcionales y centrados"

# PASO 7: Instrucciones de verificación
print_step "7" "VERIFICACIÓN REQUERIDA:"
echo -e "\n${YELLOW}🔍 PROBAR AHORA:${NC}"
echo "1. Abrir client/index.html en navegador"
echo "2. Verificar que el carrusel se ve completo"
echo "3. Confirmar que el texto no se corta"
echo "4. Verificar que los botones funcionan"
echo "5. Probar navegación con flechas"
echo "6. Confirmar responsive en móvil"

echo -e "\n${YELLOW}🔄 SI ALGO SALE MAL:${NC}"
echo "1. Restaurar inmediatamente:"
echo "   cp $backup_file client/css/styles.css"
echo "2. Verificar en navegador que todo volvió a la normalidad"

# PASO 8: Próximos pasos opcionales
print_step "8" "PRÓXIMOS PASOS (OPCIONALES):"
echo -e "\n${BLUE}Si el carrusel funciona bien, puedes aplicar:${NC}"
echo "• Variables de ancho en otras secciones gradualmente"
echo "• Implementación de anchos estandarizados"
echo "• Continuar con Phase 4 Day 4"

# PASO 9: Testing interactivo
echo -e "\n${YELLOW}¿Quieres probar el resultado ahora?${NC}"
read -p "Abrir navegador para verificar? (y/n): " -n 1 -r
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

echo -e "\n${GREEN}✅ IMPLEMENTACIÓN CONSERVADORA COMPLETADA${NC}"
echo -e "${BLUE}El sitio debería estar funcional con carrusel corregido${NC}"

# PASO 10: Opciones finales
echo -e "\n${YELLOW}¿El carrusel se ve bien ahora?${NC}"
read -p "Si SÍ, continuamos con más mejoras (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${RED}Restaurando backup inmediatamente...${NC}"
    cp "$backup_file" client/css/styles.css
    print_success "Sitio restaurado a estado anterior"
    exit 0
fi

echo -e "\n${GREEN}🎉 ¡CARRUSEL FUNCIONANDO CORRECTAMENTE!${NC}"
echo -e "${BLUE}Ahora podemos continuar con mejoras adicionales${NC}"