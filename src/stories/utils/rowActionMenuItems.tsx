import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import ShareIcon from '@mui/icons-material/Share'
import GroupIcon from '@mui/icons-material/Group'
import ViewSidebar from '@mui/icons-material/ViewSidebar'
import React, { ReactNode } from 'react'
import { MenuItemBase } from '../../components/Menu'
import { Table_Row, TableInstance } from '../../TableComponent'

type ActionMenuItemProps = {
	onClick?: (action: string) => void
}
type GetDefaultRowActionMenuItemsProps<TData extends Record<string, any> = {}> =
	{
		closeMenu?: () => void
		row: Table_Row<TData>
		table: TableInstance<TData>
	}

export const ViewProfileActionMenuItem = ({ onClick }: ActionMenuItemProps) => (
	<MenuItemBase
		size="small"
		icon={<AccountCircleIcon />}
		onClick={() => onClick?.('View Profile')}
	>
		View Profile
	</MenuItemBase>
)

export const RemoveActionMenuItem = ({ onClick }: ActionMenuItemProps) => (
	<MenuItemBase
		size="small"
		icon={<DeleteIcon />}
		onClick={() => onClick?.('Remove')}
	>
		Remove
	</MenuItemBase>
)

export const ShareActionMenuItem = ({ onClick }: ActionMenuItemProps) => (
	<MenuItemBase
		size="small"
		icon={<ShareIcon />}
		onClick={() => onClick?.('Share')}
	>
		Share
	</MenuItemBase>
)

export const OpenSidebarMenuItem = ({ onClick }: ActionMenuItemProps) => (
	<MenuItemBase
		size="small"
		icon={<ViewSidebar />}
		onClick={() => onClick?.('Share')}
	>
		Open Sidebar
	</MenuItemBase>
)
export const ShowGroupedColumnValuesMenuItem = <
	TData extends Record<string, any> = {}
>({
	table,
	row,
	closeMenu,
}: GetDefaultRowActionMenuItemsProps<TData>) => (
	<MenuItemBase
		size="small"
		icon={<GroupIcon />}
		onClick={() => {
			const { grouping } = table.getState()
			console.log(
				grouping.reduce((acc, columnId) => {
					acc[columnId] = row.getValue(columnId)

					return acc
				}, {}),
				row.original
			)
			closeMenu?.()
		}}
	>
		Show grouped column values
	</MenuItemBase>
)

export const getDefaultRowActionMenuItems = (customActions?: ((closeMenu?: () => void) => ReactNode[])) => <
	TData extends Record<string, any> = {}
>({
	closeMenu,
	row,
	table,
}: GetDefaultRowActionMenuItemsProps<TData>) => {
	const onClick = (action: string) => {
		console.info(action, row)
		closeMenu?.()
	}
	return [
		<ViewProfileActionMenuItem key="view-profile" onClick={onClick} />,
		<RemoveActionMenuItem key="remove" onClick={onClick} />,
		<ShareActionMenuItem key="share" onClick={onClick} />,
		<ShowGroupedColumnValuesMenuItem
			key="showGrouoed"
			table={table}
			row={row}
			closeMenu={closeMenu}
		/>,
		...(customActions?.(closeMenu) ?? []),
	]
}
