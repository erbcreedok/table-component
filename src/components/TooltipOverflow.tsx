import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import {
	ComponentProps,
	forwardRef,
	ReactElement,
	RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { useResizeDetector } from 'react-resize-detector'

import { Tooltip, TooltipProps } from './Tooltip'

export type TooltipOverflowProps = {
	text?: string
	content?: ReactElement | string
	boxProps?: ComponentProps<typeof Box>
	disabled?: boolean
	handleWidth?: boolean
	handleHeight?: boolean
	isTruncated?: boolean
	onIsTruncatedChange?: (truncated: boolean) => void
} & Omit<TooltipProps, 'children' | 'title'>

const Ellipsis = styled(Box)`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`

export const TooltipOverflow = forwardRef<HTMLDivElement, TooltipOverflowProps>(
	(
		{
			boxProps,
			className,
			content,
			disabled,
			text,
			handleWidth = true,
			handleHeight = false,
			isTruncated: uIsTruncated,
			onIsTruncatedChange,
			...rest
		},
		outerRef
	) => {
		const innerRef = useRef<HTMLDivElement>(null)
		const ref = (outerRef ?? innerRef) as RefObject<HTMLDivElement>
		const [truncated, setTruncated] = useState(false)

		const isTruncated = uIsTruncated ?? truncated
		const setIsTruncated = useCallback(
			(truncated: boolean) => {
				setTruncated(truncated)
				onIsTruncatedChange?.(truncated)
			},
			[onIsTruncatedChange]
		)

		const handleResize = useCallback(() => {
			let truncated = false
			if (handleWidth) {
				const scrollWidth = ref.current?.scrollWidth as number
				const widthContainer = Math.ceil(
					ref.current?.getBoundingClientRect().width as number
				)
				truncated = truncated || widthContainer < scrollWidth
			}
			if (handleHeight) {
				const scrollHeight = ref.current?.scrollHeight as number
				const heightContainer = Math.ceil(
					ref.current?.getBoundingClientRect().height as number
				)
				truncated = truncated || heightContainer < scrollHeight
			}

			setIsTruncated(truncated)
		}, [handleHeight, handleWidth, ref, setIsTruncated])

		useResizeDetector({
			onResize: handleResize,
			handleWidth,
			handleHeight,
			targetRef: ref,
		})

		useEffect(() => {
			if (text) {
				handleResize()
			} else {
				setIsTruncated(true)
			}
		}, [handleResize, setIsTruncated, text])

		const computedContent = content ?? text

		return (
			<Tooltip
				title={text}
				disableHoverListener={!isTruncated || disabled}
				{...rest}
			>
				<Ellipsis className={className} ref={ref} {...boxProps}>
					{computedContent}
				</Ellipsis>
			</Tooltip>
		)
	}
)
