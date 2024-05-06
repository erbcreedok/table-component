import TableRow, { TableRowProps } from '@mui/material/TableRow'
import type { VirtualItem } from '@tanstack/react-virtual'
import React, { useEffect, useMemo, useRef } from 'react'

import type { MultirowHeader, Table_Row, TableInstance } from '..'
import { ColumnVirtualizerWrapper, Colors, TextColor } from '..'
import type { StickyElement } from '../hooks/useMultiSticky'
import { arrayHasAll } from '../utils/arrayHasAll'
import { makeMultirowColumns } from '../utils/makeMultirowColumns'
import { mapVirtualItems } from '../utils/virtual'

import { TableHeadMultiRowCell } from './TableHeadMultiRowCell'
import { TableHeadMultiRowCellEmpty } from './TableHeadMultiRowCellEmpty'

const sharedCellStyles = {
	background: Colors.Gray10,
}
const cellStyles = {
	...sharedCellStyles,
	borderColor: Colors.Gray,
	borderCollapse: 'collapse',
	borderStyle: 'solid',
	borderWidth: '1px',
	height: '36px',
	padding: '0 12px',
	color: TextColor.Dark,
	fontWeight: 600,
	fontSize: '12px',
	lineHeight: '18px',
	textAlign: 'center',
}

type Props = {
	multirowHeader: MultirowHeader
	table: TableInstance
	virtualColumns?: VirtualItem[]
	parentRow?: Table_Row
	cellBackgroundColor?: string
	cellBackgroundColorHover?: string
	isScrolled?: boolean
	registerSticky: (
		el: HTMLTableRowElement,
		id: string,
		order: number | string
	) => void
	stickyElements: StickyElement[]
} & TableRowProps

