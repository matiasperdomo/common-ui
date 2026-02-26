# useRedesSociales

<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>

## 1) Propósito

`useRedesSociales` consulta Solr para obtener la lista de **redes sociales institucionales**, normaliza URL de ícono y enlace, y devuelve un estado simple `{ redes, loading, error }`.

**No hace:** no renderiza UI ni decide variantes visuales (eso corresponde al componente `RedesSociales` y a sus consumidores), y no aplica estilos.

**Consumidor típico:** el componente `RedesSociales` (common-ui) consume `useRedesSociales()`; a su vez `RedesSociales` se usa en `FooterView.jsx`, `HeaderView.jsx` y, en apps consumidoras, puede usarse desde páginas como `Home.jsx`.

---

## 2) Importación

```js
import { useRedesSociales } from 'common-ui';
```

---

## 3) Firma y retorno (API)

```ts
useRedesSociales(opts?): {
  redes: Array<{
    id: string | number
    enlace: string | null
    alt: string
    icono: string | null
    order: number
  }>
  loading: boolean
  error: Error | null
}
```

Notas:

* `icono` y `enlace` pueden ser `null` si no es posible normalizarlos.
* La lista final se filtra para **requerir `icono` válido**.

---

## 4) Parámetros

Parámetro opcional `opts`:

* `endpoint?: string` (default: `undefined`)

  * Requerido: no
  * Efecto operativo: si se provee, se usa tal cual como URL completa para `fetch`.

* `rows?: number` (default: `50`)

  * Requerido: no
  * Efecto operativo: define cuántos docs pide el endpoint por defecto.

---

## 5) Endpoint y dependencias externas

**Sistema:** Solr

Cuando no se pasa `opts.endpoint`, el hook construye el endpoint por defecto:

* **Endpoint:** `/home.footer.redes/select`
* **Método:** `GET`
* **Query base:**

  * `q=*:*`
  * `wt=json`
  * `rows=<rows>`
  * `sort=delta asc`

Dependencias:

* `fetch` (navegador)
* `AbortController` (cancelación)
* `buildApiUrl(path, params)` (arma URL)
* `toAbsolute(url)` (normaliza URL del ícono a absoluta)
* `toHref(uri)` (normaliza enlaces Drupal a href navegable)

---

## 6) Contrato mínimo esperado

El hook asume que el endpoint devuelve `json.response.docs` como arreglo.

Campos usados por doc:

### Requeridos (para que el item se incluya)

* `redes_img_url` (string|array): URL del ícono. Si falta o no es convertible, el ítem se descarta.

### Opcionales (con degradación)

* `redes_enlace` (string|array): enlace destino. Si falta → `enlace=null`.
* `redes_img_alt` (string|array): alt del ícono. Si falta → fallback.
* `redes_img_tit` (string|array): fallback alternativo para `alt`.
* `delta` (number|string|array): orden. Si falta → usa índice del doc como fallback.
* `id` (string|number) o `uuid` (string|array): identificador. Si falta → `red-${idx}`.

Reglas de normalización:

* Campos multivalor: si llega `Array`, se usa el **primer valor**.
* `icono`: `toAbsolute(redes_img_url)`.
* `enlace`: `toHref(redes_enlace)`.
* `alt`: `redes_img_alt` → `redes_img_tit` → `''`.

---

## 7) Comportamiento (reglas)

* Construye `endpoint` con `useMemo` para evitar recalcularlo si no cambian `endpointProp/rows`.
* Hace `fetch(endpoint)` con header `Accept: application/json`.
* Parsea `docs` y mapea a `{ id, enlace, alt, icono, order }`.
* Filtra ítems sin `icono` (requisito mínimo para render).
* Ordena la salida por `order` ascendente.

---

## 8) Estados

El hook no expone `status`. Interpretación operativa:

* **loading**: `true` desde el inicio del efecto hasta resolver/romper el request.
* **success (implícito)**: `loading=false`, `error=null` y `redes.length > 0`.
* **empty (implícito)**: `loading=false`, `error=null` y `redes.length === 0`.
* **error**: `loading=false` y `error` es una instancia de `Error` (por ejemplo `HTTP 500`).

---

## 9) Cancelación / cleanup

* Usa `AbortController`.
* Pasa `signal` a `fetch`.
* En cleanup del `useEffect`, aborta la solicitud.
* Si la request fue abortada, el hook no actualiza el estado.

---

## 10) Notas de implementación

* El endpoint por defecto se calcula dentro del hook para evitar dependencia externa de configuración.

---

## 11) Ejemplo

### Ejemplo mínimo

```jsx
import { useRedesSociales } from 'common-ui';

export function RedesDebug() {
  const { redes, loading, error } = useRedesSociales();
  if (loading) return <p>Cargando…</p>;
  if (error) return <p>Ocurrió un error</p>;
  return <pre>{JSON.stringify(redes, null, 2)}</pre>;
}
```

### Ejemplo realista (dentro de un componente presentacional)

```jsx
import { useRedesSociales } from 'common-ui';

export default function RedesSociales({ className = '' }) {
  const { redes, loading } = useRedesSociales();
  if (loading) return null;

  return (
    <ul className={className} aria-label="Redes sociales">
      {redes.map((r) => (
        <li key={r.id}>
          <a href={r.enlace || undefined} aria-label={r.alt}>
            {r.icono ? <img src={r.icono} alt={r.alt} /> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
```
---
<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>
