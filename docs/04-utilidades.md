# Utilidades

<p style="text-align: right;">  ← Volver a <a href="./03-tokens-diseno.md">Tokens de diseño</a> | Ir a <a href="./05-componentes/README.md">Componentes</a> →</p>

Este documento describe las utilidades públicas expuestas por `common-ui` para resolver tareas transversales (URLs Drupal, armado de URLs de API, fechas, YouTube, slugs, fuentes, etc.).

> Regla: solo se considera **API pública** lo que está exportado desde `src/index.js`. Si una utilidad existe en `src/utils/*` pero no está exportada, se considera **interna** y no debe documentarse como pública.

---

## Importación

Ejemplo de import desde la API pública:

```js
import { toAbsolute, toHref, toSafeHref, buildApiUrl } from 'common-ui';
```

---

## 1) Drupal y URLs

Estas utilidades cubren dos casos distintos:

* **URLs de archivos** (imágenes, adjuntos): normalización de `public://`, `/sites/default/files`, URLs absolutas, etc.
* **HREFs de navegación** (links): normalización de `internal:/`, bloqueo de esquemas inseguros, etc.

### 1.1 `toAbsolute(url)`

Convierte una referencia de Drupal a una URL absoluta utilizable en `src` (imágenes/archivos).

Casos típicos:

* `public://...` → `/sites/default/files/...` (y luego absoluto según host base)
* rutas relativas de archivos de Drupal → absoluto
* normaliza `http://` a `https://` cuando aplica

### 1.2 `normalizeDrupalFileUrl(rawUrl)`

Normaliza una URL de archivo de Drupal, con foco en robustez ante casos reales (por ejemplo, caracteres especiales en filenames).

**Ejemplo real (carácter `#` en filename):**

* Input:

```text
public://documentos/informe#final.pdf
```

* Output (ejemplo):

```text
https://abc.gob.ar/sites/default/files/documentos/informe%23final.pdf
```

Notas:

* El `#` debe escaparse (`%23`) para evitar que el navegador lo interprete como fragmento.
* El host exacto dependerá de la configuración/base usada por el proyecto.

### 1.3 `toHref(raw)`

Convierte un valor de enlace Drupal (por ejemplo `internal:/ruta`) en un **href** apto para navegación.

Uso típico:

* `internal:/sad/moreno/inicio` → `/sad/moreno/inicio`
* URLs absolutas `https://...` se preservan

### 1.4 `toSafeHref(raw)`

Wrapper defensivo para producir un `href` seguro:

* Bloquea esquemas inseguros (por ejemplo `javascript:`)
* Normaliza entradas vacías o inválidas

**Uso recomendado:** cuando el link proviene de datos externos (CMS/Solr) y se necesita una salida segura para renderizar en `<a href>`.

---

## 2) API: armado de URLs y errores

### 2.1 `buildApiUrl(pathOrUrl)`

Arma una URL absoluta para consumir endpoints (por ejemplo, Solr/API interna) a partir de un `path` o URL parcial.

* Si recibe una URL absoluta, la preserva.
* Si recibe un path, lo concatena con la base configurada.

### 2.2 `setApiBase(base)`

Setea la base de API usada por `buildApiUrl`.

**Uso previsto (advertencia):**

* Recomendado **solo para tests y desarrollo local**.
* En producción, preferir **configuración por entorno** y `buildApiUrl()` como única vía de armado.

> Motivo: cambiar la base en runtime introduce diferencias difíciles de auditar entre entornos y despliegues.

### 2.3 `ApiError` y `normalizeApiError(error)`

Utilidades para normalizar errores de API a una forma estable para UI (mensajes, status, etc.).

---

## 3) YouTube

### `getYouTubeId(url)`

Extrae el ID desde URLs comunes de YouTube.

### `getYouTubeEmbedUrl(urlOrId)`

Devuelve URL para iframe.

### `getYouTubeThumbUrl(urlOrId)`

Devuelve URL de miniatura.

---

## 4) Fechas

En `common-ui` existen dos formateadores con nombres muy parecidos, pero con **salidas distintas**.

### `formatFechaLongEs(isoLike)`

Convierte una fecha ISO (o ISO-like) a un formato largo localizado (`es-AR`) usando `toLocaleDateString`.

**Ejemplo:**

- Input: `2025-07-26`
- Output: `26 de julio de 2025`

Notas:
- Si el valor es falsy o inválido, devuelve `''`.
- La salida depende del formateo del runtime (`Intl`) pero se fija el locale `es-AR`.

### `formatFechaLargoES(fecha)`

Convierte una fecha a un formato estable `dd mes yyyy` (sin “de”) y con mes en minúsculas.
Además, intenta soportar entradas comunes:

- `YYYY-MM-DD` (ISO)
- `DD/MM/YYYY` (barra)
- otros formatos parseables por `Date`

**Ejemplos:**

- Input: `2025-11-10` → Output: `10 noviembre 2025`
- Input: `10/11/2025` → Output: `10 noviembre 2025`

Notas:
- Si no puede parsear, devuelve el string original (no vacío), para evitar “perder” información.
- El formato es deliberadamente uniforme y no depende de `Intl`.

### Criterio de uso (recomendación)

- Usar `formatFechaLongEs` cuando se necesita una fecha “natural” en castellano (con “de”, estilo institucional).
- Usar `formatFechaLargoES` cuando se necesita un formato estable y controlado `dd mes yyyy` (útil para UI con consistencia estricta).

---

## 5) Slugs

### `slugify(text)`

Normaliza texto para URL (minúsculas, guiones, sin caracteres problemáticos).

### `buildSlugFq(...)`

Construye un slug “completo” según convención del proyecto.

### `getSlugFromAliasOrTitle({ alias, path_alias, titulo, titulo_url })`

Deriva el slug desde:

1. `alias` o `path_alias` o `titulo_url`
2. si no existen, cae a `titulo`

---

## 6) Fuentes e íconos

Estas utilidades requieren navegador (usan `document.head`). No deben ejecutarse en SSR sin guardas.

### `ensureEncodeSans()`

Inserta los `<link>` necesarios para Encode Sans (evita duplicación por `id`).

### `ensureIconFontAwesome()`

Inserta el `<link>` de Font Awesome cuando una app lo requiere.

**Uso operativo:** ejecutar una sola vez en el entrypoint (o delegar en `common-ui/globals` si corresponde).

---


<p style="text-align: right;">  ← Volver a <a href="./03-tokens-diseno.md">Tokens de diseño</a> | Ir a <a href="./05-componentes/README.md">Componentes</a> →</p>
