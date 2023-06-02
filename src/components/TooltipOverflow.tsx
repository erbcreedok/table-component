import styled from '@emotion/styled'
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

import { Tooltip } from './Tooltip'

type Props = {
	text?: string
	content?: ReactElement | string
	boxProps?: ComponentProps<typeof Box>
	disabled?: boolean
} & Omit<ComponentProps<typeof Tooltip>, 'children' | 'title'>

const Ellipsis = styled(Box)`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`

export const TooltipOverflow = forwardRef<HTMLDivElement, Props>(
	({ text, content, disabled, boxProps, ...rest }, outerRef) => {
		const innerRef = useRef<HTMLDivElement>(null)
		const ref = (outerRef ?? innerRef) as RefObject<HTMLDivElement>
		const [visible, setVisible] = useState(false)

		const handleResize = useCallback(() => {
			const scrollWidth = ref.current?.scrollWidth as number
			const widthContainer = Math.ceil(
				ref.current?.getBoundingClientRect().width as number
			)

			setVisible(widthContainer < scrollWidth)
		}, [])

		useResizeDetector({
			onResize: handleResize,
			handleWidth: true,
			handleHeight: false,
			targetRef: ref,
		})

		useEffect(() => {
			if (text) {
				handleResize()
			} else {
				setVisible(false)
			}
		}, [handleResize, text])

		const computedContent = content ?? text

		return (
			<Tooltip title={visible && !disabled ? computedContent : null} {...rest}>
				<Ellipsis ref={ref} {...boxProps}>
					{text}
				</Ellipsis>
			</Tooltip>
		)
	}
)
