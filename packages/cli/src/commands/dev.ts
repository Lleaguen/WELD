/**
 * weld dev — start Vite dev server
 */

import { execSync }          from 'node:child_process'
import { info, err }         from '../utils/print.js'
import { pathExists, resolvePath } from '../utils/fs.js'

export async function cmdDev(_args: string[]): Promise<void> {
  const hasBun  = pathExists(resolvePath('bun.lockb'))
  const hasPnpm = pathExists(resolvePath('pnpm-lock.yaml'))
  const pm      = hasBun ? 'bunx' : hasPnpm ? 'pnpm' : 'npx'

  info('Starting WELD dev server...\n')

  try {
    execSync(`${pm} vite`, { stdio: 'inherit' })
  } catch (e) {
    err('Failed to start dev server. Make sure Vite is installed.')
    process.exit(1)
  }
}
