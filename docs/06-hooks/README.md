# Hooks

<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>

Esta sección documenta los **hooks públicos** de `common-ui`.

* **Alcance:** se documenta como público únicamente lo que esté exportado desde `src/index.js`.
* **Uso típico:** se consumen en **containers** (o componentes con responsabilidad de datos/estado) y luego se delega el renderizado a componentes de vista.

## Índice

* [useHeaderLogos](./use-header-logos.md)
* [useMenu](./use-menu.md)
* [useFooter](./use-footer.md)
* [useFooterData](./use-footer-data.md)
* [useRedesSociales](./use-redes-sociales.md)
* [usePageBreadcrumb](./use-page-breadcrumb.md)

## Criterios generales

### Importación

Los hooks se importan desde la **API pública** del paquete:

```js
import { useMenu } from 'common-ui';
```

### Regla operativa

* Los hooks se consumen en el nivel más cercano a su uso (container/componente que necesita esos datos).
* No requieren inicialización global.

### Dependencias de routing

Algunos hooks usan `react-router-dom` en runtime (por ejemplo, `useLocation`). En esos casos la app consumidora debe proveer un Router.

La regla completa y la recomendación de `peerDependency` se documentan en: [02 — Arquitectura](../02-arquitectura.md).

### Manejo de estado

En `common-ui` conviven dos familias de hooks:

1. **Hooks con estado explícito**

Exponen un estado para facilitar el render en containers. Según el caso, el estado puede representarse como:

* `status` (por ejemplo: `loading | success | empty | error`) y `error` (string o null), o
* `loading` (boolean) y `error` (objeto `Error` o null).

Cada hook documenta su contrato de retorno real (no se fuerza un formato único si el código no lo implementa).

2. **Hooks de compatibilidad / retorno estable**

Retornan un valor “siempre consistente” (por ejemplo `[]`) para simplificar el consumo en componentes.

En estos casos:

* no siempre existe `loading`/`status`/`error` en el retorno,
* el manejo de estados (cargando / sin datos / error) se resuelve en capas superiores (por ejemplo, un adaptador o un container).

### Contratos de datos

Cuando un hook consulta endpoints (Solr/API), el contrato que se documenta **refleja los campos efectivamente usados** por el hook.

Los contratos de endpoints se consolidan en: [Contratos de datos — endpoints Solr](../07-contratos-de-datos/endpoints-solr.md).

---
<p style="text-align: right;">  ← Volver a <a href="./../00-resumen.md"> Resumen</a> | Ir a <a href="../07-contratos-de-datos/endpoints-solr.md">Contratos de datos</a> →</p>
