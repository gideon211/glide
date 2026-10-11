import Glide, { type ScrollCallback } from 'glide'
import {
  type ForwardRefExoticComponent,
  type RefAttributes,
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Store } from './store'
import type { GlideContextValue, GlideProps, GlideRef } from './types'

export const GlideContext = createContext<GlideContextValue | null>(null)

/**
 * The root store for the glide context
 *
 * This store serves as a fallback for the context if it is not available
 * and allows us to use the global glide instance above a provider
 */
export const rootGlideContextStore = new Store<GlideContextValue | null>(null)

/**
 * React component to setup a Glide instance
 */
export const ReactGlide: ForwardRefExoticComponent<
  GlideProps & RefAttributes<GlideRef>
> = forwardRef<GlideRef, GlideProps>(
  (
    {
      children,
      root = false,
      options = {},
      autoRaf = true,
      className = '',
      ...props
    }: GlideProps,
    ref
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const [glide, setGlide] = useState<Glide | undefined>(undefined)

    // Setup ref
    useImperativeHandle(
      ref,
      () => ({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        glide,
      }),
      [glide]
    )

    // Setup glide instance
    useEffect(() => {
      const glide = new Glide({
        ...options,
        ...(wrapperRef.current &&
          contentRef.current && {
            wrapper: wrapperRef.current!,
            content: contentRef.current!,
          }),
        autoRaf: options?.autoRaf ?? autoRaf, // this is to avoid breaking the autoRaf prop if it's still used (require breaking change)
      })

      setGlide(glide)

      return () => {
        glide.destroy()
        setGlide(undefined)
      }
    }, [autoRaf, JSON.stringify({ ...options, wrapper: null, content: null })])

    // Handle callbacks
    const callbacksRefs = useRef<
      {
        callback: ScrollCallback
        priority: number
      }[]
    >([])

    const addCallback: GlideContextValue['addCallback'] = useCallback(
      (callback, priority) => {
        callbacksRefs.current.push({ callback, priority })
        callbacksRefs.current.sort((a, b) => a.priority - b.priority)
      },
      []
    )

    const removeCallback: GlideContextValue['removeCallback'] = useCallback(
      (callback) => {
        callbacksRefs.current = callbacksRefs.current.filter(
          (cb) => cb.callback !== callback
        )
      },
      []
    )

    // This makes sure to set the global context if the root is true
    useEffect(() => {
      if (root && glide) {
        rootGlideContextStore.set({ glide, addCallback, removeCallback })

        return () => rootGlideContextStore.set(null)
      }
    }, [root, glide, addCallback, removeCallback])

    // Setup callback listeners
    useEffect(() => {
      if (!glide) return

      const onScroll: ScrollCallback = (data) => {
        for (const { callback } of callbacksRefs.current) {
          callback(data)
        }
      }

      glide.on('scroll', onScroll)

      return () => {
        glide.off('scroll', onScroll)
      }
    }, [glide])

    if (!children) return null

    return (
      <GlideContext.Provider
        value={{ glide: glide!, addCallback, removeCallback }}
      >
        {root && root !== 'asChild' ? (
          children
        ) : (
          <div
            ref={wrapperRef}
            className={`${className} ${glide?.className ?? ''}`.trim()}
            {...props}
          >
            <div ref={contentRef}>{children}</div>
          </div>
        )}
      </GlideContext.Provider>
    )
  }
)
