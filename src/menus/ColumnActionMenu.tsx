import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { FC, useEffect, useState } from 'react'
import { Button, Checkbox, Typography } from '@mui/material'

import type { Table_Header, TableInstance } from '..'
import { useFilterControls } from '../TableFiltersBar/filter-bar-hooks/useFilterControls'

import { ShowHideColumnsMenu } from './ShowHideColumnsMenu'

export const commonMenuItemStyles = {
	py: '6px',
	my: 0,
	justifyContent: 'space-between',
	alignItems: 'center',
}

export const commonListItemStyles = {
	display: 'flex',
	alignItems: 'center',
}

const QuickSorts = ({ columnDef, column, table, setVisible }) => {
	const {
		options: {
			enableColumnFilters,
			enableGrouping,
			enableHiding,
			enableSorting,
			enableMultiSort,
			icons: { ClearIcon, SortAscIcon, SortDescIcon },
			localization,
			renderColumnActionsMenuItems,
		},
	} = table

	const handleClearSort = () => {
		column.clearSorting()
		setVisible(false)
	}

	const handleSortAsc = () => {
		column.toggleSorting(false, enableMultiSort)
		setVisible(false)
	}

	const handleSortDesc = () => {
		column.toggleSorting(true, enableMultiSort)
		setVisible(false)
	}

	return (
		<>
			{columnDef.renderColumnActionsMenuItems?.({
				closeMenu: () => setVisible(false),
				column,
				table,
			}) ??
				renderColumnActionsMenuItems?.({
					closeMenu: () => setVisible(false),
					column,
					table,
				}) ??
				(enableSorting &&
					column.getCanSort() &&
					[
						column.getIsSorted() && (
							<MenuItem
								key={0}
								onClick={handleClearSort}
								sx={commonMenuItemStyles}
							>
								<Box sx={commonListItemStyles}>
									<ListItemIcon>
										<ClearIcon />
									</ListItemIcon>
									{localization.clearSort}
								</Box>
							</MenuItem>
						),
						(!column.getIsSorted() || column.getIsSorted() !== 'asc') && (
							<MenuItem
								disabled={column.getIsSorted() === 'asc'}
								key={1}
								onClick={handleSortAsc}
								sx={commonMenuItemStyles}
							>
								<Box sx={commonListItemStyles}>
									<ListItemIcon>
										<SortAscIcon />
									</ListItemIcon>
									{localization.sortAsc}
								</Box>
							</MenuItem>
						),
						(!column.getIsSorted() || column.getIsSorted() !== 'desc') && (
							<MenuItem
								divider={enableColumnFilters || enableGrouping || enableHiding}
								key={2}
								disabled={column.getIsSorted() === 'desc'}
								onClick={handleSortDesc}
								sx={commonMenuItemStyles}
							>
								<Box sx={commonListItemStyles}>
									<ListItemIcon>
										<SortDescIcon />
									</ListItemIcon>
									{localization.sortDesc}
								</Box>
							</MenuItem>
						),
					].filter(Boolean))}
		</>
	)
}

const QuickFilters = ({ column, table, setVisible }) => {
	const {
		options: {
			enableColumnFilters,
			icons: { FilterListOffIcon },
			localization,
		},
	} = table

	const handleClearFilter = () => {
		column.setFilterValue('')
		setVisible(false)
	}

	return (
		<>
			{enableColumnFilters &&
				column.getCanFilter() &&
				[
					column.getFilterValue() && (
						<MenuItem
							key={0}
							onClick={handleClearFilter}
							sx={commonMenuItemStyles}
						>
							<Box sx={commonListItemStyles}>
								<ListItemIcon>
									<FilterListOffIcon />
								</ListItemIcon>
								{localization.clearFilter}
							</Box>
						</MenuItem>
					),
				].filter(Boolean)}
		</>
	)
}

const QuickGroupings = ({ column, table, setVisible }) => {
	const {
		setColumnOrder,
		options: {
			enableGrouping,
			enableHiding,
			icons: { GroupIcon },
			localization,
		},
	} = table

	const handleGroupByColumn = () => {
		column.toggleGrouping()
		setColumnOrder((old: any) => ['mrt-row-expand', ...old])
		setVisible(false)
	}

	return (
		<>
			{enableGrouping &&
				column.getCanGroup() && [
					<MenuItem
						divider={enableHiding}
						key={0}
						onClick={handleGroupByColumn}
						sx={commonMenuItemStyles}
					>
						<Box sx={commonListItemStyles}>
							<ListItemIcon sx={{ pl: '4px' }}>
								<GroupIcon />
							</ListItemIcon>
							{localization[column.getIsGrouped() ? 'ungroup' : 'groupBy']}
						</Box>
					</MenuItem>,
				]}
		</>
	)
}

