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

  const weldLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfsAAAHsCAYAAADVWATxAAAQAElEQVR4Aez9CYBkR3mgi8Z29pN7Ze1b V+/darWk0tZaoISEoAGxmCnZYxssbL/mmbniGsbb9X0zRb1378x47AseydgjeUEGY2ZUgzEILBACCoQktLSWVu97VdeelXuePZYXKYwNQkt3q7uzqvtER2Rl'

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
    <Weld.Shell style={{ background: '#0a0e27' }}>
      <Weld.Header fixed style={{ background: 'rgba(10, 14, 39, 0.95)', borderBottom: '1px solid rgba(0, 212, 255, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '32px' }}>
          <img src="/weld.png" alt="WELD" onClick={() => setPage('home')} style={{ cursor: 'pointer', height: '32px', width: 'auto' }} />
          </div>
          <nav style={{ display: 'flex', gap: '32px', marginLeft: 'auto' }}>
            <button 
              onClick={() => setPage('home')}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: page === 'home' ? '#00d4ff' : '#999',
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
                color: page === 'about' ? '#00d4ff' : '#999',
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

      <Weld.Main style={{ background: '#0a0e27', padding: '60px 20px' }}>
        {page === 'home' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Weld.Section title="Welcome to WELD" divider={false}>
              <Weld.Text style={{ fontSize: '16px', color: '#aaa' }}>
                A modern fullstack framework for building type-safe, offline-first web applications.
              </Weld.Text>

              <div style={{ marginTop: '48px' }}>
                <Weld.Heading level={3} style={{ color: '#e0e0e0', marginBottom: '24px' }}>Features</Weld.Heading>
                <Weld.Grid cols={3} gap={16}>
                  <Weld.Card style={{ background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)' }} accent>
                    <Weld.Heading level={4} style={{ color: '#00d4ff' }}>Type Safety</Weld.Heading>
                    <Weld.Text style={{ color: '#aaa', marginTop: '8px' }}>End-to-end type checking from API to UI</Weld.Text>
                  </Weld.Card>
                  <Weld.Card style={{ background: 'rgba(59, 107, 255, 0.05)', border: '1px solid rgba(59, 107, 255, 0.2)' }}>
                    <Weld.Heading level={4} style={{ color: '#e0e0e0' }}>Offline-First</Weld.Heading>
                    <Weld.Text style={{ color: '#aaa', marginTop: '8px' }}>Automatic caching and sync queue</Weld.Text>
                  </Weld.Card>
                  <Weld.Card style={{ background: 'rgba(59, 107, 255, 0.05)', border: '1px solid rgba(59, 107, 255, 0.2)' }}>
                    <Weld.Heading level={4} style={{ color: '#e0e0e0' }}>Zero Config</Weld.Heading>
                    <Weld.Text style={{ color: '#aaa', marginTop: '8px' }}>Beautiful components out of the box</Weld.Text>
                  </Weld.Card>
                </Weld.Grid>
              </div>

              <Weld.Divider style={{ margin: '48px 0', borderColor: 'rgba(0, 212, 255, 0.1)' }} />

              <Weld.Heading level={3} style={{ color: '#e0e0e0', marginBottom: '24px' }}>Try It</Weld.Heading>
              <div style={{ padding: '32px', background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.15)', borderRadius: '8px' }}>
                <Weld.Text style={{ color: '#aaa' }}>
                  Counter: <strong style={{ color: '#00d4ff', fontSize: '18px' }}>{count}</strong>
                </Weld.Text>
                <button 
                  onClick={() => setCount(count + 1)}
                  style={{ 
                    marginTop: '16px',
                    padding: '8px 16px',
                    background: 'rgba(0, 212, 255, 0.1)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    color: '#00d4ff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)'
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Increment
                </button>
              </div>
            </Weld.Section>
          </div>
        )}

        {page === 'about' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Weld.Section title="About WELD">
              <Weld.Text style={{ color: '#aaa', marginBottom: '24px' }}>
                WELD is designed for developers who want to build modern web applications without fighting complexity.
              </Weld.Text>

              <Weld.Heading level={3} style={{ color: '#e0e0e0', marginTop: '32px', marginBottom: '16px' }}>Why WELD?</Weld.Heading>
              <ul style={{ paddingLeft: '24px', lineHeight: '1.8', color: '#aaa' }}>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#00d4ff' }}>Type Safety:</strong> End-to-end type checking</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#00d4ff' }}>Offline-First:</strong> Built-in caching and sync</li>
                <li style={{ marginBottom: '12px' }}><strong style={{ color: '#00d4ff' }}>Zero Config:</strong> Components work immediately</li>
              </ul>

              <Weld.Heading level={3} style={{ color: '#e0e0e0', marginTop: '32px', marginBottom: '16px' }}>Learn More</Weld.Heading>
              <Weld.Text style={{ color: '#aaa' }}>
                Check out the <a href="https://weld-docs.vercel.app" target="_blank" rel="noopener noreferrer">documentation</a>.
              </Weld.Text>
            </Weld.Section>
          </div>
        )}
      </Weld.Main>

      <Weld.Footer style={{ background: 'rgba(10, 14, 39, 0.95)', borderTop: '1px solid rgba(0, 212, 255, 0.1)' }}>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Built with ⬡ WELD</p>
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
