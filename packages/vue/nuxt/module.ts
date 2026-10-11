import {
  addComponent,
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'

// Module options TypeScript interface definition
export type ModuleOptions = Record<string, never>

const nuxtModule = defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'glide/nuxt',
    configKey: 'glide',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addPlugin({
      src: resolve('./nuxt/runtime/glide.mjs'),
      name: 'glide',
    })

    addImports({ name: 'useGlide', from: 'glide/vue' })
    addComponent({
      name: 'VueGlide',
      filePath: 'glide/vue',
      global: true,
      export: 'VueGlide',
    })
  },
})

export default nuxtModule
export * from 'glide/vue'