const QuickPinning = ({ column, table, setVisible }) => {
	const {
		options: {
			enableHiding,
			enablePinning,
			icons: { PushPinIcon },
			localization,
		},
	} = table

	const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
		column.pin(pinDirection)
		setVisible(false)
	}

	return (
		<>
			{enablePinning &&
				column.getCanPin() && [
					<MenuItem
						disabled={column.getIsPinned() === 'left' || !column.getCanPin()}
						key={0}
						onClick={() => handlePinColumn('left')}
						sx={commonMenuItemStyles}
					>
						<Box sx={commonListItemStyles}>
							<ListItemIcon>
								<PushPinIcon style={{ transform: 'rotate(90deg)' }} />
							</ListItemIcon>
							{localization.pinToLeft}
						</Box>
					</MenuItem>,
					<MenuItem
						disabled={column.getIsPinned() === 'right' || !column.getCanPin()}
						key={1}
						onClick={() => handlePinColumn('right')}
						sx={commonMenuItemStyles}
					>
						<Box sx={commonListItemStyles}>
							<ListItemIcon>
								<PushPinIcon style={{ transform: 'rotate(-90deg)' }} />
							</ListItemIcon>
							{localization.pinToRight}
						</Box>
					</MenuItem>,
					<MenuItem
						disabled={!column.getIsPinned()}
						divider={enableHiding}
						key={2}
						onClick={() => handlePinColumn(false)}
						sx={commonMenuItemStyles}
					>
						<Box sx={commonListItemStyles}>
							<ListItemIcon>
								<PushPinIcon />
							</ListItemIcon>
							{localization.unpin}
						</Box>
					</MenuItem>,
				]}
		</>
	)
}

const QuickColumnResizing = ({ column, table, setVisible }) => {
	const {
		getState,
		options: {
			enableColumnResizing,
			icons: { RestartAltIcon },
			localization,
		},
	} = table

	const { columnSizing } = getState()

	const handleResetColumnSize = () => {
		column.resetSize()
		setVisible(false)
	}

	return (
		<>
			{enableColumnResizing &&
				column.getCanResize() && [
					<MenuItem
						disabled={!columnSizing[column.id]}
						key={0}
						onClick={handleResetColumnSize}
						sx={commonMenuItemStyles}
					>
						<Box sx={commonListItemStyles}>
							<ListItemIcon>
								<RestartAltIcon />
							</ListItemIcon>
							{localization.resetColumnSize}
						</Box>
					</MenuItem>,
				]}
		</>
	)
}

const QuickHiding = ({ column, table, setVisible, columnDef }) => {
	const {
		getState,
		toggleAllColumnsVisible,
		options: {
			enableHiding,
			icons: { ArrowRightIcon, ViewColumnIcon, HideIcon },
			localization,
		},
	} = table

	const [showHideColumnsMenuAnchorEl, setShowHideColumnsMenuAnchorEl] =
		useState<null | HTMLElement>(null)

	const { columnVisibility } = getState()

	const handleHideColumn = () => {
		column.toggleVisibility(false)
		if (column.getIsGrouped()) {
			column.toggleGrouping()
		}
		column.clearSorting()
		setVisible(false)
	}

	const handleShowAllColumns = () => {
		toggleAllColumnsVisible(true)
		setVisible(false)
	}

	const handleOpenShowHideColumnsMenu = (
		event: React.MouseEvent<HTMLElement>
	) => {
		event.stopPropagation()
		setShowHideColumnsMenuAnchorEl(event.currentTarget)
	}

	return (
		<>
			{enableHiding && [
				<MenuItem
					disabled={!column.getCanHide()}
					key={0}
					onClick={handleHideColumn}
					sx={commonMenuItemStyles}
				>
					<Box sx={commonListItemStyles}>
						<ListItemIcon sx={{ pl: '4px' }}>
							<HideIcon />
						</ListItemIcon>
						{localization.hideInView}
					</Box>
				</MenuItem>,
				<MenuItem
					disabled={
						!Object.values(columnVisibility).filter((visible) => !visible)
							.length
					}
					key={1}
					onClick={handleShowAllColumns}
					sx={commonMenuItemStyles}
				>
					<Box sx={commonListItemStyles}>
						<ListItemIcon>
							<ViewColumnIcon />
						</ListItemIcon>
						{localization.showAllColumns?.replace(
							'{column}',
							String(columnDef.header)
						)}
					</Box>
					<IconButton
						onClick={handleOpenShowHideColumnsMenu}
						onMouseEnter={handleOpenShowHideColumnsMenu}
						size="small"
						sx={{ p: 0 }}
					>
						<ArrowRightIcon />
					</IconButton>
				</MenuItem>,
				<ShowHideColumnsMenu
					anchorEl={showHideColumnsMenuAnchorEl}
					isSubMenu
					key={2}
					setAnchorEl={setShowHideColumnsMenuAnchorEl}
					table={table}
				/>,
			]}
		</>
	)
}

