import React from 'react'
import Collapse from '@mui/material/Collapse'
import LinearProgress from '@mui/material/LinearProgress'

import type { TableInstance } from '..'

interface Props<TData extends Record<string, any> = object> {
	isTopToolbar: boolean
	isShown?: boolean
	table: TableInstance<TData>
}

export const LinearProgressBar = <TData extends Record<string, any> = object>({
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
