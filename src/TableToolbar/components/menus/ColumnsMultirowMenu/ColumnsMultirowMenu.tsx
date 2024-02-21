import React, { useCallback, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

import { MultirowHeader, MultirowHeaderRow } from 'src/TableComponent'

import type {
	Table_Column,
	TableData,
	TableInstance,
	MultirowColumnsGroup,
	MultirowColumn,
} from '../../../../index'
import { ContentTitle } from '../../../../components/ContentTitle'
import { ButtonLink } from '../../../../components/ButtonLink'
import {
	reorderColumn,
	reorderColumnSet,
	Table_DisplayColumnIdsArray,
} from '../../../../column.utils'
import { Sidebar } from '../../../../components/Sidebar'
import { Colors, TextColor } from '../../../../components/styles'
import { getMultirowHeaderGroupLeafColumnIds } from '../../../../utils/getMultirowHeaderGroupLeafColumnIds'
import { getValidColumnOrder } from '../../../../utils/getValidColumnOrder'
import { arrayHasAll } from '../../../../utils/arrayHasAll'
import { splitArrayItems } from '../../../../utils/splitArrayItems'
import { getColumnsFilteredByDisplay } from '../../../../utils/getFilteredByDisplay'
import { getTestAttributes } from '../../../../utils/getTestAttributes'
import { withNativeEvent } from '../../../../utils/withNativeEvent'
import { makeMultirowColumns } from '../../../../utils/makeMultirowColumns'
import { ColumnsMenuItem } from '../ColumnsMenu/ColumnsMenuItem'

import { ColumnsMultirowMenuGroupItem } from './ColumnsMultirowMenuGroupItem'
import { MultirowColumnDef, MultirowColumnParent } from './multirowMenu.types'
import { MultiRowTree } from './MultiRowTree'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

export const defaultOrganizeColumnsMenu = <TData extends TableData = {}>(
	allColumns: Table_Column<TData>[]
) =>
	getColumnsFilteredByDisplay(
		allColumns.filter((col) => !Table_DisplayColumnIdsArray.includes(col.id))
	)

export const ColumnsMultirowMenu = <TData extends TableData = {}>({
	anchorEl,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const {
		getAllLeafColumns,
		setColumnOrder,
		setGrouping,
		getState,
		options: {
			localization,
			innerTable,
			multirowHeader: multirowHeaderDef,
			multirowColumnsDisplayDepth,
			organizeColumnsMenu = defaultOrganizeColumnsMenu,
			e2eLabels,
		},
	} = table
	const { columnOrder } = getState()
	const [multirowColumnIds, multirowHeader, isLeafDepth] = useMemo(() => {
		if (!multirowHeaderDef) return [[], [], false]
		const lastRow = multirowHeaderDef[multirowHeaderDef?.length - 1]
		// add custom multirow group filled with leaf columns
		const multirowColumnIds = getMultirowHeaderGroupLeafColumnIds(lastRow)
		const columnsRow: MultirowHeaderRow = {
			depth: lastRow.depth + 1,
			columns: getColumnsFilteredByDisplay(getAllLeafColumns())
				.filter((column) => multirowColumnIds.includes(column.id))
				.map((column) => ({
					text: column.columnDef.header ?? column.id,
					shorthandText: column.columnDef.shortHeader,
					columnIds: [column.id],
				})),
		}

		return [
			multirowColumnIds,
			[...multirowHeaderDef, columnsRow],
			(multirowColumnsDisplayDepth ?? 0) > lastRow.depth,
		]
	}, [getAllLeafColumns, multirowColumnsDisplayDepth, multirowHeaderDef])
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
	const [searchList, setsearchList] = useState<
		Table_Column<TData>[] | MultirowColumnsGroup[]
	>([])
	const allColumns = organizeColumnsMenu(getAllLeafColumns())
	if (!isLeafDepth) {
		allColumns.sort(
			(a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id)
		)
	}

	const [visibleColumns, hiddenColumns] = splitArrayItems(allColumns, (col) =>
		col.getIsVisible()
	)

	const [groupedColumns, ungroupedColumns] = useMemo(
		() =>
			splitArrayItems(visibleColumns, (col) =>
				isLeafDepth
					? col.getIsGrouped()
					: !multirowColumnIds.includes(col.id) && col.getIsGrouped()
			),
		[isLeafDepth, multirowColumnIds, visibleColumns]
	)

	const [hoveredColumn, setHoveredColumn] =
		useState<Table_Column<TData> | null>(null)
	const [draggingColumn, setDraggingColumn] =
		useState<Table_Column<TData> | null>(null)
	const [hoveredGroup, setHoveredGroup] =
		useState<MultirowColumnParent<TData> | null>(null)
	const [draggingGroup, setDraggingGroup] =
		useState<MultirowColumnParent<TData> | null>(null)

	const visibleColumnsCount = visibleColumns.length
	const hiddenColumnsCount = hiddenColumns.length

	const handleCloseClick = () => setAnchorEl(null)

	const handleOnSearchChange = (value: string) => {
		if (value) {
			setIsSearchActive(true)
		} else {
			setIsSearchActive(false)
		}

		if (multirowHeader && multirowColumnsDisplayDepth) {
			const multirowDepthMatchingRow =
				multirowHeader.find(
					(multiRow) => multiRow.depth === multirowColumnsDisplayDepth
				) ?? multirowHeader[0]
			const multirowColumns = makeMultirowColumns(
				allColumns,
				multirowDepthMatchingRow,
				table as TableInstance
			)

			const multirowGroups = multirowColumns.filter((el) => el.text)
			const nonMultirowGroups = multirowColumns.filter((el) => !el.text)

			const multirowGroupsWithColumns = multirowGroups.map((col) => ({
				...col,
				columns: replaceColIds(col.colIds, allColumns),
			}))
			const nonMultirowColumns = nonMultirowGroups
				.map((col) => replaceColIds(col.colIds, allColumns))
				.flat()

			setsearchList(
				value.length
					? [
							...multirowGroupsWithColumns.filter((group) =>
								group.text.toLowerCase().includes(value)
							),
							...nonMultirowColumns.filter(
								(col: { columnDef: { header: string } }) =>
									col.columnDef.header.toLowerCase().includes(value)
							),
					  ]
					: []
			)
		}
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
		[setColumnOrder, setGrouping, table.options]
	)

	const onColumnGroupOrderChange = useCallback(
		(
			draggedGroup: MultirowColumnParent<TData>,
			targetGroup: MultirowColumnParent<TData>
		) => {
			const draggedColumns = draggedGroup.columns
			const targetColumns = targetGroup.columns
			if (!draggedColumns || !targetColumns) return
			if (targetColumns.some((col) => col.getIsGrouped())) {
				setGrouping((grouping) =>
					reorderColumnSet(draggedColumns, targetColumns, grouping)
				)
			} else {
				setColumnOrder((columnOrder) => {
					const newOrder = reorderColumnSet(
						draggedColumns,
						targetColumns,
						getValidColumnOrder(table.options, columnOrder)
					)

					return newOrder
				})
			}
		},
		[setColumnOrder, setGrouping, table.options]
	)

	const itemDraggingProps = {
		hoveredColumn,
		draggingColumn,
		setHoveredColumn,
		setDraggingColumn,
		onColumnOrderChange,
	}

	const groupDraggingProps = {
		hoveredGroup,
		draggingGroup,
		setHoveredGroup,
		setDraggingGroup,
		onColumnGroupOrderChange,
	}
	const draggingProps = {
		...itemDraggingProps,
		...groupDraggingProps,
	}

	const findParent = useCallback(
		(
			targetColumn: MultirowColumnDef,
			multirowHeader: MultirowHeader,
			multirowColumnsDisplayDepth: number
		): MultirowColumnParent<TData> => {
			const parentRow =
				multirowHeader.find(
					(multiRow: { depth: number }) =>
						multiRow.depth === multirowColumnsDisplayDepth - 1
				) ?? multirowHeader[0]

			const parentColumn = parentRow.columns.filter(
				(column: { columnIds: any }) =>
					arrayHasAll(column.columnIds, targetColumn.colIds)
			)[0]

			const result: MultirowColumnParent<TData> = {
				text: parentColumn.shorthandText ?? parentColumn.text,
				id: parentColumn.shorthandText ?? parentColumn.text,
				colIds: parentColumn.columnIds,
				parent: null,
			}

			result.parent =
				multirowColumnsDisplayDepth - 1 > 1
					? findParent(result, multirowHeader, multirowColumnsDisplayDepth - 1)
					: null

			return result
		},
		[]
	)

	const addMultirowColumnsParents = useCallback(
		(
			multirowHeader: MultirowHeader,
			multirowColumns: MultirowColumn[],
			multirowColumnsDisplayDepth: number
		): (MultirowColumn | MultirowColumnParent<TData>)[] => {
			if (multirowColumnsDisplayDepth > 1) {
				return multirowColumns.map((col: MultirowColumn) => {
					if (!col.text) {
						return col
					}

					const parentColumn = findParent(
						col,
						multirowHeader,
						multirowColumnsDisplayDepth
					)

					return {
						...col,
						parent: parentColumn,
					}
				})
			}

			return multirowColumns.map((col: any) => ({
				...col,
				parent: null,
			}))
		},
		[findParent]
	)

	const replaceColIds = (colIds: any[], columns: any[]) => {
		return colIds.map((id: any) =>
			columns.find((column: { id: any }) => column.id === id)
		)
	}

	const getMultirowHeaderGroups = useCallback(
		(columns) => {
			if (multirowHeader && multirowColumnsDisplayDepth) {
				const multirowDepthMatchingRow =
					multirowHeader.find(
						(multiRow) => multiRow.depth === multirowColumnsDisplayDepth
					) ?? multirowHeader[0]

				const multirowColumns = makeMultirowColumns(
					columns,
					multirowDepthMatchingRow,
					table as TableInstance
				)

				const multirowColumnsWithParents = addMultirowColumnsParents(
					multirowHeader,
					multirowColumns,
					multirowColumnsDisplayDepth
				)

				return multirowColumnsWithParents.map(
					(col: MultirowColumnParent<TData>) => ({
						...col,
						columns: replaceColIds(col.colIds, columns),
					})
				)
			}

			return null
		},
		[
			addMultirowColumnsParents,
			multirowColumnsDisplayDepth,
			multirowHeader,
			table,
		]
	)

	const [ungroupedHeaderGroups, hiddenHeaderGroups] = useMemo(() => {
		return [
			getMultirowHeaderGroups(ungroupedColumns),
			getMultirowHeaderGroups(hiddenColumns),
		]
	}, [getMultirowHeaderGroups, ungroupedColumns, hiddenColumns])

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
				multirowHeader && searchList.length ? (
					searchList.map((item) => {
						if (item.text) {
							return (
								<ColumnsMultirowMenuGroupItem
									key={item.id}
									group={item}
									table={table}
									depth={1}
									enableDrag
									{...groupDraggingProps}
									drawAngle={false}
								/>
							)
						}

						return (
							<ColumnsMenuItem
								key={item.id}
								column={item}
								table={table}
								enableDrag
								{...itemDraggingProps}
							/>
						)
					})
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
							maxHeight: 'calc(100vh - 180px)',
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
								enableDrag={groupedColumns.length > 1}
								{...itemDraggingProps}
							/>
						))}

						{ungroupedHeaderGroups && (
							<MultiRowTree
								multirowGroups={ungroupedHeaderGroups}
								table={table}
								enableDrag
								multirowColumnsDisplayDepth={multirowColumnsDisplayDepth ?? 1}
								{...draggingProps}
							/>
						)}

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
								{hiddenHeaderGroups && (
									<MultiRowTree
										multirowGroups={hiddenHeaderGroups}
										table={table}
										enableDrag
										multirowColumnsDisplayDepth={
											multirowColumnsDisplayDepth ?? 1
										}
										{...draggingProps}
									/>
								)}
							</>
						)}
					</Box>
				</>
			)}
		</Sidebar>
	)
}
