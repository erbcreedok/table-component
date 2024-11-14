import { Typography } from '@mui/material'
import { IconButtonProps } from '@mui/material/IconButton'
import React, { MouseEventHandler, ReactNode } from 'react'

import { TableData, TableInstance } from '../TableComponent'
import { withNativeEvent } from '../utils/withNativeEvent'

import { ToolbarIconButton } from './ToolbarIconButton'
import { Tooltip } from './Tooltip'

export type ToolbarButtonProps<TData = TableData> = {
	icon?: ReactNode
	title?: string
	toggled?: boolean
	enableCaption?: boolean
	nativeEventTitle?: string
	table: TableInstance<TData>
} & IconButtonProps
export const ToolbarButton = <TData,>({
	enableCaption,
	icon,
	title,
	nativeEventTitle,
	table,
	onClick,
	...rest
}: ToolbarButtonProps<TData>) => (
	<Tooltip placement="top" title={title}>
		<ToolbarIconButton
			aria-label={title}
			disableRipple
			enableCaption={enableCaption}
			{...rest}
			onClick={withNativeEvent(
				{
					el: nativeEventTitle,
					type: 'click',
				},
				table
			)(onClick as MouseEventHandler<HTMLElement>)}
		>
			{icon}
			{enableCaption && (
				<Typography
					sx={{
						textOverflow: 'ellipsis',
						overflow: 'hidden',
						whiteSpace: 'nowrap',
					}}
				>
					{title}
				</Typography>
			)}
		</ToolbarIconButton>
	</Tooltip>
)
