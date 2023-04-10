import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Grow from '@mui/material/Grow'
import React, { FC, useEffect, useRef } from 'react'

import { EditRowModal } from '../body/EditRowModal'
import { TableContextType } from '../context/TableContext'

import { TablePaper } from './TablePaper'

type Props = TableContextType
export const TableRoot: FC<Props> = ({ table, state, config }) => {
	const { editingRow } = state

	const initialBodyHeight = useRef<string>()

	useEffect(() => {
		if (typeof window !== 'undefined') {
			initialBodyHeight.current = document.body.style.height
		}
	}, [])

	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (table.getState().isFullScreen) {
				document.body.style.height = '100vh'
			} else {
				document.body.style.height = initialBodyHeight.current as string
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [table.getState().isFullScreen])

	return (
		<>
			<Dialog
				PaperComponent={Box}
				TransitionComponent={!config.enableRowVirtualization ? Grow : undefined}
				disablePortal
				fullScreen
				keepMounted={false}
				onClose={() => table.setIsFullScreen(false)}
				open={table.getState().isFullScreen}
				transitionDuration={400}
			>
				<TablePaper table={table as any} />
			</Dialog>
			{!table.getState().isFullScreen && <TablePaper table={table as any} />}
			{editingRow && config.editingMode === 'modal' && (
				<EditRowModal row={editingRow as any} table={table} open />
			)}
		</>
	)
}
