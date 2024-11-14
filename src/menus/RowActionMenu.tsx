import { MouseEvent } from 'react'

import type { Table_Row, TableData, TableInstance } from '..'
import { Menu, MenuItemBase } from '../components/Menu'
import { getTestAttributes } from '../utils/getTestAttributes'
import { isEditingEnabled } from '../utils/isEditingEnabled'
import { isEditRowActionVisible } from '../utils/showRowActionsColumn'

interface Props<TData = TableData> {
	anchorEl: HTMLElement | null
	handleEdit: (event: MouseEvent) => void
	row: Table_Row<TData>
	open: boolean
	setOpen: (open: boolean) => void
	table: TableInstance<TData>
}

export const RowActionMenu = <TData,>({
	anchorEl,
	handleEdit,
	row,
	open,
	setOpen,
	table,
}: Props<TData>) => {
	const {
		options: {
			icons: { EditIcon },
			editingMode,
			enableEditing,
			hideEditRowAction,
			localization,
			renderEditMenuItem,
			renderRowActionMenuItems,
			e2eLabels,
			renderRowActionMenuItemsOnOpen,
		},
	} = table

	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={() => setOpen(false)}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			PaperProps={{
				sx: {
					margin: '0 12px',
					overflow: 'visible',
					'&:before': {
						content: '""',
						display: 'block',
						position: 'absolute',
						width: 8,
						height: 8,
						backgroundColor: 'white',
						transform: 'translate(-3px, 7px) rotate(45deg)',
						zIndex: 0,
					},
				},
			}}
			MenuListProps={getTestAttributes(e2eLabels, 'rowActionMenu')}
		>
			{!(hideEditRowAction ?? !isEditRowActionVisible(editingMode)) &&
				isEditingEnabled(enableEditing, { table, row }) &&
				(renderEditMenuItem ? (
					renderEditMenuItem({ table, row, handleEdit })
				) : (
					<MenuItemBase size="small" icon={<EditIcon />} onClick={handleEdit}>
						{localization.edit}
					</MenuItemBase>
				))}
			{(!renderRowActionMenuItemsOnOpen || open) &&
				renderRowActionMenuItems?.({
					row,
					table,
					closeMenu: () => setOpen(false),
				})}
		</Menu>
	)
}
