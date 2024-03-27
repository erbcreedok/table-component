import { BoxProps } from '@mui/material'
import { PropsWithChildren, useMemo } from 'react'

import {
	Table_Cell,
	Table_Column,
	Table_Row,
	TableData,
	TableInstance,
	NumericColumn,
} from '../TableComponent'
import { mergeSx } from '../utils/mergeSx'

import { TooltipProps } from './Tooltip'
import { TooltipOverflow } from './TooltipOverflow'

export type CellBaseProps<TData extends TableData = {}> = PropsWithChildren<
	{
		cell: Table_Cell<TData>
		table: TableInstance<TData>
		column: Table_Column<TData>
		row: Table_Row<TData>
		text?: string
		tooltipProps?: Omit<TooltipProps, 'ref'>
		clamp?: boolean | number
	} & BoxProps
>
export const CellBase = <TData extends TableData = {}>({
	cell,
	column,
	// spread `row` out of `rest`, because it's not a valid Box prop
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	row,
	children,
	table,
	text: uText,
	tooltipProps,
	clamp = true,
	...rest
}: CellBaseProps<TData>) => {
	const {
		options: { cellGroupedPlaceholderText = 'N/A', cellPlaceholderText },
	} = table
	const {
		formatCellValue = (value) => value,
		enableCustomization,
		dataType,
	} = column.columnDef
	const isGrouped = column.getIsGrouped()
	const value = cell.getValue()

	const text = useMemo(() => {
		const { columnDef } = column

		// Space 1000 numeric
		if (
			value !== undefined &&
			enableCustomization &&
			dataType === 'numeric' &&
			((columnDef as NumericColumn).numberFormat === undefined ||
				(columnDef as NumericColumn).numberFormat === 'SPACE1000')
		) {
			return (value as number)
				.toString()
				.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ' ')
		}

		if (uText) return uText
		const formatted = `${formatCellValue(value) ?? ''}`
		if (formatted) return formatted
		const placeholder =
			columnDef.cellPlaceholderText ?? cellPlaceholderText ?? ''
		if (isGrouped)
			return (
				columnDef.cellGroupedPlaceholderText ??
				cellGroupedPlaceholderText ??
				placeholder
			)

		return placeholder
	}, [
		cellGroupedPlaceholderText,
		cellPlaceholderText,
		column,
		dataType,
		enableCustomization,
		formatCellValue,
		isGrouped,
		uText,
		value,
	])

	const content = <>{children ?? text}</>
	const lineClamp = column.columnDef.lineClamp ?? clamp
	const computedClamp = lineClamp === true ? 2 : !lineClamp ? 1 : lineClamp
	const isParagraph =
		typeof content.props.children === 'string'
			? content.props.children.split(' ').length > computedClamp
			: false

	// Webkit-Box can't truncate paragraph, if count of words is less than line-clamp
	const canClamp = isParagraph && computedClamp > 1

	return (
		<TooltipOverflow
			content={content}
			text={text}
			placement="top"
			handleHeight
			arrow
			enterDelay={1000}
			enterNextDelay={1000}
			{...tooltipProps}
			boxProps={{
				...rest,
				sx: mergeSx(
					{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						...(lineClamp === false && {
							whiteSpace: 'normal',
						}),
						...(canClamp && {
							display: '-webkit-box',
							WebkitLineClamp: computedClamp,
							WebkitBoxOrient: 'vertical',
							whiteSpace: 'normal',
						}),
					},
					rest.sx
				),
			}}
		/>
	)
}
