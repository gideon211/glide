import vuePlugin from 'glide/vue'
import type { Plugin } from '#app'
import { defineNuxtPlugin } from '#imports'

const plugin = defineNuxtPlugin({
  name: 'glide',
  setup(nuxtApp: unknown) {
    ;(nuxtApp as { vueApp: { use: (plugin: unknown) => void } }).vueApp.use(
      vuePlugin
    )
  },
}) satisfies Plugin

export default plugin
