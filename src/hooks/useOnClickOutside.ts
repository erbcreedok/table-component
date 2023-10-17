import { RefObject } from 'react'

import { useEventListener } from './useEventListener'

type Handler = (event: MouseEvent) => void

const isClickedOutside = (ref: RefObject<HTMLElement>, event: MouseEvent) => {
	const el = ref?.current
	if (!el) return true

	return !el.contains(event.target as Node)
}
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
	ref: RefObject<T> | RefObject<T>[],
	handler: Handler,
	mouseEvent: 'mousedown' | 'mouseup' = 'mousedown'
): void {
	useEventListener(mouseEvent, (event) => {
		const refs = Array.isArray(ref) ? ref : [ref]
		if (refs.some((r) => !isClickedOutside(r, event))) {
			return
		}

		handler(event)
	})
}
