import type Glide from 'glide'
import type { GlideOptions, ScrollCallback } from 'glide'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type GlideContextValue = {
  glide: Glide
  addCallback: (callback: ScrollCallback, priority: number) => void
  removeCallback: (callback: ScrollCallback) => void
}

export type GlideProps = ComponentPropsWithoutRef<'div'> & {
  /**
   * Setup a global instance of Glide
   * if `asChild`, the component will render wrapper and content divs
   * @default false
   */
  root?: boolean | 'asChild'
  /**
   * Glide options
   */
  options?: GlideOptions
  /**
   * Auto-setup requestAnimationFrame
   * @default true
   * @deprecated use options.autoRaf instead
   */
  autoRaf?: boolean
  /**
   * Children
   */
  children?: ReactNode

  /**
   * Class name to be applied to the wrapper div
   * @default ''
   */
  className?: string | undefined
}

export type GlideRef = {
  /**
   * The wrapper div element
   *
   * Will only be defined if `root` is `false` or `root` is `asChild`
   */
  wrapper: HTMLDivElement | null
  /**
   * The content div element
   *
   * Will only be defined if `root` is `false` or `root` is `asChild`
   */
  content: HTMLDivElement | null
  /**
   * The glide instance
   */
  glide?: Glide
}
