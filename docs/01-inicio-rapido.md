# Inicio rápido

<p style="text-align: right;">  ← Volver a <a href="./00-resumen.md"> Resumen</a> | Ir a <a href="./02-arquitectura.md">Arquitectura</a> →</p>

Esta guía resume los pasos mínimos para consumir `common-ui` desde una aplicación React.

---

## Requisitos mínimos

La aplicación consumidora debe proveer dependencias compatibles:

- `react >= 18`
- `react-dom >= 18`
- `react-bootstrap >= 2`
- `bootstrap >= 5.3` (requerido para estilos)

> Nota: Bootstrap debe estar cargado en la aplicación consumidora para que los estilos y variables `--bs-*` tengan efecto.

## 1) Inicialización global

En el entrypoint de la app (por ejemplo `src/main.jsx`) se recomienda importar una vez:

```js
import 'common-ui/globals';
```

**Qué hace este import:**

* Carga los **tokens institucionales** (`tokens.css`).
* Inicializa la tipografía institucional **Encode Sans**.

**Qué NO hace este import:**

* No inicializa librerías de íconos (por ejemplo, **Font Awesome**). Si el proyecto las usa, deben inicializarse explícitamente desde la app consumidora.

**Reglas de consumo (operativas):**

* **Bootstrap** debe estar cargado **antes o al momento del render** (por ejemplo, importado en `main.jsx`).
* `common-ui/globals` se importa **una sola vez** en el entrypoint.
* El **Router lo provee la app consumidora** si se consumen componentes que usan `Link` / `useLocation` (por ejemplo, `BrowserRouter`).
* `react-router-dom` es un **requisito del proyecto consumidor** (declarado como `peerDependency` en `common-ui`).
* (Interno) En el repo de `common-ui`, `react-router-dom` también se incluye como devDependency para desarrollo/pruebas del paquete.

---

## 2) Importar y usar componentes

Ejemplo:

```jsx
import { Header, Footer } from 'common-ui';

export default function App() {
  return (
    <>
      <Header />
      <main>Contenido</main>
      <Footer />
    </>
  );
}
```
Los componentes se importan desde `common-ui` (API pública). Internamente, las exportaciones se concentran en `src/index.js`.


## 3) Importar hooks y utilidades
Ejemplo de imports típicos:

```jsx
import { useMenu, toHref, buildApiUrl } from 'common-ui';
```
Los hooks y utilidades se importan y utilizan en los componentes/containers que los requieran.

→ Ver [Utilidades](./04-utilidades.md)


## 4) Fuentes e íconos (según necesidad)
`common-ui/globals` asegura **Encode Sans**.

Si el proyecto requiere íconos (por ejemplo Font Awesome), esa inicialización se hace **en la app consumidora** y **una única vez** en el entrypoint.

→ Ver [Utilidades](./04-utilidades.md)

## 5) Tokens y convenciones de estilo
Para reglas de tokens (primitivos vs semánticos), foco visible, utilidades globales y excepciones institucionales:

→ Ver [Tokens y diseño](./03-tokens-diseno.md)

---
<p style="text-align: right;">  ← Volver a <a href="./00-resumen.md"> Resumen</a> | Ir a <a href="./02-arquitectura.md">Arquitectura</a> →</p>










