/**
 * Project templates
 */

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

export default defineConfig({
  plugins: [react()],
})`,
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
      path: '.env',
      content: `VITE_API_URL=http://localhost:3000`,
    },
    {
      path: '.gitignore',
      content: `node_modules\ndist\n.env.local\n`,
    },
  ]
}

// ─── SPA Template ────────────────────────────────────────────────────────────

function spaTemplate(name: string): TemplateFile[] {
  return [
    {
      path: 'package.json',
      content: JSON.stringify({
        name,
        version: '0.1.0',
        type: 'module',
        scripts: {
          dev:     'vite',
          build:   'vite build',
          preview: 'vite preview',
        },
        dependencies: {
          '@weldjs/react':  'latest',
          '@weldjs/router': 'latest',
          '@weldjs/forms':  'latest',
          '@weldjs/http':   'latest',
          'react':          '^18.0.0',
          'react-dom':      '^18.0.0',
          'zod':            '^3.22.0',
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
import { WeldProvider, ToastProvider } from '@weldjs/react'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WeldProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </WeldProvider>
  </React.StrictMode>
)`,
    },
    {
      path: 'src/App.tsx',
      content: `import { useState } from 'react'
import { Weld } from '@weldjs/react'
import { WeldRouter, Route } from '@weldjs/router'
import { Home } from './pages/Home'

export function App() {
  return (
    <Weld.Shell>
      <Weld.Header fixed neon>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ fontWeight: 700, fontSize: 17, background: 'linear-gradient(135deg, #00d4ff, #3b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ⬡ ${name}
          </span>
        </div>
      </Weld.Header>
      <Weld.Main>
        <WeldRouter>
          <Route path="/" component={Home} />
        </WeldRouter>
      </Weld.Main>
      <Weld.Footer>
        <Weld.Text variant="muted" style={{ textAlign: 'center', fontSize: 13 }}>
          Built with ⬡ WELD
        </Weld.Text>
      </Weld.Footer>
    </Weld.Shell>
  )
}`,
    },
    {
      path: 'src/pages/Home.tsx',
      content: `import { useState } from 'react'
import { Weld } from '@weldjs/react'

export function Home() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <Weld.Section title="Welcome to ${name}" description="Your WELD app is ready. Edit src/pages/Home.tsx to get started." divider={false}>
        <Weld.Grid cols={3} gap={16} style={{ marginTop: 24 }}>
          <Weld.Card accent style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <Weld.Heading level={4}>🔒 Type Safety</Weld.Heading>
            <Weld.Text variant="muted" style={{ marginTop: 8, fontSize: 13 }}>End-to-end typed from server to component.</Weld.Text>
          </Weld.Card>
          <Weld.Card style={{ background: 'rgba(59,107,255,0.04)', border: '1px solid rgba(59,107,255,0.15)' }}>
            <Weld.Heading level={4}>📡 Offline-First</Weld.Heading>
            <Weld.Text variant="muted" style={{ marginTop: 8, fontSize: 13 }}>Automatic IndexedDB cache and sync queue.</Weld.Text>
          </Weld.Card>
          <Weld.Card style={{ background: 'rgba(59,107,255,0.04)', border: '1px solid rgba(59,107,255,0.15)' }}>
            <Weld.Heading level={4}>⚡ Zero Config</Weld.Heading>
            <Weld.Text variant="muted" style={{ marginTop: 8, fontSize: 13 }}>Beautiful Neon UI components out of the box.</Weld.Text>
          </Weld.Card>
        </Weld.Grid>

        <div style={{ marginTop: 32, padding: '24px', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.10)', borderRadius: 8 }}>
          <Weld.Text variant="muted">Counter: <strong style={{ color: '#00d4ff' }}>{count}</strong></Weld.Text>
          <Weld.Button
            action={() => new Promise<void>((res) => setTimeout(() => { setCount(c => c + 1); res() }, 600))}
            style={{ marginTop: 16 }}
          >
            Increment
          </Weld.Button>
        </div>
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
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
)`,
    },
  ]
}

// ─── Fullstack Template ───────────────────────────────────────────────────────

function fullstackTemplate(name: string): TemplateFile[] {
  const spa = spaTemplate(name)

  // Update package.json to add server dep and script
  const pkgFile = spa.find(f => f.path === 'package.json')!
  const pkg = JSON.parse(pkgFile.content)
  pkg.dependencies['@weldjs/server'] = 'latest'
  pkg.scripts['server:dev'] = 'node --watch server/index.js'
  pkgFile.content = JSON.stringify(pkg, null, 2)

  return [
    ...spa,
    {
      path: 'server/index.ts',
      content: `import { WeldServer } from '@weldjs/server'
import { z } from 'zod'

const server = new WeldServer({ port: 3000 })

server.get('health', z.object({ ok: z.boolean() }), async () => {
  return { ok: true }
})

export type AppRouter = typeof server.router

server.listen()`,
    },
    {
      path: 'server/tsconfig.json',
      content: JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'bundler',
          lib: ['ES2020'],
          strict: true,
          skipLibCheck: true,
          outDir: './dist',
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
        scripts: {
          dev:     'vite',
          build:   'vite build',
          preview: 'vite preview',
        },
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

export function App() {
  return (
    <Weld.Shell>
      <Weld.Header fixed neon>
        <span style={{ fontWeight: 700, background: 'linear-gradient(135deg, #00d4ff, #3b6bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ⬡ ${name}
        </span>
      </Weld.Header>
      <Weld.Main>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <Weld.Heading level={1} style={{ marginBottom: 16 }}>${name}</Weld.Heading>
          <Weld.Text variant="muted">
            Your minimal WELD app. Edit <Weld.Text variant="code" as="span">src/App.tsx</Weld.Text> to get started.
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
    {
      path: '.gitignore',
      content: `node_modules\ndist\n`,
    },
  ]
}
