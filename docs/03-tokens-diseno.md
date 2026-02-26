# Tokens de diseño

<p style="text-align: right;">  ← Volver a <a href="./00-resumen.md">Resumen</a> | Ir a <a href="./04-utilidades.md">Utilidades</a> →</p>

Este documento describe el sistema de **tokens de diseño** de `common-ui` (variables CSS y utilidades globales) y cómo debe consumirse desde una aplicación React.

---

## 1) Qué incluye `tokens.css`

`src/styles/tokens.css` concentra:

* **Paleta (primitivos)**: colores base institucionales y neutros.
* **Tokens semánticos**: texto, fondos, bordes, links y foco visible.
* **Overrides mínimos de Bootstrap** (variables `--bs-*`).
* **Base global** (tipografía y suavizado).
* **Utilidades globales** (clases helper).
* Estilos globales institucionales para **Pagination** y **Breadcrumb**.

> Objetivo operativo: proveer una base institucional reutilizable (tokens + utilidades globales) para frontends React, evitando estilos ad hoc por aplicación.

---

## 2) Cómo se cargan los tokens

Los tokens se cargan desde el entrypoint de la app importando **una sola vez**:

```js
import 'common-ui/globals';
```

`common-ui/globals` importa `tokens.css` y ejecuta la inicialización de la fuente institucional (Encode Sans).

→ Ver [Inicio rápido](./01-inicio-rapido.md)

---

## 3) Paleta (primitivos)

Los “primitivos” son valores base. No deberían usarse directamente en estilos de componentes salvo casos excepcionales; la prioridad es consumir **tokens semánticos**.

Primitivos principales definidos (ejemplos):

* Teal institucional: `--color-teal-600` (principal) y `--color-teal-300` (suave).
* Escala de grises: `--color-gray-100` … `--color-gray-800`.
* Acento fucsia: `--color-accent-600`.
* Gradiente (primitivos): `--color-gradient-pink`, `--color-gradient-blue`, `--color-gradient-cyan`.
* Tipografía base: `--font-sans` (Encode Sans + fallbacks).

### Ejemplo mínimo (primitivo vs semántico)

* ❌ `color: var(--color-teal-600)`
* ✅ `color: var(--link-color)`

---

## 4) Tokens semánticos

Los tokens semánticos definen el significado de uso, no el color “en bruto”. Esto permite mantener consistencia y facilitar cambios a futuro.

### Texto / fondos / bordes

* `--text-color`
* `--text-color-muted`
* `--bg-muted`
* `--border-color`

### Enlaces (institucional)

* `--link-color`
* `--link-color-muted`
* `--link-color-inverse`

### Foco visible (token)

* `--focus-ring`

Este token se consume desde una regla global `:focus-visible` para aplicar foco visible consistente mediante `box-shadow`.

### Gradiente institucional

* `--gradient-angle`
* `--brand-gradient`

Se define el gradiente como un token semántico y se parametriza el ángulo mediante utilidades (ver sección 6).

### Acento (botón institucional)

* `--accent-color`
* `--accent-color-hover`
* `--accent-color-active`
* `--accent-focus-shadow`

---

## 5) Overrides mínimos de Bootstrap

`tokens.css` define variables `--bs-*` para alinear Bootstrap con el sistema institucional:

* `--bs-font-sans-serif`
* `--bs-body-font-family`
* `--bs-body-color`
* `--bs-link-color`
* `--bs-link-hover-color`

**Importante:** estos overrides tienen efecto si Bootstrap está cargado en la aplicación consumidora (Bootstrap consume esas variables CSS).

---

## 6) Utilidades globales incluidas

### 6.1 Enlaces

Clases utilitarias:

* `.link` (link institucional sin subrayado por defecto)
* `.link--muted`
* `.link--inverse`

Además, se aplica una regla global para `<a>` usando variables `--bs-link-*`.

### 6.2 Gradiente institucional

* `.bg-brand-gradient` aplica `--brand-gradient` como fondo.
* `.text-brand-gradient` aplica el gradiente al texto con `background-clip`.

Control de ángulo mediante utilidades:

* `.bg-gradient-0`, `.bg-gradient-45`, `.bg-gradient-90`, `.bg-gradient-135`, `.bg-gradient-180`, `.bg-gradient-270`

Uso típico:

```html
<div class="bg-brand-gradient bg-gradient-135">...</div>
<h2 class="text-brand-gradient">Título</h2>
```

### 6.3 Helpers varios

* `.u-bg-muted` / `.bg-gris`
* `.rounded-20` (usa `--radius-2xl`)
* `.border-right-muted`
* `.border-bottom-brand`

### 6.4 Botón de acento institucional

`.btn-accent` define un botón “píldora” con acento fucsia, mayúsculas y foco propio (`--accent-focus-shadow`).

Uso típico:

```html
<button class="btn-accent" type="button">Ingresar</button>
```

---

## 7) Tipografía institucional

### Pesos y escala

Se definen pesos:

* `--font-weight-regular`
* `--font-weight-semibold`
* `--font-weight-bold`

Y una escala responsiva de headings mediante `clamp()`:

* `--h1-size` … `--h6-size`

### Normalización de headings

`h1..h6` quedan normalizados con:

* `font-family: var(--font-sans)`
* `color: var(--heading-color)` (teal institucional por defecto)
* márgenes verticales coherentes
* `text-wrap: balance` para mejorar cortes de línea en títulos

Además se proveen utilidades:

* `.u-h1`, `.u-h2`, `.u-h3`

Estas utilidades sirven cuando se requiere un estilo de título en un div/span sin usar un heading real.

---

## 8) Estilos globales institucionales

### 8.1 Pagination (Bootstrap)

Se define un estilo global para cualquier `<ul class="pagination">`:

Variables de paginación (ajustables en un solo lugar):

* `--pg-gap`
* `--pg-pill-radius`
* `--pg-min-width`
* `--pg-padding-y`
* `--pg-padding-x`

Se corrige un comportamiento típico de Bootstrap (margen negativo entre `.page-link`) reemplazándolo por `gap`.

Incluye foco visible en paginación (usa `--focus-ring`) y compactación para móviles (`@media (max-width: 576px)`).

### 8.2 Breadcrumb institucional

Se define estilo para `nav[aria-label="breadcrumb"] .breadcrumb`:

* tipografía institucional
* tamaño
* links con `--link-color` y peso semibold
* hover/underline consistente

---

## 9) Fuentes e íconos (referencias)

La inicialización de fuentes/íconos se ejecuta una única vez en el punto de entrada de la aplicación (directamente o vía `common-ui/globals`), evitando duplicación de `<link>`.

→ Ver [Utilidades](./04-utilidades.md)

---

<p style="text-align: right;">  ← Volver a <a href="./00-resumen.md">Resumen</a> | Ir a <a href="./04-utilidades.md">Utilidades</a> →</p>
