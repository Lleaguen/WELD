/**
 * weld create <name> [--template spa|fullstack|minimal]
 */

import { execSync }           from 'node:child_process'
import { log, ok, step, c }  from '../utils/print.js'
import { writeFileSafe, pathExists, resolvePath } from '../utils/fs.js'
import { getTemplate, copyLogo, type Template } from '../templates/index.js'

export async function cmdCreate(args: string[]): Promise<void> {
  const name     = args[0]
  const tmplFlag = args.indexOf('--template')
  const template: Template = tmplFlag !== -1
    ? (args[tmplFlag + 1] ?? 'spa') as Template
    : 'spa'

  if (!name) {
    console.error('\nUsage: weld create <project-name> [--template spa|fullstack|minimal]\n')
    process.exit(1)
  }

  const dest = resolvePath(name)

  if (pathExists(dest)) {
    console.error(`\nDirectory "${name}" already exists.\n`)
    process.exit(1)
  }

  log(`\n  ⬡  ${c.bold('WELD')} — Creating ${c.cyan(name)} (${template})\n`)

  const files = getTemplate(name, template)

  step(1, 'Scaffolding project files...')
  for (const file of files) {
    await writeFileSafe(`${dest}/${file.path}`, file.content)
    log(`     ${c.dim('+')} ${file.path}`)
  }

  // Copy WELD logo
  copyLogo(dest)
  log(`     ${c.dim('+')} src/assets/weld.png`)

  step(2, 'Installing dependencies...')
  // Detect package manager from lockfiles — same logic as weld dev/build
  const hasBun  = pathExists(resolvePath('bun.lockb'))
  const hasPnpm = pathExists(resolvePath('pnpm-lock.yaml'))
  const pm      = hasBun ? 'bun' : hasPnpm ? 'pnpm' : 'npm'

  try {
    execSync(`${pm} install`, { cwd: dest, stdio: 'inherit' })
  } catch {
    log(`  ${c.dim(`(skip — run ${pm} install manually)`)}`)
  }

  ok('Done!\n')
  log(`  Next steps:\n`)
  log(`    ${c.cyan(`cd ${name}`)}`)
  log(`    ${c.cyan(`${pm} run dev`)}\n`)
}
