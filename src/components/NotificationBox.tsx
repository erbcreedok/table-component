import Typography, { TypographyProps } from '@mui/material/Typography'
import { ReactNode, useCallback, useEffect, useRef } from 'react'

import { getColorAlpha } from '../utils/getColorAlpha'
import { mergeSx } from '../utils/mergeSx'

import { Colors } from './styles'

export type NotificationBoxProps = {
	text: string | ReactNode
	type?: string | 'danger' | 'warning'
	size?: 'small' | 'medium' | 'large'
	closeAutomatically?: boolean
	closeDelay?: number
	closeAfterHoverDelay?: number
	onClose?(): void
} & TypographyProps

export const NotificationBox = ({
	text,
	type,
	size,
	sx,
	closeAutomatically = false,
	closeDelay = 5000,
	closeAfterHoverDelay = 1500,
	onClose,
	onMouseEnter,
	onMouseLeave,
	...rest
}: NotificationBoxProps) => {
	const hideLock = useRef(true)
	const lockTimeout = useRef<NodeJS.Timeout>()
	const hideTimeout = useRef<NodeJS.Timeout>()

	useEffect(() => {
		if (closeAutomatically) {
			hideLock.current = true
			lockTimeout.current = setTimeout(() => {
				hideLock.current = false
			}, closeDelay)
			hideTimeout.current = setTimeout(() => {
				onClose?.()
			}, closeDelay)
		}

		return () => {
			clearTimeout(lockTimeout.current)
			clearTimeout(hideTimeout.current)
		}
	}, [closeAutomatically, closeDelay, onClose])

	const handleMouseEnter = useCallback(
		(event) => {
			clearTimeout(hideTimeout.current)
			onMouseEnter?.(event)
		},
		[onMouseEnter]
	)
	const handleMouseLeave = useCallback(
		(event) => {
			if (!hideLock.current) {
				hideTimeout.current = setTimeout(() => {
					onClose?.()
				}, closeAfterHoverDelay)
			}
			onMouseLeave?.(event)
		},
		[closeAfterHoverDelay, onClose, onMouseLeave]
	)

	return (
		<Typography
			{...rest}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			sx={mergeSx(
				{
					p:
						size === 'small'
							? '4px 10px'
							: size === 'large'
							? '12px 18px'
							: '9px 12px',
					borderRadius: '6px',
					fontSize:
						size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
					border: `2px solid ${
						type === 'danger'
							? Colors.Red3
							: type === 'warning'
							? Colors.Amber3
							: Colors.LightBlue
					}`,
					color: type === 'danger' ? Colors.Red5 : undefined,
					background:
						type === 'danger'
							? Colors.Red4
							: type === 'warning'
							? Colors.Amber2
							: Colors.LightestBlue,
					zIndex: 10,
					width: 'fit-content',
					boxShadow: `0px 4px 22px 0px ${getColorAlpha(Colors.Gray90, 0.15)}`,
				},
				sx
			)}
		>
			{text}
		</Typography>
	)
}
