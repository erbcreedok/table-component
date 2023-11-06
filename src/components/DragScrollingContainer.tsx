import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
	PropsWithChildren,
	useEffect,
} from 'react'
import { Box, BoxProps, styled } from '@mui/material'

import { useTableContext } from '../context/useTableContext'
import { useDebouncedScrollTo } from '../hooks/useDebouncedScrollTo'

export const DragScrollingContainer = forwardRef<
	HTMLElement,
	PropsWithChildren<BoxProps>
>(({ children, ...rest }, _ref) => {
	const { table } = useTableContext()
	const {
		options: { enableDragScrolling },
	} = table
	const ref = useRef<HTMLElement>(null)
	useImperativeHandle(_ref, () => ref.current as HTMLElement)
	const { debouncedScrollTo, enableScrollListeners } = useDebouncedScrollTo(ref)

	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState<number | null>(null)
	const [startY, setStartY] = useState<number | null>(null)
	const [scrollLeft, setScrollLeft] = useState(0)
	const [scrollTop, setScrollTop] = useState(0)

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		setIsDragging(true)
		setStartX(e.pageX - (ref.current?.offsetLeft || 0))
		setStartY(e.pageY - (ref.current?.offsetTop || 0))
		setScrollLeft(ref.current?.scrollLeft || 0)
		setScrollTop(ref.current?.scrollTop || 0)
	}, [])

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!isDragging || !ref.current) return
			const x = e.pageX - (ref.current.offsetLeft || 0)
			const y = e.pageY - (ref.current.offsetTop || 0)
			const deltaX = enableDragScrolling === 'vertical' ? 0 : x - (startX || 0)
			const deltaY =
				enableDragScrolling === 'horizontal' ? 0 : y - (startY || 0)
			debouncedScrollTo({
				left: (scrollLeft || 0) - deltaX,
				top: (scrollTop || 0) - deltaY,
			})
		},
		[
			isDragging,
			enableDragScrolling,
			startX,
			startY,
			debouncedScrollTo,
			scrollLeft,
			scrollTop,
		]
	)

	const handleMouseUp = useCallback(() => {
		enableScrollListeners()
		setIsDragging(false)
	}, [enableScrollListeners])

	useEffect(() => {
		document.addEventListener('mouseup', handleMouseUp)

		return () => {
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [handleMouseUp])

	return (
		<StyledDiv
			{...rest}
			ref={ref}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
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
