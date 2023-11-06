import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import React, { useCallback } from 'react'
import { TableBodyRow, TableBodyRowProps } from '../../../body/TableBodyRow'
import { ExpandButton } from '../../../buttons/ExpandButton'
import { TableHeadMultiRow } from '../../../head/TableHeadMultiRow'
import { TableHeadRow } from '../../../head/TableHeadRow'
import { useComputedMeasureElement } from '../../../hooks/useComputedMeasureElement'
import { useMultiSticky } from '../../../hooks/useMultiSticky'
import { getHeaderGroupFilteredByDisplay } from '../../../utils/getFilteredByDisplay'
import { isUnitTreeItem } from '../../utils/getTeamMembers'

const Wrapper = styled(Box)`
	display: flex;
	gap: 9px;
	align-items: center;
	height: 32px;
	font-family: sans-serif;
	padding-top: 4px;
	padding-bottom: 4px;
	border-bottom: 1px solid #e1e3eb;
	position: sticky;
	left: 0;
	width: fit-content;
`

type Props<TData extends Record<string, any> = {}> = TableBodyRowProps

export const UnitRow = <TData extends Record<string, any> = {}>(
	props: Props<TData>
) => {
	const { domIndex, row, table, virtualColumns, virtualRow, measureElement } =
		props
	const {
		getVisibleLeafColumns,
		getHeaderGroups,
		getPaginationRowModel,
		options: { enableStickyHeader, multirowHeader },
	} = table
	const { isFullScreen } = table.getState()
	const { registerSticky, stickyElements } = useMultiSticky()

	const unit = isUnitTreeItem(row.original) ? row.original : null
	const index = getPaginationRowModel().rows.findIndex((r) => r.id === row.id)
	const nextRow = getPaginationRowModel().rows[index + 1]
	const isNextRowIsUnit = isUnitTreeItem(nextRow?.original)
	const showTableHeader =
		(unit && nextRow && !isNextRowIsUnit && row?.getIsExpanded?.()) ||
		(!unit && domIndex == 0)

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

	const unitRow = unit ? (
		<tr
			className="unit-row"
			data-index={virtualRow?.index}
			ref={computedMeasureElement}
		>
			<td
				className="unit-cell"
				style={{ padding: 0, background: '#FAFAFC' }}
				colSpan={
					getVisibleLeafColumns().filter((col) => !col.columnDef.notDisplayed)
						.length
				}
			>
				<Wrapper sx={{ pl: `${(row.depth + 2) * 12}px` }}>
					<ExpandButton sx={{ mx: '-8px' }} row={row} table={table} />
					<div
						style={{ color: '#303240', fontSize: '14px', lineHeight: '18px' }}
					>
						{unit.name}
					</div>
				</Wrapper>
			</td>
		</tr>
	) : null

	const memberRow = !unit ? (
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
						cellBackgroundColor="#EBEDF5"
						cellBackgroundColorHover="#FAFAFC"
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
