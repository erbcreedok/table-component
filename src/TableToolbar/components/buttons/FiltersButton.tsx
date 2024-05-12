import { Typography } from '@mui/material'
import type { IconButtonProps } from '@mui/material/IconButton'
import React, { useState } from 'react'

import {
	TableInstance,
	IconsColor,
	ToolbarIconButton,
	Tooltip,
} from '../../../'
import { FiltersMenuWithMuiProps } from '../menus/FiltersMenu/FiltersMenu'

interface Props<TData extends Record<string, any> = {}>
	extends IconButtonProps {
	table: TableInstance<TData>
	enableCaption: boolean
}

export const FiltersButton = <TData extends Record<string, any> = {}>({
	table,
	enableCaption,
	disabled,
	...rest
}: Props<TData>) => {
	const {
		options: {
			icons: { FiltersIcon },
			localization,
		},
	} = table
	const [open, setOpen] = useState(false)

	return (
		<>
			<Tooltip
				placement="top"
				title={rest?.title ?? localization.showFiltering}
				disabled={disabled}
			>
				<ToolbarIconButton
					aria-label={localization.showFiltering}
					onClick={() => setOpen(true)}
					disableRipple
					enableCaption={enableCaption}
					disabled={disabled}
					{...rest}
				>
					<FiltersIcon
						htmlColor={disabled ? IconsColor.disabled : IconsColor.default}
					/>
					{enableCaption && (
						<Typography
							color={disabled ? IconsColor.disabled : IconsColor.default}
						>
							{localization.showFiltering}
						</Typography>
					)}
				</ToolbarIconButton>
			</Tooltip>

			{open && (
				<FiltersMenuWithMuiProps
					open
					onClose={() => setOpen(false)}
					table={table as TableInstance}
				/>
			)}
		</>
	)
}
