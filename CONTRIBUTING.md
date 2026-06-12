# Contribuir al proyecto

## Convenciones de código

### Commits
Usar formato convencional:
```
feat: nueva característica
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato
refactor: refactorización de código
test: cambios en tests
chore: cambios de configuración
```

Ejemplo:
```bash
git commit -m "feat: agregar módulo de reportes"
```

### Ramas
- `main` - Producción
- `develop` - Desarrollo
- `feature/nombre-feature` - Nuevas características
- `bugfix/nombre-bug` - Correcciones
- `hotfix/nombre-hotfix` - Fixes de emergencia

### Nombres de variables y funciones
- Usar camelCase para JavaScript
- Nombres descriptivos y en inglés
- Evitar abreviaturas

Ejemplo:
```javascript
// Bien
const getUserById = (id) => { }
const studentList = []

// Evitar
const getUD = (id) => { }
const sl = []
```

### Estilos CSS
- Usar clases en lugar de IDs
- Nombres descriptivos
- Organizar por componente

```css
/* Bien */
.button-primary {
  background: blue;
}

/* Evitar */
#btn {
  background: blue;
}
```

## Proceso de Pull Request

1. Fork el repositorio
2. Crear rama: `git checkout -b feature/mi-caracteristica`
3. Hacer cambios y commits
4. Push: `git push origin feature/mi-caracteristica`
5. Crear Pull Request
6. Esperar review
7. Mergear después de aprobación

## Testing

Antes de hacer push:
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Licencia

Al contribuir, aceptas que tu código será licenciado bajo MIT.
