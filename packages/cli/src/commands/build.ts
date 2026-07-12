/**
 * weld build — production build via Vite
 */

import { execSync }          from 'node:child_process'
import { info, ok, err }     from '../utils/print.js'
import { pathExists, resolvePath } from '../utils/fs.js'

export async function cmdBuild(_args: string[]): Promise<void> {
  const hasBun  = pathExists(resolvePath('bun.lockb'))
  const hasPnpm = pathExists(resolvePath('pnpm-lock.yaml'))
  const pm      = hasBun ? 'bunx' : hasPnpm ? 'pnpm' : 'npx'

  info('Building for production...\n')

  try {
    execSync(`${pm} vite build`, { stdio: 'inherit' })
    ok('Build complete.\n')
  } catch {
    err('Build failed.')
    process.exit(1)
  }
}
