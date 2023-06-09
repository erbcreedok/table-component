import styled from "@emotion/styled"
import Box from '@mui/material/Box'
import React from 'react'
import { TableBodyRow, TableBodyRowProps } from '../../../body/TableBodyRow'
import { ExpandButton } from '../../../buttons/ExpandButton'
import { TableHeadRow } from '../../../head/TableHeadRow'
import { isUnitTreeItem } from '../../utils/getTeamMembers'

const Wrapper = styled(Box)`
	display: flex;
	align-items: center;
	height: 32px;
	font-family: sans-serif;
	padding-top: 4px;
	padding-bottom: 4px;
	border-bottom: 1px solid #E1E3EB;
`

type Props<TData extends Record<string, any> = {}> = TableBodyRowProps

export const UnitRow = <TData extends Record<string, any> = {}>(props: Props<TData>) => {
	const { row, table, virtualColumns, virtualPaddingLeft, virtualPaddingRight } = props
	const { getVisibleLeafColumns, getHeaderGroups, getPaginationRowModel } = table

	const unit = isUnitTreeItem(row.original) ? row.original : null
	const index = getPaginationRowModel().rows.findIndex((r) => r.id === row.id)
	const nextRow = getPaginationRowModel().rows[index + 1]
	const isNextRowIsUnit = isUnitTreeItem(nextRow?.original)
	const showTableHeader = unit && nextRow && !isNextRowIsUnit && row?.getIsExpanded?.() || (!unit && index == 0)

	const unitRow = unit ? (
		<tr>
			<td style={{ padding: 0, background: '#FAFAFC' }} colSpan={getVisibleLeafColumns().length}>
				<Wrapper sx={{ ml: `${(row.depth + 2) * 12}px` }}>
					<ExpandButton sx={{ mx: '-8px' }} row={row} table={table} />
					<div style={{ color: '#303240', fontSize: '14px', lineHeight: '18px' }}>{unit.name}</div>
				</Wrapper>
			</td>
		</tr>
	) : null

	const memberRow = !unit ? (
		<TableBodyRow {...props} />
	) : null

	const tableHeader = showTableHeader ? getHeaderGroups().map((headerGroup) => (
		<TableHeadRow
			parentRow={row}
			headerGroup={headerGroup as any}
			key={headerGroup.id}
			table={table}
			virtualColumns={virtualColumns}
			virtualPaddingLeft={virtualPaddingLeft}
			virtualPaddingRight={virtualPaddingRight}
			cellBackgroundColor="#EBEDF5"
			cellBackgroundColorHover="#FAFAFC"
		/>
	)) : null

	return (
		<>
			{unitRow}
			{tableHeader}
			{memberRow}
		</>
	)
}
