---
title: Introducción
description: ¿Qué es WELD? Una descripción en lenguaje simple para developers que vienen de HTML/CSS/JS.
---

## ¿Qué es WELD?

WELD es un conjunto de herramientas para construir aplicaciones web con React. Te da componentes de UI ya listos (header, sidebar, botones, formularios, modales…) y una forma inteligente de obtener datos de tu backend — una que maneja automáticamente los estados de carga, guarda respuestas en caché para uso sin conexión, y detecta errores antes de que lleguen a tus usuarios. Escribís menos código, y el código que escribís es más difícil de hacer mal.

## ¿Qué obtenés?

- **Componentes UI** — piezas de layout ya construidas como `Weld.Shell`, `Weld.Header`, `Weld.Sidebar` y `Weld.Footer`. Los agregás y tu app tiene una estructura sólida de inmediato.
- **Fetching de datos** — un solo hook (`useWeld`) reemplaza todo el boilerplate de `fetch` + `useEffect` + `useState`. Los estados de carga y error son automáticos.
- **Soporte offline** — si el usuario pierde la conexión, la última respuesta exitosa se sirve desde un caché local. Sin trabajo extra de tu parte.
- **Seguridad de tipos** — si tu backend cambia el nombre de un campo o elimina un endpoint, TypeScript te avisa antes de que tu app siquiera corra.
- **Validación** — las respuestas del servidor se verifican contra un esquema en tiempo de ejecución, así los datos incorrectos nunca llegan a tus componentes en silencio.
- **Enrutamiento del lado del cliente** — un `WeldRouter` con rutas anidadas, parámetros de URL y rutas protegidas.
- **Formularios** — un hook `useForm` con validación integrada y visualización de errores.

## ¿Para quién es?

WELD es una buena opción si:

- Conocés los fundamentos de HTML, CSS y JavaScript y querés construir algo real con React.
- Estás cansado de armar spinners de carga y mensajes de error a mano.
- Querés que tu app siga funcionando (o al menos no crashee) cuando la red es lenta o no existe.
- Trabajás en un equipo donde el backend y el frontend son separados, y querés que ambos lados se mantengan sincronizados automáticamente.

**No necesitás** saber qué es tRPC, Arquitectura Hexagonal o `useSyncExternalStore` para usar WELD. Son cosas que WELD maneja por vos debajo del capó.

## Qué necesitás saber primero

- **Fundamentos de TypeScript** — deberías estar cómodo escribiendo tipos e interfaces. Si conocés bien JavaScript, TypeScript es una curva de aprendizaje corta.
- **Fundamentos de React** — componentes, props y hooks (`useState`, `useEffect`). La [documentación de React](https://react.dev/learn) cubre esto en pocas horas.

Eso es todo. WELD hace el resto.

## Siguiente paso

→ [Instalación](/es/getting-started/installation)
