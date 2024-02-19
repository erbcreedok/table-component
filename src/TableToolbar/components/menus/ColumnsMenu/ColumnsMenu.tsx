import React, { useCallback, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

import type { Table_Column, TableData, TableInstance } from '../../../../index'
import { ContentTitle } from '../../../../components/ContentTitle'
import { ButtonLink } from '../../../../components/ButtonLink'
import {
	reorderColumn,
	Table_DisplayColumnIdsArray,
} from '../../../../column.utils'
import { Sidebar } from '../../../../components/Sidebar'
import { Colors, TextColor } from '../../../../components/styles'
import { getValidColumnOrder } from '../../../../utils/getValidColumnOrder'
import { splitArrayItems } from '../../../../utils/splitArrayItems'
import { getColumnsFilteredByDisplay } from '../../../../utils/getFilteredByDisplay'
import { getTestAttributes } from '../../../../utils/getTestAttributes'
import { withNativeEvent } from '../../../../utils/withNativeEvent'

import { ColumnsMenuItem } from './ColumnsMenuItem'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

export const defaultOrganizeColumnsMenu = <TData extends TableData = {}>(
	allColumns: Table_Column<TData>[]
) =>
	getColumnsFilteredByDisplay(
		allColumns.filter(
			(col) => !(Table_DisplayColumnIdsArray as string[]).includes(col.id)
		)
	)

export const ColumnsMenu = <TData extends TableData = {}>({
	anchorEl,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const {
		getAllLeafColumns,
		setColumnOrder,
		setGrouping,
		options: {
			localization,
			innerTable,
			organizeColumnsMenu = defaultOrganizeColumnsMenu,
			e2eLabels,
		},
	} = table
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
	const [searchList, setSearchList] = useState<Array<Table_Column<TData>>>([])
	const allColumns = organizeColumnsMenu(getAllLeafColumns())

	const [visibleColumns, hiddenColumns] = splitArrayItems(allColumns, (col) =>
		col.getIsVisible()
	)

	const [groupedColumns, ungroupedColumns] = useMemo(
		() => splitArrayItems(visibleColumns, (col) => col.getIsGrouped()),
		[visibleColumns]
	)

	const [hoveredColumn, setHoveredColumn] =
		useState<Table_Column<TData> | null>(null)
	const [draggingColumn, setDraggingColumn] =
		useState<Table_Column<TData> | null>(null)

	const visibleColumnsCount = visibleColumns.length
	const hiddenColumnsCount = hiddenColumns.length

	const handleCloseClick = () => setAnchorEl(null)

	const handleOnSearchChange = (value: string) => {
		if (value) {
			setIsSearchActive(true)
		} else {
			setIsSearchActive(false)
		}

		setSearchList(
			value.length
				? allColumns.filter((col) =>
						col.columnDef.header.toLowerCase().includes(value)
				  )
				: []
		)
	}

	const handleHideAllClick = () => {
		allColumns
			.filter((col) => col.columnDef.enableHiding !== false)
			.forEach((col) => col.toggleVisibility(false))
	}

	const handleShowAllClick = () => {
		allColumns.forEach((col) => col.toggleVisibility(true))
	}

	const onColumnOrderChange = useCallback(
		(draggedColumn: Table_Column<TData>, targetColumn: Table_Column<TData>) => {
			if (targetColumn.getIsGrouped()) {
				setGrouping((grouping) =>
					reorderColumn(draggedColumn, targetColumn, grouping)
				)
			} else {
				setColumnOrder((columnOrder) =>
					reorderColumn(
						draggedColumn,
						targetColumn,
						getValidColumnOrder(table.options, columnOrder)
					)
				)
			}
		},
		[table.options, setColumnOrder, setGrouping]
	)

	return (
		<Sidebar
			open={!!anchorEl}
			onClose={handleCloseClick}
			styles={{ minWidth: 660 }}
			withHeader
			headerTitle={localization.columns}
			subHeader={
				<Typography sx={{ color: TextColor.Primary }}>
					{visibleColumnsCount} columns shown, {hiddenColumnsCount} columns
					hidden
				</Typography>
			}
			withSearch
			onSearchChange={handleOnSearchChange}
			innerTableSidebar={innerTable}
			PaperProps={getTestAttributes(e2eLabels, 'sidebarColumns')}
		>
			{isSearchActive ? (
				searchList.length ? (
					searchList.map((column) => (
						<ColumnsMenuItem
							key={column.id}
							column={column}
							table={table}
							hoveredColumn={hoveredColumn}
							draggingColumn={draggingColumn}
							setHoveredColumn={setHoveredColumn}
							setDraggingColumn={setDraggingColumn}
							onColumnOrderChange={onColumnOrderChange}
						/>
					))
				) : (
					<Typography
						sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
					>
						No options
					</Typography>
				)
			) : (
				<>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							flexWrap: 'wrap',
							overflowX: 'auto',
							'&::-webkit-scrollbar': { height: 3, WebkitAppearance: 'none' },
							'&::-webkit-scrollbar-thumb': {
								borderRadius: 6,
								border: 'none',
								backgroundColor: Colors.Gray40,
							},
						}}
					>
						<Box
							sx={{
								display: 'flex',
								padding: '12px 24px',
								alignItems: 'center',
								justifyContent: 'space-between',
								maxWidth: '300px',
							}}
						>
							<ContentTitle>Shown Columns</ContentTitle>
							<Box
								sx={{
									display: 'flex',
									width: 120,
									justifyContent: 'space-between',
								}}
							>
								<ButtonLink
									onClick={withNativeEvent(
										{
											el: 'ColumnsSettingsSidebar_HideAll',
											type: 'click',
										},
										table
									)(handleHideAllClick)}
									{...getTestAttributes(e2eLabels, 'sidebarColumnsHideAll')}
								>
									{localization.hideAll}
								</ButtonLink>
								<ButtonLink
									onClick={withNativeEvent(
										{
											el: 'ColumnsSettingsSidebar_ShowAll',
											type: 'click',
										},
										table
									)(handleShowAllClick)}
									{...getTestAttributes(e2eLabels, 'sidebarColumnsShowAll')}
								>
									{localization.showAll}
								</ButtonLink>
							</Box>
						</Box>
						{groupedColumns.map((column) => (
							<ColumnsMenuItem
								key={column?.id}
								column={column}
								table={table}
								hoveredColumn={hoveredColumn}
								draggingColumn={draggingColumn}
								setHoveredColumn={setHoveredColumn}
								setDraggingColumn={setDraggingColumn}
								onColumnOrderChange={onColumnOrderChange}
								enableDrag={groupedColumns.length > 1}
							/>
						))}

						{ungroupedColumns.map((column) => (
							<ColumnsMenuItem
								key={column.id}
								column={column}
								table={table}
								hoveredColumn={hoveredColumn}
								draggingColumn={draggingColumn}
								setHoveredColumn={setHoveredColumn}
								setDraggingColumn={setDraggingColumn}
								onColumnOrderChange={onColumnOrderChange}
								enableDrag
							/>
						))}

						{!!hiddenColumns.length && (
							<>
								<ContentTitle
									sx={{
										paddingLeft: '24px',
										marginTop: '18px',
										marginBottom: '18px',
									}}
								>
									Hidden Columns
								</ContentTitle>
								{hiddenColumns.map((column) => (
									<ColumnsMenuItem
										key={column.id}
										column={column}
										table={table}
										hoveredColumn={hoveredColumn}
										draggingColumn={draggingColumn}
										setHoveredColumn={setHoveredColumn}
										setDraggingColumn={setDraggingColumn}
										onColumnOrderChange={onColumnOrderChange}
									/>
								))}
							</>
						)}
					</Box>
				</>
			)}
		</Sidebar>
	)
}