export const TableHeadMultiRow = ({
	table,
	sx,
	isScrolled,
	multirowHeader,
	registerSticky,
	stickyElements,
	virtualColumns,
	...rest
}: Props) => {
	const rowsRef = useRef<HTMLTableRowElement[]>([])
	const {
		options: {
			layoutMode,
			muiTableHeadRowProps,
			multirowColumnsDisplayDepth,
			enableMultirowExpandCollapse,
		},
		getState,
		getHeaderGroups,
		setCollapsedMultirow,
	} = table
	const { collapsedMultirow, grouping } = getState()
	const headerGroup = getHeaderGroups()

	useEffect(() => {
		rowsRef.current = rowsRef.current.slice(0, multirowHeader.length)
	}, [multirowHeader])

	useEffect(() => {
		rowsRef.current.forEach((el, i) => {
			registerSticky(el, el.id, i)
		})
	}, [rowsRef.current, registerSticky])

	const getMultirowColumns = (multiHeaderRow) => {
		// TODO: create table.getMultirowColumns() method
		// currently, we are very strict about the structure of the multirowHeader, because of virtual items
		const columns = mapVirtualItems(
			table.getNonCollapsedColumns(),
			virtualColumns
		).map(([col]) => col)

		return makeMultirowColumns(columns, multiHeaderRow, table)
	}

	const getRowStyles = (theme, row, stickyId) => {
		return {
			position: row.pin ? 'sticky' : 'relative',
			backgroundColor: Colors.LightestGray,
			display: layoutMode === 'grid' ? 'flex' : 'table-row',
			top:
				row.pin && stickyElements.length
					? stickyElements.find((sticky) => sticky.id === stickyId)?.top
					: 0,
			boxShadow:
				row.pin && isScrolled
					? '0px 4px 4px 0px rgba(0, 0, 0, 0.10)'
					: undefined,
			...(!row.pin && {
				zIndex: -1,
			}),
			...(sx instanceof Function ? sx(theme) : (sx as any)),
		}
	}

	const handleMultirowCollapse = (
		data: { id: string; colIds: string[]; originalColIds: string[] },
		depth
	) => {
		const collapsedCellChildren = findAllChildren(data, depth)

		let newData = [...collapsedMultirow]
		const index = newData.findIndex((el) => el.id === data.id)
		if (index !== -1) {
			newData.splice(index, 1)
		} else {
			newData = newData.filter(({ id }) => !collapsedCellChildren.includes(id))
			newData.push(data)
		}

		setCollapsedMultirow(newData)
	}

	const findAllChildren = (data, depth) => {
		const children = multirowHeader.reduce((acc, curr) => {
			if (curr.depth <= depth) return acc

			for (const col of curr.columns) {
				if (arrayHasAll(data.colIds, col.columnIds)) {
					acc.push(col?.shorthandText ?? col.text)
				}
			}

			return acc
		}, [] as string[])

		return children
	}

	const findCollapsedParent = (multiColumn, depth) => {
		let result: boolean | { id: string; colIds: string[] } | undefined = false

		if (depth >= 1) {
			const depthMatchingMultiRow = multirowHeader.find(
				(row) => row.depth === depth - 1
			)
			const depthMatchingMultiColumns = depthMatchingMultiRow
				? getMultirowColumns(depthMatchingMultiRow)
				: []

			if (depthMatchingMultiColumns?.length) {
				const parent = depthMatchingMultiColumns.find((col) =>
					multiColumn.colIds.some((colId) => col.colIds.includes(colId))
				)

				if (parent) {
					result = collapsedMultirow.find((el) => el.id === parent?.id)
				}
			}

			if (Boolean(result) === false && depth > 1) {
				result = findCollapsedParent(multiColumn, depth - 1)
			}
		}

		return result
	}

	const predefinedMultirowHeader = useMemo(() => {
		return [...multirowHeader]
			.sort((a, b) => a.depth - b.depth)
			.map((row) => {
				const multirowColumns = getMultirowColumns(row)

				const updatedColumns = multirowColumns.map((cell, i) => {
					const collapsedParent = cell.text
						? findCollapsedParent(cell, cell.depth)
						: false
					let newColSpanValue = cell.colSpan

					if (i > 0 && collapsedParent) {
						const prevCell = multirowColumns[i - 1]
						const prevCellCollapsedParent = prevCell.text
							? findCollapsedParent(prevCell, prevCell.depth)
							: false

						newColSpanValue =
							prevCellCollapsedParent &&
							prevCellCollapsedParent.id === collapsedParent.id
								? 0
								: 1
					}

					if (i === 0 && collapsedParent) {
						newColSpanValue = 1
					}

					return {
						...cell,
						collapsedParent,
						colSpan: newColSpanValue,
					}
				})

				return { ...row, columns: updatedColumns }
			})
	}, [
		collapsedMultirow,
		headerGroup,
		findCollapsedParent,
		getMultirowColumns,
		multirowHeader,
		grouping,
	])

	return (
		<>
			{predefinedMultirowHeader.map((row, i) => {
				return (
					<>
						<TableRow
							key={row.depth}
							ref={(ref: HTMLTableRowElement) => {
								if (row.pin) {
									rowsRef.current[i * 2] = ref
								}
							}}
							{...muiTableHeadRowProps}
							{...rest}
							id={`${i}`}
							sx={(theme) => getRowStyles(theme, row, i.toString())}
						>
							<ColumnVirtualizerWrapper sx={sharedCellStyles}>
								{row.columns.map((cell) => {
									const canCollapse = enableMultirowExpandCollapse
										? cell.colIds.length > 1 && !!cell.text
										: false

									const showCollapse =
										enableMultirowExpandCollapse &&
										!!cell.text &&
										!cell.isGrouped &&
										!cell.isPinned

									if (cell.collapsedParent) {
										return (
											<TableHeadMultiRowCellEmpty
												key={cell.id}
												cell={cell}
												cellStyles={cellStyles}
											/>
										)
									}

									return (
										<TableHeadMultiRowCell
											key={cell.id}
											cell={cell}
											cellStyles={cellStyles}
											table={table}
											showCollapse={showCollapse ?? false}
											canCollapse={canCollapse}
											isCollapsed={collapsedMultirow.some(
												({ id }) => id === cell.id
											)}
											onCollapse={handleMultirowCollapse}
											collapsedMultirow={collapsedMultirow}
											multirowColumnsDisplayDepth={
												multirowColumnsDisplayDepth ?? 1
											}
										/>
									)
								})}
							</ColumnVirtualizerWrapper>
						</TableRow>
						{row.additionalRowContent ? (
							<TableRow
								key={`${row.depth}-sub`}
								ref={(ref: HTMLTableRowElement) => {
									if (row.pin) {
										rowsRef.current[i * 2 + 1] = ref
									}
								}}
								{...muiTableHeadRowProps}
								{...rest}
								id={`${i}-sub`}
								sx={(theme) => getRowStyles(theme, row, `${i}-sub`)}
							>
								<ColumnVirtualizerWrapper sx={sharedCellStyles}>
									{row.additionalRowContent(table, row.columns)}
								</ColumnVirtualizerWrapper>
							</TableRow>
						) : null}
					</>
				)
			})}
		</>
	)
}
