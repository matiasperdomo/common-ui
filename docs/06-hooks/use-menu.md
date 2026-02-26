# useMenu / useMenuMeta

<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>

## 1) Propósito

`useMenuMeta` obtiene el **menú institucional** desde Solr, lo normaliza y lo devuelve como una estructura jerárquica lista para renderizar.

`useMenu` es un wrapper de compatibilidad: devuelve **solo** el array jerarquizado (sin estados).

**No hace:** no renderiza UI (eso lo hace `Menu.jsx` dentro de `HeaderView.jsx`), no define estilos, y no resuelve permisos/autorización.

**Consumidor típico:** `Header.jsx` consume `useMenu()` (o `useMenuMeta()` si se requieren estados) y pasa `menuItems` a `HeaderView.jsx`, que renderiza el menú con `Menu.jsx`.

---

## 2) Importación

```js
import { useMenu, useMenuMeta } from 'common-ui';
```

---

## 3) Firma y retorno (API)

### `useMenu(opts?)`

```ts
useMenu(opts?): MenuItem[]
```

* Devuelve siempre un array.
* Si no hay datos o hay error: `[]`.

### `useMenuMeta(opts?)`

```ts
useMenuMeta(opts?): {
  status: 'loading' | 'success' | 'empty' | 'error'
  items: MenuItem[]
  error: string | null
}
```

Notas:

* `error` es **string** (mensaje), no un objeto `Error`.
* En `error`, el hook fuerza `items=[]` como fallback defensivo.

---

## 4) Parámetros

Ambos hooks aceptan el mismo objeto `opts` (opcional):

* `rows?: number` (default: `200`)

  * Requerido: no
  * Efecto operativo: define la cantidad máxima de documentos solicitados al endpoint.

---

## 5) Endpoint y dependencias externas

**Sistema:** Solr

* **Endpoint:** `/home.menu/select`
* **Método:** `GET`
* **Query base:**

  * `q=*:*`
  * `wt=json`
  * `rows=<rows>`
  * `sort=peso asc`

Dependencias:

* `fetch` (navegador)
* `AbortController` (cancelación)
* `buildApiUrl(path, params)` (arma URL)
* `toHref(uri)` (normaliza enlaces Drupal a href navegable)

---

## 6) Contrato mínimo esperado

El hook asume que el endpoint devuelve `json.response.docs` como arreglo.

Para construir el menú, cada doc debería proveer:

### Requeridos

* `id` o `id_s` (string): identificador estable (si falta, el ítem se descarta).

### Recomendados

* `peso` (number|string): orden ascendente.

### Opcionales (con degradación)

* Texto (`title` | `name` | `texto_del_enlace` | `texto_delEnlace`): si falta → `title=''`.
* URL (`uri` | `url`): si falta → `url=null`.
* Jerarquía (`parent` | `parent_s` | `parent_id` | `padre` | `uuid_padre`): si falta → ítem raíz.
* Activación (`enabled` | `activo`): si falta → se asume activo.
* UUID (`uuid` | `uuid_s`): si existe, permite resolver parents del tipo `menu_link_content:{uuid}`.

Reglas de normalización:

* Si `uri` empieza con `internal:/`, se convierte a ruta reemplazando `internal:/` por `/`.
* `url` final se normaliza con `toHref(...)`.
* Si un campo viene como array, se toma el **primer elemento**.

---

## 7) Comportamiento (reglas)

### 7.1 Carga y parse

* Consulta el endpoint una vez por mount y cuando cambia `rows`.
* Si la respuesta HTTP no es OK, pasa a `error`.

### 7.2 Filtro de ítems activos

Se consideran activos los docs donde `enabled` o `activo` sea `1`, `'1'`, `true`, `'true'`.

Si esos campos no existen, el hook **asume activo** (tolerancia ante fuentes incompletas).

### 7.3 Validación y normalización de cada ítem

* Si no hay `id`, el doc se descarta.
* Se arma un nodo normalizado:

  * `title` (string)
  * `url` (`string | null`)
  * `parent` (valor crudo para resolver jerarquía)
  * `children: []`
  * `weight` (number)

### 7.4 Jerarquía (padre/hijos)

Soporta dos formas:

* parent por `id` directo (si `parent` coincide con un `id`).
* parent por UUID de Drupal: si el parent viene como `menu_link_content:{uuid}`, se resuelve a `id` mediante un mapa armado con `uuid/uuid_s`.

Los ítems sin parent resoluble quedan en el nivel raíz.

### 7.5 Orden

* Raíz: orden ascendente por `weight`.
* `children`: también se ordenan por `weight`.

---

## 8) Estados

### Para `useMenuMeta`

* **loading**: estado inicial y mientras el request está en curso.
* **success**: cuando existe al menos un ítem en el array raíz (`items.length > 0`).
* **empty**: cuando no hay docs o el menú estructurado queda vacío.
* **error**: cuando falla `fetch`, la respuesta no es OK, o falla el parse. En este estado:

  * `items=[]`
  * `error` contiene `e.message` o `'Error desconocido'`.

### Para `useMenu`

No expone estados. Interpretación operativa:

* `[]` puede significar “todavía cargando”, “sin datos” o “error”.
* Si la UI necesita diferenciar esos casos, usar `useMenuMeta`.

---

## 9) Cancelación / cleanup

* Usa `AbortController`.
* Pasa `signal` a `fetch`.
* En cleanup del `useEffect`, aborta la solicitud.
* Si la request se aborta, no se setean estados.

---

## 10) Notas de implementación

* `useMenu` está implementado como wrapper sobre el core (`useMenuCore`) para mantener compatibilidad con consumidores que esperan “solo array”.

---

## 11) Ejemplo

### Ejemplo mínimo (compatibilidad): `useMenu`

```jsx
import { useMenu } from 'common-ui';

export function HeaderContainer() {
  const menuItems = useMenu();
  return <div>{menuItems.length ? 'OK' : '...'}</div>;
}
```

### Ejemplo realista (con estados): `useMenuMeta`

```jsx
import { useMenuMeta } from 'common-ui';
import Menu from './Menu';

export function HeaderContainer() {
  const { status, items, error } = useMenuMeta();

  if (status === 'loading') return null;
  if (status === 'error') return <div role="status">{error}</div>;
  if (status === 'empty') return null;

  return <Menu items={items} />;
}
```

---
<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>