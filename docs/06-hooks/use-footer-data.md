# useFooterData

<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>

## 1) Propósito

`useFooterData` transforma la salida cruda de `useFooter()` (docs de Solr) en un **modelo listo para render** por `Footer.jsx`: `logos`, `columnas` y `hasData`, reexponiendo `loading` y `error`.

**No hace:** no realiza la consulta HTTP directamente (eso lo hace `useFooter`), no renderiza UI, y no aplica estilos.

**Consumidor típico:** `Footer.jsx` consume `useFooterData()`.

---

## 2) Importación

```js
import { useFooterData } from 'common-ui';
```

---

## 3) Firma y retorno (API)

```ts
useFooterData(): {
  logos: {
    enlace: string | null
    desktop: string | null
    desktopAlt: string
    mobile: string | null
    mobileAlt: string
  }
  columnas: Record<number, Record<string, {
    delta?: number
    enlaces: Array<{ texto: string; url: string | null; delta?: number }>
  }>>
  hasData: boolean
  loading: boolean
  error: Error | null
}
```

Notas sobre el retorno:

* `logos.enlace` se sanitiza con `toSafeHref` y puede quedar `null`.
* `desktop`/`mobile` resultan de normalizar `public://...` con `fromPublicUri`.
* `columnas` es un objeto indexado por `foot_columna_delta` (número) y luego por nombre de sección.

---

## 4) Parámetros

No aplica (no recibe parámetros).

---

## 5) Endpoint y dependencias externas

`useFooterData` no consulta endpoints por sí mismo: depende de `useFooter()`.

Dependencias internas relevantes:

* `useFooter()` (consulta Solr y entrega `rawData/loading/error`).
* `fromPublicUri()` (normaliza URLs de archivos Drupal tipo `public://...`).
* `toSafeHref()` (sanitiza enlaces para uso seguro en UI).
* `useMemo()` (memoiza el armado del modelo).

---

## 6) Contrato mínimo esperado

El adaptador asume que `useFooter()` entrega un array de documentos (`docs`). Para construir un modelo completo, el contrato mínimo por bloque es:

### 6.1 Para `logos`

Se toma **el primer documento** que tenga alguna imagen de logo:

* `foot_logodesk_img_url` (string|array) **o** `foot_logomobil_img_url` (string|array)

Opcionales (con degradación):

* `foot_logodesk_img_alt` (si falta → `''`)
* `foot_logomobil_img_alt` (si falta → `''`)
* `foot_enlace_url` (si falta/invalid → `logos.enlace = null`)

### 6.2 Para `columnas`

Requeridos para que el item se incluya:

* `foot_columna_delta` (string|number|array) → debe convertirse a número válido
* `foot_tit_seccion` (string|array) → no vacío (se aplica `trim`)

Opcionales:

* `foot_tit_seccion_delta` (si falta → la sección queda sin delta y se ordena al final)
* `foot_enlace_texto` (si falta → `texto=''` y el enlace queda igualmente modelado)
* `foot_enlace_url` (si falta/invalid → `url=null`)
* `foot_enlace_delta` (si falta → el enlace se ordena al final)

Reglas de normalización:

* Campos multivalor: si llega `Array`, se usa el **primer valor**.
* URLs:

  * imágenes: `fromPublicUri(...)`
  * enlaces: `toSafeHref(...)`

---

## 7) Comportamiento (reglas)

### 7.1 Normalización multivalor

Para cualquier campo que pueda venir como array, se aplica una lectura defensiva: si es `Array`, se toma `value[0]`; si no, se usa el valor original.

### 7.2 Selección de logos

`logos` se arma a partir del **primer doc** que tenga `foot_logodesk_img_url` o `foot_logomobil_img_url`.

### 7.3 Armado de columnas

Cada doc válido se agrupa por:

* columna: `Number(foot_columna_delta)`
* sección: `trim(foot_tit_seccion)`

Cada sección acumula `enlaces[]`.

### 7.4 Enlaces sin URL (texto plano)

Existe una lista interna (`NO_LINK_TEXTS`) de textos que deben renderizarse **sin enlace**: si `texto` coincide, se fuerza `url=null`.

### 7.5 Ordenamiento por delta

* Secciones: por `foot_tit_seccion_delta` ascendente.
* Enlaces: por `foot_enlace_delta` ascendente.

Si el `delta` está ausente, se ordena al final.

### 7.6 hasData

`hasData` es `true` si:

* existe al menos una columna con contenido, **o**
* existe al menos un logo (`desktop` o `mobile`).

---

## 8) Estados

`useFooterData` reexpone estados de `useFooter()` y agrega `hasData`:

* **loading**: `true` mientras `useFooter()` está cargando.
* **error**: `Error` si `useFooter()` falla; en ese caso el modelo puede estar vacío.
* **empty (implícito)**: `!hasData` con `error=null` y `loading=false`.
* **success (implícito)**: `hasData=true` con `error=null` y `loading=false`.

---

## 9) Cancelación / cleanup

`useFooterData` no inicia requests ni timers. No requiere cleanup propio.

La cancelación/defensa ante unmount corresponde a `useFooter()`.

---

## 10) Notas de implementación

* El procesamiento se memoiza con `useMemo` para evitar recomputar el modelo en cada render.
* `NO_LINK_TEXTS` es una excepción deliberada para renderizar ciertos ítems como texto plano.

---

## 11) Ejemplo

Ejemplo real de consumo (patrón usado por `Footer.jsx`):

```jsx
import FooterView from './FooterView';
import { useFooterData } from 'common-ui';

export function FooterContainer() {
  const { logos, columnas, hasData, loading, error } = useFooterData();

  if (loading) return <div aria-busy="true">Cargando…</div>;
  if (error) return <div role="alert">No se pudo cargar el pie de página.</div>;
  if (!hasData) return null;

  return <FooterView logos={logos} columnas={columnas} />;
}
```
---
<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>