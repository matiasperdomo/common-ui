# PageBreadcrumb

<p style="text-align: right;"> ← Volver a <a href="../05-componentes/README.md">Componentes</a></p>


## Propósito

`PageBreadcrumb` renderiza un breadcrumb accesible basado en el `pathname` actual.

* El armado de ítems se resuelve en el hook `usePageBreadcrumb`.
* El render es presentacional y usa el markup estándar de Bootstrap (`nav` + `ol.breadcrumb` + `li.breadcrumb-item`).

---

## Importación

```jsx
import { PageBreadcrumb } from 'common-ui';
```

---

## Uso mínimo

```jsx
<PageBreadcrumb />
```

---

## API (props)

### `className` (opcional)

* Tipo: `string`
* Default: `''`
* Se concatena a `breadcrumb mb-0` en el `<ol>`.

### `homeHref` (opcional)

* Tipo: `string`
* Default: `'/'`
* Href del primer ítem (inicio).

### `homeLabel` (opcional)

* Tipo: `string`
* Default: `'HOME'`
* Etiqueta del primer ítem.

### `overrides` (opcional)

* Tipo: `Record<string, string>`
* Default: `{}`

Mapea segmentos “en crudo” a un label fijo.

Ejemplo:

```js
const overrides = {
  noticias: 'Noticias',
  calendario_escolar: 'Calendario escolar',
};
```

### `transform` (opcional)

* Tipo: `(segment: string) => string`
* Default: `undefined`

Función para transformar cada segmento (si no hay override).

Si no se provee:

* reemplaza `-` y `_` por espacios,
* y pasa el resultado a mayúsculas.

### `maxItems` (opcional)

* Tipo: `number`
* Default: `undefined`

Si la cantidad de ítems excede `maxItems`, el breadcrumb se compacta a:

`HOME` → primer segmento → `…` → último segmento (activo).

### `pathname` (opcional, uso técnico)

* Tipo: `string`
* Default: `undefined` (usa `useLocation().pathname`)

Pensado para testing o escenarios controlados. Aun proveyendo `pathname`, el hook sigue usando `useLocation()`, por lo que requiere Router.

---

## Accesibilidad (atributos, foco, links externos)

* Contenedor `nav` con `aria-label`.
* Ítem activo marcado con `aria-current="page"`.
* Ítem de elipsis renderizado como texto (`…`) sin link.

---

## Estilos (tokens, clases, variantes)

* Usa clases Bootstrap: `breadcrumb`, `breadcrumb-item`, `active`.
* `className` permite agregar clases al `<ol>`.

---

## Dependencias técnicas

* Requiere Router en la app consumidora (usa `react-router-dom`).
* Detalle ampliado de routing y dependencias: [Arquitectura](../02-arquitectura.md).

---

## Referencias (links a Hooks / Contratos)

* Hook: [usePageBreadcrumb](../06-hooks/use-page-breadcrumb.md)
---
<p style="text-align: right;"> ← Volver a <a href="../05-componentes/README.md">Componentes</a></p>