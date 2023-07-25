import React, { useState } from 'react'
import type { IconButtonProps } from '@mui/material/IconButton'
import { Typography } from '@mui/material'

import { Tooltip } from '../../../components/Tooltip'
import type { TableInstance } from '../../../index'
import { ToolbarIconButton } from '../../../components/ToolbarIconButton'
import { IconsColor } from '../../../components/styles'
import { FiltersMenu } from '../menus/FiltersMenu/FiltersMenu'

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
				<FiltersMenu open onClose={() => setOpen(false)} table={table} />
			)}
		</>
	)
}
