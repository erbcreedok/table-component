import React, { DragEventHandler } from 'react'
import IconButton from '@mui/material/IconButton'
import type { IconButtonProps } from '@mui/material/IconButton'

import { DragIcon } from '../icons/DragIcon'

interface Props {
	iconButtonProps?: IconButtonProps
	onDragStart: DragEventHandler<HTMLButtonElement>
	onDragEnd: DragEventHandler<HTMLButtonElement>
}

export const GrabHandleButton = ({
	iconButtonProps,
	onDragEnd,
	onDragStart,
}: Props) => {
	return (
		<IconButton
			disableRipple
			draggable="true"
			size="small"
			{...iconButtonProps}
			onClick={(e) => {
				e.stopPropagation()
				iconButtonProps?.onClick?.(e)
			}}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			sx={(theme) => ({
				cursor: 'grab',
				m: '0 -0.1rem',
				opacity: 0.5,
				p: '2px',
				transition: 'all 150ms ease-in-out',
				'&:hover': {
					backgroundColor: 'transparent',
					opacity: 1,
				},
				'&:active': {
					cursor: 'grabbing',
				},
				...(iconButtonProps?.sx instanceof Function
					? iconButtonProps?.sx(theme)
					: (iconButtonProps?.sx as any)),
			})}
			title={undefined}
		>
			<DragIcon />
		</IconButton>
	)
}
