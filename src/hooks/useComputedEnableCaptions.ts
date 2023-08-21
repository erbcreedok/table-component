import { useRef, useState, useEffect, useCallback } from 'react'
import { useResizeDetector } from 'react-resize-detector'

export const useComputedEnableCaptions = (
	enableCaptions: boolean | 'auto' = 'auto'
) => {
	const [isCaptionEnabled, setIsCaptionEnabled] = useState(!!enableCaptions)
	const innerRef = useRef<HTMLDivElement>(null)
	const outerRef = useRef<HTMLDivElement>(null)
	const innerWidth = useRef(0)
	const outerWidth = useRef(0)
	const lastInnerWidth = useRef(0)
	const ignoreResize = useRef(false)

	const checkForOverflow = useCallback(() => {
		lastInnerWidth.current = innerWidth.current
		innerWidth.current = innerRef.current ? innerRef.current.offsetWidth : 0
		outerWidth.current = outerRef.current ? outerRef.current.offsetWidth : 0
		if (ignoreResize.current || enableCaptions !== 'auto') return
		const hasOverflow = innerWidth.current > outerWidth.current
		if (hasOverflow) {
			setIsCaptionEnabled(false)
			ignoreResize.current = true
			setTimeout(() => {
				ignoreResize.current = false
			}, 100)
		} else if (lastInnerWidth.current >= innerWidth.current) {
			setIsCaptionEnabled(true)
		}
	}, [enableCaptions])

	useResizeDetector<HTMLDivElement>({
		onResize: checkForOverflow,
		targetRef: innerRef,
	})

	useResizeDetector<HTMLDivElement>({
		onResize: checkForOverflow,
		targetRef: outerRef,
	})

	useEffect(() => {
		checkForOverflow()
	}, [checkForOverflow])

	const computedEnableCaptions =
		enableCaptions === 'auto' ? isCaptionEnabled : enableCaptions

	return { outerRef, innerRef, computedEnableCaptions }
}
