/**
 * create-weld-app
 * Usage: npm create weld-app
 *        npm create weld-app my-app
 */

import { execSync }    from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync, copyFileSync }  from 'node:fs'
import { join, dirname } from 'node:path'
import { createInterface } from 'node:readline'

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

  const deps: Record<string, string> = {
    '@weldjs/react':  'latest',
    'react':          '^18.0.0',
    'react-dom':      '^18.0.0',
  }

  await write(dest, 'package.json', JSON.stringify({
    name,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev:     'vite',
      build:   'vite build',
      preview: 'vite preview',
    },
    dependencies:    deps,
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
    <title>${name} — WELD</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`)

  await write(dest, 'vite.config.ts', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`)

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

  await write(dest, 'src/main.tsx', `import React from 'react'
import ReactDOM from 'react-dom/client'
import { WeldProvider } from '@weldjs/react'
import { App } from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WeldProvider>
      <App />
    </WeldProvider>
  </React.StrictMode>
)`)

  await write(dest, 'src/styles.css', `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
}

body {
  background: #0a0e27;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
}

a {
  color: #00d4ff;
}

a:hover {
  text-decoration: underline;
}

button {
  font-family: inherit;
}
`)

  await write(dest, 'src/App.tsx', `import { useState } from 'react'
import { Weld } from '@weldjs/react'

export function App() {
  const [page, setPage] = useState('home')
  const [count, setCount] = useState(0)

  return (
    <Weld.Shell style={{ background: '#0a0e27', display: 'flex', flexDirection: 'column' }}>
      <Weld.Header fixed style={{ background: 'rgba(10, 14, 39, 0.98)', borderBottom: '1px solid rgba(0, 212, 255, 0.2)', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <img 
            src="/weld.png" 
            alt="WELD" 
            onClick={() => setPage('home')} 
            style={{ cursor: 'pointer', height: '40px', width: 'auto' }} 
          />
          <nav style={{ display: 'flex', gap: '24px' }}>
            <button 
              onClick={() => setPage('home')}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: page === 'home' ? '#00d4ff' : '#888',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
            >
              Home
            </button>
            <button 
              onClick={() => setPage('about')}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: page === 'about' ? '#00d4ff' : '#888',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
            >
              About
            </button>
          </nav>
        </div>
      </Weld.Header>

      <Weld.Main style={{ background: '#0a0e27', padding: '80px 24px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {page === 'home' && (
            <div>
              <Weld.Heading level={1} style={{ color: '#00d4ff', marginBottom: '16px', fontSize: '36px' }}>
                Welcome to WELD
              </Weld.Heading>
              <Weld.Text style={{ color: '#aaa', fontSize: '16px', marginBottom: '40px' }}>
                A modern fullstack framework for building type-safe, offline-first web applications.
              </Weld.Text>

              <Weld.Heading level={2} style={{ color: '#e0e0e0', marginBottom: '24px', fontSize: '20px' }}>
                Features
              </Weld.Heading>
              <Weld.Grid cols={3} gap={16} style={{ marginBottom: '40px' }}>
                <Weld.Card style={{ background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)', padding: '20px' }}>
                  <Weld.Heading level={4} style={{ color: '#00d4ff', fontSize: '16px', marginBottom: '8px' }}>Type Safety</Weld.Heading>
                  <Weld.Text style={{ color: '#aaa', fontSize: '14px' }}>End-to-end type checking</Weld.Text>
                </Weld.Card>
                <Weld.Card style={{ background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)', padding: '20px' }}>
                  <Weld.Heading level={4} style={{ color: '#00d4ff', fontSize: '16px', marginBottom: '8px' }}>Offline-First</Weld.Heading>
                  <Weld.Text style={{ color: '#aaa', fontSize: '14px' }}>Automatic caching & sync</Weld.Text>
                </Weld.Card>
                <Weld.Card style={{ background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)', padding: '20px' }}>
                  <Weld.Heading level={4} style={{ color: '#00d4ff', fontSize: '16px', marginBottom: '8px' }}>Zero Config</Weld.Heading>
                  <Weld.Text style={{ color: '#aaa', fontSize: '14px' }}>Works out of the box</Weld.Text>
                </Weld.Card>
              </Weld.Grid>

              <Weld.Divider style={{ margin: '40px 0', borderColor: 'rgba(0, 212, 255, 0.15)' }} />

              <Weld.Heading level={2} style={{ color: '#e0e0e0', marginBottom: '24px', fontSize: '20px' }}>
                Try It Out
              </Weld.Heading>
              <Weld.Card style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)', padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <Weld.Text style={{ color: '#aaa', marginBottom: '12px' }}>Counter: <strong style={{ color: '#00d4ff', fontSize: '20px' }}>{count}</strong></Weld.Text>
                </div>
                <button 
                  onClick={() => setCount(count + 1)}
                  style={{ 
                    padding: '10px 20px',
                    background: 'rgba(0, 212, 255, 0.15)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    color: '#00d4ff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.25)'
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.15)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Increment
                </button>
              </Weld.Card>
            </div>
          )}

          {page === 'about' && (
            <div>
              <Weld.Heading level={1} style={{ color: '#00d4ff', marginBottom: '16px', fontSize: '36px' }}>
                About WELD
              </Weld.Heading>
              <Weld.Text style={{ color: '#aaa', fontSize: '16px', marginBottom: '32px' }}>
                WELD is a modern fullstack framework designed for developers who want to build sophisticated web applications without fighting unnecessary complexity.
              </Weld.Text>

              <Weld.Heading level={2} style={{ color: '#e0e0e0', marginBottom: '16px', fontSize: '20px' }}>
                Why Choose WELD?
              </Weld.Heading>
              <ul style={{ paddingLeft: '24px', lineHeight: '2', color: '#aaa', marginBottom: '32px' }}>
                <li><strong style={{ color: '#00d4ff' }}>Type Safety:</strong> Full end-to-end type checking</li>
                <li><strong style={{ color: '#00d4ff' }}>Offline-First:</strong> Automatic caching and sync</li>
                <li><strong style={{ color: '#00d4ff' }}>Zero Config:</strong> Beautiful components ready to use</li>
              </ul>

              <Weld.Text style={{ color: '#aaa', fontSize: '16px' }}>
                Learn more at{' '}
                <a href="https://weld-docs.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff', textDecoration: 'none' }}>
                  weld-docs.vercel.app
                </a>
              </Weld.Text>
            </div>
          )}
        </div>
      </Weld.Main>

      <Weld.Footer style={{ background: 'rgba(10, 14, 39, 0.98)', borderTop: '1px solid rgba(0, 212, 255, 0.1)', padding: '24px', textAlign: 'center', marginTop: 'auto' }}>
        <Weld.Text style={{ fontSize: '14px', color: '#666', margin: 0 }}>Built with WELD</Weld.Text>
      </Weld.Footer>

      <Weld.ToastProvider />
    </Weld.Shell>
  )
}`)

  await write(dest, 'README.md', `# ${name}

A WELD application.

## Quick Start

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173).

## Build

\`\`\`bash
npm run build
\`\`\`

## Learn More

[weld-docs.vercel.app](https://weld-docs.vercel.app)
`)

  await write(dest, '.gitignore', `node_modules
dist
.DS_Store
`)

  // Copy weld.png logo to public folder
  const logoPath = join(__dirname, '../../..', 'docs/src/assets/weld.png')
  if (existsSync(logoPath)) {
    try {
      copyFileSync(logoPath, join(dest, 'public/weld.png'))
    } catch (e) {
      // logo copy failed, but continue
    }
  }

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
