import { Menu } from '../components/Menu'
import { CreateNewRowMethod, CreateNewRowRenderMenuConfig } from '../hooks'
import type { Table_Row, TableData, TableInstance } from '../TableComponent'

export type CreateNewRowMenuProps<TData extends TableData = TableData> = {
	anchorEl: HTMLElement | null
	row: Table_Row<TData>
	depth: number
	open: boolean
	setOpen: (value: undefined) => void
	table: TableInstance<TData>
	renderMenu: CreateNewRowRenderMenuConfig<TData>
	createNewRow: CreateNewRowMethod<TData>
}
export const CreateNewRowMenu = <TData extends TableData = TableData>(
	props: CreateNewRowMenuProps<TData>
) => {
	const { anchorEl, createNewRow, open, row, depth, setOpen, renderMenu } =
		props

	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={() => setOpen(undefined)}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			PaperProps={{
				sx: {
					margin: '2px 0 0 -14px',
					overflow: 'visible',
					'&:before': {
						content: '""',
						display: 'block',
						position: 'absolute',
						width: 8,
						height: 8,
						backgroundColor: 'white',
						transform: 'translate(10px, -3px) rotate(-45deg)',
						zIndex: 0,
					},
				},
			}}
		>
			{open &&
				renderMenu({
					row,
					depth,
					createNewRow,
					closeMenu: () => setOpen(undefined),
				})}
		</Menu>
	)
}
