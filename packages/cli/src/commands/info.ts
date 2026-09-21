/**
 * weld info — show environment info
 */

import { execSync }      from 'node:child_process'
import { readFileSync }  from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { log, c }        from '../utils/print.js'

function run(cmd: string): string {
  try { return execSync(cmd, { encoding: 'utf8' }).trim() }
  catch { return 'not found' }
}

function getCliVersion(): string {
  try {
    const dir  = dirname(fileURLToPath(import.meta.url))
    const pkg  = JSON.parse(readFileSync(join(dir, '../../package.json'), 'utf8')) as { version: string }
    return pkg.version
  } catch {
    return '0.4.1'
  }
}

export async function cmdInfo(): Promise<void> {
  log(`\n  ⬡  ${c.bold('WELD Environment Info')}\n`)
  log(`  ${c.dim('CLI')}      ${c.cyan(getCliVersion())}`)
  log(`  ${c.dim('Node')}     ${process.version}`)
  log(`  ${c.dim('npm')}      ${run('npm --version')}`)
  log(`  ${c.dim('pnpm')}     ${run('pnpm --version')}`)
  log(`  ${c.dim('bun')}      ${run('bun --version')}`)
  log(`  ${c.dim('OS')}       ${process.platform} ${process.arch}`)
  log('')
}
