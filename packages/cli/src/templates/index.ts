/**
 * Project templates — mirrors create-weld-app exactly
 */

import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export type Template = 'spa' | 'fullstack' | 'minimal'

export interface TemplateFile {
  path:    string
  content: string
}

export function getTemplate(name: string, template: Template): TemplateFile[] {
  switch (template) {
    case 'fullstack': return fullstackTemplate(name)
    case 'minimal':   return minimalTemplate(name)
    default:          return spaTemplate(name)
  }
}

export function copyLogo(dest: string): void {
  const logoSrc = join(__dirname, '..', 'assets', 'weld.png')
  if (existsSync(logoSrc)) {
    const assetDir = join(dest, 'src', 'assets')
    mkdirSync(assetDir, { recursive: true })
    copyFileSync(logoSrc, join(assetDir, 'weld.png'))
  }
}

// ─── Shared base files ────────────────────────────────────────────────────────

function baseFiles(name: string): TemplateFile[] {
  return [
    {
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
    {
      path: 'vite.config.ts',
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({ plugins: [react()] })`,
    },
    {
      path: 'tsconfig.json',
      content: JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          strict: true,
          skipLibCheck: true,
        },
        include: ['src'],
      }, null, 2),
    },
    {
      path: 'src/vite-env.d.ts',
      content: `/// <reference types="vite/client" />\n\ndeclare module '*.png' {\n  const src: string\n  export default src\n}\n`,
    },
    {
      path: '.gitignore',
      content: `node_modules\ndist\n.env.local\n`,
    },
  ]
}

// ─── SPA Template (same as create-weld-app) ───────────────────────────────────

function spaTemplate(name: string): TemplateFile[] {
  return [
    {
      path: 'package.json',
      content: JSON.stringify({
        name,
        version: '0.1.0',
        type: 'module',
        scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
        dependencies: {
          '@weldjs/react': 'latest',
          'react':         '^18.0.0',
          'react-dom':     '^18.0.0',
        },
        devDependencies: {
          '@types/react':         '^18.0.0',
          '@types/react-dom':     '^18.0.0',
          '@vitejs/plugin-react': '^4.0.0',
          'typescript':           '^5.4.0',
          'vite':                 '^5.0.0',
        },
      }, null, 2),
    },
    ...baseFiles(name),
    {
      path: 'src/main.tsx',
      content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import { WeldProvider } from '@weldjs/react'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WeldProvider>
      <App />
    </WeldProvider>
  </React.StrictMode>
)`,
    },
    {
      path: 'src/App.tsx',
      content: `import { useState } from 'react'
import { Weld } from '@weldjs/react'
import weldLogo from './assets/weld.png'

export function App() {
  const [page, setPage] = useState<'home' | 'docs'>('home')

  return (
    <Weld.Shell>
      <Weld.Header fixed neon>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setPage('home')}>
            <img src={weldLogo} alt="WELD" style={{ height: 28, width: 28 }} />
            <span style={{ fontWeight: 700, fontSize: 17, background: 'linear-gradient(135deg, #00d4ff, #3b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WELD</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Weld.Button variant={page === 'home' ? 'primary' : 'ghost'} size="sm" action={() => { setPage('home'); return Promise.resolve() }}>Home</Weld.Button>
            <Weld.Button variant={page === 'docs'  ? 'primary' : 'ghost'} size="sm" action={() => { setPage('docs');  return Promise.resolve() }}>Docs</Weld.Button>
          </div>
        </div>
      </Weld.Header>
      <Weld.Main>
        {page === 'home' && <HomePage />}
        {page === 'docs'  && <DocsPage />}
      </Weld.Main>
      <Weld.Footer>
        <Weld.Text variant="muted" style={{ textAlign: 'center', fontSize: 13 }}>
          Built with ⬡ WELD — <a href="https://weld-docs.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff' }}>Documentation</a>
        </Weld.Text>
      </Weld.Footer>
    </Weld.Shell>
  )
}

function HomePage() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '80px 24px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.08) 0%, rgba(59,107,255,0.05) 50%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
            <img src={weldLogo} alt="WELD" style={{ height: 100, width: 100, filter: 'drop-shadow(0 0 24px rgba(0,212,255,0.5)) drop-shadow(0 0 48px rgba(59,107,255,0.3))' }} />
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 800, margin: '0 0 16px', background: 'linear-gradient(135deg, #00d4ff 0%, #3b6bff 60%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Build Without Limits
          </h1>
          <p style={{ fontSize: 18, color: '#a1a1aa', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            A modern fullstack framework for type-safe, offline-first web applications.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Weld.Button variant="primary" size="lg" neon={{ color: '#00d4ff', intensity: 1 }} action={() => { window.open('https://weld-docs.vercel.app/getting-started/quick-start', '_blank'); return Promise.resolve() }}>Get Started →</Weld.Button>
            <Weld.Button variant="secondary" size="lg" action={() => { window.open('https://weld-docs.vercel.app', '_blank'); return Promise.resolve() }}>Documentation</Weld.Button>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        <Weld.Grid cols={3} gap={16}>
          <Weld.Card accent style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🔒</div>
            <Weld.Heading level={4}>Type Safety</Weld.Heading>
            <Weld.Text variant="muted" style={{ marginTop: 8, fontSize: 13 }}>End-to-end TypeScript from server routes to UI.</Weld.Text>
          </Weld.Card>
          <Weld.Card style={{ background: 'rgba(59,107,255,0.04)', border: '1px solid rgba(59,107,255,0.15)' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>📡</div>
            <Weld.Heading level={4}>Offline-First</Weld.Heading>
            <Weld.Text variant="muted" style={{ marginTop: 8, fontSize: 13 }}>Automatic IndexedDB cache and mutation queue.</Weld.Text>
          </Weld.Card>
          <Weld.Card style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.15)' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⚡</div>
            <Weld.Heading level={4}>Zero Config</Weld.Heading>
            <Weld.Text variant="muted" style={{ marginTop: 8, fontSize: 13 }}>Beautiful Neon UI components out of the box.</Weld.Text>
          </Weld.Card>
        </Weld.Grid>
        <div style={{ marginTop: 48 }}>
          <Weld.Section title="Neon Button Demo" description="The WELD Button handles loading, success, and error states automatically.">
            <div style={{ marginTop: 24, padding: 32, background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.10)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <Weld.Button action={() => new Promise<void>((res) => setTimeout(() => { setCount(c => c + 1); res() }, 800))} variant="primary" size="lg" neon={{ color: '#00d4ff', intensity: 1 }}>Weld It</Weld.Button>
              <Weld.Badge variant={count > 0 ? 'success' : 'warning'} dot>Count: {count}</Weld.Badge>
              <Weld.Text variant="muted" style={{ fontSize: 13 }}>Watch the neon glow on click →</Weld.Text>
            </div>
          </Weld.Section>
        </div>
      </div>
    </div>
  )
}

function DocsPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
      <Weld.Section title="Documentation" description="Everything you need to build with WELD.">
        <Weld.Grid cols={2} gap={16} style={{ marginTop: 24 }}>
          {([
            { title: 'Quick Start',   desc: 'Build your first type-safe request in 5 minutes.', url: '/getting-started/quick-start' },
            { title: 'API Reference', desc: 'Full reference for all WELD packages.',             url: '/api/weld' },
            { title: 'Components',    desc: 'Neon UI component library with full theming.',      url: '/components/overview' },
            { title: 'Offline-First', desc: 'Automatic caching and mutation queue.',            url: '/concepts/offline-first' },
          ] as const).map(({ title, desc, url }) => (
            <Weld.Card key={title} title={title}>
              <Weld.Text variant="muted" style={{ marginTop: 8, fontSize: 13 }}>{desc}</Weld.Text>
              <Weld.Button variant="ghost" size="sm" action={() => { window.open(\`https://weld-docs.vercel.app\${url}\`, '_blank'); return Promise.resolve() }} style={{ marginTop: 12 }}>Open →</Weld.Button>
            </Weld.Card>
          ))}
        </Weld.Grid>
      </Weld.Section>
    </div>
  )
}`,
    },
    {
      path: 'src/lib/api.ts',
      content: `import { Weld } from '@weldjs/http'
// import type { AppRouter } from '../types/router'

export const api = new Weld(
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  {
    // Disable retries in dev — errors appear immediately without waiting
    retry: import.meta.env.DEV ? { attempts: 0, delay: 0 } : { attempts: 3, delay: 300 },
  }
)`,
    },
  ]
}

// ─── Fullstack Template ───────────────────────────────────────────────────────

function fullstackTemplate(name: string): TemplateFile[] {
  const spa = spaTemplate(name)
  const pkg = JSON.parse(spa.find(f => f.path === 'package.json')!.content)
  pkg.dependencies['@weldjs/server'] = 'latest'
  pkg.dependencies['@weldjs/http']   = 'latest'
  pkg.dependencies['zod']            = '^3.22.0'
  pkg.scripts['server:dev']          = 'node --watch server/index.js'
  spa.find(f => f.path === 'package.json')!.content = JSON.stringify(pkg, null, 2)

  return [
    ...spa,
    {
      path: 'server/index.ts',
      content: `import { WeldServer } from '@weldjs/server'
import { z } from 'zod'

const server = new WeldServer({ port: 3000 })

server.get('health', z.object({ ok: z.boolean() }), async () => ({ ok: true }))

export type AppRouter = typeof server.router

server.listen()`,
    },
    {
      path: 'server/tsconfig.json',
      content: JSON.stringify({
        compilerOptions: {
          target: 'ES2020', module: 'ESNext', moduleResolution: 'bundler',
          lib: ['ES2020'], strict: true, skipLibCheck: true, outDir: './dist',
        },
        include: ['.'],
      }, null, 2),
    },
  ]
}

// ─── Minimal Template ─────────────────────────────────────────────────────────

function minimalTemplate(name: string): TemplateFile[] {
  return [
    {
      path: 'package.json',
      content: JSON.stringify({
        name,
        version: '0.1.0',
        type: 'module',
        scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
        dependencies: {
          '@weldjs/react': 'latest',
          'react':         '^18.0.0',
          'react-dom':     '^18.0.0',
        },
        devDependencies: {
          '@types/react':         '^18.0.0',
          '@types/react-dom':     '^18.0.0',
          '@vitejs/plugin-react': '^4.0.0',
          'typescript':           '^5.4.0',
          'vite':                 '^5.0.0',
        },
      }, null, 2),
    },
    ...baseFiles(name),
    {
      path: 'src/main.tsx',
      content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import { WeldProvider } from '@weldjs/react'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WeldProvider>
      <App />
    </WeldProvider>
  </React.StrictMode>
)`,
    },
    {
      path: 'src/App.tsx',
      content: `import { Weld } from '@weldjs/react'
import weldLogo from './assets/weld.png'

export function App() {
  return (
    <Weld.Shell>
      <Weld.Header fixed neon>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={weldLogo} alt="WELD" style={{ height: 28, width: 28 }} />
          <span style={{ fontWeight: 700, background: 'linear-gradient(135deg, #00d4ff, #3b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ${name}
          </span>
        </div>
      </Weld.Header>
      <Weld.Main>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <Weld.Heading level={1} style={{ marginBottom: 16 }}>${name}</Weld.Heading>
          <Weld.Text variant="muted">
            Edit <Weld.Text variant="code" as="span">src/App.tsx</Weld.Text> to get started.
          </Weld.Text>
        </div>
      </Weld.Main>
      <Weld.Footer>
        <Weld.Text variant="muted" style={{ textAlign: 'center', fontSize: 13 }}>Built with ⬡ WELD</Weld.Text>
      </Weld.Footer>
    </Weld.Shell>
  )
}`,
    },
  ]
}
