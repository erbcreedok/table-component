import React, { useCallback, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

import type {
	Table_Column,
	TableData,
	TableInstance,
	MultirowColumnsGroup,
} from '../../../../index'
import { ContentTitle } from '../../../../components/ContentTitle'
import { ButtonLink } from '../../../../components/ButtonLink'
import {
	reorderColumn,
	Table_DisplayColumnIdsArray,
} from '../../../../column.utils'
import { Sidebar } from '../../../../components/Sidebar'
import { TreeAngle } from '../../../../components/TreeAngle'
import { ConditionalBox } from '../../../../components/ConditionalBox'
import { Colors, TextColor } from '../../../../components/styles'
import { splitArrayItems } from '../../../../utils/splitArrayItems'

import { ColumnsMenuItem } from './ColumnsMenuItem'
import { ColumnsMenuGroupItem } from './ColumnsMenuGroupItem'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

export const defaultOrganizeColumnsMenu = <TData extends TableData = {}>(
	allColumns: Table_Column<TData>[]
) =>
	allColumns.filter(
		(col) => !(Table_DisplayColumnIdsArray as string[]).includes(col.id)
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
			multirowHeader,
			multirowColumnsDisplayDepth,
			organizeColumnsMenu = defaultOrganizeColumnsMenu,
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
					reorderColumn(draggedColumn, targetColumn, columnOrder)
				)
			}
		},
		[setColumnOrder, setGrouping]
	)

	const getMultirowHeaderGroups = useCallback(
		(
			columns: Table_Column<TData>[]
		): { text: string; columns: Table_Column<TData>[] }[] | [] => {
			if (multirowHeader) {
				let multirowDepthMatchingColumns
				const allMultirowColumns: string[] = []

				if (multirowColumnsDisplayDepth) {
					multirowDepthMatchingColumns = [...multirowHeader].filter(
						(el) => el.depth <= multirowColumnsDisplayDepth
					)

					const headerGroups = multirowDepthMatchingColumns
						.sort((a, b) => a.depth - b.depth)
						.reduce((acc, curr, index) => {
							curr.columns.forEach((el) => {
								const subGroups: string[] = []
								if (curr.depth < multirowColumnsDisplayDepth) {
									multirowDepthMatchingColumns
										.filter(
											(multiCols) =>
												multiCols.depth <= multirowColumnsDisplayDepth &&
												multiCols.depth === curr.depth + 1
										)
										.forEach((multiCols) => {
											multiCols.columns.forEach((cols) => {
												if (
													cols.columnIds.filter((colId) =>
														el.columnIds.includes(colId)
													).length === cols.columnIds.length
												) {
													subGroups.push(cols.text)
												}
											})
										})
								}

								acc[el.text] = {
									text: el.text,
									columns: el.columnIds?.map((colId) => {
										if (!allMultirowColumns.includes(colId)) {
											allMultirowColumns.push(colId)
										}

										return columns.find((col) => col.id === colId)
									}),
									isFinalGroup: multirowColumnsDisplayDepth === curr.depth,
									depth: index,
									subGroups,
								}

								return el
							})

							return acc
						}, {})

					const subGroupsKeys: string[] = []
					for (const key in headerGroups) {
						if (headerGroups[key].subGroups.length) {
							headerGroups[key].subGroups.forEach((subGroup: string) => {
								subGroupsKeys.push(subGroup)
							})
						}
					}

					const nonMultiheaderGroup = {
						text: '',
						columns: columns.filter(
							(column) => !allMultirowColumns.includes(column.id)
						),
					}

					const getSubGroups = (subGroupsKeys) => {
						return subGroupsKeys.map((key) => headerGroups[key])
					}

					const getHeaderGroupsWithSubgroups = (groups) => {
						const groupsArray = Array.isArray(groups)
							? groups
							: Object.values(groups)
						const result = groupsArray.reduce((acc, curr) => {
							if (curr.subGroups.length) {
								const formedSubGroups = getHeaderGroupsWithSubgroups(
									getSubGroups(curr.subGroups)
								)
								acc.push({
									...curr,
									subGroups: formedSubGroups,
								})
							} else {
								acc.push(curr)
							}

							return acc
						}, [])

						return result
					}

					return [
						...getHeaderGroupsWithSubgroups(headerGroups).filter(
							(group) => !subGroupsKeys.includes(group.text)
						),
						nonMultiheaderGroup,
					]
				}

				const multirowHeaderColumns = [...multirowHeader]
					.sort((a, b) => a.depth - b.depth)
					.reduce((multirowColumns, header) => {
						const columnsWithDepth = header.columns.map((col) => ({
							...col,
							depth: header.depth,
						}))
						multirowColumns.push(...columnsWithDepth)

						return multirowColumns
					}, [] as { text: string; columnIds: string[] }[])

				const multirowHeaderGroups = columns.reduce(
					(multirowGroups, column) => {
						const groupName = multirowHeaderColumns
							.filter((el) => el.columnIds.includes(column.id))
							.map((el) => el.text)
							.join(' - ')

						multirowGroups[groupName] = {
							text: groupName,
							columns: multirowGroups[groupName]?.columns
								? [...multirowGroups[groupName].columns, column]
								: [column],
						}

						return multirowGroups
					},
					{}
				)

				return Object.values(multirowHeaderGroups)
			}

			return []
		},
		[multirowColumnsDisplayDepth, multirowHeader]
	)

	const getMultirowHeaderTree = ({ multirowGroups, targetColumnIds }) => {
		if (multirowGroups) {
			return multirowGroups.reduce((acc, curr) => {
				if (curr.columns.some((col) => targetColumnIds.includes(col.id))) {
					if (!curr.isFinalGroup) {
						curr.subGroups = getMultirowHeaderTree({
							multirowGroups: curr.subGroups,
							targetColumnIds,
						})
					}
					acc.push(curr)
				}

				return acc
			}, [])
		}

		return multirowGroups
	}

	const renderMultirowTree = ({
		multirowGroups,
		drawVerticalLine = false,
		showHidden = false,
	}) => {
		return multirowGroups.map((group, index) => (
			<Box
				key={`${index}-${group.text}`}
				sx={{
					ml: `${(group?.depth ?? 0) * 10}px`,
					borderLeft:
						group.depth > 1 && drawVerticalLine
							? `solid 1px ${Colors.Gray}`
							: 'none',
				}}
			>
				{!group.isFinalGroup && (
					<ConditionalBox
						condition={group?.subGroups?.length && group.depth !== 0}
						sx={{ display: 'flex' }}
					>
						{group?.subGroups?.length && group.depth !== 0 && (
							<TreeAngle
								lastInList={multirowGroups.length === index + 1}
								sx={{ pl: '20px' }}
							/>
						)}
						<Typography
							key={group.text}
							sx={{
								maxWidth: '300px',
								padding: `6px ${
									group?.subGroups?.length && group.depth !== 0 ? '0px' : '24px'
								}`,
								color: TextColor.Primary,
								fontSize: '14px',
								fontWeight: 400,
							}}
						>
							{group.text}
						</Typography>
					</ConditionalBox>
				)}
				{group.isFinalGroup ? (
					<ColumnsMenuGroupItem
						key={group.text}
						columnsGroup={group.columns}
						columnsGroupText={group.text}
						table={table}
						renderTreeAngle={group.depth > 0}
						isLastInList={multirowGroups.length === index + 1}
					/>
				) : group?.subGroups?.length ? (
					renderMultirowTree({
						multirowGroups: group.subGroups,
						drawVerticalLine: index + 1 < multirowGroups.length,
					})
				) : (
					group.columns
						.filter((col) =>
							showHidden ? !col.getIsVisible() : col.getIsVisible()
						)
						.map((column, i) => (
							<ColumnsMenuItem
								key={column.id}
								column={column}
								table={table}
								hoveredColumn={hoveredColumn}
								draggingColumn={draggingColumn}
								setHoveredColumn={setHoveredColumn}
								setDraggingColumn={setDraggingColumn}
								onColumnOrderChange={onColumnOrderChange}
								isLastInList={group.columns.length === i + 1}
								renderTreeAngle={group.text}
								enableDrag
							/>
						))
				)}
			</Box>
		))
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
								<ButtonLink onClick={handleHideAllClick}>Hide All</ButtonLink>
								<ButtonLink onClick={handleShowAllClick}>Show All</ButtonLink>
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

						{multirowHeader
							? renderMultirowTree({
									multirowGroups: getMultirowHeaderTree({
										multirowGroups: getMultirowHeaderGroups(allColumns),
										targetColumnIds: visibleColumns.map(({ id }) => id),
									}),
							  })
							: ungroupedColumns.map((column) => (
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
								{multirowHeader
									? renderMultirowTree({
											multirowGroups: getMultirowHeaderTree({
												multirowGroups: getMultirowHeaderGroups(allColumns),
												targetColumnIds: hiddenColumns.map(({ id }) => id),
											}),
											showHidden: true,
									  })
									: hiddenColumns.map((column) => (
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
