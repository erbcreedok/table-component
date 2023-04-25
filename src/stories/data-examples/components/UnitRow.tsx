import styled from "@emotion/styled"
import Box from '@mui/material/Box'
import React from 'react'
import { TableBodyRowProps } from '../../../body/TableBodyRow'
import { ExpandButton } from '../../../buttons/ExpandButton'
import { TableHeadRow } from '../../../head/TableHeadRow'
import { UnitTreeItem } from '../../types/TeamMember'
import { isUnitTreeItem } from '../../utils/getTeamMembers'

const Wrapper = styled(Box)`
	display: flex;
	align-items: center;
	background: #fafafa;
	height: 32px;
	font-family: sans-serif;
	padding-top: 8px;
	padding-bottom: 8px;
`

interface Props<TData extends Record<string, any> = {}> extends TableBodyRowProps {
	unit: UnitTreeItem
}

export const UnitRow = <TData extends Record<string, any> = {}>({ unit, row, table, virtualColumns, virtualPaddingLeft,virtualPaddingRight }: Props<TData>) => {
	const { getVisibleLeafColumns, getHeaderGroups, getPaginationRowModel } = table

	const index = getPaginationRowModel().rows.findIndex((r) => r.id === row.id)
	const nextRow = getPaginationRowModel().rows[index + 1]
	const isNextRowIsUnit = isUnitTreeItem(nextRow?.original)
	const showTableHeader = nextRow && !isNextRowIsUnit && row.getIsExpanded()

	return (
		<>
		<tr>
			<td colSpan={getVisibleLeafColumns().length}>
				<Wrapper sx={{ pl: `${(row.depth + 1) * 12}px` }}>
					<ExpandButton row={row} table={table} />
					<div style={{ marginRight: 'auto', height: '100%' }}>
						<div style={{ color: '#303240', fontSize: '14px' }}>{unit.name}</div>
						<span style={{ color: '#ACAFBF', fontSize: '12px' }}>{unit.type}</span>
					</div>
				</Wrapper>
			</td>
		</tr>
			{showTableHeader ? getHeaderGroups().map((headerGroup) => (
				<TableHeadRow
					parentRow={row}
					headerGroup={headerGroup as any}
					key={headerGroup.id}
					table={table}
					virtualColumns={virtualColumns}
					virtualPaddingLeft={virtualPaddingLeft}
					virtualPaddingRight={virtualPaddingRight}
				/>
			)) : null}
		</>
	)
}
