import { DragEventHandler, DragEvent } from 'react'
import IconButton from '@mui/material/IconButton'
import type { IconButtonProps } from '@mui/material/IconButton'

import { handleStopPropagation } from '../utils/withStopPropagation'
import { withNativeEvent } from '../utils/withNativeEvent'
import { Tooltip } from '../components/Tooltip'
import type { TableInstance } from '..'

interface Props<TData extends Record<string, any> = {}> {
	iconButtonProps?: IconButtonProps
	onDrag?: DragEventHandler<HTMLButtonElement>
	onDragStart: DragEventHandler<HTMLButtonElement>
	onDragEnd: DragEventHandler<HTMLButtonElement>
	table: TableInstance<TData>
	Icon?: any
	analyticsElementName?: string
}

export const GrabHandleButton = <TData extends Record<string, any> = {}>({
	iconButtonProps,
	onDrag,
	onDragEnd,
	onDragStart,
	table,
	Icon,
	analyticsElementName,
}: Props<TData>) => {
	const {
		options: {
			localization,
			icons: { DragIcon },
		},
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
				onDragStart={
					analyticsElementName
						? withNativeEvent<DragEvent<HTMLButtonElement>, TData>(
								{ el: `${analyticsElementName}_DragStart`, type: 'dragstart' },
								table
						  )(onDragStart)
						: onDragStart
				}
				onDragEnd={
					analyticsElementName
						? withNativeEvent<DragEvent<HTMLButtonElement>, TData>(
								{ el: `${analyticsElementName}_DragEnd`, type: 'dragend' },
								table
						  )(onDragEnd)
						: onDragEnd
				}
				onDrag={onDrag}
				onMouseDown={handleStopPropagation} // for DragScrollingContainer to not mess things up
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
				{Icon ? <Icon /> : <DragIcon />}
			</IconButton>
		</Tooltip>
	)
}
