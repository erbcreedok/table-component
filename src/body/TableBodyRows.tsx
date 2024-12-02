/* eslint-disable react/jsx-pascal-case */
import { VirtualItem, Virtualizer } from '@tanstack/react-virtual'
import React, { FC, useMemo } from 'react'

import type { Table_Row, TableBodyRowProps, TableInstance } from '..'
import { HierarchyRow, Memo_HierarchyRow } from '../components/HierarchyRow'
import { RowVirtualizerWrapper } from '../components/RowVirtualizerWrapper'

import { Memo_TableBodyRow, TableBodyRow } from './TableBodyRow'

interface Props {
	virtualizer: Virtualizer<HTMLDivElement | Window, HTMLTableRowElement>
	columnVirtualizer?: Virtualizer<HTMLDivElement, HTMLTableCellElement>
	table: TableInstance
	virtualColumns?: VirtualItem[]
	rows: Table_Row[]
	columnsCount: number
}

export const TableBodyRows: FC<Props> = ({
	virtualizer,
	table,
	columnVirtualizer,
	virtualColumns,
	rows,
	columnsCount,
}) => {
	const {
		getState,
		options: {
			hierarchyTreeConfig,
			memoMode,
			rowVirtualizerInstanceRef,
			virtualizerInstanceRef,
		},
		CustomRow,
	} = table

	const { groupCollapsed, newRow } = getState()

	if (rowVirtualizerInstanceRef && virtualizer) {
		rowVirtualizerInstanceRef.current = virtualizer
	}

	// deprecated
	if (virtualizerInstanceRef && virtualizer) {
		virtualizerInstanceRef.current = virtualizer
	}

	const virtualRows = virtualizer ? virtualizer.getVirtualItems() : undefined

	const rowsOrVirtualRows = virtualRows ?? rows
	const isHierarchyItem = hierarchyTreeConfig?.isHierarchyItem

	const rowProps = useMemo(() => {
		const increment =
			virtualizer && rowsOrVirtualRows?.length
				? rowsOrVirtualRows[0].index + 1
				: 1
		let domIndex = 0

		return rowsOrVirtualRows.map((rowOrVirtualRow, rowIndex) => {
			const row = virtualizer
				? rows[rowOrVirtualRow.index]
				: (rowOrVirtualRow as Table_Row)
			if (isHierarchyItem?.(row.original)) {
				domIndex = -1
			}
			const rowNumber = increment + domIndex
			// check if row has collapsed group rows
			const firstCollapsedGroupRow = Object.entries(row.groupRows ?? {}).reduce(
				(groupRow, [groupId, row]) => {
					if (
						!!groupCollapsed[groupId] &&
						row.depth < (groupRow?.depth ?? Infinity)
					) {
						return row
					}

					return groupRow
				},
				undefined as Table_Row | undefined
			)
			if (!firstCollapsedGroupRow) {
				domIndex += 1
			} else {
				// if row is collapsed, add the number of subrows to the domIndex
				domIndex += firstCollapsedGroupRow.subRows?.length ?? 0
			}

			return {
				columnVirtualizer,
				key: row.id,
				measureElement: virtualizer?.measureElement,
				numRows: rows.length,
				row,
				rowIndex: virtualizer ? rowOrVirtualRow.index : rowIndex,
				rowNumber,
				domIndex: rowIndex,
				table,
				virtualColumns,
				virtualRow: virtualizer ? (rowOrVirtualRow as VirtualItem) : undefined,
			} as TableBodyRowProps
		})
	}, [
		isHierarchyItem,
		rowsOrVirtualRows,
		virtualizer,
		rows,
		columnVirtualizer,
		table,
		virtualColumns,
	])

	const rowsGroupingProps = useMemo(() => {
		const groupRows = {}
		const { grouping } = table.getState()
		rowProps.forEach(({ row }) => {
			grouping.forEach((columnId, columnIndex) => {
				if (!row.groupIds) return
				const groupId = row.groupIds[columnId]
				if (!groupId) return
				if (!groupRows[groupId])
					groupRows[groupId] = {
						rowId: row.id,
						count: 1,
						columnIndex,
						columnId,
					}
				else {
					groupRows[groupId].count += 1
				}
			})
		})
		const rowsGroupingProps = {}
		Object.keys(groupRows).forEach((groupId) => {
			const groupRow = groupRows[groupId]
			if (!rowsGroupingProps[groupRow.rowId]) {
				rowsGroupingProps[groupRow.rowId] = []
			}
			rowsGroupingProps[groupRow.rowId][groupRow.columnIndex] = {
				...groupRow,
				groupId,
			}
		})

		return rowsGroupingProps
	}, [rowProps, table])

	const MemoizedCustomRow = useMemo(() => {
		if (!CustomRow) return null

		return React.memo(
			CustomRow,
			(prev, next) => prev.row === next.row && prev.rowIndex === next.rowIndex
		)
	}, [CustomRow])

	return (
		<>
			{rowProps.length > 0 && newRow && !newRow.previousRow && (
				<TableBodyRow
					{...rowProps[0]}
					row={newRow}
					measureElement={undefined}
				/>
			)}
			<RowVirtualizerWrapper
				rowVirtualizer={virtualizer}
				colSpan={columnsCount}
			>
				{rowProps.map((props) => {
					const computedProps = {
						...props,
						groupingProps: rowsGroupingProps[props.row.id],
					}

					if (CustomRow)
						return memoMode === 'rows' && MemoizedCustomRow ? (
							<MemoizedCustomRow
								key={computedProps.row.id}
								{...computedProps}
							/>
						) : (
							<CustomRow key={computedProps.row.id} {...computedProps} />
						)
					if (hierarchyTreeConfig) {
						return memoMode === 'rows' ? (
							<Memo_HierarchyRow
								key={computedProps.row.id}
								{...computedProps}
							/>
						) : (
							<HierarchyRow key={computedProps.row.id} {...computedProps} />
						)
					}

					return memoMode === 'rows' ? (
						<Memo_TableBodyRow key={computedProps.row.id} {...computedProps} />
					) : (
						<TableBodyRow key={computedProps.row.id} {...computedProps} />
					)
				})}
			</RowVirtualizerWrapper>
		</>
	)
}
