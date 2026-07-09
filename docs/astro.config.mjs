import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  integrations: [
    starlight({
      title: 'WELD',
      description: 'End-to-End Type-Safe HTTP Client. Offline-first, zero-config, framework agnostic.',
      logo: {
        light: './src/assets/logo-light.svg',
        dark:  './src/assets/logo-dark.svg',
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
            { label: 'The 4 Pillars',     translations: { es: 'Los 4 Pilares' },          slug: 'concepts/pillars' },
            { label: 'E2E Type Safety',    translations: { es: 'Seguridad de Tipos E2E' }, slug: 'concepts/type-safety' },
            { label: 'Runtime Validation', translations: { es: 'Validación en Runtime' },  slug: 'concepts/validation' },
            { label: 'Offline-First',      translations: { es: 'Offline-First' },          slug: 'concepts/offline-first' },
            { label: 'Deduplication',      translations: { es: 'Deduplicación' },          slug: 'concepts/deduplication' },
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
            { label: 'Hexagonal Architecture', translations: { es: 'Arquitectura Hexagonal' }, slug: 'guides/hexagonal' },
            { label: 'TypeScript Tips',        translations: { es: 'Tips de TypeScript' },     slug: 'guides/typescript' },
          ],
        },
      ],
    }),
  ],
})
