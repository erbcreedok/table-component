import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import React, { FC, memo, useCallback } from 'react'

import { TableBodyRow, TableBodyRowProps } from '../body/TableBodyRow'
import { ExpandButton } from '../buttons/ExpandButton'
import { TableHeadMultiRow } from '../head/TableHeadMultiRow'
import { TableHeadRow } from '../head/TableHeadRow'
import { useComputedMeasureElement } from '../hooks/useComputedMeasureElement'
import { useMultiSticky } from '../hooks/useMultiSticky'
import { Table_Row, TableData, TableInstance } from '../TableComponent'
import { getHeaderGroupFilteredByDisplay } from '../utils/getFilteredByDisplay'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'

import { Colors } from './styles'

const Wrapper = styled(Box)`
	display: flex;
	gap: 9px;
	align-items: center;
	height: 32px;
	font-family: sans-serif;
	padding-top: 4px;
	padding-bottom: 4px;
	border-bottom: 1px solid ${Colors.BorderMain};
	position: sticky;
	left: 0;
	width: fit-content;
`

export type HierarchyTreeConfig<TData extends TableData = TableData> = {
	isHierarchyItem: (row: TData) => boolean
	getValue?: (row: TData) => string
	showTableHeader?:
		| boolean
		| ((row: Table_Row<TData>, table: TableInstance<TData>) => boolean)
	enableHierarchyTree?: boolean
	HierarchyRow?: FC<TableBodyRowProps<TData>>
	HierarchyComponent?: FC<TableBodyRowProps<TData>>
}
export const HierarchyRow = (props: TableBodyRowProps) => {
	const { domIndex, row, table, virtualColumns, virtualRow, measureElement } =
		props
	const {
		getVisibleLeafColumns,
		getHeaderGroups,
		getPaginationRowModel,
		options: { enableStickyHeader, hierarchyTreeConfig, multirowHeader },
	} = table
	const {
		isHierarchyItem,
		showTableHeader: _showTableHeader,
		getValue = (row) => row.name,
		HierarchyRow,
		HierarchyComponent,
	} = hierarchyTreeConfig ?? {}
	const { isFullScreen } = table.getState()
	const { registerSticky, stickyElements } = useMultiSticky()

	const hierarchyItem = isHierarchyItem?.(row.original) ? row.original : null
	const index = getPaginationRowModel().rows.findIndex((r) => r.id === row.id)
	const nextRow = getPaginationRowModel().rows[index + 1]
	const isNextRowHierarchyItem = nextRow
		? isHierarchyItem?.(nextRow.original)
		: false
	const showTableHeader =
		_showTableHeader === undefined
			? (hierarchyItem &&
					nextRow &&
					!isNextRowHierarchyItem &&
					row?.getIsExpanded?.()) ||
			  (!hierarchyItem && domIndex === 0)
			: getValueOrFunctionHandler(_showTableHeader)(row, table)

	const computedMeasureElement = useComputedMeasureElement(
		measureElement,
		useCallback(
			(el) => {
				const height = el.getBoundingClientRect().height
				if (showTableHeader) {
					return height + 48 // 48px for header row
				}

				return height
			},
			[showTableHeader]
		)
	)

	const unitRow = hierarchyItem ? (
		HierarchyRow ? (
			<HierarchyRow {...props} />
		) : (
			<tr
				className="table-hierarchy-row"
				data-index={virtualRow?.index}
				ref={computedMeasureElement}
			>
				<td
					className="table-hierarchy-cell"
					style={{ padding: 0, background: Colors.LightestGray }}
					colSpan={
						getVisibleLeafColumns().filter((col) => !col.columnDef.notDisplayed)
							.length
					}
				>
					{HierarchyComponent ? (
						<HierarchyComponent {...props} />
					) : (
						<Wrapper sx={{ pl: `${(row.depth + 2) * 12}px` }}>
							<ExpandButton sx={{ mx: '-8px' }} row={row} table={table} />
							<div
								style={{
									color: Colors.Dark,
									fontSize: '14px',
									lineHeight: '18px',
								}}
							>
								{getValue(hierarchyItem)}
							</div>
						</Wrapper>
					)}
				</td>
			</tr>
		)
	) : null

	const memberRow = !hierarchyItem ? (
		<TableBodyRow {...props} measureElement={computedMeasureElement} />
	) : null

	const tableHeader = showTableHeader ? (
		<>
			{multirowHeader && (
				<TableHeadMultiRow
					isScrolled
					multirowHeader={multirowHeader}
					table={table}
					registerSticky={registerSticky}
					stickyElements={stickyElements}
					virtualColumns={virtualColumns}
				/>
			)}
			{getHeaderGroups().map((headerGroup) => (
				<>
					<TableHeadRow
						data-index={virtualRow?.index}
						parentRow={row}
						stickyElements={stickyElements}
						registerSticky={registerSticky}
						headerGroup={getHeaderGroupFilteredByDisplay(headerGroup as any)}
						key={headerGroup.id}
						table={table}
						virtualColumns={virtualColumns}
						cellBackgroundColor={Colors.Gray20}
						cellBackgroundColorHover={Colors.LightestGray}
						stickyHeader={!!isFullScreen || !!enableStickyHeader}
						sx={{ zIndex: 2 }}
					/>
				</>
			))}
		</>
	) : null

	return (
		<>
			{unitRow}
			{tableHeader}
			{memberRow}
		</>
	)
}

export const Memo_HierarchyRow = memo(
	HierarchyRow,
	(prev, next) => prev.row === next.row && prev.rowIndex === next.rowIndex
)
