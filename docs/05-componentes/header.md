# Header

<p style="text-align: right;">  ← Volver a <a href="../05-componentes/README.md">Componentes</a></p>

## Propósito

`Header` renderiza el encabezado institucional (logos + navegación principal) y delega el renderizado en un View.

Incluye:

* logos institucionales obtenidos vía `useHeaderLogos`,
* menú principal obtenido vía `useMenu`,
* buscador como formulario GET con `action="/buscar"`,
* franja de alerta opcional controlada por prop (`alerta`).

---

## Importación

```jsx
import { Header } from 'common-ui';
```

---

## Uso mínimo

```jsx
<Header />
```

### Con alerta opcional

```jsx
<Header alerta="Mensaje institucional" />
```

---

## API (props)

### `alerta` (opcional)

* Tipo: `ReactNode`
* Comportamiento: si `alerta` es *truthy*, se renderiza una franja superior con el contenido provisto.
* Fuente de datos: la alerta se controla por props; en la implementación actual no se documenta un hook/endpoints como fuente para este contenido dentro de `Header`.

---

## Estados (`loading` / `error` / `empty`)

> `Header` consume datos para **logos** y **menú** mediante hooks. A continuación se describen los estados visibles del componente.

### Loading

* `HeaderView` marca el contenedor del encabezado con `aria-busy="true"` cuando `loading` es verdadero.

### Error

* Si `error` es *truthy*, `HeaderView` renderiza un aviso no bloqueante en la franja superior.

### Empty

* Si no hay datos de logos o menú, el estado puede resolverse como “sin datos” (`empty`) a nivel de hook.

  * `useHeaderLogos` usa `status: 'empty'` cuando no hay documentos aplicables o no encuentra logos para Header/Desktop.
  * Para el menú, el estado `empty` existe en `useMenuMeta` cuando no hay `docs` (y `useMenu` devuelve `[]` porque expone solo `items`).

---

## Accesibilidad (atributos, foco, links externos)

* Buscador: se documenta como formulario con `role="search"`, método GET y `action="/buscar"`, con label accesible (oculto).
* `Navbar.Toggle` se documenta con `aria-controls` coherente con el `id` del collapse.

---

## Estilos (tokens, clases, variantes)

* El componente usa CSS Modules (`Header.module.css`).
* Existe una clase `.alerta` para la barra de alerta, basada en tokens `--header-alert-*`.
* El buscador está estilado con clases `.buscador`, `.buscador-box`, `.buscador-input` y `.buscador-btn`, usando tokens y variables de Bootstrap (por ejemplo `--bs-link-color` y `--focus-ring`).

---

## Dependencias técnicas

* UI: `react-bootstrap` (`Navbar`, `Container`, `Nav`, `NavDropdown`).

* Requisito visual: la app consumidora debe cargar el CSS de Bootstrap (según la documentación actual del componente).

* Hooks relacionados:

  * `useHeaderLogos()` retorna `{ status, data, error }`.
  * `useMenu()` mantiene contrato y devuelve solo el array jerárquico de ítems.
  * `useMenuMeta()` expone `{ status, items, error }` para UI que necesite estados.

* `useHeaderAlert()` existe como stub (sin fetch real): retorna `status: 'empty'` y `message: null`.

---

## Referencias (links a Hooks / Contratos)

* Hook: [Hooks](../06-hooks/README.md)
* Contratos de datos: [Contratos de datos](../07-contratos-de-datos/endpoints-solr.md)
---
<p style="text-align: right;">  ← Volver a <a href="../05-componentes/README.md">Componentes</a></p>

