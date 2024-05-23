import Box from '@mui/material/Box'
import { PartialKeys } from '@tanstack/table-core'

import { useTableContext } from '../context/useTableContext'
import { TableData, TableInstance } from '../TableComponent'

import { Colors } from './styles'
import { Tooltip, TooltipProps } from './Tooltip'

export type ErrorTooltipIconProps<TData extends TableData = {}> = {
	error?: string | null | boolean
	table?: TableInstance<TData>
	icon?: any
} & PartialKeys<TooltipProps, 'title' | 'children'>
export const ErrorTooltipIcon = (props: ErrorTooltipIconProps) => {
	const { icon, error, table, ...rest } = props
	const WarningOutlineIcon = icon ?? table?.options?.icons?.WarningOutlineIcon

	return (
		<Tooltip
			placement="top"
			arrow
			disabled={typeof error !== 'string'}
			title={error}
			{...rest}
		>
			<Box sx={{ display: 'flex', mr: '9px' }}>
				<WarningOutlineIcon sx={{ color: Colors.Red, m: 'auto' }} />
			</Box>
		</Tooltip>
	)
}

export const ErrorTooltipIconWithTable = <TData extends TableData = {}>(
	props: ErrorTooltipIconProps<TData>
) => {
	const { table } = useTableContext()

	return <ErrorTooltipIcon {...props} table={table} />
}
