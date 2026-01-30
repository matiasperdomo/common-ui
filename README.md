# common-ui (abc.gob.ar)

Librería compartida de UI para el ecosistema `abc.gob.ar`. Centraliza componentes, hooks, utilidades y tokens CSS institucionales para aplicaciones React.

## Requisitos
La app consumidora debe proveer:
- react >= 18
- react-dom >= 18
- react-bootstrap >= 2
- bootstrap >= 5.3 (requerido para estilos)

## Integración recomendada (Quick start)

En el punto de entrada de la aplicación (por ejemplo, `src/main.jsx`), se recomienda inicializar estilos y tipografía institucional importando:

```js
// src/main.jsx (app consumidora)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'common-ui/globals';
```

A partir de allí, los componentes pueden importarse desde el paquete:

```js
import { Header, Footer } from 'common-ui';
```
## API pública (resumen)

### Componentes
- Header
- Footer
- RedesSociales
- Pagination
- PageSplit
- PageBreadcrumb

### Hooks
- useMenu
- useMenuMeta

### Utilidades
- Drupal/URLs: `toAbsolute`, `toHref`, `normalizeDrupalFileUrl`
- API: `buildApiUrl`, `normalizeApiError`, `ApiError`
- YouTube: `getYouTubeId`, `getYouTubeEmbedUrl`, `getYouTubeThumbUrl`
- Fechas: `formatFechaLongEs`, `formatFechaLargoES`
- Fuentes: `ensureEncodeSans`, `ensureIconFontAwesome`
- Slugs: `slugify`, `buildSlugFq`, `getSlugFromAliasOrTitle`

**Nota (Fechas)**
- `formatFechaLongEs(fecha)` → Ej.: `formatFechaLongEs('2025-07-26')` → `"26 de julio de 2025"`
- `formatFechaLargoES(fecha)` → Ej.: `formatFechaLargoES('2025-11-10')` → `"10 noviembre 2025"`

#### Ejemplo
```js
import {
  Header,
  Footer,
  Pagination,
  useMenu,
  toHref,
  buildApiUrl,
} from 'common-ui';
```
## Convenciones
### Container + View
Los componentes principales se implementan en dos capas: un contenedor (datos/estado) y una vista (render).

### Estilos
Se utiliza CSS Modules por componente y variables institucionales desde `src/styles/tokens.css`.

### Inicialización
Se recomienda importar `common-ui/globals` una única vez en el entrypoint de la aplicación consumidora para cargar tokens y tipografía.

## Desarrollo (mantenimiento de la librería)
Esta sección aplica a quienes realizan cambios en `common-ui`. Los comandos se ejecutan desde la carpeta raíz del paquete.

### Compilación del paquete
Genera los artefactos de distribución en `dist/` (bundle de la librería).

```bash
npm run build
```
### Compilación en modo observación (recompilación automática)
Mantiene el proceso de compilación activo y recompila automáticamente ante cambios en el código fuente.
```bash
npm run build:watch
```