import React, { MouseEvent, useState } from 'react'
import type { IconButtonProps } from '@mui/material/IconButton'
import { Typography } from '@mui/material'

import { Tooltip } from '../../../components/Tooltip'
import type { TableInstance } from '../../../index'
import { ToolbarIconButton } from '../../../components/ToolbarIconButton'
import { IconsColor } from '../../../components/styles'
import { ColumnsMenu } from '../menus/ColumnsMenu/ColumnsMenu'

interface Props<TData extends Record<string, any> = {}>
	extends IconButtonProps {
	table: TableInstance<TData>
	enableCaption: boolean
}

export const ColumnsButton = <TData extends Record<string, any> = {}>({
	table,
	enableCaption,
	...rest
}: Props<TData>) => {
	const {
		options: {
			icons: { ToggleIcon },
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
			<Tooltip placement="top" title={rest?.title ?? localization.showColumns}>
				<ToolbarIconButton
					aria-label={localization.showColumns}
					onClick={handleClick}
					disableRipple
					enableCaption={enableCaption}
					{...rest}
				>
					<ToggleIcon
						htmlColor={disabled ? IconsColor.disabled : IconsColor.default}
					/>
					{enableCaption && <Typography>{localization.showColumns}</Typography>}
				</ToolbarIconButton>
			</Tooltip>

			{anchorEl && (
				<ColumnsMenu
					anchorEl={anchorEl}
					setAnchorEl={setAnchorEl}
					table={table}
				/>
			)}
		</>
	)
}
