# Contratos de datos — Endpoints Solr

<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> </p>

Este documento define el **contrato mínimo esperado** por `common-ui` para consumir endpoints Solr. Está redactado para que backend, integradores y mantenedores puedan validar rápidamente si un índice cumple o no con los requerimientos de los hooks/componentes.

> Alcance: contratos **mínimos**. `common-ui` es tolerante a faltantes (degradación controlada). Donde exista una regla estricta, se indica como **Requerido**.

---

## 0) Shape mínimo de respuesta Solr (común)

Para todos los endpoints documentados, `common-ui` asume:

* `response.numFound` (number)
* `response.start` (number) (opcional)
* `response.docs` (array)

Opcionales útiles para diagnóstico:

* `responseHeader.status` (number)
* `responseHeader.QTime` (number)
* `responseHeader.params` (object)

---

## 1) Normalización y utilidades (común)

### 1.1 URLs de imágenes

* **`toAbsolute(url)`**: normaliza a URL absoluta cuando Solr devuelve una URL relativa o parcial.
* **`fromPublicUri(uri)`**: convierte URIs Drupal tipo `public://...` a una URL pública accesible.

Regla: si la imagen no se puede normalizar a una URL utilizable, se degrada a `null`.

### 1.2 URLs de enlaces

* **`toHref(uri)`**: convierte valores tipo `internal:/ruta` a `/ruta` y conserva URLs externas.
* **`toSafeHref(uri)`**: sanitiza y puede devolver `null` si el href no es seguro/usable.

Regla: si el enlace no se puede normalizar a un href navegable, se degrada a `null`.

### 1.3 Campos multivalor

Algunos índices devuelven campos como `Array`. `common-ui` aplica lectura defensiva:

* si el valor es `Array`, se toma el **primer elemento**;
* si no, se usa el valor tal cual.

---

## 2) Endpoint — Logos de Header

### 2.1 Hook consumidor

* `useHeaderLogos()`

### 2.2 Sistema / endpoint

* **Sistema:** Solr
* **Endpoint:** `GET /home.pagina.logos/select`
* **Query base:** `q=*:*&wt=json`

> Nota: el filtrado por contexto/dispositivo se realiza del lado cliente.

### 2.3 Contrato mínimo esperado por doc

**Requeridos (para que el doc sea candidato):**

* `tax_contexto` (string) — se espera `'Header'`
* `tax_dispositivos` (string) — se espera `'Desktop'`

**Opcionales (con degradación):**

* `delta` (number|string) — orden ascendente (si falta, se ordena al final)
* `clave` (string) — identificación (`provincia` / `abc`) (si falta, se usa fallback por `titulo`)
* `titulo` (string) — fallback para identificación y `alt`
* `imagen1_url` (string) — si falta, `src=null`
* `imagen1_alt` (string) — si falta, `alt` cae a `titulo` o `''`
* `enlace_uri` (string) — si falta, `link=null`

**Normalización:**

* `src = toAbsolute(imagen1_url)`
* `link = toHref(enlace_uri)`

### 2.4 Ejemplo de doc mínimo

```json
{
  "tax_contexto": "Header",
  "tax_dispositivos": "Desktop",
  "clave": "abc",
  "titulo": "abc.gob.ar",
  "imagen1_url": "/sites/default/files/logo.png",
  "imagen1_alt": "abc.gob.ar",
  "enlace_uri": "internal:/"
}
```

---

## 3) Endpoint — Footer (logos + columnas) y Redes Sociales

> Este endpoint se usa para **dos consumos** distintos:
>
> * Footer: `useFooter()` + `useFooterData()`
> * Redes: `useRedesSociales()`
>
> Es clave evitar **contaminación de campos** entre tipos de documentos.

### 3.1 Hooks consumidores

* Footer:

  * `useFooter()` (consulta paginada + deduplicación)
  * `useFooterData()` (adapter a modelo de render)
* Redes:

  * `useRedesSociales()`

### 3.2 Sistema / endpoint

* **Sistema:** Solr
* **Endpoint:** `GET /home.footer.redes/select`
* **Query base (mínima):** `q=*:*&wt=json`

#### 3.2.1 Reglas operativas por hook

* `useFooter()`:

  * hace una request inicial con `rows=0` para leer `numFound`;
  * pagina en bloques (`rows=200`) usando `start` hasta completar;
  * deduplica por clave compuesta.
* `useRedesSociales()`:

  * típicamente usa `rows=50` y orden por `delta asc`.

### 3.3 Convención recomendada de tipado

Para evitar solapamientos, se recomienda que cada doc declare:

* `tipo_bloque`: `"footer"` o `"redes_sociales"`

Y además:

* docs `footer` **no deberían incluir** campos `redes_*`;
* docs `redes_sociales` **no deberían incluir** campos `foot_*`.

> `common-ui` tolera mezcla (por filtrado implícito por campos), pero esta separación evita bugs silenciosos.

---

### 3.4 Bloque Footer — Logos

#### 3.4.1 Contrato mínimo esperado

**Requerido (para detectar doc de logo):**

* `foot_logodesk_img_url` **o** `foot_logomobil_img_url` (string o array)

**Opcionales (con degradación):**

* `foot_logodesk_img_alt` (string) → default `''`
* `foot_logomobil_img_alt` (string) → default `''`
* `foot_enlace_url` (string) → `logos.enlace = toSafeHref(...)` o `null`

**Normalización:**

