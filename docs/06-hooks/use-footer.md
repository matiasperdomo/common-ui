# useFooter

<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>


## 1) Propósito

`useFooter` consulta Solr para obtener **todos** los documentos necesarios del footer, mediante paginación `start/rows` y deduplicación defensiva, y expone un estado operativo estándar `{ data, loading, error }`.

**Consumidor esperado:** este hook se usa como fuente “raw” para `useFooterData()`, que normaliza URLs/imágenes y construye la estructura final (`logos`, `columnas`) para el componente Footer.

---

## 2) Importación

```js
import { useFooter } from 'common-ui';
```

---

## 3) Firma y retorno (API)

```js
const { data, loading, error } = useFooter();
```

Retorna:

* **`data`**: `Array<object>`

  * Inicial: `[]`
  * “Sin datos” (`numFound = 0`): `[]`
  * Error: `[]`
  * Éxito: `docs` deduplicados (unión de todas las páginas)
* **`loading`**: `boolean`

  * Inicial: `true`
* **`error`**: `Error | null`

  * Éxito / sin datos: `null`
  * Error: instancia de `Error`

---

## 4) Parámetros

No aplica (no recibe parámetros).

---

## 5) Endpoint / dependencias externas

* **Endpoint Solr**: `GET /home.footer.redes/select`
* **Construcción de URL**: `buildApiUrl('/home.footer.redes/select', params)`
* **HTTP**: `fetch` con `Accept: application/json`

### Estrategia de consulta (2 etapas)

1. **Head** (solo conteo):

* `q=*:*`
* `wt=json`
* `rows=0`

2. **Paginación**:

* `q=*:*`
* `wt=json`
* `rows=200` (fijo)
* `start=0, 200, 400, ...` hasta `numFound`

---

## 6) Contrato mínimo esperado

`useFooter` **no normaliza** datos: retorna documentos crudos (`docs`) y solo requiere un mínimo para poder **deduplicar** de forma defensiva.

Campos usados para deduplicación (preferidos / fallback):

* `tipo_bloque` (string)
* `nid` (string|number)
* `delta` **o** `foot_enlace_delta`
* `foot_enlace_url` **o** `redes_enlace`

La clave conceptual de deduplicación es:

`{tipo_bloque}|{nid}|{delta}|{link}`

> Nota operativa: la construcción de `logos`/`columnas` **no ocurre acá**; ocurre en `useFooterData`, que además aplica `fromPublicUri()` y `toSafeHref()` y define reglas específicas (por ejemplo, textos que no deben enlazarse).

---

## 7) Comportamiento (reglas)

### 7.1 Paginación defensiva (sin `sort`)

Se recorre el total usando `start/rows` y **no se depende del orden del índice** (no hay `sort`).

### 7.2 Deduplicación defensiva

Cada documento se agrega solo si su clave no fue vista previamente (`Set`).

### 7.3 “Sin datos” no es error

Si `numFound` es `0`, retorna `data=[]`, `loading=false`, `error=null`.

### 7.4 Manejo de errores

Ante fallo de red o respuesta no OK:

* loguea `console.error('useFooter:', e)`
* `data=[]`
* `error=Error`
* `loading=false`

---

## 8) Estados

* **Inicial**: `loading=true`, `data=[]`, `error=null`
* **Éxito**: `loading=false`, `data=[...]`, `error=null`
* **Sin datos**: `loading=false`, `data=[]`, `error=null`
* **Error**: `loading=false`, `data=[]`, `error=Error`

---

## 9) Cancelación / cleanup

El hook evita actualizar estado si el componente ya no está montado (flag `alive`).

* **No aborta** requests en curso.
* Si la respuesta llega tarde, se ignora y no hay `setState`.

---

## 10) Ejemplo

Ejemplo de inspección rápida de datos crudos (útil para verificar contrato Solr):

```jsx
import { useFooter } from 'common-ui';

export function FooterDebug() {
  const { data, loading, error } = useFooter();

  if (loading) return <p>Cargando…</p>;
  if (error) return <p>Ocurrió un error</p>;

  return (
    <pre style={{ whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(data.slice(0, 3), null, 2)}
    </pre>
  );
}
```
---
<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>
