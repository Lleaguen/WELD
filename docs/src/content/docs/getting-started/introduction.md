---
title: Introduction
description: What is WELD? A plain-language overview for developers coming from HTML/CSS/JS.
---

## What is WELD?

WELD is a toolkit for building web apps with React. It gives you a set of ready-made UI components (header, sidebar, buttons, forms, modals…) and a smart way to fetch data from your backend — one that automatically handles loading states, caches responses for offline use, and catches errors before they reach your users. You write less code, and the code you do write is harder to get wrong.

## What do you get?

- **UI components** — pre-built layout pieces like `Weld.Shell`, `Weld.Header`, `Weld.Sidebar`, and `Weld.Footer`. Drop them in and your app has a solid structure immediately.
- **Data fetching** — one hook (`useWeld`) replaces all your `fetch` + `useEffect` + `useState` boilerplate. Loading and error states are automatic.
- **Offline support** — if the user loses their internet connection, the last successful response is served from a local cache. No extra work required.
- **Type safety** — if your backend changes a field name or removes an endpoint, TypeScript tells you before your app even runs.
- **Validation** — responses from the server are checked against a schema at runtime, so bad data never reaches your components silently.
- **Client-side routing** — a `WeldRouter` with nested routes, URL params, and protected routes.
- **Forms** — a `useForm` hook with built-in validation and error display.

## Who is it for?

WELD is a good fit if you:

- Know the basics of HTML, CSS, and JavaScript and want to build something real with React.
- Are tired of wiring up loading spinners and error messages by hand.
- Want your app to still work (or at least not crash) when the network is slow or gone.
- Are working on a team where the backend and frontend are separate, and you want both sides to stay in sync automatically.

You do **not** need to know what tRPC, Hexagonal Architecture, or `useSyncExternalStore` means to use WELD. Those are things WELD handles for you under the hood.

## What you need to know first

- **TypeScript basics** — you should be comfortable writing types and interfaces. If you know JavaScript well, TypeScript is a short learning curve.
- **React basics** — components, props, and hooks (`useState`, `useEffect`). The [React docs](https://react.dev/learn) cover this in a few hours.

That's it. WELD does the rest.

## Next step

→ [Installation](/getting-started/installation)
