import React, { MouseEvent, useState } from 'react'
import type { IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Typography } from '@mui/material'

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
	...rest
}: Props<TData>) => {
	const {
		options: {
			icons: { FiltersIcon },
			localization,
		},
	} = table
	const disabled = false
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClick = (_event: MouseEvent<HTMLElement>) => {
		setAnchorEl(_event.currentTarget)
	}

	return (
		<>
			<Tooltip
				placement="top"
				title={rest?.title ?? localization.showFiltering}
			>
				<ToolbarIconButton
					aria-label={localization.showFiltering}
					onClick={handleClick}
					disableRipple
					{...rest}
				>
					<FiltersIcon
						htmlColor={disabled ? IconsColor.disabled : IconsColor.default}
					/>
					{enableCaption && (
						<Typography>{localization.showFiltering}</Typography>
					)}
				</ToolbarIconButton>
			</Tooltip>

			{anchorEl && (
				<FiltersMenu
					anchorEl={anchorEl}
					setAnchorEl={setAnchorEl}
					table={table}
				/>
			)}
		</>
	)
}
