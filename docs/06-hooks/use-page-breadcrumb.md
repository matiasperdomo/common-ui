# usePageBreadcrumb

<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>

## 1) Propósito

`usePageBreadcrumb` construye los **items de navegación** de un breadcrumb a partir del `pathname` actual de React Router.

**No hace:** no consulta endpoints y no renderiza UI. La capa de presentación (`PageBreadcrumbView`) se encarga **solo del render y estilos**, sin lógica de datos.

**Consumidor típico:** `PageBreadcrumb.jsx` consume `usePageBreadcrumb(props)` y delega el render en `PageBreadcrumbView`.

---

## 2) Importación

```js
import { usePageBreadcrumb } from 'common-ui';
```

---

## 3) Firma y retorno (API)

```ts
usePageBreadcrumb(options?): {
  items: BreadcrumbItem[]
  ariaLabel: string
}

type BreadcrumbItem = {
  label: string
  href: string | null
  active: boolean
  ellipsis?: boolean
}
```

Notas:

* Si `active === true`, el hook devuelve `href: null` para que el item no sea clickeable.
* El item de elipsis se identifica con `ellipsis: true`, `label: '…'` y `href: null`.

---

## 4) Parámetros

Todos los parámetros son opcionales y se pasan en el objeto `options`.

* `homeHref?: string` (default: `'/'`)

  * Efecto operativo: define el destino del item “HOME”.

* `homeLabel?: string` (default: `'HOME'`)

  * Efecto operativo: define el texto del item “HOME”.

* `overrides?: Record<string, string>` (default: `{}`)

  * Efecto operativo: reemplaza el `label` por coincidencia exacta de segmento (`overrides[seg]`).

* `transform?: (seg: string) => string` (default: `undefined`)

  * Efecto operativo: transforma el `label` cuando no hay override.

* `maxItems?: number` (default: `undefined`)

  * Efecto operativo: activa el modo compacto cuando `segments.length + 1 > maxItems`.

* `pathname?: string` (default: `undefined`)

  * Efecto operativo: fuerza un pathname (útil para tests). Si no se provee, se toma de `useLocation().pathname`.

---

## 5) Endpoint y dependencias externas

No aplica endpoint (no hay consultas).

Dependencias externas:

* `react-router-dom`: usa `useLocation()`.
* `react`: usa `useMemo()`.

---

## 6) Contrato mínimo esperado

* Requiere que exista un **Router** activo (porque siempre ejecuta `useLocation()`), incluso si se pasa `pathname`.

Contrato del `pathname`:

* Se asume string con formato de ruta (`/a/b/c`).
* Cada segmento puede venir URL-encoded; el hook intenta `decodeURIComponent` por segmento.

---

## 7) Comportamiento (reglas)

* **Segmentos:** divide por `/`, elimina vacíos, y decodifica cada segmento cuando es posible.
* **Etiquetas (`label`):** prioridad:

  1. `overrides[seg]`
  2. `transform(seg)`
  3. fallback: reemplaza `-`/`_` por espacio, `trim()`, `toUpperCase()`
* **Rutas acumuladas (`href`):** construye `/a`, `/a/b`, `/a/b/c`.
* **Item HOME:** siempre es el primer item (`active: false`).
* **Item activo:** el último segmento se marca `active: true` y se devuelve con `href: null`.
* **Modo compacto (`maxItems`):** devuelve `HOME / PRIMERO / … / ÚLTIMO` (el “primero” linkea a `/${segments[0]}`).

---

## 8) Estados

El hook no expone `status/loading/error`.

Interpretación operativa:

* Siempre devuelve al menos un item (HOME), por lo que no existe un estado “empty” explícito.
* Si el `pathname` es `'/'` (sin segmentos), `items` contiene solo HOME.

---

## 9) Cancelación / cleanup

No aplica: no inicia requests ni timers. No requiere cleanup.

---

## 10) Notas de implementación

* Memoiza `segments`, `paths` e `items` con `useMemo`.
* Aunque exista `pathname` para tests, el hook sigue requiriendo Router porque usa `useLocation()`.

---

## 11) Ejemplo

### Ejemplo mínimo

```jsx
import { usePageBreadcrumb } from 'common-ui';

export function BreadcrumbDebug() {
  const { items } = usePageBreadcrumb();
  return <pre>{JSON.stringify(items, null, 2)}</pre>;
}
```

### Ejemplo realista (patrón equivalente a `PageBreadcrumb.jsx`)

```jsx
import PageBreadcrumbView from './PageBreadcrumbView';
import { usePageBreadcrumb } from 'common-ui';

export default function PageBreadcrumb(props) {
  const { items, ariaLabel } = usePageBreadcrumb(props);
  return (
    <PageBreadcrumbView
      items={items}
      ariaLabel={ariaLabel}
      className={props.className}
    />
  );
}
```

### Ejemplo con overrides y modo compacto

```js
usePageBreadcrumb({
  homeLabel: 'INICIO',
  overrides: { sads: 'SAD' },
  maxItems: 4,
});
```
---
<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>