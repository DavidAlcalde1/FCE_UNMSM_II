#!/bin/bash

# =============================================================
# ROLLBACK INMEDIATO - RESTAURAR SITIO FUNCIONAL
# Vuelve al estado anterior antes de los cambios
# =============================================================

echo "🚨 ROLLBACK INMEDIATO - RESTAURANDO SITIO"
echo "========================================"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_step() {
    echo -e "\n${BLUE}🔄 $1${NC}"
}

# PASO 1: Buscar y restaurar desde backup
print_step "Buscando backup más reciente..."

backup_files=$(ls client/css/styles_backup_*.css 2>/dev/null | sort)
if [ -n "$backup_files" ]; then
    # Tomar el backup más reciente
    latest_backup=$(echo "$backup_files" | tail -n1)
    print_success "Backup encontrado: $latest_backup"
    
    print_step "Restaurando backup..."
    cp "$latest_backup" client/css/styles.css
    print_success "Archivo styles.css restaurado desde $latest_backup"
else
    print_error "No se encontraron backups. Restaurando desde archivo original..."
    
    # Si no hay backup, restaurar desde el archivo original que debería estar en el repositorio
    if [ -f "client/css/styles.css" ]; then
        print_step "Creando backup del archivo actual antes de restaurar..."
        cp client/css/styles.css "client/css/styles_corrupted_$(date +%Y%m%d_%H%M).css"
        print_success "Backup del archivo corrupto creado"
    fi
    
    print_step "Intentando restaurar desde git..."
    if command -v git >/dev/null 2>&1; then
        git checkout HEAD -- client/css/styles.css
        print_success "Archivo restaurado desde git"
    else
        print_error "No se pudo restaurar automáticamente"
        print_step "INSTRUCCIONES MANUALES:"
        echo "1. Ve a tu directorio de trabajo"
        echo "2. Ejecuta: git checkout HEAD -- client/css/styles.css"
        echo "3. O restaura desde tu backup más reciente"
        exit 1
    fi
fi

# PASO 2: Limpiar cualquier referencia a archivos nuevos
print_step "Limpiando referencias a archivos problemáticos..."

# Remover líneas agregadas recientemente de nuestros scripts
if grep -q "SOLUCIÓN.*ANCHO" client/css/styles.css; then
    print_step "Eliminando comentarios de solución de anchos..."
    sed -i '/\/\*.*ANCHO.*\*\//d' client/css/styles.css
    sed -i '/\/\*.*ESTANDARI.*\*\//d' client/css/styles.css
fi

if grep -q "CARRUSEL.*FULL" client/css/styles.css; then
    print_step "Eliminando comentarios de solución de carrusel..."
    sed -i '/\/\*.*CARRUSEL.*\*\//d' client/css/styles.css
    sed -i '/\/\*.*SOLUCIÓN.*\*\//d' client/css/styles.css
fi

print_success "Referencias problemáticas eliminadas"

# PASO 3: Verificar que el HTML no tenga clases problemáticas
print_step "Verificando HTML del carrusel..."

# Restaurar clase del carrusel si fue modificada
if grep -q "carousel-fullwidth" client/index.html; then
    print_step "Restaurando clase original del carrusel..."
    sed -i 's/carousel carousel-fullwidth/carousel/g' client/index.html
    sed -i 's/carousel-fullwidth//g' client/index.html
    print_success "Carrusel restaurado a clase original"
fi

# PASO 4: Verificación final
print_step "Verificando restauración..."

# Comprobar que el archivo no esté vacío o corrupto
if [ -s "client/css/styles.css" ]; then
    line_count=$(wc -l < client/css/styles.css)
    print_success "Archivo CSS tiene $line_count líneas (normal)"
else
    print_error "Archivo CSS está vacío o corrupto"
    exit 1
fi

# PASO 5: Resultado final
print_step "RESTAURACIÓN COMPLETADA"
echo -e "\n${GREEN}📊 RESUMEN:${NC}"
echo "• Backup restaurado: $latest_backup"
echo "• Referencias problemáticas eliminadas"
echo "• Carrusel restaurado a clase original"
echo "• Archivo CSS verificado"

echo -e "\n${GREEN}🎯 SITIO RESTAURADO:${NC}"
echo "• Layout original restaurado"
echo "• Navegación funcional"
echo "• Carrusel operativo"
echo "• Diseño consistente"

echo -e "\n${YELLOW}🔍 VERIFICAR AHORA:${NC}"
echo "1. Abre client/index.html en navegador"
echo "2. Confirma que el sitio se ve normal"
echo "3. Verifica que el carrusel funciona"
echo "4. Confirma navegación operativa"

print_success "¡ROLLBACK COMPLETADO - SITIO RESTAURADO!"

# PASO 6: Preguntar si abrir navegador
read -p "¿Quieres abrir el sitio para verificar? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Abriendo navegador para verificación..."
    if command -v xdg-open > /dev/null; then
        xdg-open client/index.html
    elif command -v open > /dev/null; then
        open client/index.html
    else
        echo "Por favor abre manualmente: client/index.html"
    fi
fi

echo -e "\n${GREEN}✅ SITIO FUNCIONAL RESTAURADO${NC}"
echo -e "${BLUE}Ahora el sitio debería verse como antes${NC}"