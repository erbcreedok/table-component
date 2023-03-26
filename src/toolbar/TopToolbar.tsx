import React from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'
import { lighten } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

import { GlobalFilterTextField } from '../inputs/GlobalFilterTextField'
import type { TableInstance } from '..'

import { LinearProgressBar } from './LinearProgressBar'
import { TablePagination } from './TablePagination'
import { ToolbarAlertBanner } from './ToolbarAlertBanner'
import { ToolbarInternalButtons } from './ToolbarInternalButtons'
import { ToolbarDropZone } from './ToolbarDropZone'

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

interface Props<TData extends Record<string, any> = object> {
	table: TableInstance<TData>
}

export const TopToolbar = <TData extends Record<string, any> = object>({
	table,
}: Props<TData>) => {
	const {
		getState,
		options: {
			enableGlobalFilter,
			enablePagination,
			enableToolbarInternalActions,
			muiTopToolbarProps,
			positionGlobalFilter,
			positionPagination,
			positionToolbarAlertBanner,
			positionToolbarDropZone,
			renderTopToolbarCustomActions,
		},
		refs: { topToolbarRef },
	} = table

	const { isFullScreen, showGlobalFilter } = getState()

	const isMobile = useMediaQuery('(max-width:720px)')

	const toolbarProps =
		muiTopToolbarProps instanceof Function
			? muiTopToolbarProps({ table })
			: muiTopToolbarProps

	const stackAlertBanner =
		isMobile || !!renderTopToolbarCustomActions || showGlobalFilter

	return (
		<Toolbar
			variant="dense"
			{...toolbarProps}
			ref={(ref: HTMLDivElement) => {
				topToolbarRef.current = ref
				if (toolbarProps?.ref) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					toolbarProps.ref.current = ref
				}
			}}
			sx={(theme) => ({
				position: isFullScreen ? 'sticky' : undefined,
				top: isFullScreen ? '0' : undefined,
				...commonToolbarStyles({ theme }),
				...(toolbarProps?.sx instanceof Function
					? toolbarProps.sx(theme)
					: (toolbarProps?.sx as any)),
			})}
		>
			{positionToolbarAlertBanner === 'top' && (
				<ToolbarAlertBanner stackAlertBanner={stackAlertBanner} table={table} />
			)}
			{['both', 'top'].includes(positionToolbarDropZone ?? '') && (
				<ToolbarDropZone table={table} />
			)}
			<Box
				sx={{
					alignItems: 'flex-start',
					boxSizing: 'border-box',
					display: 'flex',
					justifyContent: 'space-between',
					p: '0.5rem',
					position: stackAlertBanner ? 'relative' : 'absolute',
					right: 0,
					top: 0,
					width: '100%',
				}}
			>
				{enableGlobalFilter && positionGlobalFilter === 'left' && (
					<GlobalFilterTextField table={table} />
				)}
				{renderTopToolbarCustomActions?.({ table }) ?? <span />}
				{enableToolbarInternalActions ? (
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap-reverse',
							justifyContent: 'flex-end',
						}}
					>
						{enableGlobalFilter && positionGlobalFilter === 'right' && (
							<GlobalFilterTextField table={table} />
						)}
						<ToolbarInternalButtons table={table} />
					</Box>
				) : (
					enableGlobalFilter &&
					positionGlobalFilter === 'right' && (
						<GlobalFilterTextField table={table} />
					)
				)}
			</Box>
			{enablePagination &&
				['top', 'both'].includes(positionPagination ?? '') && (
					<TablePagination table={table} position="top" />
				)}
			<LinearProgressBar isTopToolbar table={table} />
		</Toolbar>
	)
}
