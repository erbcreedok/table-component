import { Typography } from '@mui/material'
import type { IconButtonProps } from '@mui/material/IconButton'
import React, { MouseEvent, useState } from 'react'

import {
	TableInstance,
	IconsColor,
	ToolbarIconButton,
	Tooltip,
} from '../../../'
import { GroupingMenuWithMuiProps } from '../menus/GroupingMenu/GroupingMenu'

interface Props<TData extends Record<string, any> = {}>
	extends IconButtonProps {
	table: TableInstance<TData>
	enableCaption: boolean
}

export const GroupingButton = <TData extends Record<string, any> = {}>({
	table,
	enableCaption,
	disabled,
	...rest
}: Props<TData>) => {
	const {
		options: {
			icons: { GroupingIcon },
			localization,
		},
	} = table
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClick = (_event: MouseEvent<HTMLElement>) => {
		setAnchorEl(_event.currentTarget)
	}

	return (
		<>
			<Tooltip
				placement="top"
				title={rest?.title ?? localization.showGrouping}
				disabled={disabled}
			>
				<ToolbarIconButton
					aria-label={localization.showGrouping}
					onClick={handleClick}
					disableRipple
					enableCaption={enableCaption}
					disabled={disabled}
					{...rest}
				>
					<GroupingIcon
						htmlColor={disabled ? IconsColor.disabled : IconsColor.default}
					/>
					{enableCaption && (
						<Typography
							color={disabled ? IconsColor.disabled : IconsColor.default}
						>
							{localization.showGrouping}
						</Typography>
					)}
				</ToolbarIconButton>
			</Tooltip>

			{anchorEl && (
				<GroupingMenuWithMuiProps
					anchorEl={anchorEl}
					setAnchorEl={setAnchorEl}
					table={table as TableInstance}
				/>
			)}
		</>
	)
}
