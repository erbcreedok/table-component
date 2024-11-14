import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import React, { useCallback, useMemo, useState } from 'react'

import {
	reorderColumn,
	Table_DisplayColumnIdsArray,
} from '../../../../column.utils'
import {
	ButtonLink,
	Colors,
	ContentTitle,
	SidebarPropsWithOnCloseEnd,
	SidebarWithMuiProps,
	Table_Column,
	TableData,
	TableInstance,
	TextColor,
} from '../../../../index'
import { createComponentWithMuiProps } from '../../../../utils/createComponentWithMuiProps'
import { getTestAttributes } from '../../../../utils/getTestAttributes'
import { getValidColumnOrder } from '../../../../utils/getValidColumnOrder'
import { getValueOrFunctionHandler } from '../../../../utils/getValueOrFunctionHandler'
import { isColumnDisplayed } from '../../../../utils/isColumnDisplayed'
import { mergeMuiProps } from '../../../../utils/mergeMuiProps'
import { splitArrayItems } from '../../../../utils/splitArrayItems'
import { withNativeEvent } from '../../../../utils/withNativeEvent'

import { ColumnsMenuItem } from './ColumnsMenuItem'

export interface ColumnsMenuProps<TData = TableData> {
	anchorEl: HTMLElement | null
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
	sidebarProps?: SidebarPropsWithOnCloseEnd
}

export const defaultOrganizeColumnsMenu = (allColumns: Table_Column[]) => {
	return allColumns.filter(
		(col) =>
			!Table_DisplayColumnIdsArray.includes(col.id) && isColumnDisplayed(col)
	)
}

export const ColumnsMenu = ({
	anchorEl,
	setAnchorEl,
	table,
	sidebarProps,
}: ColumnsMenuProps) => {
	const {
		getAllLeafColumns,
		setColumnOrder,
		setColumnPinning,
		setGrouping,
		options: {
			localization,
			innerTable,
			organizeColumnsMenu = defaultOrganizeColumnsMenu,
			e2eLabels,
		},
	} = table
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
	const [searchList, setSearchList] = useState<Array<Table_Column>>([])
	const allColumns = organizeColumnsMenu(getAllLeafColumns(), table)

	const [visibleColumns, hiddenColumns] = splitArrayItems(allColumns, (col) =>
		col.getIsVisible()
	)

	const [hoveredColumn, setHoveredColumn] = useState<Table_Column | null>(null)
	const [draggingColumn, setDraggingColumn] = useState<Table_Column | null>(
		null
	)

	const visibleColumnsCount = visibleColumns.length
	const hiddenColumnsCount = hiddenColumns.length

	const onCloseEnd = sidebarProps?.onCloseEnd
	const handleCloseClick = useCallback(() => {
		setAnchorEl(null)
		onCloseEnd?.()
	}, [setAnchorEl, onCloseEnd])

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
		table.toggleAllColumnsVisible(false)
	}

	const handleShowAllClick = () => {
		table.toggleAllColumnsVisible(true)
	}

	const onColumnOrderChange = useCallback(
		(draggedColumn: Table_Column, targetColumn: Table_Column) => {
			const pinPosition = targetColumn.getIsPinned()
			if (targetColumn.getIsGrouped()) {
				setGrouping((grouping) =>
					reorderColumn(draggedColumn, targetColumn, grouping)
				)
			} else if (pinPosition) {
				setColumnPinning((columnPinning) => ({
					...columnPinning,
					[pinPosition]: reorderColumn(
						draggedColumn,
						targetColumn,
						columnPinning[pinPosition] ?? []
					),
				}))
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
		[setGrouping, setColumnPinning, setColumnOrder, table.options]
	)

	const enableDrag = useMemo(() => {
		const enableForGrouped =
			visibleColumns.filter((col) => col.getIsGrouped() && !col.getIsPinned())
				.length > 1
		const enableForPinned = {
			left:
				visibleColumns.filter(
					(col) => col.getIsPinned() === 'left' && !col.getIsGrouped()
				).length > 1,
			right:
				visibleColumns.filter(
					(col) => col.getIsPinned() === 'right' && !col.getIsGrouped()
				).length > 1,
		}
		const enableForDefault =
			visibleColumns.filter(
				(col) =>
					!col.getIsPinned() &&
					!col.getIsGrouped() &&
					col.columnDef.enableColumnOrdering !== false
			).length > 1

		return (column: Table_Column): boolean => {
			const pinPosition = column.getIsPinned()
			if (column.getIsGrouped()) return enableForGrouped
			if (pinPosition) return enableForPinned[pinPosition]
			if (column.columnDef.enableColumnOrdering !== false)
				return enableForDefault

			return false
		}
	}, [visibleColumns])

	return (
		<SidebarWithMuiProps
			table={table as TableInstance}
			open={!!anchorEl}
			onClose={handleCloseClick}
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
			{...sidebarProps}
			PaperProps={mergeMuiProps(
				{ sx: { minWidth: 660 } },
				getTestAttributes(e2eLabels, 'sidebarColumns'),
				sidebarProps?.PaperProps
			)}
		>
			{isSearchActive ? (
				searchList.length ? (
					searchList.map((column) => (
						<ColumnsMenuItem key={column.id} column={column} table={table} />
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
							maxHeight: 'calc(100vh - 134px)',
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
						{visibleColumns.map((column) => (
							<ColumnsMenuItem
								key={column?.id}
								column={column}
								table={table}
								hoveredColumn={hoveredColumn}
								draggingColumn={draggingColumn}
								setHoveredColumn={setHoveredColumn}
								setDraggingColumn={setDraggingColumn}
								onColumnOrderChange={onColumnOrderChange}
								enableDrag={enableDrag(column)}
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
									/>
								))}
							</>
						)}
					</Box>
				</>
			)}
		</SidebarWithMuiProps>
	)
}

export const ColumnsMenuWithMuiProps = createComponentWithMuiProps(
	ColumnsMenu,
	({ table }) =>
		getValueOrFunctionHandler(table.options.muiColumnsMenuProps)({
			table,
		})
)
