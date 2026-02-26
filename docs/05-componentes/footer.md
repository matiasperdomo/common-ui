## Footer

<p style="text-align: right;">  ← Volver a <a href="../05-componentes/README.md">Componentes</a></p>

## Propósito

`Footer` implementa el pie de página institucional. Obtiene datos mediante hooks, resuelve estados de carga/error/sin datos y delega el renderizado a `FooterView`.

Incluye:

* render responsive (mobile con acordeón / desktop en grilla),
* bloque de redes sociales (`<RedesSociales />`),
* comportamiento configurable ante error o ausencia de datos (`fallback`).

---

## Importación

```jsx
import { Footer } from 'common-ui';
```

---

## Uso mínimo

```jsx
<Footer />
```

---

## API (props)

### `fallback` (opcional)

Controla el comportamiento cuando no hay datos (`hasData === false`) o cuando ocurre un error.

* Tipo: `'none' | 'static'`
* Default: `'none'`

Comportamiento:

* `'none'`

  * error → renderiza un footer con `alert alert-warning`
  * sin datos → `return null` (no renderiza nada)
* `'static'`

  * error → renderiza un footer mínimo (sin alert)
  * sin datos → renderiza un footer mínimo

Ejemplo:

```jsx
<Footer fallback="static" />
```

### `staticModel` (opcional)

Modelo para el footer mínimo cuando `fallback="static"`.

* Tipo: `{ logos, columnas }`
* Si no se provee, se usa un modelo por defecto interno.

Notas:

* Las URLs del modelo estático se sanitizan con `toSafeHref()` (misma política que el footer dinámico).
* Si una URL no es válida/permitida, se convierte a `null` y el View la renderiza como texto (sin `<a>`).

Ejemplo:

```jsx
<Footer
  fallback="static"
  staticModel={{
    logos: { enlace: 'https://abc.gob.ar', desktop: null, mobile: null },
    columnas: {
      0: {
        Servicios: { enlaces: [{ texto: 'Inicio', url: 'https://abc.gob.ar' }] },
      },
    },
  }}
/>
```

---

## Estados (loading / error / empty)

### Loading

* Renderiza siempre un skeleton (`<FooterSkeleton />`).
* El skeleton se renderiza dentro de un `<footer>` con:

  * `role="contentinfo"`
  * `aria-label="Pie de página DGCyE"`
  * `aria-busy="true"`
  * `aria-live="polite"`

### Error

* Si `fallback === 'static'`: renderiza el footer mínimo (sin alert).
* Si `fallback === 'none'`: renderiza un `<footer>` con un `alert alert-warning` con el mensaje:

  * “No se pudo cargar el pie de página.”

### Empty (sin datos)

* Si `fallback === 'static'`: renderiza el footer mínimo.
* Si `fallback === 'none'`: no renderiza nada (`return null`).

---

## Accesibilidad (atributos, foco, links externos)

* El footer renderiza un `<footer>` con:

  * `role="contentinfo"`
  * `aria-label="Pie de página DGCyE"`

Mobile (acordeón):

* Botón por sección con:

  * `aria-expanded`
  * `aria-controls`
* Panel con:

  * `role="region"`
  * `aria-labelledby`
  * `aria-hidden` según estado abierto/cerrado

Links / texto:

* El View renderiza `<a>` solo si recibe `href` válido.
* Si `href` es `null`, renderiza texto plano (`<span>`).

Logo:

* Si `logos.enlace` es `null`, renderiza el logo sin `<a>` (solo imagen envuelta en `<span>` con `aria-label`).

Redes sociales:

* El contenedor de redes usa `role="group"` y `aria-label="Redes sociales"`.

---

## Estilos (tokens, clases, variantes)

* `FooterView` usa CSS Modules (`Footer.module.css`).
* Se apoya en utilidades/clases Bootstrap para grilla y breakpoints (por ejemplo `d-md-none`, `d-none d-md-block`, `row`, `col-*`).
* El skeleton y el estado de error usan clases Bootstrap (`placeholder-*`, `alert`, `bg-light`, `border-top`, etc.).

---

## Dependencias técnicas

* La app consumidora debe cargar el CSS de Bootstrap para que grilla, breakpoints, `alert` y `placeholder` se vean correctamente.
* El componente utiliza `toSafeHref()` para sanitizar enlaces (dinámicos y del `staticModel`).

---

## Referencias (links a Hooks / Contratos)

* Hooks: [Hooks](../06-hooks/README.md)
* Contratos de datos: [Contratos de datos](../07-contratos-de-datos.md)

---
<p style="text-align: right;">  ← Volver a <a href="../05-componentes/README.md">Componentes</a></p>