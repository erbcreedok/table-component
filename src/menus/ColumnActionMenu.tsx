import { FC, useRef, useState } from 'react'

import type { Table_Header, TableInstance } from '..'
import { Menu } from '../components/Menu'
import { getTestAttributes } from '../utils/getTestAttributes'

import { QuickColumnPinningMenuItems } from './QuickColumnPinningMenuItems'
import { QuickFilterMenuItems } from './QuickFilterMenuItems'
import { QuickFiltersMenu } from './QuickFiltersMenu'
import { QuickGroupingMenuItems } from './QuickGroupingMenuItems'
import { QuickHidingMenuItems } from './QuickHidingMenuItems'
import { QuickSortMenuItems } from './QuickSortMenuItems'
import { CustomColumnMenuItems } from './CustomColumnMenuItems'

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
	const menuRef = useRef(null)
	const {
		options: { renderColumnActionsMenuItems, e2eLabels, setColumns },
	} = table
	const { column } = header
	const { columnDef } = column

	const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

	const toggleSubMenu = () => {
		setIsSubMenuOpen(!isSubMenuOpen)
	}

	const handleClose = () => {
		setVisible(false)
		setIsSubMenuOpen(false)
	}

	if (isSubMenuOpen) {
		return (
			<QuickFiltersMenu
				anchorEl={anchorEl}
				open={!!anchorEl}
				onClose={() => handleClose()}
				minWidth={anchorEl?.clientWidth}
				table={table}
				column={column}
				toggleSubMenu={toggleSubMenu}
			/>
		)
	}

	return (
		<Menu
			anchorEl={anchorEl}
			open={!!anchorEl}
			onClose={() => handleClose()}
			minWidth={anchorEl?.clientWidth}
			PaperProps={{
				ref: menuRef,
				sx: {
					margin: '6px 0',
				},
			}}
			MenuListProps={getTestAttributes(e2eLabels, 'columnMenu')}
		>
			{columnDef.renderColumnActionsMenuItems?.({
				closeMenu: () => handleClose(),
				column,
				table,
			}) ??
				renderColumnActionsMenuItems?.({
					closeMenu: () => handleClose(),
					column,
					table,
				}) ?? [
					<QuickSortMenuItems
						key="sort"
						table={table}
						column={column}
						setVisible={setVisible}
						menuRef={menuRef}
					/>,
					<QuickFilterMenuItems
						key="filter"
						column={column}
						toggleSubMenu={toggleSubMenu}
						table={table}
					/>,
					<QuickGroupingMenuItems
						key="grouping"
						table={table}
						column={column}
						setVisible={setVisible}
					/>,
					<QuickColumnPinningMenuItems
						key="freezing"
						column={column}
						table={table}
						setVisible={setVisible}
					/>,
					<QuickHidingMenuItems
						key="hiding"
						table={table}
						column={column}
						setVisible={setVisible}
					/>,
					setColumns && (
						<CustomColumnMenuItems
							key="columnEdit"
							column={column}
							setVisible={setVisible}
							setColumns={setColumns}
						/>
					),
				]}
		</Menu>
	)
}
