# PageSplit

<p style="text-align: right;"> ← Volver a <a href="../05-componentes/README.md">Componentes</a></p>

## Propósito

`PageSplit` define un layout institucional de **fondo dividido** (gris arriba / blanco abajo) para mantener consistencia visual en pantallas con “panel + sidebar”.

Tiene dos modos:

* **Con panel** (`withPanel=true`): grilla en 2 columnas

  * izquierda: panel blanco (contenido principal)
  * derecha: columna auxiliar sobre el fondo gris
  * `breadcrumb` opcional, también sobre el fondo gris
* **Sin panel** (`withPanel=false`): contenedor simple (modo de compatibilidad)

---

## Importación

```jsx
import { PageSplit } from 'common-ui';
```

---

## Uso mínimo

### Uso recomendado (con panel)

```jsx
<PageSplit
  withPanel
  breadcrumb={<PageBreadcrumb />}
  panelInnerClassName="container py-4"
  right={<aside>Contenido lateral</aside>}
>
  <h1>Título</h1>
  <p>Contenido principal</p>
</PageSplit>
```

---

## API (props)

### Visual / fondo

#### `splitHeight` (default: `320`)

* Tipo: `number | string`
* Define la altura del tramo superior del fondo dividido (CSS var `--split-height`).
* Si es `number`, se interpreta como `px`.

#### `topColor` (opcional)

* Tipo: `string`
* Color del tramo superior (CSS var `--split-top`).

#### `bottomColor` (opcional)

* Tipo: `string`
* Color del tramo inferior (CSS var `--split-bottom`).

#### `noFullBleed` (default: `false`)

* Tipo: `boolean`
* Desactiva el comportamiento full-bleed (`100vw`) del fondo.

---

### Modo de layout

#### `withPanel` (default: `false`)

* Tipo: `boolean`
* Activa el modo panel + sidebar + breadcrumb.

---

### Slots / contenido

#### `breadcrumb` (default: `null`)

* Tipo: `ReactNode`
* Breadcrumb (o cualquier contenido) sobre el fondo gris.

#### `right` (default: `null`)

* Tipo: `ReactNode`
* Contenido de la columna derecha.

#### `children`

* Tipo: `ReactNode`
* Contenido principal (panel blanco en modo `withPanel=true`).

---

### Clases

#### `panelClassName` (default: `''`)

Clases adicionales para el contenedor del panel blanco.

#### `panelInnerClassName` (default: `''`)

Clases adicionales para el interior del panel (`.panel-inner`).

Uso típico: `"container py-4"`.

#### `rightClassName` (default: `''`)

Clases adicionales para la columna derecha.

#### `contentClassName` (default: `''`)

Solo aplica cuando `withPanel=false`.

#### `className` (default: `''`)

Clases adicionales para el wrapper general.

---

### Ajustes de separación / altura (CSS variables)

* `panelTopGap` (opcional) → `--panel-top-gap`
* `panelBottomGap` (opcional) → `--panel-bottom-gap`
* `panelMinHeight` (opcional) → `--panel-min-h`

#### `style` (opcional)

* Tipo: `object`
* Se mergea con las variables CSS que calcula el container.

---

## Accesibilidad (atributos, foco, links externos)

El componente es un layout. La accesibilidad depende de:

* que `breadcrumb` use estructura semántica (por ejemplo `PageBreadcrumb`),
* que el contenido principal use headings/landmarks correctos,
* que el contenido de `right` (si es sidebar) use `aside` (el View lo envuelve como `<aside>`).

---

## Estilos (tokens, clases, variantes)

`PageSplit.module.css` define:

* Fondo dividido con `::before` y `linear-gradient` (tramo superior e inferior).
* Full-bleed sin scroll horizontal (`left: 50%`, `width: 100vw`, `transform: translateX(-50%)`), con `overflow-x: clip` y fallback.
* Grilla responsive:

  * mobile: 1 columna
  * `>= 768px`: `2fr 1fr`
  * `>= 992px`: `3fr 1fr` (equivalente visual a 9/3)
* Estilo del panel izquierdo:

  * fondo blanco
  * borde redondeado solo a la derecha en desktop
  * sombra suave en desktop
  * en pantallas menores a `992px` se anula redondeo y sombra

---

## Dependencias técnicas

* Estilos del componente implementados con CSS Modules.
* Requiere que la app consumidora cargue Bootstrap si se usa `panelInnerClassName="container ..."` u otras clases Bootstrap en slots/clases.

---

## Referencias (links a Hooks / Contratos)

* No aplica (componente de layout, sin hook propio).

---
<p style="text-align: right;"> ← Volver a <a href="../05-componentes/README.md">Componentes</a></p>

