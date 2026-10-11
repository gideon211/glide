import type Glide from 'glide'
import type { ScrollCallback } from 'glide'
import { shallowRef } from 'vue'

export const globalGlide = shallowRef<Glide>()
export const globalAddCallback =
  shallowRef<(callback: ScrollCallback, priority: number) => void>()
export const globalRemoveCallback =
  shallowRef<(callback: ScrollCallback) => void>()
