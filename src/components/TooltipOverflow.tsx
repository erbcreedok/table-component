import styled from '@emotion/styled'
import Box from '@mui/material/Box'
import {
	ComponentProps,
	FC,
	ReactElement,
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
} & Omit<ComponentProps<typeof Tooltip>, 'children' | 'title'>

const Ellipsis = styled(Box)`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`

export const TooltipOverflow: FC<Props> = ({
	text,
	content,
	boxProps,
	...rest
}) => {
	const ref = useRef<HTMLDivElement>(null)
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
		<Tooltip title={visible ? computedContent : null} {...rest}>
			<Ellipsis ref={ref} {...boxProps}>
				{text}
			</Ellipsis>
		</Tooltip>
	)
}
