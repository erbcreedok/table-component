import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

export const useComputedEnableCaptions = (
	enableCaptions?: boolean | 'auto'
) => {
	const [isCaptionEnabled, setIsCaptionEnabled] = useState(!!enableCaptions)
	const innerRef = useRef<HTMLDivElement>(null)
	const widthWithCaption = useRef(0)
	const onResize = useCallback((width) => {
		setIsCaptionEnabled(Math.round(width) > widthWithCaption.current)
	}, [])
	const { ref: outerRef } = useResizeDetector({
		onResize,
		handleHeight: false,
		handleWidth: enableCaptions === 'auto',
	})
	const computedEnableCaptions =
		enableCaptions === 'auto' ? isCaptionEnabled : !!enableCaptions

	useLayoutEffect(() => {
		if (computedEnableCaptions) {
			widthWithCaption.current = innerRef.current?.scrollWidth ?? 0
		}
	}, [computedEnableCaptions])

	return {
		outerRef,
		innerRef,
		computedEnableCaptions,
	}
}
