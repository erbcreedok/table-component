import { backdropClasses, paperClasses } from '@mui/material'
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
	innerTableSidebar?: boolean
	innerTable?: boolean
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
	innerTableSidebar,
	children,
	innerTable,
}: Props) => {
	const innerTableDrawerStyles = {
		[`& > .${backdropClasses.root}`]: {
			backgroundColor: 'transparent',
		},
		[`& > .${paperClasses.root}`]: {
			boxShadow: '-1px 0px 44px 0px #00000026',
		},
	}

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			transitionDuration={400}
			sx={innerTableSidebar ? innerTableDrawerStyles : null}
		>
			<Box sx={{ ...styles, ...(innerTable ? { maxHeight: '100%' } : {}) }}>
				<>
					{withHeader && (
						<SidebarHeaderComponent
							title={headerTitle}
							subHeader={subHeader}
							onClick={onClose}
						/>
					)}
					{withSearch && <SidebarSearchComponent onChange={onSearchChange} />}
					<Box
						sx={{
							maxHeight: `calc(100% - ${withSearch ? '116' : '65'}px)`,
							boxSizing: 'border-box',
							display: innerTable ? 'flex' : 'block',
							width: '100%',
							overflow: 'hidden',
							position: 'relative',
						}}
					>
						{children}
					</Box>
				</>
			</Box>
		</Drawer>
	)
}
