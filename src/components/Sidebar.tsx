import React, { ReactElement, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import { SidebarHeaderComponent } from './SidebarHeader'
import { SidebarSearchComponent } from './SidebarSearch'

interface Props<TData extends Record<string, any> = {}> {
	isOpen: boolean
	onClose(): void
	withHeader?: boolean
	withSearch?: boolean
	onSearchChange?(value: string): void
	headerTitle?: string
	subHeader?: string | ReactElement | null
	styles?: Record<string, any>
	children?: ReactNode
}

export const Sidebar = <TData extends Record<string, any> = {}>({
	isOpen,
	onClose,
	withHeader = false,
	withSearch = false,
	onSearchChange = () => null,
	headerTitle = '',
	subHeader,
	styles = { minWidth: 400 },
	children,
}: Props<TData>) => {
	const handleCloseCLick = () => {
		onClose()
	}

	return (
		<Drawer
			anchor="right"
			open={isOpen}
			onClose={handleCloseCLick}
			transitionDuration={400}
		>
			<Box sx={styles}>
				<>
					{withHeader && (
						<SidebarHeaderComponent
							title={headerTitle}
							subHeader={subHeader}
							onClick={handleCloseCLick}
						/>
					)}
					{withSearch && <SidebarSearchComponent onChange={onSearchChange} />}
					{children}
				</>
			</Box>
		</Drawer>
	)
}
