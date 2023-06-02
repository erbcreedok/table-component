import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import ShareIcon from '@mui/icons-material/Share'
import React from 'react'
import { MenuItemBase } from '../../components/Menu'
import { Table_Row } from '../../TableComponent'

type ActionMenuItemProps = {
	onClick?: (action: string) => void
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

type GetDefaultRowActionMenuItemsProps<TData extends Record<string, any> = {}> = {
	closeMenu?: () => void
	row: Table_Row<TData>
}
export const getDefaultRowActionMenuItems = <TData extends Record<string, any> = {}>({ closeMenu, row }: GetDefaultRowActionMenuItemsProps<TData>) => {
	const onClick = (action: string) => {
		console.info(action, row)
		closeMenu?.()
	}
	return [
		<ViewProfileActionMenuItem key="view-profile" onClick={onClick} />,
		<RemoveActionMenuItem key="remove" onClick={onClick} />,
		<ShareActionMenuItem key="share" onClick={onClick} />
	]
}
