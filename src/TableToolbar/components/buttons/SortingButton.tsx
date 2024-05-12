import { Typography } from '@mui/material'
import type { IconButtonProps } from '@mui/material/IconButton'
import React, { MouseEvent, useState } from 'react'

import {
	TableData,
	TableInstance,
	IconsColor,
	ToolbarIconButton,
	Tooltip,
} from '../../../'
import { withNativeEvent } from '../../../utils/withNativeEvent'
import { SortingMenuWithMuiProps } from '../menus/SortingMenu/SortingMenu'

type Props<TData extends TableData> = IconButtonProps & {
	table: TableInstance<TData>
	enableCaption: boolean
}

export const SortingButton = <TData extends TableData = {}>({
	table,
	enableCaption,
	disabled,
	...rest
}: Props<TData>) => {
	const {
		options: {
			icons: { SortIcon },
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
				title={rest?.title ?? localization.showSorting}
				disabled={disabled}
			>
				<ToolbarIconButton
					aria-label={localization.showSorting}
					onClick={withNativeEvent(
						{
							el: 'ActionBar_SortButton',
							type: 'click',
						},
						table
					)(handleClick)}
					disableRipple
					enableCaption={enableCaption}
					disabled={disabled}
					{...rest}
				>
					<SortIcon
						htmlColor={disabled ? IconsColor.disabled : IconsColor.default}
					/>
					{enableCaption && (
						<Typography
							color={disabled ? IconsColor.disabled : IconsColor.default}
						>
							{localization.showSorting}
						</Typography>
					)}
				</ToolbarIconButton>
			</Tooltip>
			{anchorEl && (
				<SortingMenuWithMuiProps
					anchorEl={anchorEl}
					setAnchorEl={setAnchorEl}
					table={table as TableInstance}
				/>
			)}
		</>
	)
}
