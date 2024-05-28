import { BoxProps } from '@mui/material'
import { PropsWithChildren, useMemo } from 'react'

import { validateValue } from '../utils/validate'
import {
	Table_Cell,
	Table_Column,
	Table_Row,
	TableData,
	TableInstance,
	NumericColumn,
	PercentColumn,
} from '../TableComponent'
import { mergeSx } from '../utils/mergeSx'

import { TooltipProps } from './Tooltip'
import { TooltipOverflow } from './TooltipOverflow'
import { LinearProgressWithLabel } from './LinearProgressWithLabel'

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
	const { columnDef } = column
	const {
		formatCellValue = (value) => value,
		enableCustomization,
		dataType,
	} = columnDef
	const isGrouped = column.getIsGrouped()
	const value = isGrouped
		? row.getGroupingValue(cell.column.id)
		: cell.getValue()

	const text = useMemo(() => {
		// Custom Column
		if (value !== undefined && enableCustomization) {
			// Space 1000 numeric
			if (
				dataType === 'numeric' &&
				(columnDef as NumericColumn).displayFormat === 'SPACE_1000'
			) {
				return (value as number)
					.toString()
					.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ' ')
			}

			// Percent
			if (dataType === 'percent') {
				return `${value}%`
			}
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
		columnDef,
		dataType,
		enableCustomization,
		formatCellValue,
		isGrouped,
		uText,
		value,
	])

	// Custom Column: Percent as Progress Bar
	if (
		value !== undefined &&
		enableCustomization &&
		dataType === 'percent' &&
		(columnDef as PercentColumn).displayFormat === 'PROGRESS_BAR'
	) {
		return <LinearProgressWithLabel value={Number(value)} />
	}

	const isValid = enableCustomization
		? validateValue({
				value,
				table,
				cell,
				row,
				values: [],
		  })
		: true

	const content = <>{children ?? text}</>
	const lineClamp = columnDef.lineClamp ?? clamp
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
						borderBottom: isValid === true ? undefined : '1px red dashed',
					},
					rest.sx
				),
			}}
		/>
	)
}
