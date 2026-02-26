# useHeaderLogos

<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>

## 1) Propósito

`useHeaderLogos` obtiene desde Solr los **logos del Header (Desktop)** y devuelve un estado simple para que la capa de presentación arme el encabezado institucional.

**No hace:** no resuelve el menú, no decide layout, no maneja variantes Mobile (filtra solo `Desktop`), y no renderiza UI.

**Consumidor típico:** `Header.jsx` consume `useHeaderLogos()` y pasa `logos` a `HeaderView`.

---

## 2) Importación

```js
import { useHeaderLogos } from 'common-ui';
```

---

## 3) Firma y retorno (API)

```ts
useHeaderLogos(): {
  status: 'loading' | 'success' | 'empty' | 'error'
  data: {
    provincia: { src: string | null; alt: string; link: string | null } | null
    abc: { src: string | null; alt: string; link: string | null } | null
  } | null
  error: string | null
}
```

Notas sobre el retorno:

* `error` es **string** (mensaje), no un objeto `Error`.
* En `success`, `data` existe y puede tener `provincia` y/o `abc` en `null` (se considera éxito si existe al menos uno).

---

## 4) Parámetros

No aplica (no recibe parámetros).

---

## 5) Endpoint y dependencias externas

**Sistema:** Solr

* **Endpoint:** `home.pagina.logos/select`
* **Método:** `GET`
* **Query base:** `q=*:*` (el filtrado se realiza del lado cliente)

Dependencias externas / internas:

* `fetch` (navegador)
* `AbortController` (cancelación)
* `buildApiUrl(path, params)` (arma URL)
* `toAbsolute(url)` (normaliza URL de imagen a absoluta)
* `toHref(uri)` (normaliza enlaces Drupal a href navegable)

---

## 6) Contrato mínimo esperado

El hook asume que el endpoint devuelve `json.response.docs` como arreglo.

Para identificar y construir los logos se usan estos campos:

### Requeridos (para que un doc sea candidato)

* `tax_contexto` (string): se espera `'Header'`
* `tax_dispositivos` (string): se espera `'Desktop'`

### Opcionales (con degradación)

* `delta` (number): si falta, se ordena al final
* `clave` (string): si falta, se usa fallback por `titulo`
* `titulo` (string): se usa para fallback y para `alt`
* `imagen1_url` (string): si falta, `src=null`
* `imagen1_alt` (string): si falta, `alt` cae a `titulo` o `''`
* `enlace_uri` (string): si falta o no es convertible, `link=null`

Reglas de normalización:

* `src`: si existe `imagen1_url`, se normaliza con `toAbsolute(...)`.
* `link`: si existe `enlace_uri`, se normaliza con `toHref(...)`.

---

## 7) Comportamiento (reglas)

### 7.1 Filtro por contexto y dispositivo

Del conjunto de `docs`, mantiene solo los documentos donde:

* `tax_contexto === 'Header'` **y**
* `tax_dispositivos === 'Desktop'`

Si el filtro queda vacío, el estado final es `empty`.

### 7.2 Ordenamiento

Ordena los docs filtrados por `delta` ascendente.

* Si `delta` es `null/undefined`, se usa `999` para ordenar al final.

### 7.3 Selección de “Provincia” y “ABC”

Para cada logo, aplica este criterio:

1. Buscar coincidencia exacta por `clave` (case-insensitive):

   * `clave === 'provincia'`
   * `clave === 'abc'`

2. Si no hay `clave` válida, fallback por `titulo`:

   * `titulo` incluye “provincia”
   * `titulo` incluye “abc”

Si no se identifica ninguno de los dos, el estado final es `empty`.

### 7.4 Construcción del payload

Cada logo se transforma a:

* `src`: `toAbsolute(imagen1_url)` o `null`
* `alt`: prioridad `imagen1_alt` → `titulo` → `''` (trim)
* `link`: `toHref(enlace_uri)` o `null`

Si ambos (`provincia` y `abc`) quedan `null`, el estado final es `empty`.

---

## 8) Estados

* **loading**: estado inicial y durante la consulta.
* **success**: existe al menos uno de estos:

  * `data.provincia` o `data.abc`.
* **empty**: cuando:

  * `docs.length === 0`, o
  * el filtro `Header/Desktop` no devuelve resultados, o
  * no se identifica “provincia” ni “abc”, o
  * se identifican pero ambos resultan `null` (sin `src/link` usable).
* **error**: cuando falla `fetch`, la respuesta no es OK (por ejemplo `HTTP 500`), o falla el parse.

---

## 9) Cancelación / cleanup

* Usa `AbortController`.
* Pasa `signal` a `fetch`.
* En `cleanup` (`return () => ...`), aborta la solicitud.
* Si la request fue abortada, no se setea `status/error/data`.

---

## 10) Notas de implementación

* El endpoint se consulta con `q=*:*` y el filtrado se hace del lado cliente.
* El hook expone `error` como **string** para consumo directo en UI.

---

## 11) Ejemplo

Ejemplo realista (patrón equivalente al de `Header.jsx`):

```jsx
import HeaderView from './HeaderView';
import { useHeaderLogos } from 'common-ui';

export default function HeaderContainer() {
  const { status, data: logos, error } = useHeaderLogos();

  const loading = status !== 'success';

  return (
    <HeaderView
      logos={logos || {}}
      loading={loading}
      error={error}
    />
  );
}
```
---
<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>
