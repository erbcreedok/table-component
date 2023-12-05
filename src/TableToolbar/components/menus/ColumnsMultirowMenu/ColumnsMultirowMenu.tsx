import React, { useCallback, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

import { MultirowHeader } from 'src/TableComponent'

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
import { splitArrayItems } from '../../../../utils/splitArrayItems'
import { getColumnsFilteredByDisplay } from '../../../../utils/getFilteredByDisplay'
import { getTestAttributes } from '../../../../utils/getTestAttributes'
import { withNativeEvent } from '../../../../utils/withNativeEvent'
import { makeMultirowColumns } from '../../../../utils/makeMultirowColumns'
import { arrayHasAll } from '../../../../utils/arrayHasAll'
import { ColumnsMenuItem } from '../ColumnsMenu/ColumnsMenuItem'

import { ColumnsMultirowMenuGroupItem } from './ColumnsMultirowMenuGroupItem'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

type MultirowColumnParent<TData extends Record<string, any> = {}> = {
	text: string
	id: string
	colIds: string[]
	parent: MultirowColumnParent<TData> | null
	children?: MultirowColumnParent<TData>[] | null
	columns?: Table_Column<TData>[]
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
		options: {
			localization,
			innerTable,
			multirowHeader,
			multirowColumnsDisplayDepth,
			organizeColumnsMenu = defaultOrganizeColumnsMenu,
			e2eLabels,
		},
	} = table
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
	const [searchList, setsearchList] = useState<
		Table_Column<TData>[] | MultirowColumnsGroup[]
	>([])
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

	const [hoveredColumnsGroup, setHoveredColumnsGroup] = useState<
		Table_Column<TData>[] | null
	>(null)
	const [draggingColumnsGroup, setDraggingColumnsGroup] = useState<
		Table_Column<TData>[] | null
	>(null)

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
					reorderColumn(draggedColumn, targetColumn, columnOrder)
				)
			}
		},
		[setColumnOrder, setGrouping]
	)

	const onColumnSetOrderChange = useCallback(
		(
			draggedColumns: Table_Column<TData>[],
			targetColumns: Table_Column<TData>[]
		) => {
			if (targetColumns.some((col) => col.getIsGrouped())) {
				setGrouping((grouping) =>
					reorderColumnSet(draggedColumns, targetColumns, grouping)
				)
			} else {
				setColumnOrder((columnOrder) =>
					reorderColumnSet(draggedColumns, targetColumns, columnOrder)
				)
			}
		},
		[setColumnOrder, setGrouping]
	)

	const findParent = useCallback(
		(
			targetColumn: Omit<MultirowColumnParent<TData>, 'parent'>,
			multirowHeader: MultirowHeader,
			multirowColumnsDisplayDepth: number
		) => {
			const parentRow =
				multirowHeader.find(
					(multiRow: { depth: number }) =>
						multiRow.depth === multirowColumnsDisplayDepth - 1
				) ?? multirowHeader[0]

			const parentColumn = parentRow.columns.filter(
				(column: { columnIds: any }) => {
					return arrayHasAll(column.columnIds, targetColumn.colIds)
				}
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
		) => {
			if (multirowColumnsDisplayDepth > 1) {
				return multirowColumns.map(
					(col: { text: string; id: string; colIds: string[] }) => {
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
					}
				)
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

				return multirowColumnsWithParents.map((col: { colIds: any }) => ({
					...col,
					columns: replaceColIds(col.colIds, columns),
				}))
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

	const pullOutParents = (group) => {
		if (!group.parent) {
			return group
		}

		return [{ ...group, parent: group.parent.id }, pullOutParents(group.parent)]
	}

	const buildParentsTree = (
		items: MultirowColumnParent<TData>[],
		parent: string | null = null
	) => {
		const result: MultirowColumnParent<TData>[] = []

		items.forEach((item) => {
			if (!item.text) {
				result.push(item)

				return
			}

			if (item.parent === parent) {
				result.push(item)
				item.children = buildParentsTree(
					items.filter((el) => el.text),
					item.id
				)

				if (!item.children.length) {
					delete item.children
				}
			}
		})

		return result
	}

	const makeParentsTree = (groups) => {
		const flattenGroups = groups
			.reduce((acc, curr) => {
				acc.push(pullOutParents(curr))

				return acc
			}, [])
			.flat(Infinity)
			.reduce((arr, el) => {
				if (!arr.find(({ id }) => el.id === id)) {
					arr.push(el)
				}

				return arr
			}, [])

		return buildParentsTree(flattenGroups)
	}

	const drawTree = ({ groups, depth = 1 }) => {
		return groups.map((group, index) => {
			if (group.children && group.children.length) {
				return (
					<Box key={group.id} sx={{ position: 'relative' }}>
						{group.text && (
							<Typography
								key={group.text}
								sx={{
									maxWidth: '300px',
									padding: `6px ${depth * 24}px`,
									color: TextColor.Primary,
									fontSize: '14px',
									fontWeight: 400,
								}}
							>
								{group.text}
							</Typography>
						)}
						{/* vertical gray line and angle */}
						{depth > 1 && (
							<Box
								sx={{
									position: 'absolute',
									width: '16px',
									// position depends on previous group children
									height:
										index > 0
											? `${
													47 + (groups[index - 1].children?.length || 0) * 25
											  }px`
											: '22px',
									left: `${(depth - 1) * 24 + 2}px`,
									top:
										// position depends on previous group children
										index > 0
											? `-${
													31 + (groups[index - 1].children?.length || 0) * 25
											  }px`
											: '-6px',
									borderLeft: `1px solid ${Colors.Gray}`,
									borderBottom: `1px solid ${Colors.Gray}`,
									borderBottomLeftRadius: '3px',
								}}
							/>
						)}
						{drawTree({
							groups: group.children,
							depth: depth + 1,
						})}
					</Box>
				)
			}

			return (
				<Box key={group.id} sx={{ position: 'relative' }}>
					{/* vertical gray line */}
					<Box
						sx={{
							position: 'absolute',
							width: '1px',
							height: index > 0 ? '38px' : '24px',
							left: `${(depth - 1) * 24 + 2}px`,
							bottom: '18px',
							borderLeft: `1px solid ${Colors.Gray}`,
						}}
					/>
					<ColumnsMultirowMenuGroupItem
						columnsGroup={group.columns}
						columnsGroupText={group.text}
						table={table}
						hoveredColumns={hoveredColumnsGroup}
						draggingColumns={draggingColumnsGroup}
						setHoveredColumns={setHoveredColumnsGroup}
						setDraggingColumns={setDraggingColumnsGroup}
						onColumnOrderChange={onColumnSetOrderChange}
						depth={depth}
						enableDrag
						drawAngle={depth > 1 && index + 1 === groups.length}
					/>
				</Box>
			)
		})
	}

	const renderMultirowTree = ({ multirowGroups }) => {
		const parentsTree = makeParentsTree(multirowGroups)

		return parentsTree.map((group: MultirowColumnParent<TData>) => {
			if (!group.text && group.columns) {
				return group.columns.map((column: Table_Column<TData>) => (
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
				))
			}

			return drawTree({
				groups: [group],
				depth: 1,
			})
		})
	}

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
									key={item.text}
									columnsGroup={item.columns}
									columnsGroupText={item.shorthandText ?? item.text}
									table={table}
									hoveredColumns={hoveredColumnsGroup}
									draggingColumns={draggingColumnsGroup}
									setHoveredColumns={setHoveredColumnsGroup}
									setDraggingColumns={setDraggingColumnsGroup}
									onColumnOrderChange={onColumnSetOrderChange}
									depth={1}
									enableDrag
									drawAngle={false}
								/>
							)
						}

						return (
							<ColumnsMenuItem
								key={item.id}
								column={item}
								table={table}
								hoveredColumn={hoveredColumn}
								draggingColumn={draggingColumn}
								setHoveredColumn={setHoveredColumn}
								setDraggingColumn={setDraggingColumn}
								onColumnOrderChange={onColumnOrderChange}
								enableDrag
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
							maxHeight: 'calc(100vh - 180px)',
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

						{renderMultirowTree({
							multirowGroups: getMultirowHeaderGroups(ungroupedColumns),
						})}

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
								{renderMultirowTree({
									multirowGroups: getMultirowHeaderGroups(hiddenColumns),
								})}
							</>
						)}
					</Box>
				</>
			)}
		</Sidebar>
	)
}
