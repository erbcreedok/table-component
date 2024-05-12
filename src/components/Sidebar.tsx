import {
	backdropClasses,
	BoxProps,
	DrawerProps,
	paperClasses,
} from '@mui/material'
import { ReactElement, ReactNode, MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import { TableInstance } from '../TableComponent'
import { createComponentWithMuiProps } from '../utils/createComponentWithMuiProps'
import { getE2EAttributes } from '../utils/getE2EAttributes'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { mergeMuiProps } from '../utils/mergeMuiProps'
import { mergeSx } from '../utils/mergeSx'
import { omit } from '../utils/omit'

import { SidebarHeaderComponent } from './SidebarHeader'
import { SidebarSearchComponent } from './SidebarSearch'

interface SidebarTemplateProps {
	onClose?(): void
	topPanel?: ReactNode
	/** @deprecated use topPanel */
	withHeader?: boolean
	/** @deprecated use topPanel */
	withSearch?: boolean
	/** @deprecated use topPanel */
	onSearchChange?(value: string): void
	/** @deprecated use topPanel */
	onSearchClear?(event: MouseEvent<HTMLElement>): void
	/** @deprecated use topPanel */
	headerTitle?: string
	/** @deprecated use topPanel */
	subHeader?: string | ReactElement | null
	children?: ReactNode
	innerTable?: boolean
	wrapperProps?: BoxProps
	contentProps?: BoxProps
}

export type SidebarProps = SidebarTemplateProps & {
	innerTableSidebar?: boolean
	onClose?: () => void
} & Omit<DrawerProps, 'onClose'>
export type SidebarPropsWithOnCloseEnd = Partial<SidebarProps> & {
	onCloseEnd?: () => void
}

export const SidebarTemplate = ({
	onClose = () => null,
	topPanel,
	withHeader = false,
	withSearch = false,
	onSearchChange = () => null,
	onSearchClear,
	headerTitle = '',
	subHeader,
	children,
	innerTable,
	wrapperProps,
	contentProps,
}: SidebarTemplateProps) => {
	return (
		<Box
			{...wrapperProps}
			sx={mergeSx(
				{
					...(innerTable ? { maxHeight: '100%', flexGrow: 1 } : {}),
				},
				wrapperProps?.sx
			)}
		>
			{withHeader && (
				<SidebarHeaderComponent
					title={headerTitle}
					subHeader={subHeader}
					onClick={onClose}
				/>
			)}
			{withSearch && (
				<SidebarSearchComponent
					onChange={onSearchChange}
					onClear={onSearchClear}
				/>
			)}
			{topPanel}
			<Box
				{...contentProps}
				sx={mergeSx(
					{
						maxHeight: `calc(100% - ${withSearch ? '116' : '65'}px)`,
						boxSizing: 'border-box',
						display: innerTable ? 'flex' : 'block',
						width: '100%',
						overflow: 'hidden',
						position: 'relative',
					},
					contentProps?.sx
				)}
			>
				{children}
			</Box>
		</Box>
	)
}

export const Sidebar = (props: SidebarProps) => {
	const { innerTableSidebar, children, PaperProps, ...rest } = props
	const innerTableDrawerStyles = {
		[`& > .${backdropClasses.root}`]: {
			backgroundColor: 'transparent',
		},
		[`& > .${paperClasses.root}`]: {
			boxShadow: '-1px 0px 44px 0px #00000026',
		},
	}

	// omit headerTitle and subHeader from Drawer props, so they don't get passed to html element
	const drawerProps = omit(
		rest,
		'headerTitle',
		'subHeader',
		'wrapperProps',
		'contentProps',
		'topPanel'
	)

	return (
		<Drawer
			anchor="right"
			transitionDuration={400}
			{...drawerProps}
			sx={mergeSx(
				innerTableSidebar ? innerTableDrawerStyles : null,
				drawerProps.sx
			)}
			PaperProps={mergeMuiProps(getE2EAttributes('sidebarPaper'), PaperProps)}
		>
			<SidebarTemplate innerTable={innerTableSidebar} {...props}>
				{children}
			</SidebarTemplate>
		</Drawer>
	)
}

export const SidebarWithMuiProps = createComponentWithMuiProps<
	SidebarProps & { table: TableInstance }
>(Sidebar, ({ table, ...rest }) => {
	const muiProps = getValueOrFunctionHandler(table.options.muiSidebarProps)({
		table,
	})
	const props = mergeMuiProps(muiProps, rest)
	const PaperProps = mergeMuiProps(muiProps?.PaperProps, rest.PaperProps)
	const wrapperProps = mergeMuiProps(muiProps?.wrapperProps, rest.wrapperProps)
	const contentProps = mergeMuiProps(muiProps?.contentProps, rest.contentProps)

	return {
		...props,
		PaperProps,
		wrapperProps,
		contentProps,
		table: undefined,
	}
})
