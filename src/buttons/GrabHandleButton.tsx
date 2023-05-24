import React, { DragEventHandler } from 'react'
import IconButton from '@mui/material/IconButton'
import type { IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import type { TableInstance } from '..'
import { DragIcon } from '../icons/DragIcon'

interface Props<TData extends Record<string, any> = {}> {
	iconButtonProps?: IconButtonProps
	onDragStart: DragEventHandler<HTMLButtonElement>
	onDragEnd: DragEventHandler<HTMLButtonElement>
	table: TableInstance<TData>
}

export const GrabHandleButton = <TData extends Record<string, any> = {}>({
	iconButtonProps,
	onDragEnd,
	onDragStart,
	table,
}: Props<TData>) => {
	const {
		options: { localization },
	} = table

	return (
		<Tooltip
			arrow
			enterDelay={1000}
			enterNextDelay={1000}
			placement="top"
			title={iconButtonProps?.title ?? localization.move}
		>
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
		</Tooltip>
	)
}
