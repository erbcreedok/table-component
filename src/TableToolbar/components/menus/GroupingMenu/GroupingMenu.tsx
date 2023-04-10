import React, { useCallback, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'

import type { TableInstance } from '../../../../index'
import { SidebarHeaderComponent } from '../components/SIdebarHeader'
import { SidebarSearchComponent } from '../components/SidebarSearch'
import { Table_Column } from '../../../../index'
import { SimpleMenuItem } from '../components/SimpleMenuItem'
import { ButtonLink } from '../../../../components/ButtonLink'
import { SidebarPopover } from '../components/SidebarPopover'
import { reorderColumn } from '../../../../column.utils'

import { GroupingMenuItem } from './GroupingMenuItem'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	isSubMenu?: boolean
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

export const GroupingMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const {
		getState,
		getAllColumns,
		getLeftLeafColumns,
		getCenterLeafColumns,
		getRightLeafColumns,
		setGrouping,
	} = table
	const { columnOrder, columnPinning, columnVisibility, grouping } = getState()
	const [searchList, setSearchList] = useState<Array<Table_Column<TData>>>([])
	const [hoveredColumn, setHoveredColumn] =
		useState<Table_Column<TData> | null>(null)

	const allColumns = useMemo(() => {
		const columns = getAllColumns()

		if (columnOrder.length > 0) {
			return Array.from(new Set(columnOrder))
				.map((colId) => getCenterLeafColumns().find((col) => col?.id === colId))
				.filter(
					(col) =>
						col.id !== 'member.id' && col.getIsVisible() && col.getCanGroup()
				)
		}

		return columns
			.filter((col) => col.id !== 'member.id')
			.filter((col) => col.getIsVisible())
	}, [
		columnOrder,
		columnPinning,
		columnVisibility,
		grouping,
		getAllColumns,
		getCenterLeafColumns,
		getLeftLeafColumns,
		getRightLeafColumns,
	]) as Array<Table_Column<TData>>

	const groupedList = useMemo(
		() =>
			grouping.map((colId) =>
				getCenterLeafColumns().find((col) => col?.id === colId)
			),
		[grouping]
	)

	const nonGroupedList = useMemo(
		() => allColumns.filter((col) => !col.getIsGrouped()),
		[allColumns, grouping, columnVisibility]
	)

	const handleCloseCLick = () => setAnchorEl(null)
	const handleOnSearchChange = (value: string) => {
		setSearchList(
			value.length >= 3
				? getAllColumns().filter((col) =>
						col.columnDef.header.toLowerCase().includes(value)
				  )
				: []
		)
	}

	const onGroupingByColumn = (column: Table_Column<TData>) => {
		column.toggleGrouping()
	}

	const removeAllGroup = () => {
		allColumns.forEach((col) => {
			if (col.getIsGrouped()) {
				col.toggleGrouping()
			}
		})
	}

	const onColumnOrderChanged = (
		column: Table_Column<TData>,
		hovered: Table_Column<TData>
	) => {
		setGrouping((old) => reorderColumn(column, hovered, old))
	}

	return (
		<Drawer
			anchor="right"
			open={!!anchorEl}
			onClose={handleCloseCLick}
			transitionDuration={400}
		>
			<Box sx={{ minWidth: 500 }}>
				<SidebarHeaderComponent title="Grouping" onClick={handleCloseCLick} />
				{!groupedList.length && (
					<SidebarSearchComponent onChange={handleOnSearchChange} />
				)}

				<Box
					sx={{ marginTop: '12px', '& hr': { margin: '21px 24px 15px 24px' } }}
				>
					{groupedList.length > 0 ? (
						<>
							{groupedList.map((column, index) => (
								<GroupingMenuItem
									table={table}
									allColumns={allColumns}
									column={column}
									key={`${index}-${column.id}`}
									enableDrag={groupedList.length > 1}
									hoveredColumn={hoveredColumn}
									onColumnOrderChange={onColumnOrderChanged}
									setHoveredColumn={setHoveredColumn}
								/>
							))}
							<Divider />
							<Box
								sx={{
									marginLeft: '24px',
									marginRight: '24px',
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<SidebarPopover
									buttonText="Group by +"
									columns={nonGroupedList}
									onGroupingByColumn={onGroupingByColumn}
								/>
								<ButtonLink onClick={removeAllGroup}>Remove all</ButtonLink>
							</Box>
						</>
					) : searchList.length > 0 ? (
						searchList.map((column, index) => (
							<SimpleMenuItem column={column} key={`${index}-${column.id}`} />
						))
					) : (
						allColumns.map((column, index) => (
							<SimpleMenuItem column={column} key={`${index}-${column.id}`} />
						))
					)}
				</Box>
			</Box>
		</Drawer>
	)
}
