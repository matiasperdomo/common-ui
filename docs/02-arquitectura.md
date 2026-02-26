# Arquitectura

<p style="text-align: right;">  ← Volver a <a href="./00-resumen.md"> Resumen</a> | Ir a <a href="./03-tokens-diseno.md">Tokens de diseño</a> →</p>


Este documento describe la organización interna de `common-ui` y los criterios de implementación utilizados para mantener una librería estable, reusable y fácil de mantener.

---

## Estructura del repositorio

La librería se organiza en dos niveles:

- `src/`: código fuente (lo que se desarrolla y mantiene).
- `dist/`: artefactos compilados (lo que se publica/consume como paquete).

Dentro de `src/`:

- `src/components/`: componentes React.
- `src/hooks/`: hooks de datos/estado compartidos.
- `src/utils/`: utilidades transversales.
- `src/styles/`: estilos globales y tokens institucionales.
- `src/index.js`: **concentrador de exportaciones** (API pública del paquete).
- `src/globals.js`: inicialización global (tokens + fuentes).

---

## API pública y punto de entrada

**Criterio de API pública:**  todo lo que se considera “público” y soportado como contrato de consumo **debe estar exportado desde `src/index.js`**.  
Regla: **si no está exportado desde `src/index.js`, no se considera API pública** y no debería documentarse como tal en la sección principal.

### Import principal
Las aplicaciones consumidoras importan desde:

```js
import { Header, Footer } from 'common-ui';
```
Ese `import` expone únicamente lo exportado desde el archivo concentrador (`src/index.js`). En términos de arquitectura, ese archivo define qué se considera “API pública”.

### Inicialización global

La inicialización global se realiza mediante:

```js 
import 'common-ui/globals';
```

Este módulo se usa para cargar tokens globales y ejecutar inicializaciones de fuentes institucionales de forma centralizada.

## Organización por capas: Container + View
`common-ui` aplica un enfoque de dos capas para los componentes principales:
- **Container**: resuelve datos, estado, compatibilidad de interfaces (shape), control de carga/error/vacío, y prepara props.
- **View**: render puro (markup + clases + estructura accesible), asumiendo que recibe props ya “listas”.

### Reglas mínimas del patrón (obligatorias)
- **Container**: hace data fetching, normaliza datos y decide estados (`loading` / `error` / `empty`).
- **View**: no conoce Solr/Drupal; no hace fetch ni normalizaciones; no decide estados operativos.
- **URLs**: si un componente necesita resolver URLs (archivos o hrefs), lo hace el **Container** usando src/utils/drupal.js (por ejemplo `toAbsolute`, `toHref`, `toSafeHref`) y entrega al View URLs ya resueltas.

### Ejemplo: Header (Container)
`Header.jsx`:
- consume hooks (`useMenu`, `useHeaderLogos`)
- normaliza el formato de salida del hook del menú (soporta dos formatos: array directo o `{ data, status, error }`)
- calcula `loading` y `error`
- delega render a `HeaderView` pasando `logos`, `menuItems`, `alerta`, `loading`, `error`

Esto permite que el `HeaderView` no tenga que “saber” de endpoints ni de estados intermedios: recibe un set de props consistente.

### Ejemplo: Footer (Container)
`Footer.jsx`:
- consume `useFooterData`
- define un comportamiento operativo consistente:
    - muestra Skeleton mientras `loading` es `true`
    - muestra estado de error con un mensaje institucional
    - si no hay datos (`hasData`), no renderiza nada (evita armar un footer incompleto)
- delega render final a `FooterView`

Además, incluye una decisión explícita de compatibilidad: si el hook no expone `loading/error`, se definen defaults para no romper integraciones existentes.

### Ejemplo: PageSplit (Container “liviano”)
`PageSplit.jsx` ilustra un container que no consume datos, pero sí:
- calcula estilos CSS dinámicos (variables `--split-*`, `--panel-*`)
- centraliza lógica de configuración visual (altura, colores, gaps)
- delega estructura a `PageSplitView` y entrega `children` como contenido

Esto evita lógica de cálculo y normalización dentro del View.

## Routing (nota operativa)
Algunos componentes/hook pueden depender de `react-router-dom` (por ejemplo `Link` / `useLocation`). En esos casos, **la app consumidora debe proveer routing** y montar un Router (por ejemplo `BrowserRouter`) para que el componente funcione correctamente.

## Estilos: tokens globales + CSS Modules

### Tokens institucionales
Los tokens se definen en `src/styles/tokens.css` y establecen:

- variables globales (primitivos y semánticos)
- reglas institucionales comunes (por ejemplo, foco accesible)
- utilidades globales (clases helper)
- ajustes compatibles con Bootstrap (mediante variables CSS)

Los tokens se cargan vía `common-ui/globals`, de forma centralizada.

### CSS Modules por componente

Los componentes que lo requieren usan `*.module.css` para:
- evitar colisiones de estilos entre aplicaciones consumidoras
- encapsular reglas específicas de componente
- mantener consistencia de clases y nombres a nivel de módulo

El criterio general es:
- tokens y utilidades institucionales: globales (`tokens.css`)
- estilos específicos del componente: CSS Modules (`Component.module.css`)

## Hooks: contratos consistentes y normalización temprana

Los hooks en `src/hooks/` se utilizan como fuente de datos/estado para containers. Criterios:
-  tolerancia a formatos previos (compatibilidad hacia atrás)
- normalización temprana en el container (para no propagar complejidad al View)

En la práctica, esto se traduce en:
- normalizar `data/status/error`
- definir defaults cuando corresponda
- evitar que el View contemple escenarios atípicos derivados del contrato de datos

## Accesibilidad (criterios mínimos)

Criterios operativos mínimos:
- Links externos: usar `target="_blank"` con `rel="noopener noreferrer"` cuando aplique.
- Estados `loading`: skeleton con aria-busy="true" o texto alternativo equivalente (según el caso).
- Foco visible: se respeta el token/estilo global de foco (sin overrides ad hoc en componentes).

La regla operativa: **el container decide el estado** (loading/error/vacío) y el View renderiza una estructura que preserve semántica y navegabilidad.

## Cómo agregar un componente nuevo (proceso estándar)

1. Crear carpeta en `src/components/<componente>/`

2. Implementar:
    - `<Componente>.jsx` (Container)
    - `<Componente>View.jsx` (View)
    - `<Componente>.module.css` (si aplica)

3. Exportar desde `src/index.js` (para hacerlo API pública)
4. Documentar en `docs/05-componentes/<componente>.md`

Regla: **si no está exportado desde `src/index.js`, no se considera API pública** y no debería documentarse como tal en la sección principal.

----

<p style="text-align: right;">  ← Volver a <a href="./00-resumen.md"> Resumen</a> | Ir a <a href="./03-tokens-diseno.md">Tokens de diseño</a> →</p>