* `desktop = fromPublicUri(foot_logodesk_img_url)`
* `mobile = fromPublicUri(foot_logomobil_img_url)`
* `enlace = toSafeHref(foot_enlace_url)`

#### 3.4.2 Ejemplo de doc mínimo

```json
{
  "tipo_bloque": "footer",
  "foot_logodesk_img_url": "public://logos/footer-desktop.svg",
  "foot_logodesk_img_alt": "Dirección General de Cultura y Educación",
  "foot_enlace_url": "https://abc.gob.ar/"
}
```

---

### 3.5 Bloque Footer — Columnas y secciones

#### 3.5.1 Contrato mínimo esperado

**Requeridos (para incluir el doc en columnas):**

* `foot_columna_delta` (number|string|array) — debe ser parseable a número
* `foot_tit_seccion` (string|array) — no vacío (se aplica `trim()`)

**Opcionales (con degradación):**

* `foot_tit_seccion_delta` (number|string) — orden de la sección (si falta, al final)
* `foot_enlace_texto` (string) — texto del enlace (si falta, `''`)
* `foot_enlace_url` (string) — href (si falta o no es seguro, `null`)
* `foot_enlace_delta` (number|string) — orden del enlace (si falta, al final)

**Normalización:**

* `url = toSafeHref(foot_enlace_url)`

**Regla de texto plano:**

* ciertos textos (lista `NO_LINK_TEXTS` en `useFooterData`) se fuerzan a `url=null` aunque venga `foot_enlace_url`.

#### 3.5.2 Ejemplo de doc mínimo

```json
{
  "tipo_bloque": "footer",
  "foot_columna_delta": 2,
  "foot_tit_seccion": "Institucional",
  "foot_tit_seccion_delta": 1,
  "foot_enlace_texto": "Autoridades",
  "foot_enlace_url": "internal:/autoridades",
  "foot_enlace_delta": 10
}
```

---

### 3.6 Bloque Redes Sociales

#### 3.6.1 Contrato mínimo esperado

**Requerido (para incluir el item):**

* `redes_img_url` (string|array) — ícono

**Opcionales (con degradación):**

* `redes_enlace` (string|array) — si falta, `enlace=null`
* `redes_img_alt` (string|array) — fallback
* `redes_img_tit` (string|array) — fallback alternativo
* `delta` (number|string|array) — orden (si falta, al final)

**Normalización:**

* `icono = toAbsolute(redes_img_url)`
* `enlace = toHref(redes_enlace)`
* `alt = redes_img_alt → redes_img_tit → ''`

#### 3.6.2 Ejemplo de doc mínimo

```json
{
  "tipo_bloque": "redes_sociales",
  "delta": 1,
  "redes_img_url": "/sites/default/files/icons/instagram.svg",
  "redes_img_alt": "Instagram",
  "redes_enlace": "https://www.instagram.com/abc.gob.ar/"
}
```

---

## 4) Endpoint — Menú

### 4.1 Hooks consumidores

* `useMenuMeta()` (recomendado cuando se necesitan estados)
* `useMenu()` (wrapper que devuelve solo items)

### 4.2 Sistema / endpoint

* **Sistema:** Solr
* **Endpoint:** `GET /home.menu/select`
* **Query base:** `q=*:*&wt=json&rows=200&sort=peso asc`

### 4.3 Contrato mínimo esperado por doc

**Requeridos:**

* `id` o `id_s` (string) — si falta, el item se descarta

**Recomendados:**

* `peso` (number|string) — orden

**Opcionales (con degradación):**

* `title` / `name` / `texto_del_enlace` (string) — si falta, `title=''`
* `uri` / `url` (string) — si falta, `url=null`
* `parent` / `parent_s` / `parent_id` (string) — jerarquía
* `uuid` / `uuid_s` (string) — para resolver parents del tipo `menu_link_content:{uuid}`
* `enabled` / `activo` (boolean|number|string) — si falta, se asume activo

**Normalización:**

* `url = toHref(uri|url)` (incluye manejo de `internal:/...`)

### 4.4 Ejemplo de doc mínimo

```json
{
  "id": "menu-001",
  "peso": 10,
  "title": "SAD",
  "uri": "internal:/sad",
  "parent": null,
  "enabled": 1
}
```

---

## 5) Checklist de validación rápida (para backend)

### Header logos (`/home.pagina.logos/select`)

* [ ] Existen docs con `tax_contexto=Header` y `tax_dispositivos=Desktop`.
* [ ] Hay al menos un doc identificable como `provincia` y/o `abc`.
* [ ] `imagen1_url` es resoluble (relativa o absoluta) y `enlace_uri` es navegable.

### Footer + redes (`/home.footer.redes/select`)

* [ ] `response.numFound` es correcto (soporta `rows=0`).
* [ ] Los docs de footer no incluyen campos `redes_*` (recomendado).
* [ ] Los docs de redes incluyen al menos `redes_img_url`.
* [ ] `foot_columna_delta` y `foot_tit_seccion` existen en los docs de columnas.

### Menú (`/home.menu/select`)

* [ ] Todos los docs tienen `id`.
* [ ] `peso` existe o, si no existe, el orden no es crítico.
* [ ] `uri`/`url` respetan `internal:/...` o URL externa.

---

## 6) Nota sobre apps consumidoras (ej. abc-home)

Este documento describe el contrato de `common-ui`. Una app consumidora (por ejemplo `abc-home`) puede tener componentes como `Home.jsx` que consuman `common-ui`, pero **no modifican** el contrato esperado por estos endpoints.

---
<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> </p>