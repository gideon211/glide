import Glide, { type GlideOptions, type ScrollCallback } from 'glide'
import type {
  HTMLAttributes,
  InjectionKey,
  Plugin,
  PropType,
  ShallowRef,
  ToRefs,
} from 'vue'
import {
  defineComponent,
  h,
  onWatcherCleanup,
  provide,
  reactive,
  ref,
  shallowRef,
  watch,
} from 'vue'
import { globalAddCallback, globalGlide, globalRemoveCallback } from './store'

export const GlideSymbol: InjectionKey<ShallowRef<Glide | undefined>> =
  Symbol('GlideContext')
export const AddCallbackSymbol: InjectionKey<
  ((callback: ScrollCallback, priority: number) => void) | undefined
> = Symbol('AddCallback')
export const RemoveCallbackSymbol: InjectionKey<
  ((callback: ScrollCallback) => void) | undefined
> = Symbol('RemoveCallback')

export type GlideExposed = {
  wrapper?: HTMLDivElement
  content?: HTMLDivElement
  glide?: Glide
}

const VueGlideImpl = defineComponent({
  name: 'VueGlide',
  props: {
    root: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    autoRaf: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    options: {
      type: Object as PropType<GlideOptions>,
      default: () => ({}),
    },
    props: {
      type: Object as PropType<HTMLAttributes>,
      default: () => ({}),
    },
  },
  setup(props, { slots, expose }) {
    const glideRef = shallowRef<Glide>()
    const wrapper = ref<HTMLDivElement>()
    const content = ref<HTMLDivElement>()
    // Setup exposed properties
    expose<ToRefs<GlideExposed>>({
      glide: glideRef,
      wrapper,
      content,
    })

    // Sync options
    watch(
      [() => props.options, wrapper, content],
      () => {
        const isClient = typeof window !== 'undefined'

        if (!isClient) return

        if (!(props.root || (wrapper.value && content.value))) return

        glideRef.value = new Glide({
          ...props.options,
          ...(!props.root
            ? {
                wrapper: wrapper.value,
                content: content.value,
              }
            : {}),
          autoRaf: props.options?.autoRaf ?? props.autoRaf,
        })

        onWatcherCleanup(() => {
          glideRef.value?.destroy()
          glideRef.value = undefined
        })
      },
      { deep: true, immediate: true }
    )

    const callbacks = reactive<
      { callback: ScrollCallback; priority: number }[]
    >([])

    function addCallback(callback: ScrollCallback, priority: number) {
      callbacks.push({ callback, priority })
      callbacks.sort((a, b) => a.priority - b.priority)
    }

    function removeCallback(callback: ScrollCallback) {
      callbacks.splice(
        callbacks.findIndex((cb) => cb.callback === callback),
        1
      )
    }

    const onScroll: ScrollCallback = (data) => {
      for (const { callback } of callbacks) {
        callback(data)
      }
    }

    watch(
      [glideRef, () => props.root],
      ([glide, root]) => {
        glide?.on('scroll', onScroll)

        if (root) {
          globalGlide.value = glide
          globalAddCallback.value = addCallback
          globalRemoveCallback.value = removeCallback

          onWatcherCleanup(() => {
            globalGlide.value = undefined
            globalAddCallback.value = undefined
            globalRemoveCallback.value = undefined
          })
        }
      },
      { immediate: true }
    )

    if (!props.root) {
      provide(GlideSymbol, glideRef)
      provide(AddCallbackSymbol, addCallback)
      provide(RemoveCallbackSymbol, removeCallback)
    }

    return () => {
      if (props.root) {
        return slots.default?.()
      }
      return h('div', { ref: wrapper, ...props?.props }, [
        h('div', { ref: content }, slots.default?.()),
      ])
    }
  },
})

export const VueGlide = VueGlideImpl as typeof VueGlideImpl & {
  new (): GlideExposed
}

export const vueGlidePlugin: Plugin = (app) => {
  app.component('vue-glide', VueGlide)
  // Setup a global provide to silence top level useGlide injection warning
  app.provide(GlideSymbol, shallowRef(undefined))
  app.provide(AddCallbackSymbol, undefined)
  app.provide(RemoveCallbackSymbol, undefined)
}

// @ts-expect-error
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    'vue-glide': typeof VueGlide
  }
}
