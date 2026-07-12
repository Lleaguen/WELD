/**
 * CLI output helpers
 */

export function printHelp(): void {
  console.log(`
  ⬡  WELD CLI v0.1.0

  Usage:
    weld <command> [options]

  Commands:
    create <name>     Scaffold a new WELD app
    dev               Start development server
    build             Build for production
    info              Show environment info

  Options:
    -v, --version     Show version
    -h, --help        Show this help

  Examples:
    weld create my-app
    weld create my-app --template fullstack
    weld dev
    weld build
`)
}

export const c = {
  cyan:   (s: string) => `\x1b[36m${s}\x1b[0m`,
  green:  (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  red:    (s: string) => `\x1b[31m${s}\x1b[0m`,
  dim:    (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold:   (s: string) => `\x1b[1m${s}\x1b[0m`,
}

export function log(msg: string)  { console.log(msg) }
export function ok(msg: string)   { console.log(c.green('✓') + ' ' + msg) }
export function info(msg: string) { console.log(c.cyan('ℹ') + ' ' + msg) }
export function warn(msg: string) { console.log(c.yellow('⚠') + ' ' + msg) }
export function err(msg: string)  { console.error(c.red('✕') + ' ' + msg) }
export function step(n: number, msg: string) {
  console.log(c.dim(`[${n}]`) + ' ' + msg)
}
