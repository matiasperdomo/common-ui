# common-ui (abc.gob.ar)

Librería compartida de UI para el ecosistema `abc.gob.ar`. Centraliza componentes, hooks, utilidades y tokens CSS institucionales para aplicaciones React.

---

## Modelo de consumo (importante)

`common-ui` **no se instala desde un registry/npm**. En `abc-home` se consume como **dependencia local** y el import `from 'common-ui'` se resuelve por configuración del proyecto.

* En `abc-home/package.json`, `common-ui` se declara como dependencia local:

  * `"common-ui": "file:../common-ui"`
* En `abc-home/vite.config.js`, `common-ui` se resuelve con un **alias** al código fuente:

  * `alias: { 'common-ui': path.resolve(__dirname, '../common-ui/src') }`
  * con `preserveSymlinks: true`

**Implicancia operativa:** para levantar `abc-home` en una máquina nueva, debe existir el repositorio `common-ui` en la ruta relativa `../common-ui` respecto de `abc-home`.

---

## Requisitos

La app consumidora debe proveer:

* `react` >= 18
* `react-dom` >= 18
* `react-bootstrap` >= 2
* `bootstrap` >= 5.3 (requerido para estilos)

> Nota: algunos componentes/hooks pueden depender de routing (React Router). Cuando aplique, ver el criterio en `docs/02-arquitectura.md`.

---

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

---

## API pública (resumen)

### Componentes

* `Header`
* `Footer`
* `RedesSociales`
* `Pagination`
* `PageSplit`
* `PageBreadcrumb`

### Hooks

* `useMenu`
* `useMenuMeta`

### Utilidades

* Drupal/URLs: `toAbsolute`, `toHref`, `normalizeDrupalFileUrl`
* API: `buildApiUrl`, `normalizeApiError`, `ApiError`
* YouTube: `getYouTubeId`, `getYouTubeEmbedUrl`, `getYouTubeThumbUrl`
* Fechas: `formatFechaLongEs`, `formatFechaLargoES`
* Fuentes: `ensureEncodeSans`, `ensureIconFontAwesome`
* Slugs: `slugify`, `buildSlugFq`, `getSlugFromAliasOrTitle`

### Ejemplo

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

---

## Convenciones

### Container + View

Los componentes principales se implementan en dos capas:

* **Container**: obtiene datos (por ejemplo, desde Solr), normaliza, resuelve URLs (Drupal) y administra estados (`loading` / `error` / `empty`).
* **View**: renderiza UI “pura” (sin dependencias a Solr/Drupal).

### Estilos

Se utiliza CSS Modules por componente y variables institucionales desde `src/styles/tokens.css`.

### Inicialización

Se recomienda importar `common-ui/globals` **una sola vez** en el entrypoint de la aplicación consumidora para cargar tokens y tipografía.

---

## Desarrollo (mantenimiento de la librería)

Esta sección aplica a quienes realizan cambios en `common-ui`. Los comandos se ejecutan desde la carpeta raíz del paquete.

### Compilación del paquete

Genera los artefactos de distribución en `dist/`.

```bash
npm run build
```

### Compilación en modo observación

Mantiene el proceso de compilación activo y recompila automáticamente ante cambios.

```bash
npm run build:watch
```
