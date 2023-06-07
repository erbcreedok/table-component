import React, { FC } from 'react'
import Paper from '@mui/material/Paper'

import { TableBulkActions } from '../components/TableBulkActions'
import { BottomToolbar } from '../toolbar/BottomToolbar'
import type { TableInstance } from '..'
import { TableToolbar } from '../TableToolbar'
import { TableStatusBar } from '../TableStatusBar'

import { TableContainer } from './TableContainer'

interface Props {
	table: TableInstance
}

export const TablePaper: FC<Props> = ({ table }) => {
	const {
		getState,
		options: {
			enableBottomToolbar,
			enableBulkActions,
			enableStatusBar,
			enableTopToolbar,
			muiTablePaperProps,
			renderBottomToolbar,
			renderTopToolbar,
			toolbarProps,
			bulkActionProps,
		},
		refs: { tablePaperRef },
	} = table
	const { isFullScreen } = getState()

	const tablePaperProps =
		muiTablePaperProps instanceof Function
			? muiTablePaperProps({ table })
			: muiTablePaperProps

	return (
		<Paper
			elevation={2}
			{...tablePaperProps}
			ref={(ref: HTMLDivElement) => {
				tablePaperRef.current = ref
				if (tablePaperProps?.ref) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					tablePaperProps.ref.current = ref
				}
			}}
			sx={(theme) => ({
				transition: 'all 150ms ease-in-out',
				display: 'flex',
				flexDirection: 'column',
				gap: '6px',
				...(tablePaperProps?.sx instanceof Function
					? tablePaperProps?.sx(theme)
					: (tablePaperProps?.sx as any)),
			})}
			style={{
				...tablePaperProps?.style,
				...(isFullScreen
					? {
							height: '100vh',
							margin: 0,
							maxHeight: '100vh',
							maxWidth: '100vw',
							padding: 0,
							width: '100vw',
					  }
					: {}),
			}}
		>
			{enableTopToolbar &&
				(renderTopToolbar instanceof Function
					? renderTopToolbar({ table })
					: renderTopToolbar ?? (
							<TableToolbar sx={{ p: '6px' }} table={table} {...toolbarProps} />
					  ))}
			{enableStatusBar && <TableStatusBar sx={{ p: '6px' }} table={table} />}
			<TableContainer table={table} />
			{enableBottomToolbar &&
				(renderBottomToolbar instanceof Function
					? renderBottomToolbar({ table })
					: renderBottomToolbar ?? <BottomToolbar table={table} />)}
			{enableBulkActions && (
				<TableBulkActions table={table} {...bulkActionProps} />
			)}
		</Paper>
	)
}
