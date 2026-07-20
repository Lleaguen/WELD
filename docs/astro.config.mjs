import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  integrations: [
    starlight({
      title: 'WELD',
      description: 'End-to-End Type-Safe HTTP Client. Offline-first, zero-config, framework agnostic.',
      logo: {
        src:           './src/assets/weld.png',
        replacesTitle: true,
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/lleaguen/WELD' },
      ],
      customCss: ['./src/styles/custom.css'],
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        es:   { label: 'Español', lang: 'es' },
      },
      sidebar: [
        {
          label: 'Getting Started',
          translations: { es: 'Primeros Pasos' },
          items: [
            { label: 'Introduction',  translations: { es: 'Introducción' },  slug: 'getting-started/introduction' },
            { label: 'Installation',  translations: { es: 'Instalación' },   slug: 'getting-started/installation' },
            { label: 'Quick Start',   translations: { es: 'Inicio Rápido' }, slug: 'getting-started/quick-start' },
          ],
        },
        {
          label: 'Core Concepts',
          translations: { es: 'Conceptos Clave' },
          items: [
            { label: 'The 4 Pillars',      translations: { es: 'Los 4 Pilares' },          slug: 'concepts/pillars' },
            { label: 'E2E Type Safety',    translations: { es: 'Seguridad de Tipos E2E' }, slug: 'concepts/type-safety' },
            { label: 'Runtime Validation', translations: { es: 'Validación en Runtime' },  slug: 'concepts/validation' },
            { label: 'Offline-First',      translations: { es: 'Offline-First' },          slug: 'concepts/offline-first' },
            { label: 'Deduplication',      translations: { es: 'Deduplicación' },          slug: 'concepts/deduplication' },
          ],
        },
        {
          label: 'UI Components',
          translations: { es: 'Componentes UI' },
          items: [
            { label: 'Overview',    translations: { es: 'Resumen' },    slug: 'components/overview' },
            { label: 'Layout',      translations: { es: 'Layout' },     slug: 'components/layout' },
            { label: 'Primitives',  translations: { es: 'Primitivos' }, slug: 'components/primitives' },
            { label: 'Data Display',translations: { es: 'Datos' },      slug: 'components/data' },
            { label: 'Feedback',    translations: { es: 'Feedback' },   slug: 'components/feedback' },
            { label: 'Overlay',     translations: { es: 'Overlays' },   slug: 'components/overlay' },
            { label: 'Neon Theme',  translations: { es: 'Tema Neon' },  slug: 'components/theme' },
          ],
        },
        {
          label: 'Router',
          translations: { es: 'Router' },
          items: [
            { label: 'Setup',           translations: { es: 'Configuración' }, slug: 'router/setup' },
            { label: 'Routes & Params', translations: { es: 'Rutas y Params' },slug: 'router/routes' },
            { label: 'Navigation',      translations: { es: 'Navegación' },    slug: 'router/navigation' },
            { label: 'Protected Routes',translations: { es: 'Rutas Protegidas' }, slug: 'router/protected' },
          ],
        },
        {
          label: 'Forms',
          translations: { es: 'Formularios' },
          items: [
            { label: 'useForm',    slug: 'forms/use-form' },
            { label: 'Validation', translations: { es: 'Validación' }, slug: 'forms/validation' },
          ],
        },
        {
          label: 'Server',
          translations: { es: 'Servidor' },
          items: [
            { label: 'WeldServer',   slug: 'server/weld-server' },
            { label: 'Routes',       translations: { es: 'Rutas' }, slug: 'server/routes' },
            { label: 'Shared Types', translations: { es: 'Tipos Compartidos' }, slug: 'server/shared-types' },
          ],
        },
        {
          label: 'CLI',
          items: [
            { label: 'weld create', slug: 'cli/create' },
            { label: 'weld dev',    slug: 'cli/dev' },
            { label: 'weld build',  slug: 'cli/build' },
          ],
        },
        {
          label: 'Framework Adapters',
          translations: { es: 'Adaptadores' },
          items: [
            { label: 'React',   slug: 'adapters/react' },
            { label: 'Vue',     slug: 'adapters/vue' },
            { label: 'SolidJS', slug: 'adapters/solid' },
            { label: 'Angular', slug: 'adapters/angular' },
          ],
        },
        {
          label: 'API Reference',
          translations: { es: 'Referencia API' },
          items: [
            { label: 'new Weld()',          slug: 'api/weld' },
            { label: 'api.get()',           slug: 'api/get' },
            { label: 'api.post()',          slug: 'api/post' },
            { label: 'WeldRequestOptions', slug: 'api/options' },
            { label: 'WeldResponse',       slug: 'api/response' },
          ],
        },
        {
          label: 'Guides',
          translations: { es: 'Guías' },
          items: [
            { label: 'From HTML to WELD',      translations: { es: 'De HTML a WELD' },         slug: 'guides/from-html' },
            { label: 'Hexagonal Architecture', translations: { es: 'Arquitectura Hexagonal' }, slug: 'guides/hexagonal' },
            { label: 'TypeScript Tips',        translations: { es: 'Tips de TypeScript' },     slug: 'guides/typescript' },
          ],
        },
      ],
    }),
  ],
})
