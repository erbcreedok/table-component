import type { IconButtonProps } from '@mui/material/IconButton'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

import type { TableData, TableInstance } from '..'

interface Props<TData = TableData> extends IconButtonProps {
	table: TableInstance<TData>
}

export const FullScreenToggleButton = <TData,>({
	table,
	...rest
}: Props<TData>) => {
	const {
		getState,
		options: {
			icons: { FullscreenExitIcon, FullscreenIcon },
			localization,
		},
		setIsFullScreen,
	} = table
	const { isFullScreen } = getState()

	const handleToggleFullScreen = () => {
		setIsFullScreen(!isFullScreen)
	}

	return (
		<Tooltip arrow title={rest?.title ?? localization.toggleFullScreen}>
			<IconButton
				aria-label={localization.showHideFilters}
				onClick={handleToggleFullScreen}
				{...rest}
				title={undefined}
			>
				{isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
			</IconButton>
		</Tooltip>
	)
}
