import React, { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { Typography } from '@mui/material'

import type { Table_Column, TableInstance } from '../../../../index'
import { ContentTitle } from '../../../../components/ContentTitle'
import { ButtonLink } from '../../../../components/ButtonLink'
import { reorderColumn } from '../../../../column.utils'
import { SidebarSearchComponent } from '../components/SidebarSearch'
import { SidebarHeaderComponent } from '../components/SIdebarHeader'

import { SettingsMenuItem } from './SettingsMenuItem'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

export const SettingsMenu = <TData extends Record<string, any> = {}>({
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
	} = table
	const { columnOrder, columnPinning, columnVisibility, grouping } = getState()
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
					getCenterLeafColumns().find((col) => col?.id === colId)
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
			.map((col) => col.id),
		hidden: allColumns
			.filter((column) => !column.getIsVisible())
			.map((col) => col.id),
	})

	const groupedList = useMemo(
		() =>
			grouping.map((colId) =>
				getCenterLeafColumns().find((col) => col?.id === colId)
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
				prev.shown = [...prev.shown, column.columnDef.accessorKey]
				prev.hidden = [
					...prev.hidden.filter((id) => id !== column.columnDef.accessorKey),
				]
			} else {
				prev.shown = [
					...prev.shown.filter((id) => id !== column.columnDef.accessorKey),
				]
				prev.hidden = [column.columnDef.accessorKey, ...prev.hidden]
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

	const handleCloseCLick = () => setAnchorEl(null)

	const handleHideAllClick = () => {
		allColumns
			.filter((col) => col.columnDef.enableHiding)
			.forEach((col) => col.toggleVisibility(false))
		const required = allColumns
			.filter((col) => !col.columnDef.enableHiding)
			.map((col) => col.columnDef.accessorKey)

		setColumnIds((prev) => ({
			shown: [...required],
			hidden: [
				...prev.shown.filter((id) => !required.includes(id)),
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
		setSearchList(
			value.length >= 3
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
		<Drawer
			anchor="right"
			open={!!anchorEl}
			onClose={handleCloseCLick}
			transitionDuration={400}
		>
			<Box sx={{ minWidth: 660 }}>
				<SidebarHeaderComponent
					title="Table Column Settings"
					subHeader={
						<Typography>
							Shown: {visibleColumnsCount} of {allColumns.length}
						</Typography>
					}
					onClick={handleCloseCLick}
				/>
				<SidebarSearchComponent onChange={handleOnSearchChange} />

				{searchList.length > 0 ? (
					searchList.map((column, index) => (
						<SettingsMenuItem
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
					<>
						<Box
							sx={{
								display: 'flex',
								padding: '12px 24px',
								alignItems: 'center',
								justifyContent: 'space-between',
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
							{groupedList.map((column, index) => (
								<SettingsMenuItem
									allColumns={allColumns}
									column={column}
									hoveredColumn={hoveredColumn}
									isSubMenu={false}
									key={`${index}-${column.id}`}
									setHoveredColumn={setHoveredColumn}
									table={table}
									onColumnVisibilityChange={onColumnVisibilityChange}
									enableDrag
									onColumnOrderChange={onColumnGroupingChange}
								/>
							))}

							{allColumns
								.filter(
									(col) =>
										columnIds.shown.includes(col.columnDef.accessorKey) &&
										!grouping.includes(col.columnDef.accessorKey)
								)
								.map((column, index) => (
									<SettingsMenuItem
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
											columnIds.hidden.includes(col.columnDef.accessorKey)
										)
										.map((column, index) => (
											<SettingsMenuItem
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
			</Box>
		</Drawer>
	)
}
