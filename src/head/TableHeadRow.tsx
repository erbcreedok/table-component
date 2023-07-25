import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import type { VirtualItem } from '@tanstack/react-virtual'

import type {
	Table_Header,
	Table_HeaderGroup,
	Table_Row,
	TableInstance,
} from '..'
import type { StickyElement } from '../hooks/useMultiSticky'
import { getColumnId } from '../column.utils'
import { Colors } from '../components/styles'
import { getColumnGroupIds } from '../utils/getColumnGroupIds'
import { getHeaderGroupBorders } from '../utils/getGroupBorders'

import { TableHeadCell, TableHeadCellProps } from './TableHeadCell'

type Props = {
	stickyHeader?: boolean
	headerGroup: Table_HeaderGroup
	table: TableInstance
	virtualColumns?: VirtualItem[]
	virtualPaddingLeft?: number
	virtualPaddingRight?: number
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

export const TableHeadRow = ({
	headerGroup,
	table,
	virtualColumns,
	virtualPaddingLeft,
	virtualPaddingRight,
	parentRow,
	sx,
	cellBackgroundColor,
	cellBackgroundColorHover,
	stickyHeader,
	isScrolled,
	registerSticky,
	stickyElements,
	...rest
}: Props) => {
	const ref = useRef<HTMLTableRowElement | null>(null)
	const {
		options: {
			layoutMode,
			muiTableHeadRowProps,
			enableRowDragging,
			multirowHeader,
		},
		setHoveredRow,
		getState,
		setGroupCollapsed,
	} = table
	const { draggingRows, grouping } = getState()

	useEffect(() => {
		if (ref.current) {
			registerSticky(ref.current, 'headRow', 'last')
		}
	}, [ref, registerSticky])

	const tableRowProps =
		muiTableHeadRowProps instanceof Function
			? muiTableHeadRowProps({ headerGroup, table })
			: muiTableHeadRowProps

	const handleDragEnter = () => {
		if (enableRowDragging && draggingRows.length > 0) {
			let row
			if (!parentRow) {
				row = table.getPaginationRowModel().flatRows[0]
			} else if (parentRow.subRows) {
				row = parentRow.subRows[0]
			}
			if (row) {
				setHoveredRow({
					row,
					position: 'top',
					rowRef: ref,
				})
			} else {
				setHoveredRow(null)
			}
		}
	}

	const groupedRows = table.getGroupedRowModel().flatRows as Table_Row[]
	const groupCollapseIds = useMemo(() => {
		const groupCollapseIds = {}
		grouping.forEach((columnId) => {
			groupCollapseIds[columnId] = getColumnGroupIds(groupedRows, columnId)
		})

		return groupCollapseIds
	}, [groupedRows, grouping])

	const getGroupCollapseValues = useCallback(
		(columnId: string, expanded?: boolean) => {
			return groupCollapseIds[columnId].reduce(
				(acc, id) => ({
					...acc,
					[id]: expanded,
				}),
				{}
			)
		},
		[groupCollapseIds]
	)
	const getToggleGroupCollapse = useCallback(
		(columnId: string) => (expanded?: boolean) => {
			// we shall get all the columns that are grouped after the current column
			const collapsingColumns = grouping.reduceRight((acc, id) => {
				if (acc.includes(columnId)) {
					return acc
				}

				return [id, ...acc]
			}, [] as string[])
			const values = collapsingColumns.reduce(
				(acc, columnId) => ({
					...acc,
					...getGroupCollapseValues(columnId, expanded),
				}),
				{}
			)
			setGroupCollapsed((prev) => ({
				...prev,
				...values,
			}))
		},
		[getGroupCollapseValues, grouping, setGroupCollapsed]
	)

	const getHeaderCellProps = (): TableHeadCellProps[] => {
		return (virtualColumns ?? headerGroup.headers).map(
			(headerOrVirtualHeader) => {
				const header = virtualColumns
					? headerGroup.headers[headerOrVirtualHeader.index]
					: (headerOrVirtualHeader as Table_Header)
				const groupBorders = getHeaderGroupBorders({ header, table })
				const columnId = getColumnId(header.column.columnDef)

				return {
					parentRow,
					header,
					table,
					groupBorders,
					backgroundColor: cellBackgroundColor,
					backgroundColorHover: cellBackgroundColorHover,
					groupCollapseIds: groupCollapseIds[columnId],
					onToggleGroupCollapse: getToggleGroupCollapse(columnId),
				}
			}
		)
	}

	return (
		<TableRow
			ref={ref}
			{...tableRowProps}
			onDragEnter={handleDragEnter}
			{...rest}
			sx={(theme) => ({
				position: stickyHeader ? 'sticky' : 'relative',
				backgroundColor: Colors.LightestGray,
				display: layoutMode === 'grid' ? 'flex' : 'table-row',
				top: multirowHeader?.length
					? stickyElements.find((sticky) => sticky.id === 'headRow')?.top
					: 0,
				boxShadow:
					stickyHeader && isScrolled
						? '0px 4px 4px 0px rgba(0, 0, 0, 0.10)'
						: undefined,
				...(tableRowProps?.sx instanceof Function
					? tableRowProps?.sx(theme)
					: (tableRowProps?.sx as any)),
				...(sx instanceof Function ? sx(theme) : (sx as any)),
			})}
		>
			{virtualPaddingLeft ? (
				<th
					aria-label="virtual-padding-left"
					style={{ display: 'flex', width: virtualPaddingLeft }}
				/>
			) : null}
			{getHeaderCellProps().map((props) => (
				<TableHeadCell key={props.header.id} {...props} />
			))}
			{virtualPaddingRight ? (
				<th
					aria-label="virtual-padding-right"
					style={{ display: 'flex', width: virtualPaddingRight }}
				/>
			) : null}
		</TableRow>
	)
}
