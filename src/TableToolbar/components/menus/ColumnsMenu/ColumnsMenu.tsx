import React, { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

import type { Table_Column, TableInstance } from '../../../../index'
import { ContentTitle } from '../../../../components/ContentTitle'
import { ButtonLink } from '../../../../components/ButtonLink'
import { getColumnId, reorderColumn } from '../../../../column.utils'
import { Sidebar } from '../../../../components/Sidebar'
import { Text } from '../../../../components/styles'

import { ColumnsMenuItem } from './ColumnsMenuItem'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

export const ColumnsMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const {
		getAllColumns,
		getCenterLeafColumns,
		getLeftLeafColumns,
		getRightLeafColumns,
		getState,
		setColumnOrder,
		setGrouping,
		options: { localization },
	} = table
	const { columnOrder, columnPinning, columnVisibility, grouping } = getState()
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
	const [searchList, setSearchList] = useState<Array<Table_Column<TData>>>([])

	const allColumns = useMemo(() => {
		const columns = getAllColumns()

		if (
			columnOrder.length > 0 &&
			!columns.some((col) => col.columnDef.columnDefType === 'group')
		) {
			return [
				...getLeftLeafColumns(),
				...Array.from(new Set(columnOrder)).map((colId) =>
					getCenterLeafColumns().find(
						(col) => getColumnId(col.columnDef) === colId
					)
				),
				...getRightLeafColumns(),
			].filter(Boolean)
		}

		return columns
	}, [
		columnOrder,
		columnPinning,
		columnVisibility,
		getAllColumns,
		getCenterLeafColumns,
		getLeftLeafColumns,
		getRightLeafColumns,
	]) as Array<Table_Column<TData>>

	const [columnIds, setColumnIds] = useState({
		shown: allColumns
			.filter((column) => column.getIsVisible())
			.map((col) => getColumnId(col.columnDef)),
		hidden: allColumns
			.filter((column) => !column.getIsVisible())
			.map((col) => getColumnId(col.columnDef)),
	})

	const groupedList = useMemo(
		() =>
			grouping.map((colId) =>
				getCenterLeafColumns().find(
					(col) => getColumnId(col.columnDef) === colId
				)
			),
		[grouping]
	)

	useEffect(() => {
		setColumnOrder([...columnIds.shown, ...columnIds.hidden])
	}, [columnIds])

	const onColumnVisibilityChange = (
		column: Table_Column<TData>,
		checked: boolean
	): void => {
		setColumnIds((prev) => {
			if (checked) {
				prev.shown = [
					...(prev.shown as string[]),
					getColumnId(column.columnDef),
				]
				prev.hidden = [
					...prev.hidden.filter((id) => id !== getColumnId(column.columnDef)),
				]
			} else {
				prev.shown = [
					...prev.shown.filter((id) => id !== getColumnId(column.columnDef)),
				]
				prev.hidden = [getColumnId(column.columnDef), ...prev.hidden]
			}

			return { ...prev }
		})
	}

	const [hoveredColumn, setHoveredColumn] =
		useState<Table_Column<TData> | null>(null)

	const visibleColumnsCount = allColumns.reduce((acc, item) => {
		// eslint-disable-next-line no-param-reassign
		acc += item.getIsVisible() ? 1 : 0

		return acc
	}, 0)

	const hiddenColumnsCount = allColumns.length - visibleColumnsCount

	const handleCloseClick = () => setAnchorEl(null)

	const handleHideAllClick = () => {
		allColumns
			.filter((col) => col.columnDef.enableHiding)
			.forEach((col) => col.toggleVisibility(false))
		const required = allColumns
			.filter((col) => !col.columnDef.enableHiding)
			.map((col) => getColumnId(col.columnDef))

		setColumnIds((prev) => ({
			shown: [...required] as string[],
			hidden: [
				...(prev.shown.filter((id) => !required.includes(id)) as string[]),
				...prev.hidden,
			],
		}))
	}

	const handleShowAllClick = () => {
		allColumns.forEach((col) => col.toggleVisibility(true))
		setColumnIds((prev) => ({
			shown: [...prev.shown, ...prev.hidden],
			hidden: [],
		}))
	}

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

	const onColumnOrderChange = (
		draggedColumn: Table_Column<TData>,
		targetColumn: Table_Column<TData>
	) => {
		setColumnIds((state) => ({
			...state,
			shown: reorderColumn(draggedColumn, targetColumn, columnIds.shown),
			hidden: state.hidden,
		}))
	}

	const onColumnGroupingChange = (
		draggedColumn: Table_Column<TData>,
		targetColumn: Table_Column<TData>
	) => {
		setGrouping((old) => reorderColumn(draggedColumn, targetColumn, old))
	}

	return (
		<Sidebar
			open={!!anchorEl}
			onClose={handleCloseClick}
			styles={{ minWidth: 660 }}
			withHeader
			headerTitle={localization.columns}
			subHeader={
				<Typography sx={{ color: Text.Primary }}>
					{visibleColumnsCount} columns shown, {hiddenColumnsCount} columns
					hidden
				</Typography>
			}
			withSearch
			onSearchChange={handleOnSearchChange}
		>
			{isSearchActive ? (
				searchList.length ? (
					searchList.map((column, index) => (
						<ColumnsMenuItem
							allColumns={allColumns}
							column={column}
							hoveredColumn={hoveredColumn}
							isSubMenu={false}
							key={`${index}-${column.id}`}
							setHoveredColumn={setHoveredColumn}
							table={table}
							onColumnVisibilityChange={onColumnVisibilityChange}
							enableDrag={false}
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
								backgroundColor: '#CED0DB',
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
						{groupedList.map((column, index) => (
							<ColumnsMenuItem
								allColumns={allColumns}
								column={column as Table_Column<TData>}
								hoveredColumn={hoveredColumn}
								isSubMenu={false}
								key={`${index}-${column?.id}`}
								setHoveredColumn={setHoveredColumn}
								table={table}
								onColumnVisibilityChange={onColumnVisibilityChange}
								enableDrag={groupedList.length > 1}
								onColumnOrderChange={onColumnGroupingChange}
							/>
						))}

						{allColumns
							.filter(
								(col) =>
									columnIds.shown.includes(getColumnId(col.columnDef)) &&
									!grouping.includes(getColumnId(col.columnDef))
							)
							.map((column, index) => (
								<ColumnsMenuItem
									allColumns={allColumns}
									column={column}
									hoveredColumn={hoveredColumn}
									isSubMenu={false}
									key={`${index}-${column.id}`}
									setHoveredColumn={setHoveredColumn}
									table={table}
									onColumnVisibilityChange={onColumnVisibilityChange}
									enableDrag
									onColumnOrderChange={onColumnOrderChange}
								/>
							))}

						{!!columnIds.hidden.length && (
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
								{allColumns
									.filter((col) =>
										columnIds.hidden.includes(getColumnId(col.columnDef))
									)
									.map((column, index) => (
										<ColumnsMenuItem
											allColumns={allColumns}
											column={column}
											hoveredColumn={hoveredColumn}
											isSubMenu={false}
											key={`${index}-${column.id}`}
											setHoveredColumn={setHoveredColumn}
											table={table}
											onColumnVisibilityChange={onColumnVisibilityChange}
											enableDrag={false}
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
