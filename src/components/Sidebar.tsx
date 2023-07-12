import React, { ReactElement, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import { SidebarHeaderComponent } from './SidebarHeader'
import { SidebarSearchComponent } from './SidebarSearch'

interface Props {
	open: boolean
	onClose(): void
	withHeader?: boolean
	withSearch?: boolean
	onSearchChange?(value: string): void
	headerTitle?: string
	subHeader?: string | ReactElement | null
	styles?: Record<string, any>
	children?: ReactNode
	transparentBackdrop?: boolean
}

export const Sidebar = ({
	open,
	onClose,
	withHeader = false,
	withSearch = false,
	onSearchChange = () => null,
	headerTitle = '',
	subHeader,
	styles = { minWidth: 400, maxWidth: '80vw' },
	transparentBackdrop,
	children,
}: Props) => {
	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			transitionDuration={400}
			sx={{
				'& > .MuiBackdrop-root': {
					backgroundColor: transparentBackdrop
						? 'transparent'
						: 'rgba(0, 0, 0, 0.5)',
				},
			}}
		>
			<Box sx={styles}>
				<>
					{withHeader && (
						<SidebarHeaderComponent
							title={headerTitle}
							subHeader={subHeader}
							onClick={onClose}
						/>
					)}
					{withSearch && <SidebarSearchComponent onChange={onSearchChange} />}
					{children}
				</>
			</Box>
		</Drawer>
	)
}
