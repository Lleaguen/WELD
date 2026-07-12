/**
 * weld info — show environment info
 */

import { execSync }  from 'node:child_process'
import { log, c }   from '../utils/print.js'

function run(cmd: string): string {
  try { return execSync(cmd, { encoding: 'utf8' }).trim() }
  catch { return 'not found' }
}

export async function cmdInfo(): Promise<void> {
  log(`\n  ⬡  ${c.bold('WELD Environment Info')}\n`)
  log(`  ${c.dim('CLI')}      ${c.cyan('0.1.0')}`)
  log(`  ${c.dim('Node')}     ${process.version}`)
  log(`  ${c.dim('npm')}      ${run('npm --version')}`)
  log(`  ${c.dim('pnpm')}     ${run('pnpm --version')}`)
  log(`  ${c.dim('bun')}      ${run('bun --version')}`)
  log(`  ${c.dim('OS')}       ${process.platform} ${process.arch}`)
  log('')
}
