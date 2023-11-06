/**
 * useDebouncedScrollTo: hook for debouncing scroll events on a referenced HTML element.
 *
 * It provides a 'debouncedScrollTo' method with optional debouncing and functions to manually control scroll event listeners.
 *
 * Usage:
 * const { debouncedScrollTo } = useDebouncedScrollTo(ref);
 * debouncedScrollTo({ top: 100, left: 0, behavior: 'smooth', wait: 250 });
 *
 *  You can add other methods in return, if needed
 */
import { RefObject, useCallback, useRef } from 'react'

const stopPropagation = (e: Event) => {
	e.stopPropagation()
}
export const useDebouncedScrollTo = <T extends HTMLElement>(
	ref: RefObject<T>
) => {
	const timeoutId = useRef<NodeJS.Timeout | null>(null)

	const disableScrollListeners = useCallback(() => {
		ref.current?.addEventListener('scroll', stopPropagation, true)
	}, [ref])
	const enableScrollListeners = useCallback(() => {
		ref.current?.removeEventListener('scroll', stopPropagation, true)
	}, [ref])

	const emitScrollEvent = useCallback(() => {
		if (ref.current) {
			ref.current?.dispatchEvent(new CustomEvent('scroll'))
		}
	}, [ref])

	const pauseScrollListeners = useCallback(
		(wait = 250, callback = () => {}) => {
			if (timeoutId.current) {
				clearTimeout(timeoutId.current)
				timeoutId.current = null
			} else {
				disableScrollListeners()
			}
			timeoutId.current = setTimeout(() => {
				enableScrollListeners()
				timeoutId.current = null
				callback()
			}, wait)
		},
		[disableScrollListeners, enableScrollListeners]
	)

	const debouncedScrollTo = useCallback(
		({ wait, ...options }: ScrollToOptions & { wait?: number } = {}) => {
			pauseScrollListeners(wait, emitScrollEvent)
			ref.current?.scrollTo(options)
		},
		[emitScrollEvent, pauseScrollListeners, ref]
	)

	return { debouncedScrollTo, enableScrollListeners }
}
