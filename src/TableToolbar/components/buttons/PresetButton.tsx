import React from 'react'
import type { IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Typography } from '@mui/material'
import ExpandMore from '@mui/icons-material/ExpandMore'

import type { TableInstance } from '../../../index'
import { ToolbarButton } from '../../../components/ToolbarButton'
import { NotificationDot } from '../../../components/NotificationDot'

interface Props<TData extends Record<string, any> = {}>
	extends IconButtonProps {
	table: TableInstance<TData>
}

export const PresetButton = <TData extends Record<string, any> = {}>({
	table,
	...rest
}: Props<TData>) => {
	const {
		// getState,
		options: { localization },
		// setShowFilters,
	} = table
	// const { showPresets } = getState();

	const handleToggleShowGrouping = () => {
		// setShowFilters(!showPresets);
	}

	return (
		<Tooltip placement="top" title={rest?.title ?? localization.showPreset}>
			<ToolbarButton
				aria-label={localization.showPreset}
				endIcon={<ExpandMore />}
				onClick={handleToggleShowGrouping}
				variant="outlined"
				disableRipple
			>
				<Typography>{localization.showPreset}: Default</Typography>
				<NotificationDot />
			</ToolbarButton>
		</Tooltip>
	)
}
