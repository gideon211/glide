import type Glide from 'glide'
import type { ScrollCallback } from 'glide'
import { type ComputedRef, computed, inject, nextTick, onWatcherCleanup, watch } from 'vue'
import {
  AddCallbackSymbol,
  GlideSymbol,
  RemoveCallbackSymbol,
} from './provider'
import { globalAddCallback, globalGlide, globalRemoveCallback } from './store'

export function useGlide(callback?: ScrollCallback, priority = 0): ComputedRef<Glide | undefined> {
  const glideInjection = inject(GlideSymbol)
  const addCallbackInjection = inject(AddCallbackSymbol)
  const removeCallbackInjection = inject(RemoveCallbackSymbol)

  const addCallback = computed(() =>
    addCallbackInjection ? addCallbackInjection : globalAddCallback.value
  )
  const removeCallback = computed(() =>
    removeCallbackInjection
      ? removeCallbackInjection
      : globalRemoveCallback.value
  )

  const glide = computed(() =>
    glideInjection?.value ? glideInjection.value : globalGlide.value
  )

  if (typeof window !== 'undefined') {
    // Wait two ticks to make sure the glide instance is mounted
    nextTick(() => {
      nextTick(() => {
        // @ts-expect-error - import.meta.env is available in vite and nuxt
        if (!glide.value && import.meta.env.DEV) {
          console.warn(
            'No glide instance found, either mount a root glide instance or wrap your component in a glide provider'
          )
        }
      })
    })
  }

  watch(
    [glide, addCallback, removeCallback],
    ([glide, addCallback, removeCallback]) => {
      if (!(glide && addCallback && removeCallback && callback)) return

      addCallback?.(callback, priority)
      callback?.(glide!)

      onWatcherCleanup(() => {
        removeCallback?.(callback)
      })
    },
    {
      immediate: true,
    }
  )
  return glide
}
