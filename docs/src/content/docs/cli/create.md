---
title: weld create
description: Scaffold a new WELD application.
---

```bash
npx @weldjs/cli create my-app
npx @weldjs/cli create my-app --template fullstack
npx @weldjs/cli create my-app --template minimal
```

## Templates

| Template | Includes |
|---|---|
| `spa` (default) | React + Vite + Router + Forms + API client |
| `fullstack` | Everything in SPA + `@weldjs/server` backend |
| `minimal` | React + Vite + basic shell only |

## What gets scaffolded (SPA)

```
my-app/
  src/
    main.tsx          — WeldProvider + React root
    App.tsx           — Shell + Router
    pages/
      Home.tsx        — Starter page
    lib/
      api.ts          — Weld client
  index.html
  vite.config.ts
  tsconfig.json
  .env
  package.json
```

After scaffolding:

```bash
cd my-app
npm install
npm run dev
```
