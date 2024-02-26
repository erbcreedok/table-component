import React, { useCallback, useRef, useEffect, useMemo } from 'react'
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
import { getHeadersFilteredByDisplay } from '../utils/getFilteredByDisplay'
import { getHeaderGroupBorders } from '../utils/getGroupBorders'
import { getIsColumnAllGroupsCollapsedDefault } from '../utils/getIsColumnAllGroupsCollapsed'
import { handleTableHeadDragEnter } from '../utils/handleTableHeadDragEnter'
import { sortMappedVirtualHeaders } from '../utils/sortColumns'
import { mapVirtualItems } from '../utils/virtual'
import { onGroupCollapsedToggleAllDefault } from '../utils/onGroupCollapseToggleAll'
import { getTestAttributes } from '../utils/getTestAttributes'
import {
	getNonCollapsedColumns,
	EmptyColumn,
} from '../utils/getNonCollapsedColumns'

import { TableHeadCell, TableHeadCellProps } from './TableHeadCell'
import { TableHeadCellEmpty } from './TableHeadCellEmpty'

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
			layoutMode,
			muiTableHeadRowProps,
			multirowHeader,
			onGroupCollapsedToggleAll,
			getIsColumnAllGroupsCollapsed,
			e2eLabels,
		},
		getState,
	} = table
	const { collapsedMultirow, grouping } = getState()

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
		handleTableHeadDragEnter(table, ref, parentRow)
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

	const getHeaderCellProps = (): (
		| (TableHeadCellProps & { empty: false })
		| EmptyColumn
	)[] => {
		let isPrevColumnAllGroupsCollapsed = false
		const headers = sortMappedVirtualHeaders(
			mapVirtualItems(
				getNonCollapsedColumns(
					getHeadersFilteredByDisplay(headerGroup.headers),
					collapsedMultirow
				),
				virtualColumns
			)
		)

		return headers.map(([header]) => {
			if (header.empty) {
				return header
			}

			const groupBorders = getHeaderGroupBorders({
				header,
				table,
			})
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
				empty: false as const,
			}
			isPrevColumnAllGroupsCollapsed = isAllGroupsCollapsed

			return props
		})
	}

	const tableHeadCells = useMemo(
		() => getHeaderCellProps(),
		[collapsedMultirow.length, collapsedMultirow, table, grouping, headerGroup]
	)

	return (
		<>
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
					{tableHeadCells.map((props) => {
						if (props.empty) {
							return (
								<TableHeadCellEmpty
									key={props.keyName}
									colSpan={props.colSpan ?? 1}
								/>
							)
						}

						return <TableHeadCell key={props?.header?.id} {...props} />
					})}
				</ColumnVirtualizerWrapper>
			</TableRow>
		</>
	)
}
