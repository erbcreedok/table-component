import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useCallback, useMemo, useState } from 'react'

import { MultirowHeader, MultirowHeaderRow } from '../../../../TableComponent'
import { reorderColumn, reorderColumnSet } from '../../../../column.utils'
import {
	ButtonLink,
	ContentTitle,
	SidebarPropsWithOnCloseEnd,
	SidebarWithMuiProps,
	Colors,
	TextColor,
	MultirowColumn,
	MultirowColumnsGroup,
	Table_Column,
	TableData,
	TableInstance,
} from '../../../../'
import { arrayHasAll } from '../../../../utils/arrayHasAll'
import { createComponentWithMuiProps } from '../../../../utils/createComponentWithMuiProps'
import { isColumnDisplayed } from '../../../../utils/isColumnDisplayed'
import { getMultirowHeaderGroupLeafColumnIds } from '../../../../utils/getMultirowHeaderGroupLeafColumnIds'
import { getTestAttributes } from '../../../../utils/getTestAttributes'
import { getValidColumnOrder } from '../../../../utils/getValidColumnOrder'
import { getValueOrFunctionHandler } from '../../../../utils/getValueOrFunctionHandler'
import { makeMultirowColumns } from '../../../../utils/makeMultirowColumns'
import { mergeMuiProps } from '../../../../utils/mergeMuiProps'
import { splitArrayItems } from '../../../../utils/splitArrayItems'
import { withNativeEvent } from '../../../../utils/withNativeEvent'
import { defaultOrganizeColumnsMenu } from '../ColumnsMenu/ColumnsMenu'
import { ColumnsMenuItem } from '../ColumnsMenu/ColumnsMenuItem'

import { ColumnsMultirowMenuGroupItem } from './ColumnsMultirowMenuGroupItem'
import { MultirowColumnDef, MultirowColumnParent } from './multirowMenu.types'
import { MultiRowTree } from './MultiRowTree'

export interface ColumnsMultirowMenuProps<TData extends TableData = {}> {
	anchorEl: HTMLElement | null
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
	sidebarProps?: SidebarPropsWithOnCloseEnd
}

export const ColumnsMultirowMenu = <TData extends TableData = {}>({
	anchorEl,
	setAnchorEl,
	table,
	sidebarProps,
}: ColumnsMultirowMenuProps<TData>) => {
	const {
		getAllLeafColumns,
		setColumnOrder,
		setColumnPinning,
		setGrouping,
		options: {
			localization,
			innerTable,
			multirowHeader: multirowHeaderDef,
			multirowColumnsDisplayDepth,
			organizeColumnsMenu = defaultOrganizeColumnsMenu,
			e2eLabels,
		},
	} = table
	const [multirowColumnIds, multirowHeader, isLeafDepth] = useMemo(() => {
		if (!multirowHeaderDef) return [[], [], false]
		const lastRow = multirowHeaderDef[multirowHeaderDef?.length - 1]
		// add custom multirow group filled with leaf columns
		const multirowColumnIds = getMultirowHeaderGroupLeafColumnIds(lastRow)
		const columnsRow: MultirowHeaderRow = {
			depth: lastRow.depth + 1,
			columns: getAllLeafColumns()
				.filter(
					(column) =>
						multirowColumnIds.includes(column.id) && isColumnDisplayed(column)
				)
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
	const allColumns = organizeColumnsMenu(getAllLeafColumns(), table)
	const [visibleColumns, hiddenColumns] = splitArrayItems(allColumns, (col) =>
		col.getIsVisible()
	)

	const [leftColumns, middleColumns, rightColumns] = useMemo(
		() =>
			visibleColumns.reduce(
				(acc, col) => {
					const isParentColumn =
						!isLeafDepth && multirowColumnIds.includes(col.id)
					const isLeftColumn =
						!isParentColumn &&
						(col.getIsGrouped() || col.getIsPinned() === 'left')
					const isRightColumn = !isParentColumn && col.getIsPinned() === 'right'
					if (isLeftColumn) {
						acc[0].push(col)
					} else if (!isRightColumn) {
						acc[1].push(col)
					} else {
						acc[2].push(col)
					}

					return acc
				},
				[[], [], []] as Table_Column<TData>[][]
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
		table.toggleAllColumnsVisible(false)
	}

	const handleShowAllClick = () => {
		table.toggleAllColumnsVisible(true)
	}

	const onColumnOrderChange = useCallback(
		(draggedColumn: Table_Column<TData>, targetColumn: Table_Column<TData>) => {
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
		[setColumnOrder, setColumnPinning, setGrouping, table.options]
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

	const [visibleHeaderGroups, hiddenHeaderGroups] = useMemo(() => {
		return [
			getMultirowHeaderGroups(middleColumns),
			getMultirowHeaderGroups(hiddenColumns),
		]
	}, [getMultirowHeaderGroups, middleColumns, hiddenColumns])

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

						{leftColumns.map((column) => (
							<ColumnsMenuItem
								key={column?.id}
								column={column}
								table={table}
								enableDrag={leftColumns.length > 1}
								{...itemDraggingProps}
							/>
						))}

						{visibleHeaderGroups && (
							<MultiRowTree
								multirowGroups={visibleHeaderGroups}
								table={table}
								enableDrag
								multirowColumnsDisplayDepth={multirowColumnsDisplayDepth ?? 1}
								{...draggingProps}
							/>
						)}

						{rightColumns.map((column) => (
							<ColumnsMenuItem
								key={column?.id}
								column={column}
								table={table}
								enableDrag={leftColumns.length > 1}
								{...itemDraggingProps}
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
		</SidebarWithMuiProps>
	)
}

export const ColumnsMultirowMenuWithMuiProps = createComponentWithMuiProps(
	ColumnsMultirowMenu,
	({ table }) =>
		getValueOrFunctionHandler(table.options.muiColumnsMenuProps)({
			table,
		})
)
