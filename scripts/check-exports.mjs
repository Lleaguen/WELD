#!/usr/bin/env node
/**
 * check-exports.mjs
 *
 * For each package under /packages/*, reads package.json "exports" and verifies
 * that every file listed there actually exists in the dist/ folder.
 *
 * Exits with code 1 if any files are missing.
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdirSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packagesDir = resolve(__dirname, '..', 'packages')

/**
 * Recursively collect all string values from the "exports" field.
 * The exports field can be a string, an array, or a nested object.
 */
function collectExportPaths(value) {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(collectExportPaths)
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectExportPaths)
  }
  return []
}

let allPassed = true

const packageDirs = readdirSync(packagesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => join(packagesDir, d.name))

for (const pkgDir of packageDirs) {
  const pkgJsonPath = join(pkgDir, 'package.json')

  if (!existsSync(pkgJsonPath)) continue

  let pkg
  try {
    pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))
  } catch {
    console.warn(`⚠  Could not parse ${pkgJsonPath}`)
    continue
  }

  if (!pkg.exports) continue

  const exportPaths = collectExportPaths(pkg.exports)

  // Only check paths that look like dist files (start with ./dist/)
  const distPaths = exportPaths.filter(p => p.startsWith('./dist/'))

  if (distPaths.length === 0) continue

  console.log(`\nChecking ${pkg.name ?? pkgDir} …`)

  for (const relativePath of distPaths) {
    // relativePath is like "./dist/index.js"
    const absolutePath = join(pkgDir, relativePath)

    if (existsSync(absolutePath)) {
      console.log(`  ✓ ${relativePath}`)
    } else {
      console.warn(`  ✗ MISSING: ${relativePath}`)
      allPassed = false
    }
  }
}

if (!allPassed) {
  console.error('\n❌ Some export files are missing. Run the build first.\n')
  process.exit(1)
} else {
  console.log('\n✅ All export files present.\n')
}
