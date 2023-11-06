import React, { useCallback, useRef, useEffect } from 'react'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import type { VirtualItem } from '@tanstack/react-virtual'

import type {
	Table_Column,
	Table_HeaderGroup,
	Table_Row,
	TableInstance,
} from '..'
import { ColumnVirtualizerWrapper } from '../components/ColumnVirtualizerWrapper'
import type { StickyElement } from '../hooks/useMultiSticky'
import { Colors } from '../components/styles'
import { getHeaderGroupBorders } from '../utils/getGroupBorders'
import { getIsColumnAllGroupsCollapsedDefault } from '../utils/getIsColumnAllGroupsCollapsed'
import { mapVirtualItems } from '../utils/mapVirtualItems'
import { onGroupCollapsedToggleAllDefault } from '../utils/onGroupCollapseToggleAll'
import { setHoveredRow } from '../utils/setHoveredRow'
import { getTestAttributes } from '../utils/getTestAttributes'

import { TableHeadCell, TableHeadCellProps } from './TableHeadCell'

type Props = {
	stickyHeader?: boolean
	headerGroup: Table_HeaderGroup
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

export const TableHeadRow = ({
	headerGroup,
	table,
	virtualColumns,
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
			enableRowDragging,
			layoutMode,
			muiTableHeadRowProps,
			multirowHeader,
			onGroupCollapsedToggleAll,
			getIsColumnAllGroupsCollapsed,
			e2eLabels,
		},
		getState,
	} = table
	const { draggingRows } = getState()

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
				setHoveredRow(table)({
					row,
					position: 'top',
					rowRef: ref,
				})
			} else {
				setHoveredRow(table)(null)
			}
		}
	}

	const getOnToggleGroupCollapse = useCallback(
		(column: Table_Column) => {
			return (expanded?: boolean) => {
				return (onGroupCollapsedToggleAll ?? onGroupCollapsedToggleAllDefault)({
					column,
					table,
					collapsed: !expanded,
				})
			}
		},
		[onGroupCollapsedToggleAll, table]
	)

	const getHeaderCellProps = (): TableHeadCellProps[] => {
		let isPrevColumnAllGroupsCollapsed = false
		const headers = mapVirtualItems(headerGroup.headers, virtualColumns)

		return headers.map(([header]) => {
			const groupBorders = getHeaderGroupBorders({ header, table })
			const isAllGroupsCollapsed =
				isPrevColumnAllGroupsCollapsed ||
				(getIsColumnAllGroupsCollapsed ?? getIsColumnAllGroupsCollapsedDefault)(
					{
						table,
						column: header.column,
					}
				)

			const props = {
				parentRow,
				header,
				table,
				groupBorders,
				backgroundColor: cellBackgroundColor,
				backgroundColorHover: cellBackgroundColorHover,
				groupsExpanded: !isAllGroupsCollapsed,
				disableToggleGroupCollapse: isPrevColumnAllGroupsCollapsed,
				onToggleGroupCollapse: getOnToggleGroupCollapse(header.column),
			}
			isPrevColumnAllGroupsCollapsed = isAllGroupsCollapsed

			return props
		})
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
			{...getTestAttributes(e2eLabels, 'headerRow')}
		>
			<ColumnVirtualizerWrapper
				style={{ backgroundColor: cellBackgroundColor ?? Colors.Gray20 }}
			>
				{getHeaderCellProps().map((props) => (
					<TableHeadCell key={props.header.id} {...props} />
				))}
			</ColumnVirtualizerWrapper>
		</TableRow>
	)
}
