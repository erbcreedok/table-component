import React, { MouseEvent, useState } from 'react'
import type { IconButtonProps } from '@mui/material/IconButton'
import { Typography } from '@mui/material'

import { Tooltip } from '../../../components/Tooltip'
import type { TableInstance } from '../../../index'
import { ToolbarIconButton } from '../../../components/ToolbarIconButton'
import { GroupingMenu } from '../menus/GroupingMenu/GroupingMenu'
import { IconsColor } from '../../../components/styles'

interface Props<TData extends Record<string, any> = {}>
	extends IconButtonProps {
	table: TableInstance<TData>
	enableCaption: boolean
}

export const GroupingButton = <TData extends Record<string, any> = {}>({
	table,
	enableCaption,
	...rest
}: Props<TData>) => {
	const {
		options: {
			icons: { GroupingIcon },
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
			<Tooltip placement="top" title={rest?.title ?? localization.showGrouping}>
				<ToolbarIconButton
					aria-label={localization.showGrouping}
					onClick={handleClick}
					disableRipple
					enableCaption={enableCaption}
					{...rest}
				>
					<GroupingIcon
						htmlColor={disabled ? IconsColor.disabled : IconsColor.default}
					/>
					{enableCaption && (
						<Typography>{localization.showGrouping}</Typography>
					)}
				</ToolbarIconButton>
			</Tooltip>

			{anchorEl && (
				<GroupingMenu
					anchorEl={anchorEl}
					setAnchorEl={setAnchorEl}
					table={table}
				/>
			)}
		</>
	)
}
