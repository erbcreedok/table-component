import { MouseEvent } from 'react'

import type { Table_Row, TableInstance } from '..'
import { Menu, MenuItemBase } from '../components/Menu'
import { isEditingEnabled } from '../utils/isEditingEnabled'
import { isEditRowActionVisible } from '../utils/showRowActionsColumn'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	handleEdit: (event: MouseEvent) => void
	row: Table_Row<TData>
	open: boolean
	setOpen: (open: boolean) => void
	table: TableInstance<TData>
}

export const RowActionMenu = <TData extends Record<string, any> = {}>({
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
			{renderRowActionMenuItems?.({
				row,
				table,
				closeMenu: () => setOpen(false),
			})}
		</Menu>
	)
}
