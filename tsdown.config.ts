import { defineConfig } from 'tsdown'

const shared = {
  outDir: 'dist',
  target: 'es2022' as const,
  platform: 'browser' as const,
  format: 'esm' as const,
  sourcemap: true,
  outExtensions: () => ({ js: '.mjs', dts: '.d.ts' }),
}

const iife = (globalName: string, minify = false) =>
  ({
    ...shared,
    format: 'iife' as const,
    dts: false,
    clean: false,
    globalName,
    minify,
    outExtensions: undefined,
    outputOptions: {
      entryFileNames: minify ? '[name].min.js' : '[name].js',
    },
  }) as const

export default defineConfig([
  // Core + Snap ESM
  {
    ...shared,
    entry: {
      glide: 'packages/core/index.ts',
      'glide-snap': 'packages/snap/index.ts',
    },
    dts: true,
    clean: true,
    copy: [{ from: 'packages/core/glide.css', to: 'dist', flatten: true }],
    deps: { neverBundle: ['glide'] },
  },

  // React ESM
  {
    ...shared,
    entry: { 'glide-react': 'packages/react/index.ts' },
    dts: { resolver: 'tsc' },
    clean: false,
    banner: '"use client";',
    deps: { neverBundle: ['react', 'glide'] },
  },

  // Vue ESM
  {
    ...shared,
    entry: { 'glide-vue': 'packages/vue/index.ts' },
    dts: { resolver: 'tsc' },
    clean: false,
    deps: { neverBundle: ['vue', 'glide'] },
  },

  // Nuxt ESM
  {
    ...shared,
    entry: {
      'glide-vue-nuxt': 'packages/vue/nuxt/module.ts',
      'nuxt/runtime/glide': 'packages/vue/nuxt/runtime/glide.ts',
    },
    dts: false,
    sourcemap: false,
    clean: false,
    deps: { neverBundle: ['glide', 'glide/vue', '#imports', '#app', '@nuxt/kit'] },
  },

  // Browser IIFE builds
  { entry: { glide: 'packages/core/browser.ts' }, ...iife('Glide') },
  { entry: { glide: 'packages/core/browser.ts' }, ...iife('Glide', true) },
  { entry: { 'glide-snap': 'packages/snap/browser.ts' }, ...iife('Snap') },
  { entry: { 'glide-snap': 'packages/snap/browser.ts' }, ...iife('Snap', true) },
])
