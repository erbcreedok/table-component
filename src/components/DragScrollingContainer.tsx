import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
	PropsWithChildren,
} from 'react'
import { Box, BoxProps, styled } from '@mui/material'

export const DragScrollingContainer = forwardRef<
	HTMLElement,
	PropsWithChildren<BoxProps>
>(({ children, ...rest }, _ref) => {
	const ref = useRef<HTMLElement>(null)
	useImperativeHandle(_ref, () => ref.current as HTMLElement)

	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState<number | null>(null)
	const [startY, setStartY] = useState<number | null>(null)
	const [scrollLeft, setScrollLeft] = useState(0)
	const [scrollTop, setScrollTop] = useState(0)

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		// e.preventDefault() // touch devices & selecting text
		setIsDragging(true)
		setStartX(e.pageX - (ref.current?.offsetLeft || 0))
		setStartY(e.pageY - (ref.current?.offsetTop || 0))
		setScrollLeft(ref.current?.scrollLeft || 0)
		setScrollTop(ref.current?.scrollTop || 0)
	}, [])

	// const handleTouchStart = useCallback((e: React.TouchEvent) => {
	// 	setIsDragging(true)
	// 	setStartX(e.touches[0].pageX - (ref.current?.offsetLeft || 0))
	// 	setStartY(e.touches[0].pageY - (ref.current?.offsetTop || 0))
	// 	setScrollLeft(ref.current?.scrollLeft || 0)
	// 	setScrollTop(ref.current?.scrollTop || 0)
	// }, [])

	const handleMouseUp = useCallback(() => {
		setIsDragging(false)
	}, [])

	// const handleTouchEnd = useCallback(() => {
	// 	setIsDragging(false)
	// }, [])

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!isDragging || !ref.current) return
			const x = e.pageX - (ref.current.offsetLeft || 0)
			const y = e.pageY - (ref.current.offsetTop || 0)
			const deltaX = x - (startX || 0)
			const deltaY = y - (startY || 0)
			ref.current.scrollLeft = (scrollLeft || 0) - deltaX
			ref.current.scrollTop = (scrollTop || 0) - deltaY
		},
		[isDragging, startX, startY, scrollLeft, scrollTop]
	)

	// const handleTouchMove = useCallback(
	// 	(e: React.TouchEvent) => {
	// 		if (!isDragging || e.touches.length !== 1 || !ref.current) return
	// 		const x = e.touches[0].pageX - (ref.current.offsetLeft || 0)
	// 		const y = e.touches[0].pageY - (ref.current.offsetTop || 0)
	// 		const deltaX = x - (startX || 0)
	// 		const deltaY = y - (startY || 0)
	// 		ref.current.scrollLeft = (scrollLeft || 0) - deltaX
	// 		ref.current.scrollTop = (scrollTop || 0) - deltaY
	// 	},
	// 	[isDragging, startX, startY, scrollLeft, scrollTop]
	// )

	return (
		<StyledDiv
			{...rest}
			ref={ref}
			onMouseDown={handleMouseDown}
			// onTouchStart={handleTouchStart}
			onMouseUp={handleMouseUp}
			// onTouchEnd={handleTouchEnd}
			onMouseMove={handleMouseMove}
			// onTouchMove={handleTouchMove}
		>
			{children}
		</StyledDiv>
	)
})

const StyledDiv = styled(Box)`
	& {
		cursor: grab;

		user-select: none;
		-webkit-user-select: none; /* Safari */
	}

	&:active {
		cursor: grabbing;
	}
`
