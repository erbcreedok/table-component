import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { FC, useState } from 'react'

import type { Table_Header, TableInstance } from '..'

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
		getState,
		toggleAllColumnsVisible,
		setColumnOrder,
		options: {
			enableColumnFilters,
			enableColumnResizing,
			enableGrouping,
			enableHiding,
			enablePinning,
			enableSorting,
			enableMultiSort,
			icons: {
				ArrowRightIcon,
				ViewColumnIcon,
				FilterListOffIcon,
				GroupIcon,
				PushPinIcon,
				SortAscIcon,
				SortDescIcon,
				ClearIcon,
				RestartAltIcon,
				HideIcon,
			},
			localization,
			renderColumnActionsMenuItems,
		},
	} = table
	const { column } = header
	const { columnDef } = column
	const { columnSizing, columnVisibility } = getState()

	const [showHideColumnsMenuAnchorEl, setShowHideColumnsMenuAnchorEl] =
		useState<null | HTMLElement>(null)

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

	const handleResetColumnSize = () => {
		column.resetSize()
		setVisible(false)
	}

	const handleHideColumn = () => {
		column.toggleVisibility(false)
		if (column.getIsGrouped()) {
			column.toggleGrouping()
		}
		column.clearSorting()
		setVisible(false)
	}

	const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
		column.pin(pinDirection)
		setVisible(false)
	}

	const handleGroupByColumn = () => {
		column.toggleGrouping()
		setColumnOrder((old: any) => ['mrt-row-expand', ...old])
		setVisible(false)
	}

	const handleClearFilter = () => {
		column.setFilterValue('')
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
		<Menu
			anchorEl={anchorEl}
			open={!!anchorEl}
			onClose={() => setVisible(false)}
		>
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
		</Menu>
	)
}
