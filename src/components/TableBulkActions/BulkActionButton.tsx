import { ButtonBase } from '@mui/material'
import Box from '@mui/material/Box'
import React, {
	cloneElement,
	ComponentProps,
	MouseEvent,
	ReactElement,
	useCallback,
} from 'react'

import { useTableContext } from '../../context/useTableContext'
import { Table_Row, TableData, TableInstance } from '../../TableComponent'
import { getPascalCase } from '../../utils/getPascalCase'
import { withNativeEvent } from '../../utils/withNativeEvent'
import { Colors } from '../styles'
import { Tooltip } from '../Tooltip'

export type BulkActionButtonProps<TData = TableData> = {
	text: string
	icon?: React.ReactNode
	enableCaption?: boolean
	enableTooltip?: boolean | 'auto'
	tooltipProps?: ComponentProps<typeof Tooltip>
	onClick: (props: {
		event: MouseEvent
		table: TableInstance<TData>
		selectedRows: Table_Row<TData>[]
	}) => void
} & Omit<ComponentProps<typeof ButtonBase>, 'onClick'>

export const BulkActionButton = (props: BulkActionButtonProps) => {
	const {
		icon,
		text,
		onClick,
		tooltipProps,
		enableCaption = !!text,
		enableTooltip = 'auto',
		sx,
		...rest
	} = props
	const { table } = useTableContext()
	const { getSelectedRowModel } = table

	const handleClick = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			onClick({ table, event, selectedRows: getSelectedRowModel().flatRows })
		},
		[getSelectedRowModel, onClick, table]
	)

	const tooltipTitle = () => {
		if (enableTooltip !== 'auto') return enableTooltip
		if (enableCaption) return ''

		return text
	}

	return (
		<Tooltip placement="top" title={tooltipTitle()} {...tooltipProps}>
			<ButtonBase
				{...rest}
				sx={(theme) => ({
					px: enableCaption ? '9px' : '3px',
					py: enableCaption ? '6px' : '3px',
					borderRadius: enableCaption ? '3px' : '6px',
					'&:hover': {
						background: Colors.Dark,
					},
					'&:disabled': {
						opacity: 0.5,
					},
					...(sx instanceof Function ? sx(theme) : (sx as any)),
				})}
				onClick={withNativeEvent(
					{
						el: `BulkActionsPanel_${getPascalCase(text)}`,
						type: 'click',
					},
					table
				)(handleClick)}
			>
				{icon &&
					cloneElement(icon as ReactElement, {
						style: {
							width: '18px',
							height: '18px',
						},
					})}
				{(enableCaption || !icon) && (
					<Box
						component="span"
						fontWeight={600}
						sx={{
							ml: '3px',
							px: '3px',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{text}
					</Box>
				)}
			</ButtonBase>
		</Tooltip>
	)
}
