import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index:   'src/index.ts',
    react:   'src/react.ts',
    vue:     'src/vue.ts',
    solid:   'src/solid.ts',
    angular: 'src/angular.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: true,
  external: [
    'react',
    'vue',
    'solid-js',
    'rxjs',
    '@preact/signals-core',
    'zod',
    '@weldjs/core',
    '@weldjs/react',
    '@weldjs/vue',
    '@weldjs/solid',
    '@weldjs/angular',
  ],
})
