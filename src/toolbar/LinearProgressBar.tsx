import Collapse from '@mui/material/Collapse'
import LinearProgress from '@mui/material/LinearProgress'
import React from 'react'

import type { TableData, TableInstance } from '..'

interface Props<TData = TableData> {
	isTopToolbar: boolean
	isShown?: boolean
	table: TableInstance<TData>
}

export const LinearProgressBar = <TData,>({
	isTopToolbar,
	isShown,
	table,
}: Props<TData>) => {
	const {
		options: { muiLinearProgressProps },
		getState,
	} = table
	const { isLoading, showProgressBars } = getState()

	const linearProgressProps =
		muiLinearProgressProps instanceof Function
			? muiLinearProgressProps({ isTopToolbar, table })
			: muiLinearProgressProps

	return (
		<Collapse
			in={isShown || isLoading || showProgressBars}
			mountOnEnter
			unmountOnExit
			sx={{
				bottom: isTopToolbar ? 0 : undefined,
				position: 'absolute',
				top: !isTopToolbar ? 0 : undefined,
				width: '100%',
			}}
		>
			<LinearProgress
				aria-label="Loading"
				aria-busy="true"
				sx={{ position: 'relative' }}
				{...linearProgressProps}
			/>
		</Collapse>
	)
}
