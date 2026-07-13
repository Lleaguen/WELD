/**
 * create-weld-app
 * Usage: npm create weld-app
 *        npm create weld-app my-app
 */

import { execSync }    from 'node:child_process'
import { mkdir, writeFile, copyFile } from 'node:fs/promises'
import { existsSync }  from 'node:fs'
import { join, dirname } from 'node:path'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const c = {
  cyan:  (s: string) => `\x1b[36m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  dim:   (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold:  (s: string) => `\x1b[1m${s}\x1b[0m`,
  red:   (s: string) => `\x1b[31m${s}\x1b[0m`,
}

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => { rl.close(); resolve(answer.trim()) })
  })
}

async function write(base: string, path: string, content: string) {
  const full = join(base, path)
  await mkdir(dirname(full), { recursive: true })
  await writeFile(full, content, 'utf8')
}

async function main() {
  const args = process.argv.slice(2)
  let name = args.filter(a => !a.startsWith('--'))[0] ?? ''

  console.log(`\n  ${c.bold('⬡  WELD')} — Create a new app\n`)

  if (!name) {
    name = await ask(`  Project name ${c.dim('(my-weld-app)')} › `)
    if (!name) name = 'my-weld-app'
  }

  const dest = join(process.cwd(), name)

  if (existsSync(dest)) {
    console.error(c.red(`\n  Directory "${name}" already exists.\n`))
    process.exit(1)
  }

  console.log(`\n  ${c.dim('Scaffolding')} ${c.cyan(name)}\n`)

  await write(dest, 'package.json', JSON.stringify({
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
  }, null, 2))

  await write(dest, 'index.html', `<!DOCTYPE html>
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
</html>`)

  await write(dest, 'vite.config.ts', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({ plugins: [react()] })`)

  await write(dest, 'tsconfig.json', JSON.stringify({
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
  }, null, 2))

  // ── Copy weld.png logo from assets ──────────────────────────────────────────
  const logoSrc = join(__dirname, '..', 'assets', 'weld.png')
  if (existsSync(logoSrc)) {
    await mkdir(join(dest, 'src', 'assets'), { recursive: true })
    await copyFile(logoSrc, join(dest, 'src', 'assets', 'weld.png'))
  }

  await write(dest, 'src/vite-env.d.ts', `/// <reference types="vite/client" />

declare module '*.png' {
  const src: string
  export default src
}
`)

  await write(dest, 'src/main.tsx', `import React from 'react'
import ReactDOM from 'react-dom/client'
import { WeldProvider } from '@weldjs/react'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WeldProvider>
      <App />
    </WeldProvider>
  </React.StrictMode>
)`)

  await write(dest, 'src/App.tsx', `import { useState } from 'react'
import { Weld } from '@weldjs/react'
import weldLogo from './assets/weld.png'

export function App() {
  const [page, setPage] = useState<'home' | 'docs'>('home')

  return (
    <Weld.Shell>
      <Weld.Header fixed neon>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onClick={() => setPage('home')}
          >
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
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div style={{
        textAlign: 'center',
        padding: '80px 24px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 300,
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.08) 0%, rgba(59,107,255,0.05) 50%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
            <img
              src={weldLogo}
              alt="WELD"
              style={{
                height: 100,
                width: 100,
                filter: 'drop-shadow(0 0 24px rgba(0,212,255,0.5)) drop-shadow(0 0 48px rgba(59,107,255,0.3))',
              }}
            />
          </div>

          <h1 style={{
            fontSize: 56,
            fontWeight: 800,
            margin: '0 0 16px',
            background: 'linear-gradient(135deg, #00d4ff 0%, #3b6bff 60%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            Build Without Limits
          </h1>

          <p style={{
            fontSize: 18,
            color: '#a1a1aa',
            maxWidth: 520,
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            A modern fullstack framework for type-safe, offline-first web applications.
            Zero config. Maximum power.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Weld.Button
              variant="primary"
              size="lg"
              neon={{ color: '#00d4ff', intensity: 1 }}
              action={() => { window.open('https://weld-docs.vercel.app/getting-started/quick-start', '_blank'); return Promise.resolve() }}
            >
              Get Started →
            </Weld.Button>
            <Weld.Button
              variant="secondary"
              size="lg"
              action={() => { window.open('https://weld-docs.vercel.app', '_blank'); return Promise.resolve() }}
            >
              Documentation
            </Weld.Button>
          </div>
        </div>
      </div>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        <Weld.Grid cols={3} gap={16}>
          <Weld.Card accent style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🔒</div>
            <Weld.Heading level={4}>Type Safety</Weld.Heading>
            <Weld.Text variant="muted" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
              End-to-end TypeScript from server routes to UI. Wrong paths break at compile time.
            </Weld.Text>
          </Weld.Card>

          <Weld.Card style={{ background: 'rgba(59,107,255,0.04)', border: '1px solid rgba(59,107,255,0.15)' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>📡</div>
            <Weld.Heading level={4}>Offline-First</Weld.Heading>
            <Weld.Text variant="muted" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
              Automatic IndexedDB cache and mutation queue. Works seamlessly without network.
            </Weld.Text>
          </Weld.Card>

          <Weld.Card style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.15)' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⚡</div>
            <Weld.Heading level={4}>Zero Config</Weld.Heading>
            <Weld.Text variant="muted" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
              Beautiful Neon UI components. Plasma activates on interaction, invisible at rest.
            </Weld.Text>
          </Weld.Card>
        </Weld.Grid>

        {/* ── Demo ──────────────────────────────────────────────────────── */}
        <div style={{ marginTop: 48 }}>
          <Weld.Section title="Neon Button Demo" description="The WELD Button is welded to a promise. It handles loading, success, and error states automatically.">
            <div style={{
              marginTop: 24,
              padding: '32px',
              background: 'rgba(0,212,255,0.03)',
              border: '1px solid rgba(0,212,255,0.10)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              flexWrap: 'wrap',
            }}>
              <Weld.Button
                action={() => new Promise<void>((res) => setTimeout(() => { setCount(c => c + 1); res() }, 800))}
                variant="primary"
                size="lg"
                neon={{ color: '#00d4ff', intensity: 1 }}
              >
                Weld It
              </Weld.Button>
              <Weld.Badge variant={count > 0 ? 'success' : 'warning'} dot>
                Count: {count}
              </Weld.Badge>
              <Weld.Text variant="muted" style={{ fontSize: 13 }}>
                Watch the neon glow on click →
              </Weld.Text>
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
          {[
            { title: 'Quick Start',    desc: 'Build your first type-safe request in 5 minutes.', url: '/getting-started/quick-start' },
            { title: 'API Reference',  desc: 'Full reference for all WELD packages.',             url: '/api/weld' },
            { title: 'Components',     desc: 'Neon UI component library with full theming.',      url: '/components/overview' },
            { title: 'Offline-First',  desc: 'Automatic caching and mutation queue.',            url: '/concepts/offline-first' },
            { title: 'Type Safety',    desc: 'E2E types from server to component.',              url: '/concepts/type-safety' },
            { title: 'Forms',          desc: 'Integrated Zod validation for type-safe forms.',   url: '/forms/use-form' },
          ].map(({ title, desc, url }) => (
            <Weld.Card key={title} title={title}>
              <Weld.Text variant="muted" style={{ marginTop: 8, fontSize: 13 }}>{desc}</Weld.Text>
              <Weld.Button
                variant="ghost"
                size="sm"
                action={() => { window.open(\`https://weld-docs.vercel.app\${url}\`, '_blank'); return Promise.resolve() }}
                style={{ marginTop: 12 }}
              >
                Open →
              </Weld.Button>
            </Weld.Card>
          ))}
        </Weld.Grid>
      </Weld.Section>
    </div>
  )
}
`)

  console.log(`  ${c.dim('Installing dependencies...')}\n`)
  try {
    execSync('npm install', { cwd: dest, stdio: 'inherit' })
  } catch {
    console.log(`\n  ${c.dim('(run npm install manually)')}`)
  }

  console.log(`\n  ${c.green('✓')} Done!\n`)
  console.log(`  ${c.dim('Next steps:')}\n`)
  console.log(`    ${c.cyan(`cd ${name}`)}`)
  console.log(`    ${c.cyan('npm run dev')}\n`)
}

main().catch((e) => { console.error(e); process.exit(1) })
