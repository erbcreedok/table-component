import { RefObject, useEffect, useRef, useState } from 'react'

export const useIntersectionObserver = <T extends HTMLElement>({
	ref,
	isEnabled = true,
	options = { threshold: 0.7 },
	onIntersectionChange,
}: {
	ref?: RefObject<T>
	isEnabled?: boolean
	options?: IntersectionObserverInit
	onIntersectionChange?: (
		isIntersecting: boolean,
		intersectorRef: RefObject<T>,
		observerEntry: IntersectionObserverEntry
	) => void
} = {}) => {
	const [isIntersecting, setIsIntersecting] = useState(true)
	const innerRef = useRef<T | null>(null)
	const computedRef = ref ?? innerRef

	useEffect(() => {
		let observer
		if (isEnabled && computedRef?.current) {
			observer = new IntersectionObserver(([entry]) => {
				setIsIntersecting(entry.isIntersecting)
				onIntersectionChange?.(entry.isIntersecting, computedRef, entry)
			}, options)

			observer.observe(computedRef.current)
		}

		return () => {
			if (observer) {
				observer.disconnect()
			}
		}
	}, [computedRef, isEnabled, options])

	return {
		isIntersecting,
		ref: computedRef,
	}
}
