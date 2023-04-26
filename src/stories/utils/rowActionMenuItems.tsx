import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import ShareIcon from '@mui/icons-material/Share'
import { MenuItem } from '@mui/material'
import React from 'react'
import { Table_Row } from '../../TableComponent'

type ActionMenuItemProps = {
	onClick?: (action: string) => void
}
export const ViewProfileActionMenuItem = ({ onClick }: ActionMenuItemProps) => (
	<MenuItem
		onClick={() => onClick?.('View Profile')}>
		<AccountCircleIcon /> View Profile
	</MenuItem>
)

export const RemoveActionMenuItem = ({ onClick }: ActionMenuItemProps) => (
	<MenuItem
		onClick={() => onClick?.('Remove')}>
		<DeleteIcon /> Remove
	</MenuItem>
)

export const ShareActionMenuItem = ({ onClick }: ActionMenuItemProps) => (
	<MenuItem
		onClick={() => onClick?.('Share')}>
		<ShareIcon /> Share
	</MenuItem>
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
