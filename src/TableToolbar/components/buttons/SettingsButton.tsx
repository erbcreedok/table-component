import React, { MouseEvent, useState } from 'react'
import type { IconButtonProps } from '@mui/material/IconButton'
import { Typography } from '@mui/material'

import { Tooltip } from '../../../components/Tooltip'
import type { TableInstance } from '../../../index'
import { ToolbarIconButton } from '../../../components/ToolbarIconButton'
import { IconsColor } from '../../../components/styles'
import { SettingsMenu } from '../menus/SettingsMenu/SettingsMenu'

interface Props<TData extends Record<string, any> = {}>
	extends IconButtonProps {
	table: TableInstance<TData>
	enableCaption: boolean
}

export const SettingsButton = <TData extends Record<string, any> = {}>({
	table,
	enableCaption,
	...rest
}: Props<TData>) => {
	const {
		options: {
			icons: { SettingsIcon },
			localization,
		},
	} = table

	const disabled = false

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	return (
		<>
			<Tooltip placement="top" title={rest?.title ?? localization.showSettings}>
				<ToolbarIconButton
					aria-label={localization.showSettings}
					onClick={handleClick}
					disableRipple
					{...rest}
				>
					<SettingsIcon
						htmlColor={disabled ? IconsColor.disabled : IconsColor.default}
					/>
					{enableCaption && (
						<Typography>{localization.showSettings}</Typography>
					)}
				</ToolbarIconButton>
			</Tooltip>

			{anchorEl && (
				<SettingsMenu
					anchorEl={anchorEl}
					setAnchorEl={setAnchorEl}
					table={table}
				/>
			)}
		</>
	)
}
