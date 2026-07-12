/**
 * File system helpers
 */

import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { existsSync } from 'node:fs'

export async function ensureDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true })
}

export async function writeFileSafe(path: string, content: string): Promise<void> {
  await ensureDir(dirname(path))
  await writeFile(path, content, 'utf8')
}

export async function readFileSafe(path: string): Promise<string | null> {
  try {
    return await readFile(path, 'utf8')
  } catch {
    return null
  }
}

export function pathExists(path: string): boolean {
  return existsSync(path)
}

export function resolvePath(...parts: string[]): string {
  return join(process.cwd(), ...parts)
}
