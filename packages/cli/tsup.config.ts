import { defineConfig } from 'tsup'

export default defineConfig([
  // bin entry — must be executable
  {
    entry: ['src/bin.ts'],
    format: ['esm'],
    dts: false,
    clean: true,
    banner: { js: '#!/usr/bin/env node' },
    external: ['zod'],
  },
  // library entry for programmatic use
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    external: ['zod'],
  },
])
