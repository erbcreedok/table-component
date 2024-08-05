import TableRow, { TableRowProps } from '@mui/material/TableRow'
import type { VirtualItem } from '@tanstack/react-virtual'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import {
	Colors,
	ColumnVirtualizerWrapper,
	Table_Column,
	Table_HeaderGroup,
	Table_Row,
	TableInstance,
} from '..'
import type { StickyElement } from '../hooks/useMultiSticky'
import { getHeaderGroupBorders } from '../utils/getGroupBorders'
import { getIsColumnAllGroupsCollapsedDefault } from '../utils/getIsColumnAllGroupsCollapsed'
import { getTestAttributes } from '../utils/getTestAttributes'
import { handleTableHeadDragEnter } from '../utils/handleTableHeadDragEnter'
import { onGroupCollapsedToggleAllDefault } from '../utils/onGroupCollapseToggleAll'
import { mapVirtualItems } from '../utils/virtual'

import { TableHeadCell } from './TableHeadCell'
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
	} = table

	useEffect(() => {
		if (stickyHeader && ref.current) {
			registerSticky(ref.current, 'headRow', 'last')
		}
	}, [ref, registerSticky, stickyHeader])

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

	const tableHeadCells = useMemo(() => {
		let isPrevColumnAllGroupsCollapsed = false
		const headers = mapVirtualItems(
			headerGroup.getNonCollapsedHeaders(),
			virtualColumns
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
	}, [
		headerGroup,
		virtualColumns,
		table,
		getIsColumnAllGroupsCollapsed,
		parentRow,
		cellBackgroundColor,
		cellBackgroundColorHover,
		getOnToggleGroupCollapse,
	])

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
