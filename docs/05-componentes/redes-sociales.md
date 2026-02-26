# RedesSociales

<p style="text-align: right;"> ← Volver a <a href="../05-componentes/README.md">Componentes</a></p>

## Propósito

`RedesSociales` renderiza el bloque institucional de íconos de redes sociales a partir de datos obtenidos por el hook `useRedesSociales`.

Incluye:

* estado de carga con *skeleton*,
* links externos con buenas prácticas (`target="_blank"`, `rel="noopener noreferrer"`),
* mejoras de accesibilidad (`aria-label`, `title`, `alt`),
* variante de presentación para uso en columna lateral.

---

## Importación

```jsx
import { RedesSociales } from 'common-ui';
```

---

## Uso mínimo

```jsx
<RedesSociales />
```

---

## API (props)

### `variant` (opcional)

* Tipo: `string`
* Default: `"default"`

Valores con comportamiento actual:

* `"sidebar"`: aplica estilos de variante lateral.
* Cualquier otro valor: se comporta como `"default"`.

Ejemplo:

```jsx
<RedesSociales variant="sidebar" />
```

### `className` (opcional)

* Tipo: `string`
* Default: `""`

Se concatena a la clase raíz del componente.

---

## Estados (loading / error / empty)

### Loading

* Renderiza placeholders tipo *skeleton* dentro del listado.

### Error

* No renderiza nada (retorna `null`).

### Empty

* Si no hay ítems válidos para mostrar, no renderiza el bloque (retorna `null`).

---

## Accesibilidad (atributos, foco, links externos)

### Texto accesible

Cada ítem expone texto accesible mediante:

* `aria-label` en el `<a>`,
* `title` en el `<a>`,
* `alt` en el `<img>`.

Criterio:

1. Si el backend provee texto alternativo, se usa tal cual.
2. Si falta, se aplica un fallback institucional de contingencia.

### Links externos

Los links se renderizan como externos:

* `target="_blank"`
* `rel="noopener noreferrer"`

---

## Estilos (tokens, clases, variantes)

* El componente utiliza CSS Modules.
* La variante `"sidebar"` ajusta la presentación para columnas laterales (tamaño y layout), manteniendo el mismo comportamiento funcional.
* `className` permite ajustes de ubicación/espaciado desde la app consumidora.

---

## Dependencias técnicas

* No requiere routing.
* Consume datos vía `useRedesSociales` y resuelve URLs a partir de utilidades Drupal.

---

## Referencias (links a Hooks / Contratos)

* Hook: [Hooks](../06-hooks/README.md)
* Contratos de datos: [Contratos de datos](../07-contratos-de-datos/endpoints-solr.md)
---
<p style="text-align: right;"> ← Volver a <a href="../05-componentes/README.md">Componentes</a></p>