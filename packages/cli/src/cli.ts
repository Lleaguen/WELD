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
    case '-v':
      console.log('0.1.0')
      break

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
