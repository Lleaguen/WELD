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
          dev:   'vite',
          build: 'vite build',
          preview: 'vite preview',
        },
        dependencies: {
          '@weldjs/http':   'latest',
          '@weldjs/react':  'latest',
          '@weldjs/router': 'latest',
          '@weldjs/forms':  'latest',
          'react':          '^18.0.0',
          'react-dom':      '^18.0.0',
          'zod':            '^3.22.0',
        },
        devDependencies: {
          '@types/react':        '^18.0.0',
          '@types/react-dom':    '^18.0.0',
          '@vitejs/plugin-react': '^4.0.0',
          'typescript':          '^5.4.0',
          'vite':                '^5.0.0',
        },
      }, null, 2),
    },
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
import { WeldRouter, Route } from '@weldjs/router'
import { Home } from './pages/Home'

export function App() {
  return (
    <Weld.Shell>
      <Weld.Header fixed>
        <span>⬡ ${name}</span>
      </Weld.Header>
      <div style={{ display: 'flex' }}>
        <Weld.Sidebar>
          {/* nav items */}
        </Weld.Sidebar>
        <WeldRouter>
          <Route path="/" component={Home} />
        </WeldRouter>
      </div>
      <Weld.Footer>Built with WELD</Weld.Footer>
      <Weld.ToastProvider />
    </Weld.Shell>
  )
}`,
    },
    {
      path: 'src/pages/Home.tsx',
      content: `import { Weld } from '@weldjs/react'

export function Home() {
  return (
    <Weld.Main>
      <Weld.Section title="Welcome to ${name}">
        <Weld.Card>
          <Weld.Heading level={2}>Getting started</Weld.Heading>
          <Weld.Text>Edit <Weld.Text variant="code" as="span">src/pages/Home.tsx</Weld.Text> to get started.</Weld.Text>
        </Weld.Card>
      </Weld.Section>
    </Weld.Main>
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

// ─── Fullstack Template ───────────────────────────────────────────────────────

function fullstackTemplate(name: string): TemplateFile[] {
  const spa = spaTemplate(name)

  return [
    ...spa,
    {
      path: 'server/index.ts',
      content: `import { WeldServer } from '@weldjs/server'
import { z } from 'zod'

const server = new WeldServer({ port: 3000 })

// Define your routes here
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
        scripts: { dev: 'vite', build: 'vite build' },
        dependencies: {
          '@weldjs/http':  'latest',
          '@weldjs/react': 'latest',
          'react':         '^18.0.0',
          'react-dom':     '^18.0.0',
        },
        devDependencies: {
          '@vitejs/plugin-react': '^4.0.0',
          'typescript':  '^5.4.0',
          'vite':        '^5.0.0',
        },
      }, null, 2),
    },
    {
      path: 'src/main.tsx',
      content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import { WeldProvider, Weld } from '@weldjs/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WeldProvider>
    <Weld.Shell>
      <Weld.Main>
        <Weld.Heading level={1}>${name}</Weld.Heading>
      </Weld.Main>
    </Weld.Shell>
  </WeldProvider>
)`,
    },
  ]
}
