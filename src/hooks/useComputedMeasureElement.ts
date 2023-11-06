import { useCallback } from 'react'

/**
 * `useComputedMeasureElement` - is a custom hook for React that provides a way to dynamically measure
 * and optionally set the virtual height of an HTML element. It is particularly useful when dealing with
 * elements whose dimensions might change due to dynamic content or window resizing.
 */
export const useComputedMeasureElement = <T extends HTMLElement>(
	_measureElement?: (el: T) => void,
	_getElementHeight?: (el: T) => number | string
) => {
	return useCallback(
		(el?: T | null, getElementHeight?: (el: T) => number | string) => {
			if (el) {
				const height = (getElementHeight ?? _getElementHeight)?.(el)
				if (height) {
					el.dataset.virtualHeight = height.toString()
				} else {
					delete el.dataset.virtualHeight
				}
				_measureElement?.(el)
			}
		},
		[_getElementHeight, _measureElement]
	)
}