const QuickSubFilters = ({
	table,
	column,
	toggleSubMenu,
	SubFilterSelection,
}: any) => {
	const { columnFilters, currentFilterColumn } = useFilterControls(
		table,
		column.id
	)

	const [selectedFilters, setSelectedFilters] = useState<any>([])
	const [filterValues, setFilterValues] = useState<any>([])

	// TODO: fix .length issue in getFacetedUniqueValues
	useEffect(() => {
		const { value: appliedValues } =
			columnFilters.find(({ id }) => id === column.id) || {}

		try {
			setFilterValues(
				Array.from(table.getColumn(column.id).getFacetedUniqueValues().keys())
			)
		} catch (error) {
			//
		}

		if (appliedValues?.length) {
			setSelectedFilters(appliedValues)
		}
	}, [columnFilters])

	const handleApplyFilters = () => {
		currentFilterColumn.setFilterValue([...selectedFilters])

		toggleSubMenu()
	}

	const handleCheckFilter = (value: string) => {
		if (selectedFilters.includes(value)) {
			const updatedFilters = selectedFilters.filter(
				(filter) => filter !== value
			)

			setSelectedFilters(updatedFilters)

			return
		}

		setSelectedFilters([...selectedFilters, value])
	}

	const handleCheckAllFilters = () => {
		if (selectedFilters.length === filterValues.length) {
			setSelectedFilters([])

			return
		}

		setSelectedFilters([...filterValues])
	}

	return (
		<SubFilterSelection
			table={table}
			column={column}
			selectedFilters={selectedFilters}
			filterValues={filterValues}
			onCheckFilter={handleCheckFilter}
			onCheckAllFilters={handleCheckAllFilters}
			onApplyFilters={handleApplyFilters}
		/>
	)
}

const OpenSubFilterButton = ({
	toggleSubMenu,
	enableColumnFiltersSelection,
	FiltersIcon,
}) => {
	if (!enableColumnFiltersSelection) {
		return <></>
	}

	return (
		<MenuItem key={0} onClick={toggleSubMenu} sx={commonMenuItemStyles}>
			<Box sx={commonListItemStyles}>
				<ListItemIcon>
					<FiltersIcon />
				</ListItemIcon>
				Filters
			</Box>
		</MenuItem>
	)
}

interface Props {
	anchorEl: HTMLElement | null
	header: Table_Header
	setVisible: (visible: boolean) => void
	table: TableInstance
}

export const ColumnActionMenu: FC<Props> = ({
	anchorEl,
	header,
	setVisible,
	table,
}) => {
	const {
		options: {
			enableColumnFiltersSelection,
			subFilterSelection: SubFilterSelection,
			icons: { FiltersIcon },
		},
	} = table

	const { column } = header
	const { columnDef } = column

	const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

	const toggleSubMenu = () => {
		setIsSubMenuOpen(!isSubMenuOpen)
	}

	if (isSubMenuOpen) {
		return (
			<Menu
				anchorEl={anchorEl}
				open={!!anchorEl}
				onClose={() => setVisible(false)}
			>
				<QuickSubFilters
					table={table}
					column={column}
					toggleSubMenu={toggleSubMenu}
					SubFilterSelection={SubFilterSelection}
				/>
			</Menu>
		)
	}

	return (
		<Menu
			anchorEl={anchorEl}
			open={!!anchorEl}
			onClose={() => setVisible(false)}
		>
			<>
				<QuickSorts
					table={table}
					columnDef={columnDef}
					column={column}
					setVisible={setVisible}
				/>

				<OpenSubFilterButton
					toggleSubMenu={toggleSubMenu}
					enableColumnFiltersSelection={enableColumnFiltersSelection}
					FiltersIcon={FiltersIcon}
				/>

				<QuickFilters table={table} column={column} setVisible={setVisible} />

				<QuickGroupings table={table} column={column} setVisible={setVisible} />

				<QuickPinning table={table} column={column} setVisible={setVisible} />

				<QuickColumnResizing
					table={table}
					column={column}
					setVisible={setVisible}
				/>

				<QuickHiding
					table={table}
					column={column}
					columnDef={columnDef}
					setVisible={setVisible}
				/>
			</>
		</Menu>
	)
}
