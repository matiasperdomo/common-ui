# Pagination

<p style="text-align: right;"> ← Volver a <a href="../05-componentes/README.md">Componentes</a></p>

## Propósito

`Pagination` renderiza una paginación accesible basada en el markup estándar de Bootstrap (`.pagination`, `.page-item`, `.page-link`).

Incluye:

* botones de primera/última página,
* anterior/siguiente,
* ventana configurable de páginas visibles,
* elipsis (`…`) cuando hay salto entre rangos.

Cuando `totalPages <= 1`, el componente no renderiza nada (`null`).

---

## Importación

```jsx
import { Pagination } from 'common-ui';
```

---

## Uso mínimo

```jsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={(nextPage) => setPage(nextPage)}
/>
```

---

## API (props)

### `currentPage` (obligatoria)

* Tipo: `number`
* Página actual (1-based).

### `totalPages` (obligatoria)

* Tipo: `number`
* Total de páginas.

### `onPageChange` (obligatoria)

* Tipo: `(page: number) => void`
* Callback cuando se elige una página distinta a la actual.

Reglas:

* No dispara si `page` es igual a `currentPage`.
* No dispara si `page` está fuera de rango (menor a `1` o mayor a `totalPages`).

### `windowSize` (opcional)

* Tipo: `number`
* Default: `9`
* Cantidad de páginas visibles en la “ventana” central.

### `className` (opcional)

* Tipo: `string`
* Default: `''`
* Se aplica al `<nav>` contenedor (útil para márgenes o alineación externa).

### `ariaLabel` (opcional)

* Tipo: `string`
* Default: `"Paginación"`
* Se aplica a `aria-label` del `<nav>`.

---

## Accesibilidad (atributos, foco, links externos)

* Contenedor: `<nav aria-label="...">`.
* Página activa:

  * clase `active` en el `<li>`,
  * `aria-current="page"` en el botón correspondiente.
* Botones con `aria-label` específico:

  * “Primera página”,
  * “Página anterior”,
  * “Página siguiente”,
  * “Última página”.

---

## Estilos (tokens, clases, variantes)

* El componente usa clases de Bootstrap.
* Además, `tokens.css` define estilos institucionales globales para `.pagination` (espaciado, foco visible, compactación en mobile).

---

## Dependencias técnicas 

* Requiere que la app consumidora cargue el CSS de Bootstrap para que `.pagination` se renderice correctamente.

---

## Referencias (links a Hooks / Contratos)

* No aplica (componente sin hook propio).


---
<p style="text-align: right;"> ← Volver a <a href="../05-componentes/README.md">Componentes</a></p>

