/**
 * @weldjs/cli — Command router
 */

import { cmdCreate }  from './commands/create.js'
import { cmdDev }     from './commands/dev.js'
import { cmdBuild }   from './commands/build.js'
import { cmdInfo }    from './commands/info.js'
import { printHelp }  from './utils/print.js'

export async function run(args: string[]): Promise<void> {
  const [command, ...rest] = args

  switch (command) {
    case 'create':
    case 'new':
      await cmdCreate(rest)
      break

    case 'dev':
      await cmdDev(rest)
      break

    case 'build':
      await cmdBuild(rest)
      break

    case 'info':
      await cmdInfo()
      break

    case '--version':
    case '-v': {
      // Read version from package.json at runtime — never stale
      const { createRequire } = await import('node:module')
      const { dirname }       = await import('node:path')
      const { fileURLToPath } = await import('node:url')
      try {
        const req     = createRequire(fileURLToPath(import.meta.url))
        const pkgPath = dirname(fileURLToPath(import.meta.url)) + '/../package.json'
        const pkg     = req(pkgPath) as { version: string }
        console.log(pkg.version)
      } catch {
        console.log('0.4.1')
      }
      break
    }

    case '--help':
    case '-h':
    case undefined:
      printHelp()
      break

    default:
      console.error(`\nUnknown command: ${command}\n`)
      printHelp()
      process.exit(1)
  }
}
