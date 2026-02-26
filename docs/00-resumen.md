# common-ui — Resumen

Librería compartida de interfaz (UI) para el ecosistema `abc.gob.ar`. Centraliza **componentes**, **hooks**, **utilidades** y **tokens de diseño** para aplicaciones React.

## Alcance

Esta librería provee:

- **Tokens de diseño institucionales** (CSS variables + utilidades globales + overrides mínimos de Bootstrap).
- **Componentes reutilizables** (Header, Footer, Breadcrumb, PageSplit, Pagination, RedesSociales).
- **Hooks** para consumo de datos/estado asociado a UI (por ejemplo, menú).
- **Utilidades** transversales (URLs Drupal, armado de URL de API, helpers de fechas, YouTube y slugs).

**Fuera de alcance:** common-ui no define páginas completas ni reglas funcionales específicas de una aplicación. Cada frontend compone sus páginas y resuelve su lógica de negocio utilizando los componentes, hooks y utilidades provistos por la librería.

Además:

- No **provee routing**: si se consumen componentes que dependen de `Link` / `useLocation`, la app consumidora debe montar un Router (por ejemplo, `BrowserRouter`).
- No **inicializa librerías de íconos por defecto** (por ejemplo, Font Awesome): si la app las requiere, debe inicializarlas explícitamente.

## Índice de documentación

- [Inicio rápido](./01-inicio-rapido.md)
- [Arquitectura](./02-arquitectura.md)
- [Tokens de diseño](./03-tokens-diseno.md)
- [Utilidades](./04-utilidades.md)
- [Componentes](./05-componentes/README.md)
  - [Header](./05-componentes/header.md)
  - [Footer](./05-componentes/footer.md)
  - [PageBreadcrumb](./05-componentes/page-breadcrumb.md)
  - [PageSplit](./05-componentes/page-split.md)
  - [Pagination](./05-componentes/pagination.md)
  - [RedesSociales](./05-componentes/redes-sociales.md)
- [Hooks](./06-hooks/)
  - [useHeaderLogos](./06-hooks/use-header-logos.md)
  - [useMenu](./06-hooks/use-menu.md)
  - [useFooter](./06-hooks/use-footer.md)
  - [useFooterData](./06-hooks/use-footer-data.md)
  - [useRedesSociales](./06-hooks/use-redes-sociales.md)
  - [usePageBreadcrumb](./06-hooks/use-page-breadcrumb.md)
- [Contratos de datos](./07-contratos-de-datos/endpoints-solr.md)


## API pública (visión general)

Listado de exports principales. Para el criterio de qué se considera “API pública” (y dónde se define), ver [Arquitectura](./02-arquitectura.md).

### Componentes

- `Header`
- `Footer`
- `RedesSociales`
- `Pagination`
- `PageSplit`
- `PageBreadcrumb`

### Hooks

- `useMenu`
- `useMenuMeta`: expone metadatos auxiliares del menú (shape/estado) para casos donde se necesite más que el listado principal.

### Utilidades

- Drupal/URLs: `toAbsolute`, `toHref`, `normalizeDrupalFileUrl`, `toSafeHref`
- API: `buildApiUrl`, `normalizeApiError`, `ApiError`
- YouTube: `getYouTubeId`, `getYouTubeEmbedUrl`, `getYouTubeThumbUrl`
- Fechas:
  - **Preferida:** `formatFechaLargoES`
  - **Alias (compatibilidad):** `formatFechaLongEs`
- Fuentes: `ensureEncodeSans`, `ensureIconFontAwesome`
- Slugs: `slugify`, `buildSlugFq`, `getSlugFromAliasOrTitle` (export desde `./utils/slug`)

## Convención de estilos institucionales

La librería publica tokens y utilidades globales desde `tokens.css`:

- paleta + tokens semánticos
- overrides mínimos de Bootstrap (`--bs-*`)
- utilidades globales (links, gradientes, foco accesible, helpers)
- estilos globales institucionales para paginación y breadcrumb