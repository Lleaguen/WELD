---
title: weld create
description: Generá una nueva aplicación WELD.
---

La forma recomendada de crear una nueva app WELD:

```bash
npm create weld-app
npm create weld-app mi-app
```

O usando el CLI directamente:

```bash
npx @weldjs/cli create mi-app
npx @weldjs/cli create mi-app --template fullstack
npx @weldjs/cli create mi-app --template minimal
```

## Templates

| Template | Incluye |
|---|---|
| `spa` (por defecto) | React + Vite + Router + Forms + cliente API |
| `fullstack` | Todo lo de SPA + backend `@weldjs/server` |
| `minimal` | React + Vite + shell básico solamente |

## Qué se genera (SPA)

```
mi-app/
  src/
    main.tsx          — WeldProvider + React root
    App.tsx           — Shell + Router
    pages/
      Home.tsx        — Página inicial
    lib/
      api.ts          — Cliente Weld
  index.html
  vite.config.ts
  tsconfig.json
  .env
  package.json
```

Después de generar:

```bash
cd mi-app
npm install
npm run dev
```
