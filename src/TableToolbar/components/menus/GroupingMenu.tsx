import React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import type { TableInstance } from '../../../index'

import { SidebarHeaderComponent } from './components/SIdebarHeader'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	isSubMenu?: boolean
	setAnchorEl: (anchorEl: HTMLElement | null) => void
	table: TableInstance<TData>
}

export const GroupingMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const handleCloseCLick = () => setAnchorEl(null)

	return (
		<Drawer
			anchor="right"
			open={!!anchorEl}
			onClose={handleCloseCLick}
			transitionDuration={400}
		>
			<Box sx={{ minWidth: 660 }}>
				<SidebarHeaderComponent title="Grouping" onClick={handleCloseCLick} />
			</Box>
		</Drawer>
	)
}
