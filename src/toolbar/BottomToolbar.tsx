import React from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'
import { alpha, lighten, type Theme } from '@mui/material/styles'

import type { TableInstance } from '..'

import { TablePagination } from './TablePagination'
import { ToolbarAlertBanner } from './ToolbarAlertBanner'
import { ToolbarDropZone } from './ToolbarDropZone'
import { LinearProgressBar } from './LinearProgressBar'

export const commonToolbarStyles = ({ theme }: { theme: Theme }) => ({
	alignItems: 'flex-start',
	backgroundColor: lighten(theme.palette.background.default, 0.04),
	backgroundImage: 'none',
	display: 'grid',
	flexWrap: 'wrap-reverse',
	minHeight: '3.5rem',
	overflow: 'hidden',
	p: '0 !important',
	transition: 'all 150ms ease-in-out',
	zIndex: 1,
})

interface Props<TData extends Record<string, any> = {}> {
	table: TableInstance<TData>
}

export const BottomToolbar = <TData extends Record<string, any> = {}>({
	table,
}: Props<TData>) => {
	const {
		getState,
		options: {
			enablePagination,
			muiBottomToolbarProps,
			positionPagination,
			positionToolbarAlertBanner,
			positionToolbarDropZone,
			renderBottomToolbarCustomActions,
		},
		refs: { bottomToolbarRef },
	} = table
	const { isFullScreen } = getState()

	const isMobile = useMediaQuery('(max-width:720px)')

	const toolbarProps =
		muiBottomToolbarProps instanceof Function
			? muiBottomToolbarProps({ table })
			: muiBottomToolbarProps

	const stackAlertBanner = isMobile || !!renderBottomToolbarCustomActions

	return (
		<Toolbar
			variant="dense"
			{...toolbarProps}
			ref={(node: HTMLDivElement) => {
				if (node) {
					bottomToolbarRef.current = node
					if (toolbarProps?.ref) {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						toolbarProps.ref.current = node
					}
				}
			}}
			sx={(theme) => ({
				...commonToolbarStyles({ theme }),
				bottom: isFullScreen ? '0' : undefined,
				boxShadow: `0 1px 2px -1px ${alpha(
					theme.palette.common.black,
					0.1
				)} inset`,
				left: 0,
				position: isFullScreen ? 'fixed' : 'relative',
				right: 0,
				...(toolbarProps?.sx instanceof Function
					? toolbarProps.sx(theme)
					: (toolbarProps?.sx as any)),
			})}
		>
			<LinearProgressBar isTopToolbar={false} table={table} />
			{positionToolbarAlertBanner === 'bottom' && (
				<ToolbarAlertBanner stackAlertBanner={stackAlertBanner} table={table} />
			)}
			{['both', 'bottom'].includes(positionToolbarDropZone ?? '') && (
				<ToolbarDropZone table={table} />
			)}
			<Box
				sx={{
					alignItems: 'center',
					boxSizing: 'border-box',
					display: 'flex',
					justifyContent: 'space-between',
					p: '0.5rem',
					width: '100%',
				}}
			>
				{renderBottomToolbarCustomActions ? (
					renderBottomToolbarCustomActions({ table })
				) : (
					<span />
				)}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						position: stackAlertBanner ? 'relative' : 'absolute',
						right: 0,
						top: 0,
					}}
				>
					{enablePagination === 'pages' &&
						['bottom', 'both'].includes(positionPagination ?? '') && (
							<TablePagination table={table} position="bottom" />
						)}
				</Box>
			</Box>
		</Toolbar>
	)
}
