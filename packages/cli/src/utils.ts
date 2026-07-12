import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export function log(msg: string)  { process.stdout.write(`${msg}\n`) }
export function info(msg: string) { process.stdout.write(`\x1b[36m  ${msg}\x1b[0m\n`) }
export function ok(msg: string)   { process.stdout.write(`\x1b[32m  ✓ ${msg}\x1b[0m\n`) }
export function warn(msg: string) { process.stdout.write(`\x1b[33m  ⚠ ${msg}\x1b[0m\n`) }
export function err(msg: string)  { process.stderr.write(`\x1b[31m  ✕ ${msg}\x1b[0m\n`) }

export function writeFile(path: string, content: string) {
  const dir = path.substring(0, path.lastIndexOf('/'))
  if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(path, content, 'utf-8')
}

export function run(cmd: string, cwd?: string) {
  execSync(cmd, { stdio: 'inherit', cwd })
}

export function dirExists(path: string) {
  return existsSync(path)
}

export function makeDir(path: string) {
  mkdirSync(path, { recursive: true })
}
