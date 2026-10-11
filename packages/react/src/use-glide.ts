import type Glide from 'glide'
import type { ScrollCallback } from 'glide'
import { useContext, useEffect } from 'react'
import { GlideContext, rootGlideContextStore } from './provider'
import { useStore } from './store'
import type { GlideContextValue } from './types'

// Fall back to an empty object if both context and store are not available
const fallbackContext: Partial<GlideContextValue> = {}

/**
 * Hook to access the Glide instance and its methods
 *
 * @example <caption>Scroll callback</caption>
 *          useGlide((glide) => {
 *            if (glide.isScrolling) {
 *              console.log('Scrolling...')
 *            }
 *
 *            if (glide.progress === 1) {
 *              console.log('At the end!')
 *            }
 *          })
 *
 * @example <caption>Scroll callback with dependencies</caption>
 *          useGlide((glide) => {
 *            if (glide.isScrolling) {
 *              console.log('Scrolling...', someDependency)
 *            }
 *          }, [someDependency])
 * @example <caption>Scroll callback with priority</caption>
 *          useGlide((glide) => {
 *            if (glide.isScrolling) {
 *              console.log('Scrolling...')
 *            }
 *          }, [], 1)
 * @example <caption>Instance access</caption>
 *          const glide = useGlide()
 *
 *          handleClick() {
 *            glide.scrollTo(100, {
 *              lerp: 0.1,
 *              duration: 1,
 *              easing: (t) => t,
 *              onComplete: () => {
 *                console.log('Complete!')
 *              }
 *            })
 *          }
 */
export function useGlide(
  callback?: ScrollCallback,
  deps: unknown[] = [],
  priority = 0
): Glide | undefined {
  // Try to get the glide instance from the context first
  const localContext = useContext(GlideContext)
  // Fall back to the root store if the context is not available
  const rootContext = useStore(rootGlideContextStore)
  // Fall back to the fallback context if all else fails
  const currentContext = localContext ?? rootContext ?? fallbackContext

  const { glide, addCallback, removeCallback } = currentContext

  useEffect(() => {
    if (!(callback && addCallback && removeCallback && glide)) return

    addCallback(callback, priority)
    callback(glide)

    return () => {
      removeCallback(callback)
    }
  }, [glide, addCallback, removeCallback, priority, ...deps, callback])

  return glide
}
