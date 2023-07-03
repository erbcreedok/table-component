import { RefObject, useEffect, useRef, useState } from 'react'

export const useIntersectionObserver = <T extends HTMLElement>({
	ref,
	isEnabled = true,
	options = { threshold: 0.7 },
}: {
	ref?: RefObject<T>
	isEnabled?: boolean
	options?: IntersectionObserverInit
} = {}) => {
	const [isIntersecting, setIsIntersecting] = useState(true)
	const innerRef = useRef<T | null>(null)
	const computedRef = ref ?? innerRef

	useEffect(() => {
		let observer
		if (isEnabled && computedRef?.current) {
			observer = new IntersectionObserver(([entry]) => {
				setIsIntersecting(entry.isIntersecting)
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
