# Componentes

<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../06-hooks/README.md">Hooks</a> →</p>

Esta sección documenta los **componentes públicos** de **common-ui**.

## Criterios estándar (obligatorio)

### 1) **API pública**

* Esta documentación describe únicamente lo que es **público**.
* Se considera **público** lo que esté exportado desde `src/index.js`.
* **No** se documentan rutas internas como `common-ui/components/*`.
* Si un componente existe en el repositorio pero **no** está exportado, se considera **interno** y no forma parte de esta sección.

### 2) **Importación (siempre desde el paquete)**

Todos los ejemplos deben usar import desde `common-ui`:

```jsx
import { NombreDelComponente } from 'common-ui';
```

### 3) **Routing (cuando aplique)**

Algunos componentes usan `Link` y/o `useLocation` (React Router) y por lo tanto requieren que la app consumidora provea routing (por ejemplo, `BrowserRouter`).

* La explicación completa y el criterio de dependencias se encuentran en: [Arquitectura](../02-arquitectura.md).
* En los documentos de componente, solo se menciona el requisito cuando corresponda.

### 4) **Container vs View (criterio de diseño)**

Cuando un componente sigue el patrón **Container vs View**:

* **Container**: obtiene datos (por ejemplo, desde Solr), normaliza, resuelve URLs (Drupal) y administra estados (`loading` / `error` / `empty`).
* **View**: renderiza UI “pura” (sin dependencias a Solr/Drupal).

El criterio general del patrón se explica en: [Arquitectura](../02-arquitectura.md).

### 5) **Estructura uniforme de cada documento de componente**

Cada archivo dentro de esta carpeta debe seguir esta estructura (cuando aplique):
1) **Propósito**
2) **Importación**
3) **Uso mínimo**
4) **API (props)**
5) **Estados** (`loading` / `error` / `empty`) si el componente consume datos
6) **Accesibilidad** (atributos, foco, links externos)
7) **Estilos** (tokens, clases, variantes)
8) **Dependencias técnicas** (solo si hay requisitos no obvios)
9) **Referencias** (links a Hooks / Contratos cuando corresponda)

### 6) **Datos / hooks / contratos**

* Esta sección **no** documenta contratos Solr en profundidad.
* Si un componente depende de un hook o de un shape de datos específico, se documenta aquí a nivel **operativo** (qué consume y cómo se comporta) y se referencia a:

  * [Hooks](../06-hooks/README.md)
  * [Contratos de datos](../07-contratos-de-datos.md)

---

## Índice de componentes

* [Header](./header.md)
* [Footer](./footer.md)
* [RedesSociales](./redes-sociales.md)
* [PageBreadcrumb](./page-breadcrumb.md)
* [PageSplit](./page-split.md)
* [Pagination](./pagination.md)

---
<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../06-hooks/README.md">Hooks</a> →</p>

